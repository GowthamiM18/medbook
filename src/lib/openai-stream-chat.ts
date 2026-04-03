/**
 * OpenAI streaming chat (fallback when Gemini quota is hit).
 */
import OpenAI from 'openai'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { SYSTEM_PROMPT } = require('./anthropic-chat-shared.js') as { SYSTEM_PROMPT: string }
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getOpenAIApiKey, looksLikeOpenAIKey } = require('./anthropic-env.js') as {
  getOpenAIApiKey: () => string
  looksLikeOpenAIKey: (k: string) => boolean
}

import type { ChatTurn } from './gemini-stream-chat'

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

function toFriendlyOpenAIError(e: unknown): string {
  const text = e instanceof Error ? e.message : String(e)
  const low = text.toLowerCase()
  if (low.includes('401') || low.includes('incorrect api key') || low.includes('invalid_api_key')) {
    return 'Invalid OPENAI_API_KEY. Check https://platform.openai.com/api-keys'
  }
  if (low.includes('insufficient_quota') || low.includes('billing')) {
    return 'OpenAI billing or quota issue. See https://platform.openai.com/account/billing'
  }
  if (low.includes('429') || low.includes('rate limit')) {
    return 'OpenAI rate limit. Wait a moment and try again.'
  }
  return 'OpenAI error: ' + clip(text, 200)
}

export function getOpenAiKeyPresent(): boolean {
  return Boolean(getOpenAIApiKey()?.trim())
}

export async function* streamOpenAIReply(input: {
  message: string
  conversationHistory: ChatTurn[]
}): AsyncGenerator<string, void, unknown> {
  const apiKey = getOpenAIApiKey()
  if (!apiKey?.trim()) {
    throw new Error(
      'Missing OPENAI_API_KEY. Add it to medbook/.env for chat when Gemini quota is used up.'
    )
  }
  if (!looksLikeOpenAIKey(apiKey)) {
    throw new Error(
      'OPENAI_API_KEY should start with sk- (not sk-ant-). Check medbook/.env for typos.'
    )
  }

  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini'
  const client = new OpenAI({ apiKey })

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
    throw new Error(toFriendlyOpenAIError(e))
  }
}
