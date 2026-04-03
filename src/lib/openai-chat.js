/**
 * OpenAI Chat Completions API (ChatGPT-class models).
 * Same input shape: { message, conversationHistory }.
 */

const OpenAI = require('openai')
const { SYSTEM_PROMPT } = require('./anthropic-chat-shared.js')
const { getOpenAIApiKey, looksLikeOpenAIKey } = require('./anthropic-env.js')

/**
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
function toFriendlyOpenAIError(e) {
  const text = e instanceof Error ? e.message : String(e)
  const low = text.toLowerCase()
  if (low.includes('401') || low.includes('incorrect api key') || low.includes('invalid_api_key')) {
    return 'Invalid OPENAI_API_KEY. Create a key at https://platform.openai.com/api-keys and add it to medbook/.env (one line, no quotes). Restart npm run dev.'
  }
  if (low.includes('insufficient_quota') || low.includes('billing') || low.includes('exceeded your current quota')) {
    return 'OpenAI quota or billing issue. Add payment method or credits at https://platform.openai.com/account/billing'
  }
  if (low.includes('429') || low.includes('rate limit')) {
    return 'OpenAI rate limit. Wait a moment and try again.'
  }
  if (low.includes('model') && (low.includes('not found') || low.includes('does not exist'))) {
    return 'Unknown OpenAI model. Set OPENAI_MODEL=gpt-4o-mini in medbook/.env. Hint: ' + clip(text, 100)
  }
  return 'OpenAI error: ' + clip(text, 200)
}

/**
 * @param {{ message: string, conversationHistory: Array<{ role: string, content: string }> }} input
 * @returns {Promise<string>}
 */
async function runOpenAIChat(input) {
  const apiKey = getOpenAIApiKey()
  if (!apiKey) {
    throw new Error(
      'Missing OPENAI_API_KEY. Get a key at https://platform.openai.com/api-keys and add OPENAI_API_KEY=sk-... to medbook/.env'
    )
  }
  if (!looksLikeOpenAIKey(apiKey)) {
    throw new Error(
      'OPENAI_API_KEY should start with sk-proj- or sk- (but not sk-ant-, that is Anthropic). Check medbook/.env.'
    )
  }

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  const client = new OpenAI({ apiKey })

  const trimmed = trimLeadingAssistants(cleanHistory(input.conversationHistory))
  const messages = [{ role: 'system', content: SYSTEM_PROMPT }]
  for (let i = 0; i < trimmed.length; i++) {
    messages.push({
      role: trimmed[i].role === 'assistant' ? 'assistant' : 'user',
      content: trimmed[i].content,
    })
  }
  messages.push({ role: 'user', content: String(input.message) })

  try {
    const res = await client.chat.completions.create({
      model,
      messages,
      max_tokens: 1024,
    })
    const text = res.choices[0]?.message?.content
    return typeof text === 'string' ? text : ''
  } catch (e) {
    throw new Error(toFriendlyOpenAIError(e))
  }
}

module.exports = { runOpenAIChat }
