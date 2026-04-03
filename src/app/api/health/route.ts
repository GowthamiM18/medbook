// GET /api/health — quick checks for Vercel / Postgres setup (no secrets in response)
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const hasUrl = Boolean(process.env.DATABASE_URL?.trim())
  if (!hasUrl) {
    return NextResponse.json(
      {
        ok: false,
        database: 'missing_database_url',
        hint: 'Set DATABASE_URL in Vercel Environment Variables (PostgreSQL).',
      },
      { status: 503 }
    )
  }

  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true, database: 'connected' })
  } catch (e) {
    console.error('[api/health]', e)
    return NextResponse.json(
      {
        ok: false,
        database: 'connection_failed',
        hint: 'DATABASE_URL is set but the server cannot query Postgres (wrong URL, firewall, SSL, or DB paused).',
      },
      { status: 503 }
    )
  }
}
