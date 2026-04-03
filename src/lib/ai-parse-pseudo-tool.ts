/**
 * Some Groq/Llama models print fake <function>...</function> or raw JSON instead of API tool_calls.
 * Extract create_appointment args and strip markup from user-visible text.
 */

function looksLikeCreateAppointmentArgs(o: Record<string, unknown>): boolean {
  return typeof o.doctor_name === 'string' || typeof o.doctor_id === 'string'
}

function tryParseJsonObject(s: string): Record<string, unknown> | null {
  try {
    const o = JSON.parse(s) as Record<string, unknown>
    if (o && looksLikeCreateAppointmentArgs(o)) return o
  } catch {
    /* ignore */
  }
  return null
}

/** Find first balanced {...} starting at from, return parsed object if it looks like create_appointment */
function parseBalancedJson(s: string, from: number): Record<string, unknown> | null {
  if (s[from] !== '{') return null
  let depth = 0
  for (let i = from; i < s.length; i++) {
    const c = s[i]
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) {
        return tryParseJsonObject(s.slice(from, i + 1))
      }
    }
  }
  return null
}

export function extractCreateAppointmentPayload(text: string): {
  args: Record<string, unknown> | null
  stripped: string
} {
  const raw = String(text)
  let args: Record<string, unknown> | null = null
  let stripped = raw.trim()

  const funcMatch = /<function\b/i.exec(raw)
  if (funcMatch) {
    const start = funcMatch.index
    const endTag = raw.indexOf('</function>', start)
    const segment = endTag >= 0 ? raw.slice(start, endTag) : raw.slice(start)
    const braceAt = segment.indexOf('{')
    if (braceAt >= 0) {
      const absolute = start + braceAt
      args = parseBalancedJson(raw, absolute)
    }
    if (args && endTag >= 0) {
      stripped = (raw.slice(0, start) + raw.slice(endTag + '</function>'.length)).trim()
    } else if (args) {
      stripped = raw.slice(0, start).trim()
    }
  }

  if (!args && (/"doctor_name"\s*:/.test(raw) || /"doctor_id"\s*:/.test(raw))) {
    const brace = raw.indexOf('{')
    if (brace >= 0) {
      args = parseBalancedJson(raw, brace)
      if (args) {
        let depth = 0
        let end = -1
        for (let i = brace; i < raw.length; i++) {
          if (raw[i] === '{') depth++
          else if (raw[i] === '}') {
            depth--
            if (depth === 0) {
              end = i
              break
            }
          }
        }
        if (end > brace) {
          stripped = (raw.slice(0, brace) + raw.slice(end + 1)).trim()
        }
      }
    }
  }

  stripped = stripped.replace(/\n{3,}/g, '\n\n').trim()
  return { args, stripped }
}
