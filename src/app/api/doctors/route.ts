// src/app/api/doctors/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const specialtyMatch =
      !specialty || specialtyLower === 'all' || doctorSpecialtyLower === specialtyLower

    const searchMatch =
      !search ||
      doctorNameLower.includes(searchLower) ||
      doctorSpecialtyLower.includes(searchLower)

    return specialtyMatch && searchMatch
  })

  return NextResponse.json(filtered)
}
