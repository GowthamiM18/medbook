// src/app/api/appointments/[id]/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { status } = await req.json()

  const appt = await prisma.appointment.findUnique({ where: { id: params.id } })
  if (!appt || appt.patientId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updated = await prisma.$transaction(async (tx) => {
    const a = await tx.appointment.update({
      where: { id: params.id },
      data: { status },
    })
    if (status === 'CANCELLED') {
      await tx.timeSlot.update({ where: { id: appt.slotId }, data: { isBooked: false } })
    }
    return a
  })

  return NextResponse.json(updated)
}
