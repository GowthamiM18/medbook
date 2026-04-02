// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { normalizePhone10 } from '@/lib/phone'

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json()

    if (!name || !email || !password || phone == null || String(phone).trim() === '') {
      return NextResponse.json({ error: 'All fields required, including phone number' }, { status: 400 })
    }

    const phoneNorm = normalizePhone10(String(phone))
    if (!phoneNorm) {
      return NextResponse.json(
        { error: 'Enter a valid 10-digit mobile number (you may use +91 or spaces).' },
        { status: 400 }
      )
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, phone: phoneNorm, password: hashed, role: 'PATIENT' },
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
