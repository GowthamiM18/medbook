/**
 * Google Gemini chat (free tier via Google AI Studio API key).
 * Same input shape as run-anthropic-chat: { message, conversationHistory }.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai')
const { SYSTEM_PROMPT } = require('./anthropic-chat-shared.js')
const { getGeminiApiKey, looksLikeGeminiKey } = require('./anthropic-env.js')

/**
 * Keep only user/assistant objects with string content.
 * @param {Array<{ role: string, content: string }>} hist
 */
function cleanHistory(hist) {
  const arr = Array.isArray(hist) ? hist : []
  return arr
    .filter(function (m) {
      return (
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string'
      )
    })
    .map(function (m) {
      return { role: m.role, content: m.content }
    })
}

/**
 * Gemini expects history to start with a user turn (same idea as Anthropic).
 * @param {Array<{ role: string, content: string }>} cleaned
 */
function trimLeadingAssistants(cleaned) {
  let i = 0
  while (i < cleaned.length && cleaned[i].role === 'assistant') {
    i += 1
  }
  return cleaned.slice(i)
}

/**
 * @param {Array<{ role: string, content: string }>} messages
 */
function toGeminiHistory(messages) {
  return messages.map(function (m) {
    return {
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }
  })
}

/**
 * @param {string} msg
 * @param {number} max
 */
function clip(msg, max) {
  const t = String(msg).replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return t.slice(0, max) + '…'
}

/**
 * @param {unknown} e
 */
function toFriendlyGeminiError(e) {
  const text = e instanceof Error ? e.message : String(e)
  const low = text.toLowerCase()
  if (low.includes('api_key_invalid') || low.includes('invalid api key')) {
    return 'Invalid GEMINI_API_KEY. Create a new key at https://aistudio.google.com/apikey and put it in medbook/.env (one line, no quotes). Restart npm run dev.'
  }
  if (low.includes('resource_exhausted') || low.includes('quota') || low.includes('429')) {
    return 'Gemini free quota exceeded or rate limited. Wait a bit or check usage at Google AI Studio.'
  }
  if (low.includes('not found') && low.includes('model')) {
    return (
      'Gemini model not found. Set GEMINI_MODEL=gemini-2.0-flash or gemini-1.5-flash in medbook/.env. Hint: ' +
      clip(text, 120)
    )
  }
  return 'Gemini error: ' + clip(text, 200)
}

/**
 * @param {{ message: string, conversationHistory: Array<{ role: string, content: string }> }} input
 * @returns {Promise<string>}
 */
async function runGeminiChat(input) {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    throw new Error(
      'Missing GEMINI_API_KEY. Get a free key at https://aistudio.google.com/apikey and add GEMINI_API_KEY=... to medbook/.env'
    )
  }
  if (!looksLikeGeminiKey(apiKey)) {
    throw new Error(
      'GEMINI_API_KEY should look like AIza... from Google AI Studio. Check medbook/.env for typos or extra quotes.'
    )
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_PROMPT,
  })

  const trimmed = trimLeadingAssistants(cleanHistory(input.conversationHistory))
  const history = toGeminiHistory(trimmed)

  try {
    const chat = model.startChat({ history })
    const result = await chat.sendMessage(String(input.message))
    const out = result.response.text()
    return out || ''
  } catch (e) {
    throw new Error(toFriendlyGeminiError(e))
  }
}

module.exports = { runGeminiChat }
