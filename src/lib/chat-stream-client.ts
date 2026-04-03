/**
 * Client-side reader for POST /api/chat NDJSON stream ({ t }, { done }, { e }).
 */

export async function consumeNdjsonChatStream(
  response: Response,
  onToken: (text: string) => void
): Promise<{ error?: string; appointmentCreated?: boolean }> {
  if (!response.body) {
    return { error: 'No response body' }
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let nl: number
    while ((nl = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, nl).trim()
      buffer = buffer.slice(nl + 1)
      if (!line) continue
      let obj: { t?: string; done?: boolean; e?: string; appointmentCreated?: boolean }
      try {
        obj = JSON.parse(line) as {
          t?: string
          done?: boolean
          e?: string
          appointmentCreated?: boolean
        }
      } catch {
        continue
      }
      if (typeof obj.e === 'string' && obj.e) return { error: obj.e }
      if (typeof obj.t === 'string' && obj.t) onToken(obj.t)
      if (obj.done === true) {
        return { appointmentCreated: Boolean(obj.appointmentCreated) }
      }
    }
  }

  return {}
}

