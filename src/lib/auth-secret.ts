/**
 * Single source of truth for NextAuth JWT signing and middleware `getToken`.
 * Edge middleware often does not see `NODE_ENV === 'development'`, so we must
 * not rely on it for the fallback — otherwise tokens verify in Node but fail in middleware.
 */
const FALLBACK_SECRET = 'medbook-local-dev-only-secret-change-me-32chars'

export function getAuthSecret(): string {
  return (
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    FALLBACK_SECRET
  )
}
