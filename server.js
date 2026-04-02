/**
 * Standalone HTTP server exposing POST /api/chat (same contract as Next.js).
 * Run from medbook folder: set OPENAI_API_KEY, GEMINI_API_KEY, and/or ANTHROPIC_API_KEY in .env, then: node server.js
 * Default port 3456 (use PORT=4000 node server.js to change).
 * Next.js dev still serves /api/chat — this file is optional for learning/testing.
 */

// Load variables from medbook/.env into process.env (same keys as Next.js)
require('dotenv').config({ path: require('path').join(__dirname, '.env') })

const http = require('http')
const {
  getOpenAIApiKey,
  getGeminiApiKey,
  getAnthropicApiKey,
} = require('./src/lib/anthropic-env.js')
const { runAIChat } = require('./src/lib/run-ai-chat.js')

const PORT = Number(process.env.PORT) || 3456 // Listen port

/**
 * Read full request body as a UTF-8 string.
 * @param {import('http').IncomingMessage} req
 * @returns {Promise<string>}
 */
function readBody(req) {
  return new Promise(function (resolve, reject) {
    const chunks = [] // Collect Buffer chunks
    req.on('data', function (chunk) {
      chunks.push(chunk) // Append each piece
    })
    req.on('end', function () {
      resolve(Buffer.concat(chunks).toString('utf8')) // Full JSON string
    })
    req.on('error', reject) // Network errors
  })
}

const server = http.createServer(async function (req, res) {
  // CORS for local experiments (optional)
  res.setHeader('Access-Control-Allow-Origin', '*') // Allow browser tests from any origin
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type') // Allow JSON header
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS') // Methods we support

  if (req.method === 'OPTIONS') {
    res.writeHead(204) // No content for preflight
    res.end() // Done
    return // Stop here
  }

  if (req.method !== 'POST' || req.url !== '/api/chat') {
    res.writeHead(404, { 'Content-Type': 'application/json' }) // Not found
    res.end(JSON.stringify({ error: 'Not found' })) // JSON error body
    return // Stop
  }

  let bodyText = '' // Raw JSON string
  try {
    bodyText = await readBody(req) // Wait for full body
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' }) // Bad request
    res.end(JSON.stringify({ error: 'Could not read body' }))
    return
  }

  let payload = null // Parsed JSON
  try {
    payload = JSON.parse(bodyText || '{}') // Parse client JSON
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Invalid JSON' }))
    return
  }

  const message = payload.message // Required string
  const conversationHistory = payload.conversationHistory // Required array (can be empty)

  if (typeof message !== 'string' || !Array.isArray(conversationHistory)) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Expected { message: string, conversationHistory: array }' }))
    return
  }

  if (!getOpenAIApiKey() && !getGeminiApiKey() && !getAnthropicApiKey()) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(
      JSON.stringify({
        error: 'Missing OPENAI_API_KEY, GEMINI_API_KEY, or ANTHROPIC_API_KEY',
      })
    )
    return
  }

  try {
    const text = await runAIChat({ message, conversationHistory })
    res.writeHead(200, { 'Content-Type': 'application/json' }) // OK
    res.end(JSON.stringify({ message: text })) // Same shape as Next route
  } catch (err) {
    console.error(err) // Log server-side for debugging
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Chat failed', message: err.message || 'Unknown error' }))
  }
})

server.listen(PORT, function () {
  console.log('AI chat server listening on http://localhost:' + PORT + '/api/chat') // Helpful log
})
