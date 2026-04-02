/** Strip to a 10-digit Indian mobile (handles +91, spaces, leading 0). */
export function normalizePhone10(raw: string): string | null {
  const d = String(raw).replace(/\D/g, '')
  if (d.length === 10) return d
  if (d.length === 12 && d.startsWith('91')) return d.slice(-10)
  if (d.length === 11 && d.startsWith('0')) return d.slice(1)
  return null
}

export function isValidPhone10(raw: string): boolean {
  return normalizePhone10(raw) !== null
}
