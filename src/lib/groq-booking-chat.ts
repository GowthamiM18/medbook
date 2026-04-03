/**
 * Groq chat with function calling: create_appointment → Prisma, then streamed assistant reply.
 */
import OpenAI from 'openai'
import type { ChatTurn } from '@/lib/gemini-stream-chat'
import { executeCreateAppointment } from '@/lib/ai-create-appointment'
import { extractCreateAppointmentPayload } from '@/lib/ai-parse-pseudo-tool'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { SYSTEM_PROMPT } = require('./anthropic-chat-shared.js') as { SYSTEM_PROMPT: string }

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1'

const BOOKING_TOOLS_INSTRUCTION = `
You may call create_appointment only when the user clearly wants to book an appointment AND you have all of:
- doctor_name: exact or close match to a doctor at Udumula Hospital (use full name with Dr. prefix if known)
- date: YYYY-MM-DD (use the current calendar year for upcoming dates)
- time: 24-hour HH:mm (e.g. 10:30, 14:00)
- reason: symptoms or visit reason (maps to appointment notes)

If any field is missing or unclear, ask one short question — do not guess dates/times/doctors.
After a successful booking (tool returns ok: true), confirm in plain language: doctor, date, time, and queue token.
If the tool returns ok: false, explain simply and help the user fix it (e.g. pick a listed time, sign in, update phone on profile).

Never write XML, HTML, code fences, or <function...> tags in your reply. Never paste raw JSON or fake "tool call" text — the platform runs tools for you. Speak only in normal sentences.
`

const CREATE_APPOINTMENT_TOOL: OpenAI.Chat.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'create_appointment',
    description:
      'Creates a confirmed appointment in the hospital system for the signed-in patient. Call only when doctor_name, date, time, and reason are all known.',
    parameters: {
      type: 'object',
      properties: {
        doctor_name: { type: 'string', description: 'Doctor full name, e.g. Dr. Ananya Sharma' },
        date: { type: 'string', description: 'Appointment date as YYYY-MM-DD' },
        time: { type: 'string', description: 'Slot start time as HH:mm (24h)' },
        reason: { type: 'string', description: 'Symptoms or reason for visit' },
      },
      required: ['doctor_name', 'date', 'time', 'reason'],
    },
  },
}

function cleanHistory(hist: ChatTurn[]) {
  return hist.filter(
    (m) =>
      m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
  )
}

function trimLeadingAssistants(cleaned: ChatTurn[]): ChatTurn[] {
  let i = 0
  while (i < cleaned.length && cleaned[i].role === 'assistant') i += 1
  return cleaned.slice(i)
}

function clip(msg: string, max: number) {
  const t = String(msg).replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return t.slice(0, max) + '…'
}

function toFriendlyGroqError(e: unknown): string {
  const text = e instanceof Error ? e.message : String(e)
  const low = text.toLowerCase()
  if (low.includes('401') || (low.includes('invalid') && low.includes('key'))) {
    return 'Invalid GROQ_API_KEY.'
  }
  if (low.includes('429') || low.includes('rate limit')) {
    return 'Groq rate limit. Wait and try again.'
  }
  return 'Groq error: ' + clip(text, 200)
}

/**
 * Some models emit <function>...</function> or JSON in content instead of API tool_calls.
 * Run booking when parsed; strip tags from visible text.
 */
async function finalizeAssistantContent(
  content: string,
  patientId: string | undefined,
  meta: { appointmentCreated: boolean }
): Promise<string> {
  const { args, stripped } = extractCreateAppointmentPayload(content)
  if (args) {
    const result = await executeCreateAppointment(args, patientId)
    if (result.ok) meta.appointmentCreated = true
    const prefix = stripped.trim() ? `${stripped.trim()}\n\n` : ''
    if (result.ok) return `${prefix}${result.message}`
    return `${prefix}I couldn't complete the booking: ${result.error}`
  }
  return content
}

function buildBaseMessages(
  conversationHistory: ChatTurn[],
  userMessage: string
): OpenAI.Chat.ChatCompletionMessageParam[] {
  const trimmed = trimLeadingAssistants(cleanHistory(conversationHistory))
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: `${SYSTEM_PROMPT}\n\n${BOOKING_TOOLS_INSTRUCTION}` },
  ]
  for (const m of trimmed) {
    messages.push({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })
  }
  messages.push({ role: 'user', content: String(userMessage) })
  return messages
}

/**
 * Streams assistant text; sets meta.appointmentCreated if a booking succeeded.
 */
export async function* streamGroqBookingChat(input: {
  message: string
  conversationHistory: ChatTurn[]
  patientId: string | undefined
  meta: { appointmentCreated: boolean }
}): AsyncGenerator<string, void, unknown> {
  const apiKey = process.env.GROQ_API_KEY?.trim()
  if (!apiKey?.startsWith('gsk_')) {
    throw new Error('Missing or invalid GROQ_API_KEY')
  }

  const model = process.env.GROQ_MODEL?.trim() || 'llama-3.3-70b-versatile'
  const client = new OpenAI({ apiKey, baseURL: GROQ_BASE_URL })

  let messages = buildBaseMessages(input.conversationHistory, input.message)

  const maxToolRounds = 6

  for (let round = 0; round < maxToolRounds; round++) {
    let completion: OpenAI.Chat.ChatCompletion
    try {
      completion = await client.chat.completions.create({
        model,
        messages,
        tools: [CREATE_APPOINTMENT_TOOL],
        tool_choice: 'auto',
        max_tokens: 1024,
      })
    } catch (e) {
      throw new Error(toFriendlyGroqError(e))
    }

    const choice = completion.choices[0]
    const msg = choice?.message
    if (!msg) {
      yield 'Sorry, I could not complete that request.'
      return
    }

    const toolCalls = msg.tool_calls
    if (toolCalls && toolCalls.length > 0) {
      messages.push({
        role: 'assistant',
        content: msg.content && msg.content.trim() ? msg.content : null,
        tool_calls: toolCalls,
      })

      for (const tc of toolCalls) {
        if (tc.type !== 'function') continue
        if (tc.function.name !== 'create_appointment') {
          messages.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: JSON.stringify({ ok: false, error: `Unknown tool ${tc.function.name}` }),
          })
          continue
        }

        let args: Record<string, unknown> = {}
        try {
          args = JSON.parse(tc.function.arguments || '{}') as Record<string, unknown>
        } catch {
          args = {}
        }

        const result = await executeCreateAppointment(args, input.patientId)
        if (result.ok) input.meta.appointmentCreated = true
        messages.push({
          role: 'tool',
          tool_call_id: tc.id,
          content: JSON.stringify(result),
        })
      }
      continue
    }

    if (msg.content && msg.content.trim()) {
      yield await finalizeAssistantContent(msg.content, input.patientId, input.meta)
      return
    }

    try {
      const stream = await client.chat.completions.create({
        model,
        messages,
        max_tokens: 1024,
        stream: true,
      })
      const chunks: string[] = []
      for await (const part of stream) {
        const d = part.choices[0]?.delta?.content
        if (typeof d === 'string' && d) chunks.push(d)
      }
      const full = chunks.join('')
      if (full.trim()) {
        yield await finalizeAssistantContent(full, input.patientId, input.meta)
      } else {
        yield 'Done. If you asked to book, check your dashboard for the appointment.'
      }
    } catch (e) {
      throw new Error(toFriendlyGroqError(e))
    }
    return
  }

  yield 'Sorry — too many steps. Please open Book appointment from the menu or try again with a simpler request.'
}
