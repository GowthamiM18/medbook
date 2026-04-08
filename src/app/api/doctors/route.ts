// src/app/api/doctors/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function normalizeSpecialtyLabel(s: string) {
  const t = s.trim()
  if (t.toLowerCase() === 'general practice') return 'General Physician'
  return t
}

function specialtyAliasSet(s: string) {
  const t = s.trim().toLowerCase()
  if (t === 'general physician' || t === 'general practice') {
    return new Set(['general physician', 'general practice'])
  }
  return new Set([t])
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const specialty = (searchParams.get('specialty') || '').trim()
  const search = (searchParams.get('search') || '').trim()
  const specialtyLower = specialty.toLowerCase()
  const searchLower = search.toLowerCase()

  const doctors = await prisma.doctor.findMany({
    include: { user: true },
    orderBy: { rating: 'desc' },
  })

  const filtered = doctors.filter((d) => {
    const doctorNameLower = d.user.name.toLowerCase()
    const doctorSpecialtyLower = d.specialty.toLowerCase()
    const allowedSpecialties = specialtyAliasSet(specialty)

    const specialtyMatch =
      !specialty || specialtyLower === 'all' || allowedSpecialties.has(doctorSpecialtyLower)

    const searchMatch =
      !search ||
      doctorNameLower.includes(searchLower) ||
      doctorSpecialtyLower.includes(searchLower) ||
      normalizeSpecialtyLabel(d.specialty).toLowerCase().includes(searchLower)

    return specialtyMatch && searchMatch
  })

  const normalized = filtered.map((d) => ({
    ...d,
    specialty: normalizeSpecialtyLabel(d.specialty),
  }))

  return NextResponse.json(normalized)
}
