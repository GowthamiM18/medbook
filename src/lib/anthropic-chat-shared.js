/**
 * Shared strings + helpers for the AI health assistant (used by Next.js API and server.js).
 * Plain JavaScript so Node can require() it without TypeScript.
 */

// Default: widely available on standard Anthropic API keys (override in .env if you use another)
exports.CHAT_MODEL = 'claude-3-5-sonnet-20241022'

// System instructions: specialist routing only, no diagnosis, Udumula Hospital tone
exports.SYSTEM_PROMPT = `You are an AI health assistant for Udumula Hospital. 
When a user describes symptoms, analyze them and recommend 
the right type of doctor (Cardiologist, General Physician, 
Dermatologist, Pediatrician, Neurologist, Orthopedist).
Then say you found available doctors this week and ask if 
they want to see options. Be warm, concise, and professional.
Never diagnose — only recommend specialist type.

The app may already show a short welcome message in the chat UI; continue the conversation naturally without repeating that exact greeting unless the user seems confused.`

/**
 * Turn the client payload into Anthropic "messages" array (no system here).
 * @param {string} message - Latest user message text
 * @param {Array<{ role: string, content: string }>} conversationHistory - Prior turns (user/assistant), in order
 * @returns {{ role: 'user'|'assistant', content: string }[]}
 */
exports.buildAnthropicMessages = function buildAnthropicMessages(message, conversationHistory) {
  const hist = Array.isArray(conversationHistory) ? conversationHistory : [] // Default to empty if missing
  const cleaned = hist // We will filter valid entries only
    .filter(function (m) {
      // Keep objects that look like chat turns
      return (
        m && // Must exist
        (m.role === 'user' || m.role === 'assistant') && // Anthropic allows only these in messages[]
        typeof m.content === 'string' // Content must be text
      )
    })
    .map(function (m) {
      // Clone minimal shape for the API
      return { role: m.role, content: m.content }
    })
  // Anthropic requires the FIRST message in `messages` to be role "user", not "assistant".
  // Our UI shows an opening assistant bubble locally; that must not be sent as the first API turn.
  var i = 0 // Index while skipping leading assistant-only turns
  while (i < cleaned.length && cleaned[i].role === 'assistant') {
    i = i + 1 // Skip this assistant message
  }
  var trimmed = cleaned.slice(i) // History that starts at a user message (or empty)
  return trimmed.concat([{ role: 'user', content: String(message) }]) // Append the new user message last
}
