// src/app/api/chat/route.ts — streaming: Gemini / Groq (tools + booking) / OpenAI
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  streamGeminiReply,
  getGoogleGenerativeAiKey,
  isGeminiQuotaExhaustedError,
  type ChatTurn,
} from '@/lib/gemini-stream-chat'
import { getGroqKeyPresent } from '@/lib/groq-stream-chat'
import { streamGroqBookingChat } from '@/lib/groq-booking-chat'
import { streamOpenAIReply, getOpenAiKeyPresent } from '@/lib/openai-stream-chat'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type ChatBody = {
  message?: string
  conversationHistory?: ChatTurn[]
  messages?: ChatTurn[]
}

function normalizeBody(body: ChatBody): { message: string; conversationHistory: ChatTurn[] } | null {
  if (typeof body.message === 'string' && Array.isArray(body.conversationHistory)) {
    return { message: body.message, conversationHistory: body.conversationHistory }
  }
  if (Array.isArray(body.messages) && body.messages.length > 0) {
    const msgs = body.messages
    const last = msgs[msgs.length - 1]
    if (last.role !== 'user' || typeof last.content !== 'string') return null
    return {
      message: last.content,
      conversationHistory: msgs.slice(0, -1),
    }
  }
  return null
}

function chatProviderMode(): 'auto' | 'gemini' | 'openai' | 'groq' {
  const v = (process.env.CHAT_PROVIDER || 'auto').trim().toLowerCase()
  if (v === 'gemini' || v === 'openai' || v === 'groq') return v
  return 'auto'
}

async function writeStreamChunks(
  writeLine: (obj: object) => void,
  gen: AsyncGenerator<string, void, unknown>,
  appointmentCreated = false
) {
  for await (const chunk of gen) {
    if (chunk) writeLine({ t: chunk })
  }
  writeLine({ done: true, appointmentCreated })
}

async function runGroqBooking(
  writeLine: (obj: object) => void,
  normalized: { message: string; conversationHistory: ChatTurn[] },
  patientId: string | undefined
) {
  const meta = { appointmentCreated: false }
  for await (const chunk of streamGroqBookingChat({ ...normalized, patientId, meta })) {
    if (chunk) writeLine({ t: chunk })
  }
  writeLine({ done: true, appointmentCreated: meta.appointmentCreated })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const patientId = session?.user?.id

  let body: ChatBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const normalized = normalizeBody(body)
  if (!normalized) {
    return NextResponse.json(
      { error: 'Expected { message, conversationHistory } or { messages }' },
      { status: 400 }
    )
  }

  const hasGoogle = Boolean(getGoogleGenerativeAiKey())
  const hasGroq = getGroqKeyPresent()
  const hasOpenAI = getOpenAiKeyPresent()
  const mode = chatProviderMode()

  if (mode === 'gemini' && !hasGoogle) {
    return NextResponse.json(
      {
        error: 'Missing GOOGLE_GENERATIVE_AI_API_KEY',
        message: 'CHAT_PROVIDER=gemini requires GOOGLE_GENERATIVE_AI_API_KEY in .env.',
      },
      { status: 500 }
    )
  }
  if (mode === 'groq' && !hasGroq) {
    return NextResponse.json(
      {
        error: 'Missing GROQ_API_KEY',
        message: 'CHAT_PROVIDER=groq requires GROQ_API_KEY (gsk_...) in .env.',
      },
      { status: 500 }
    )
  }
  if (mode === 'openai' && !hasOpenAI) {
    return NextResponse.json(
      {
        error: 'Missing OPENAI_API_KEY',
        message: 'CHAT_PROVIDER=openai requires OPENAI_API_KEY in .env.',
      },
      { status: 500 }
    )
  }
  if (mode === 'auto' && !hasGoogle && !hasGroq && !hasOpenAI) {
    return NextResponse.json(
      {
        error: 'No AI keys',
        message:
          'Add at least one of: GROQ_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, OPENAI_API_KEY. See .env.example.',
      },
      { status: 500 }
    )
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const writeLine = (obj: object) => {
        controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'))
      }

      try {
        if (mode === 'groq') {
          await runGroqBooking(writeLine, normalized, patientId)
          return
        }

        if (mode === 'openai') {
          await writeStreamChunks(writeLine, streamOpenAIReply(normalized), false)
          return
        }

        if (mode === 'gemini') {
          await writeStreamChunks(writeLine, streamGeminiReply(normalized), false)
          return
        }

        if (hasGoogle) {
          try {
            await writeStreamChunks(writeLine, streamGeminiReply(normalized), false)
            return
          } catch (gemErr) {
            const gmsg = gemErr instanceof Error ? gemErr.message : String(gemErr)
            if (isGeminiQuotaExhaustedError(gmsg) && hasGroq) {
              console.warn('[api/chat] Gemini quota exhausted → Groq (booking tools)')
              await runGroqBooking(writeLine, normalized, patientId)
              return
            }
            if (isGeminiQuotaExhaustedError(gmsg) && hasOpenAI) {
              console.warn('[api/chat] Gemini quota exhausted → OpenAI fallback')
              await writeStreamChunks(writeLine, streamOpenAIReply(normalized), false)
              return
            }
            throw gemErr
          }
        }

        if (hasGroq) {
          await runGroqBooking(writeLine, normalized, patientId)
          return
        }

        if (hasOpenAI) {
          await writeStreamChunks(writeLine, streamOpenAIReply(normalized), false)
          return
        }

        writeLine({ e: 'No AI provider available.' })
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error('[api/chat]', err)
        writeLine({ e: msg })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
