/**
 * Groq chat completions (OpenAI-compatible API, fast inference).
 * https://console.groq.com/docs/overview
 */
import OpenAI from 'openai'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { SYSTEM_PROMPT } = require('./anthropic-chat-shared.js') as { SYSTEM_PROMPT: string }

import type { ChatTurn } from './gemini-stream-chat'

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1'

export function getGroqApiKey(): string | undefined {
  return process.env.GROQ_API_KEY?.trim()
}

export function getGroqKeyPresent(): boolean {
  const k = getGroqApiKey()
  return Boolean(k && k.startsWith('gsk_') && k.length >= 20)
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
  if (low.includes('401') || low.includes('invalid') && low.includes('key')) {
    return 'Invalid GROQ_API_KEY. Create one at https://console.groq.com/keys'
  }
  if (low.includes('429') || low.includes('rate limit')) {
    return 'Groq rate limit. Wait a moment and try again.'
  }
  if (low.includes('model') && (low.includes('not found') || low.includes('does not exist'))) {
    return 'Unknown Groq model. Set GROQ_MODEL=llama-3.3-70b-versatile (or llama-3.1-8b-instant) in .env.'
  }
  return 'Groq error: ' + clip(text, 200)
}

export async function* streamGroqReply(input: {
  message: string
  conversationHistory: ChatTurn[]
}): AsyncGenerator<string, void, unknown> {
  const apiKey = getGroqApiKey()
  if (!apiKey?.trim()) {
    throw new Error(
      'Missing GROQ_API_KEY. Add it from https://console.groq.com/keys to medbook/.env'
    )
  }
  if (!apiKey.startsWith('gsk_')) {
    throw new Error('GROQ_API_KEY should start with gsk_. Check medbook/.env.')
  }

  const model =
    process.env.GROQ_MODEL?.trim() || 'llama-3.3-70b-versatile'
  const client = new OpenAI({
    apiKey,
    baseURL: GROQ_BASE_URL,
  })

  const trimmed = trimLeadingAssistants(cleanHistory(input.conversationHistory))
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
  ]
  for (const m of trimmed) {
    messages.push({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })
  }
  messages.push({ role: 'user', content: String(input.message) })

  try {
    const stream = await client.chat.completions.create({
      model,
      messages,
      max_tokens: 1024,
      stream: true,
    })
    for await (const part of stream) {
      const d = part.choices[0]?.delta?.content
      if (typeof d === 'string' && d) yield d
    }
  } catch (e) {
    throw new Error(toFriendlyGroqError(e))
  }
}
