// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { normalizePhone10 } from '@/lib/phone'

function setupHint(): string {
  if (process.env.VERCEL) {
    return 'Set DATABASE_URL (PostgreSQL) and NEXTAUTH_URL (your live site URL) in Vercel → Project → Settings → Environment Variables. Commit prisma/migrations/, set Root Directory to medbook if the app is in that folder, then redeploy.'
  }
  return 'Add DATABASE_URL to medbook/.env (see .env.example). Use Neon (free) or local PostgreSQL, then run: npx prisma migrate deploy'
}

function normalizeEmail(email: unknown): string | null {
  if (typeof email !== 'string') return null
  const s = email.trim().toLowerCase()
  if (!s || s.length > 254) return null
  // pragmatic check; <input type="email"> is the main gate
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return null
  return s
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError('Invalid JSON body', 400)
  }

  if (!process.env.DATABASE_URL?.trim()) {
    return jsonError(`Server is missing DATABASE_URL. ${setupHint()}`, 500)
  }

  try {
    const o = body as Record<string, unknown>
    const name = typeof o.name === 'string' ? o.name.trim() : ''
    const email = normalizeEmail(o.email)
    const password = typeof o.password === 'string' ? o.password : ''
    const phoneRaw = o.phone

    if (!name || !email || !password || phoneRaw == null || String(phoneRaw).trim() === '') {
      return jsonError('All fields are required, including phone number.', 400)
    }

    if (name.length > 120) {
      return jsonError('Name is too long.', 400)
    }

    if (password.length < 8 || password.length > 128) {
      return jsonError('Password must be between 8 and 128 characters.', 400)
    }

    const phoneNorm = normalizePhone10(String(phoneRaw))
    if (!phoneNorm) {
      return jsonError(
        'Enter a valid 10-digit mobile number (you may use +91 or spaces).',
        400
      )
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phoneNorm,
        password: hashed,
        role: 'PATIENT',
      },
    })

    return NextResponse.json({
      ok: true,
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    })
  } catch (err) {
    console.error('[api/auth/register]', err)

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        const fields = (err.meta?.target as string[] | undefined) ?? []
        const field = fields.join(', ')
        if (field.includes('email')) {
          return jsonError('This email is already registered. Try signing in.', 409)
        }
        return jsonError('That value is already in use. Try signing in or use different details.', 409)
      }
      if (err.code === 'P2021' || err.code === 'P2022') {
        return jsonError(`Database tables are missing. Run migrations on deploy. ${setupHint()}`, 500)
      }
    }

    if (err instanceof Prisma.PrismaClientInitializationError) {
      return jsonError(`Cannot reach the database. Check DATABASE_URL (SSL, password, host). ${setupHint()}`, 500)
    }

    if (err instanceof Prisma.PrismaClientRustPanicError || err instanceof Prisma.PrismaClientUnknownRequestError) {
      return jsonError(`Database error. ${setupHint()}`, 500)
    }

    const msg = err instanceof Error ? err.message : String(err)
    if (
      /prisma|database|ECONNREFUSED|ENOTFOUND|connection|timeout|relation|does not exist|P10|P20|SSL|auth failed/i.test(
        msg
      )
    ) {
      return jsonError(`Database error. ${setupHint()}`, 500)
    }

    return jsonError('Something went wrong. Please try again in a moment.', 500)
  }
}
