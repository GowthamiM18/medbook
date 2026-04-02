/**
 * Loads LLM API keys (OpenAI, Google Gemini, Anthropic) for local dev.
 * Parses .env files directly so placeholders / load order do not hide real keys.
 */

const path = require('path')
const fs = require('fs')

let didLoadDotenv = false

/**
 * Clean a raw secret string (quotes, BOM, smart quotes, accidental line breaks).
 * @param {string | undefined} v
 * @returns {string}
 */
function normalizeKey(v) {
  if (v == null || typeof v !== 'string') return ''
  let s = v.replace(/^\uFEFF/, '').trim()
  s = s.replace(/[\u201C\u201D\u2018\u2019\u00A0]/g, '')
  if (s.length >= 2) {
    const q0 = s[0]
    const q1 = s[s.length - 1]
    if ((q0 === '"' && q1 === '"') || (q0 === "'" && q1 === "'")) {
      s = s.slice(1, -1).trim()
    }
  }
  s = s.replace(/\s+/g, '')
  const semi = s.indexOf(';')
  if (semi >= 0) s = s.slice(0, semi)
  return s.trim()
}

/**
 * True if string looks like an Anthropic console key (not a proof of validity at API).
 * @param {string} k
 * @returns {boolean}
 */
function looksLikeAnthropicKey(k) {
  if (!k || typeof k !== 'string') return false
  return k.startsWith('sk-ant-') && k.length >= 24
}

/**
 * Google AI Studio keys usually start with AIza...
 * @param {string} k
 * @returns {boolean}
 */
function looksLikeGeminiKey(k) {
  if (!k || typeof k !== 'string') return false
  return k.startsWith('AIza') && k.length >= 30
}

/**
 * OpenAI keys: sk-proj-... or sk-... (never sk-ant-, that is Anthropic).
 * @param {string} k
 * @returns {boolean}
 */
function looksLikeOpenAIKey(k) {
  if (!k || typeof k !== 'string') return false
  if (k.startsWith('sk-ant-')) return false
  if (!k.startsWith('sk-')) return false
  return k.length >= 40
}

/**
 * Read ANTHROPIC_API_KEY=... from one .env file (ignores empty values).
 * @param {string} absPath
 * @returns {string}
 */
function parseAnthropicKeyFromFile(absPath) {
  if (!fs.existsSync(absPath)) return ''
  let raw = fs.readFileSync(absPath, 'utf8')
  raw = raw.replace(/^\uFEFF/, '')
  const lines = raw.split(/\r?\n/)
  let found = ''
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const m = line.match(/^\s*ANTHROPIC_API_KEY\s*=\s*(.*)$/)
    if (!m) continue
    let val = m[1].trim()
    if (!val.startsWith('"') && !val.startsWith("'")) {
      const hashAt = val.indexOf('#')
      if (hashAt >= 0) val = val.slice(0, hashAt).trim()
    }
    const n = normalizeKey(val)
    if (n.length > 0) found = n
  }
  return found
}

/**
 * Merge dotenv from common paths (first wins for each key unless we re-parse files).
 */
function loadDotenvFiles() {
  if (didLoadDotenv) return
  didLoadDotenv = true
  let dotenv = null
  try {
    dotenv = require('dotenv')
  } catch {
    return
  }
  const cwd = process.cwd()
  const appRoot = path.join(__dirname, '..', '..')
  const paths = [
    path.join(appRoot, '.env'),
    path.join(appRoot, '.env.local'),
    path.join(cwd, '.env'),
    path.join(cwd, '.env.local'),
    path.join(cwd, 'medbook', '.env'),
    path.join(cwd, 'medbook', '.env.local'),
  ]
  const seen = new Set()
  for (const filePath of paths) {
    const k = filePath.toLowerCase()
    if (seen.has(k)) continue
    seen.add(k)
    if (!fs.existsSync(filePath)) continue
    dotenv.config({ path: filePath, override: true })
  }
}

/**
 * Walk env files in order; each non-empty ANTHROPIC_API_KEY overwrites (last file wins).
 * @returns {string}
 */
function readAnthropicKeyFromEnvFilesLastWins() {
  const cwd = process.cwd()
  const appRoot = path.join(__dirname, '..', '..')
  const paths = [
    path.join(appRoot, '.env'),
    path.join(appRoot, '.env.local'),
    path.join(cwd, '.env'),
    path.join(cwd, '.env.local'),
    path.join(cwd, 'medbook', '.env'),
    path.join(cwd, 'medbook', '.env.local'),
  ]
  let last = ''
  const seen = new Set()
  for (const filePath of paths) {
    const k = filePath.toLowerCase()
    if (seen.has(k)) continue
    seen.add(k)
    const parsed = parseAnthropicKeyFromFile(filePath)
    if (parsed) last = parsed
  }
  return last
}

/**
 * @param {string} absPath
 * @returns {string}
 */
function parseGeminiKeyFromFile(absPath) {
  if (!fs.existsSync(absPath)) return ''
  let raw = fs.readFileSync(absPath, 'utf8')
  raw = raw.replace(/^\uFEFF/, '')
  const lines = raw.split(/\r?\n/)
  let found = ''
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const m = line.match(
      /^\s*(?:GEMINI_API_KEY|GOOGLE_GENERATIVE_AI_API_KEY)\s*=\s*(.*)$/
    )
    if (!m) continue
    let val = m[1].trim()
    if (!val.startsWith('"') && !val.startsWith("'")) {
      const hashAt = val.indexOf('#')
      if (hashAt >= 0) val = val.slice(0, hashAt).trim()
    }
    const n = normalizeKey(val)
    if (n.length > 0) found = n
  }
  return found
}

/**
 * @returns {string}
 */
function readGeminiKeyFromEnvFilesLastWins() {
  const cwd = process.cwd()
  const appRoot = path.join(__dirname, '..', '..')
  const paths = [
    path.join(appRoot, '.env'),
    path.join(appRoot, '.env.local'),
    path.join(cwd, '.env'),
    path.join(cwd, '.env.local'),
    path.join(cwd, 'medbook', '.env'),
    path.join(cwd, 'medbook', '.env.local'),
  ]
  let last = ''
  const seen = new Set()
  for (const filePath of paths) {
    const k = filePath.toLowerCase()
    if (seen.has(k)) continue
    seen.add(k)
    const parsed = parseGeminiKeyFromFile(filePath)
    if (parsed) last = parsed
  }
  return last
}

/**
 * @returns {string}
 */
function getGeminiApiKey() {
  loadDotenvFiles()
  const fromFile = readGeminiKeyFromEnvFilesLastWins()
  const fromEnv =
    normalizeKey(process.env.GEMINI_API_KEY) ||
    normalizeKey(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
  if (looksLikeGeminiKey(fromFile)) return fromFile
  if (looksLikeGeminiKey(fromEnv)) return fromEnv
  return fromFile || fromEnv || ''
}

/**
 * @param {string} absPath
 * @returns {string}
 */
function parseOpenAIKeyFromFile(absPath) {
  if (!fs.existsSync(absPath)) return ''
  let raw = fs.readFileSync(absPath, 'utf8')
  raw = raw.replace(/^\uFEFF/, '')
  const lines = raw.split(/\r?\n/)
  let found = ''
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const m = line.match(/^\s*OPENAI_API_KEY\s*=\s*(.*)$/)
    if (!m) continue
    let val = m[1].trim()
    if (!val.startsWith('"') && !val.startsWith("'")) {
      const hashAt = val.indexOf('#')
      if (hashAt >= 0) val = val.slice(0, hashAt).trim()
    }
    const n = normalizeKey(val)
    if (n.length > 0) found = n
  }
  return found
}

/**
 * @returns {string}
 */
function readOpenAIKeyFromEnvFilesLastWins() {
  const cwd = process.cwd()
  const appRoot = path.join(__dirname, '..', '..')
  const paths = [
    path.join(appRoot, '.env'),
    path.join(appRoot, '.env.local'),
    path.join(cwd, '.env'),
    path.join(cwd, '.env.local'),
    path.join(cwd, 'medbook', '.env'),
    path.join(cwd, 'medbook', '.env.local'),
  ]
  let last = ''
  const seen = new Set()
  for (const filePath of paths) {
    const k = filePath.toLowerCase()
    if (seen.has(k)) continue
    seen.add(k)
    const parsed = parseOpenAIKeyFromFile(filePath)
    if (parsed) last = parsed
  }
  return last
}

/**
 * @returns {string}
 */
function getOpenAIApiKey() {
  loadDotenvFiles()
  const fromFile = readOpenAIKeyFromEnvFilesLastWins()
  const fromEnv = normalizeKey(process.env.OPENAI_API_KEY)
  if (looksLikeOpenAIKey(fromFile)) return fromFile
  if (looksLikeOpenAIKey(fromEnv)) return fromEnv
  return fromFile || fromEnv || ''
}

/**
 * @returns {string}
 */
function getAnthropicApiKey() {
  loadDotenvFiles()
  const fromFile = readAnthropicKeyFromEnvFilesLastWins()
  const fromEnv = normalizeKey(process.env.ANTHROPIC_API_KEY)
  const alt = normalizeKey(process.env.CLAUDE_API_KEY)

  if (looksLikeAnthropicKey(fromFile)) return fromFile
  if (looksLikeAnthropicKey(fromEnv)) return fromEnv
  if (looksLikeAnthropicKey(alt)) return alt
  return fromFile || fromEnv || alt || ''
}

module.exports = {
  getAnthropicApiKey,
  getGeminiApiKey,
  getOpenAIApiKey,
  loadEnvFromDisk: loadDotenvFiles,
  looksLikeAnthropicKey,
  looksLikeGeminiKey,
  looksLikeOpenAIKey,
  normalizeKey,
}
