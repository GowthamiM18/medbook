/**
 * Google Gemini streaming chat for /api/chat (uses @google/generative-ai).
 * Tries multiple models on 429 / quota so free-tier limits are less blocking.
 */
import { GoogleGenerativeAI } from '@google/generative-ai'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { SYSTEM_PROMPT } = require('./anthropic-chat-shared.js') as { SYSTEM_PROMPT: string }

/** Lighter / alternate models first — often separate quotas on free tier */
const FALLBACK_MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash-8b',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
] as const

export function getGoogleGenerativeAiKey(): string | undefined {
  const a = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim()
  const b = process.env.GEMINI_API_KEY?.trim()
  return a || b || undefined
}

function getModelCandidates(): string[] {
  const envModel = process.env.GEMINI_MODEL?.trim()
  const rest = FALLBACK_MODELS.filter((m) => m !== envModel)
  const list = envModel ? [envModel, ...rest] : [...FALLBACK_MODELS]
  return Array.from(new Set(list))
}

function cleanHistory(hist: unknown) {
  const arr = Array.isArray(hist) ? hist : []
  return arr
    .filter((m): m is { role: string; content: string } => {
      if (!m || typeof m !== 'object') return false
      const role = (m as { role?: string }).role
      const content = (m as { content?: unknown }).content
      return (role === 'user' || role === 'assistant') && typeof content === 'string'
    })
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))
}

function trimLeadingAssistants(
  cleaned: { role: string; content: string }[]
): { role: string; content: string }[] {
  let i = 0
  while (i < cleaned.length && cleaned[i].role === 'assistant') i += 1
  return cleaned.slice(i)
}

function toGeminiHistory(messages: { role: string; content: string }[]) {
  return messages.map((m) => ({
    role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
    parts: [{ text: m.content }],
  }))
}

function clip(msg: string, max: number) {
  const t = String(msg).replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return t.slice(0, max) + '…'
}

/** Whether we should try the next model (quota / wrong model id) */
function shouldTryNextModel(e: unknown): boolean {
  const text = e instanceof Error ? e.message : String(e)
  const low = text.toLowerCase()
  if (low.includes('429')) return true
  if (low.includes('resource_exhausted')) return true
  if (low.includes('quota') && low.includes('exceed')) return true
  if (low.includes('too many requests')) return true
  if (low.includes('not found') && low.includes('model')) return true
  return false
}

function toFriendlyError(e: unknown, triedModels: string[]): string {
  const text = e instanceof Error ? e.message : String(e)
  const low = text.toLowerCase()
  if (low.includes('api_key_invalid') || low.includes('invalid api key')) {
    return 'Invalid API key. Check GOOGLE_GENERATIVE_AI_API_KEY in .env (Google AI Studio).'
  }
  if (low.includes('429') || (low.includes('quota') && low.includes('exceed'))) {
    return (
      'Gemini rate limit or daily quota reached for your key. Wait a few minutes, try again later, ' +
      'or open Google AI Studio → check usage. Tried models: ' +
      triedModels.join(', ') +
      '. Optional: set GEMINI_MODEL=gemini-2.0-flash-lite or gemini-1.5-flash in .env.'
    )
  }
  if (low.includes('not found') && low.includes('model')) {
    return (
      'That Gemini model name is not available for your key. Tried: ' +
      triedModels.join(', ') +
      '. Set GEMINI_MODEL to a model listed in Google AI Studio.'
    )
  }
  return 'Gemini error: ' + clip(text, 280)
}

export type ChatTurn = { role: string; content: string }

/** True when all Gemini models failed with quota / rate limit (safe to try OpenAI fallback). */
export function isGeminiQuotaExhaustedError(message: string): boolean {
  const m = message.toLowerCase()
  if (!m.includes('tried models:')) return false
  return (
    m.includes('rate limit') ||
    m.includes('quota') ||
    m.includes('429') ||
    m.includes('resource_exhausted')
  )
}

/**
 * Yields incremental text chunks from Gemini (for NDJSON streaming).
 */
export async function* streamGeminiReply(input: {
  message: string
  conversationHistory: ChatTurn[]
}): AsyncGenerator<string, void, unknown> {
  const apiKey = getGoogleGenerativeAiKey()
  if (!apiKey) {
    throw new Error(
      'Missing GOOGLE_GENERATIVE_AI_API_KEY. Add it to medbook/.env from https://aistudio.google.com/apikey'
    )
  }

  const trimmed = trimLeadingAssistants(cleanHistory(input.conversationHistory))
  const history = toGeminiHistory(trimmed)
  const userMessage = String(input.message)

  const candidates = getModelCandidates()
  const tried: string[] = []
  let lastErr: unknown = null

  const genAI = new GoogleGenerativeAI(apiKey)

  for (const modelName of candidates) {
    tried.push(modelName)
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
      })
      const chat = model.startChat({ history })
      const streamResult = await chat.sendMessageStream(userMessage)

      for await (const chunk of streamResult.stream) {
        try {
          const t = chunk.text()
          if (t) yield t
        } catch {
          /* chunk may have no candidates */
        }
      }
      return
    } catch (e) {
      lastErr = e
      if (shouldTryNextModel(e)) {
        console.warn('[gemini-stream] model failed, trying next:', modelName, e)
        continue
      }
      throw new Error(toFriendlyError(e, tried))
    }
  }

  throw new Error(toFriendlyError(lastErr, tried))
}
