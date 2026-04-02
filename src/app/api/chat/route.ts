// src/app/api/chat/route.ts — POST handler for the AI health assistant
import { NextResponse } from 'next/server'
// Gemini (free tier) if GEMINI_API_KEY set, else Anthropic (CommonJS)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { runAIChat } = require('../../../lib/run-ai-chat.js') as {
  runAIChat: (input: {
    message: string
    conversationHistory: { role: string; content: string }[]
  }) => Promise<string>
}

type ChatBody = {
  message?: string
  conversationHistory?: { role: string; content: string }[]
  messages?: { role: string; content: string }[]
}

export async function POST(req: Request) {
  const body = (await req.json()) as ChatBody

  // New contract: { message, conversationHistory }
  if (typeof body.message === 'string' && Array.isArray(body.conversationHistory)) {
    try {
      const text = await runAIChat({
        message: body.message,
        conversationHistory: body.conversationHistory,
      })
      return NextResponse.json({ message: text })
    } catch (e) {
      const err = e as Error
      console.error(err)
      return NextResponse.json(
        { error: 'Chat failed', message: err.message || 'Unknown error' },
        { status: 500 }
      )
    }
  }

  // Legacy: full { messages } array (last item must be user)
  if (Array.isArray(body.messages) && body.messages.length > 0) {
    const msgs = body.messages
    const last = msgs[msgs.length - 1]
    if (last.role !== 'user' || typeof last.content !== 'string') {
      return NextResponse.json({ error: 'Last message must be user text' }, { status: 400 })
    }
    const conversationHistory = msgs.slice(0, -1)
    try {
      const text = await runAIChat({
        message: last.content,
        conversationHistory,
      })
      return NextResponse.json({ message: text })
    } catch (e) {
      const err = e as Error
      console.error(err)
      return NextResponse.json(
        { error: 'Chat failed', message: err.message || 'Unknown error' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { error: 'Expected { message, conversationHistory } or { messages }' },
    { status: 400 }
  )
}
