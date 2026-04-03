// src/app/api/doctors/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const specialty = searchParams.get('specialty')
  const search = searchParams.get('search')

  const doctors = await prisma.doctor.findMany({
    where: {
      ...(specialty && { specialty }),
      ...(search && {
        OR: [
          { specialty: { contains: search } },
          { user: { name: { contains: search } } },
        ],
      }),
    },
    include: { user: true },
    orderBy: { rating: 'desc' },
  })

  return NextResponse.json(doctors)
}
