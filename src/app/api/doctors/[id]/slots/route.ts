// src/app/api/doctors/[id]/slots/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')

  const slots = await prisma.timeSlot.findMany({
    where: {
      doctorId: params.id,
      isBooked: false,
      ...(date && { date }),
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  })

  return NextResponse.json(slots)
}
