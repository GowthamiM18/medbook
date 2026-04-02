/**
 * Calls Anthropic Messages API using ANTHROPIC_API_KEY from the environment.
 * Used by src/app/api/chat/route.ts and by medbook/server.js.
 */

// Official SDK (CommonJS build)
const Anthropic = require('@anthropic-ai/sdk')
// Shared prompt, model name, and message builder
const {
  CHAT_MODEL,
  SYSTEM_PROMPT,
  buildAnthropicMessages,
} = require('./anthropic-chat-shared.js')
// Resolve API key from env + .env files (explicit pass avoids "Could not resolve authentication method")
const { getAnthropicApiKey, looksLikeAnthropicKey } = require('./anthropic-env.js')

/**
 * Shorten error text for display (avoid dumping huge JSON).
 * @param {string} s
 * @param {number} max
 */
function clip(s, max) {
  const t = String(s).replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return t.slice(0, max) + '…'
}

/**
 * Turn SDK / network failures into a short message for the chat UI.
 * @param {unknown} e
 */
function toFriendlyChatError(e) {
  let status = 0
  if (e && typeof e === 'object' && typeof e.status === 'number') {
    status = e.status
  }
  const msg = e instanceof Error ? e.message : String(e)
  const low = msg.toLowerCase()

  if (status === 401 || msg.includes('401') || low.includes('invalid x-api-key')) {
    return (
      'Your Anthropic API key was rejected (401). Paste a fresh key from https://console.anthropic.com into medbook/.env as ANTHROPIC_API_KEY=sk-ant-... (one line, no quotes). Restart npm run dev.'
    )
  }

  // Billing / credits — Anthropic often returns 400 invalid_request_error (must run BEFORE generic "model" branch)
  if (
    low.includes('credit balance') ||
    low.includes('too low to access') ||
    low.includes('insufficient') && (low.includes('credit') || low.includes('balance')) ||
    low.includes('exceeded your spending') ||
    low.includes('spending limit') ||
    low.includes('add credits') ||
    low.includes('purchase credits') ||
    low.includes('no api credits') ||
    (low.includes('billing') && low.includes('anthropic'))
  ) {
    return (
      'Your Anthropic account has no usable API credits (balance too low or billing not set up). Add credits or a payment method at https://console.anthropic.com/settings/plans — changing ANTHROPIC_CHAT_MODEL in .env will not fix this.'
    )
  }

  // Wrong / unknown model id (do not treat every invalid_request as model — billing uses it too)
  if (
    status === 404 ||
    (low.includes('not_found') && low.includes('model')) ||
    low.includes('model_not_found') ||
    (low.includes('model') && (low.includes('not found') || low.includes('unknown model') || low.includes('invalid model'))) ||
    (status === 400 && low.includes('claude') && low.includes('model'))
  ) {
    return (
      'Claude model ID issue. In medbook/.env set ANTHROPIC_CHAT_MODEL=claude-3-5-sonnet-20241022 (or a model listed for your account), save, restart npm run dev. Hint: ' +
      clip(msg, 120)
    )
  }

  if (status === 429 || low.includes('rate limit')) {
    return 'Anthropic rate limit reached. Wait a minute and try again.'
  }

  if (status === 403 || low.includes('permission') || low.includes('billing')) {
    return 'Anthropic returned 403 (billing or permissions). Check your plan at https://console.anthropic.com/settings/plans.'
  }

  if (status === undefined || status === 0 || low.includes('connection') || low.includes('fetch')) {
    return 'Could not reach Anthropic (network). Check your internet connection and try again.'
  }

  // Last resort: show clipped server message so you can see the real cause
  return 'AI request failed: ' + clip(msg, 200)
}

/**
 * @param {{ message: string, conversationHistory: Array<{ role: string, content: string }> }} input
 * @returns {Promise<string>} Assistant reply text only
 */
async function runAnthropicChat(input) {
  const message = input.message // Latest user text
  const conversationHistory = input.conversationHistory // Earlier messages for context
  const apiKey = getAnthropicApiKey() // Load from env + parsed .env files
  if (!apiKey) {
    throw new Error(
      'Missing ANTHROPIC_API_KEY. In the medbook folder (next to package.json), add: ANTHROPIC_API_KEY=sk-ant-... then restart npm run dev.'
    )
  }
  if (!looksLikeAnthropicKey(apiKey)) {
    throw new Error(
      'ANTHROPIC_API_KEY must be one line starting with sk-ant- (from console.anthropic.com). Remove quotes, spaces around =, and line breaks inside the key.'
    )
  }
  const client = new Anthropic({ apiKey })
  const messages = buildAnthropicMessages(message, conversationHistory)
  const model = process.env.ANTHROPIC_CHAT_MODEL || CHAT_MODEL
  try {
    const response = await client.messages.create({
      model,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    })
    const first = response.content[0]
    if (first && first.type === 'text') {
      return first.text
    }
    return ''
  } catch (e) {
    throw new Error(toFriendlyChatError(e))
  }
}

module.exports = { runAnthropicChat }
