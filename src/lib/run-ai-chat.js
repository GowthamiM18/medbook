/**
 * Picks a backend using AI_PROVIDER if set, else first available key in order:
 * OpenAI (ChatGPT API) → Gemini (free) → Anthropic (Claude).
 */

const {
  getOpenAIApiKey,
  getGeminiApiKey,
  getAnthropicApiKey,
} = require('./anthropic-env.js')

/**
 * @param {{ message: string, conversationHistory: Array<{ role: string, content: string }> }} input
 * @returns {Promise<string>}
 */
async function runAIChat(input) {
  const which = (process.env.AI_PROVIDER || '').toLowerCase().trim()

  if (which === 'openai') {
    if (getOpenAIApiKey()) {
      return require('./openai-chat.js').runOpenAIChat(input)
    }
    throw new Error('AI_PROVIDER=openai but OPENAI_API_KEY is missing or invalid in medbook/.env')
  }
  if (which === 'gemini') {
    if (getGeminiApiKey()) {
      return require('./gemini-chat.js').runGeminiChat(input)
    }
    throw new Error('AI_PROVIDER=gemini but GEMINI_API_KEY is missing or invalid in medbook/.env')
  }
  if (which === 'anthropic' || which === 'claude') {
    if (getAnthropicApiKey()) {
      return require('./run-anthropic-chat.js').runAnthropicChat(input)
    }
    throw new Error('AI_PROVIDER=anthropic but ANTHROPIC_API_KEY is missing or invalid in medbook/.env')
  }

  if (getOpenAIApiKey()) {
    return require('./openai-chat.js').runOpenAIChat(input)
  }
  if (getGeminiApiKey()) {
    return require('./gemini-chat.js').runGeminiChat(input)
  }
  if (getAnthropicApiKey()) {
    return require('./run-anthropic-chat.js').runAnthropicChat(input)
  }
  throw new Error(
    'No AI key configured. Add one to medbook/.env: OPENAI_API_KEY (ChatGPT API from platform.openai.com), or GEMINI_API_KEY (free tier from aistudio.google.com), or ANTHROPIC_API_KEY. Optional: AI_PROVIDER=openai|gemini|anthropic to force one. Restart npm run dev after saving.'
  )
}

module.exports = { runAIChat }
