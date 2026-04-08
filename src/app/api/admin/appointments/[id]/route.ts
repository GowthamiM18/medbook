import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = params
  const body = await req.json()
  const status = body?.status as string | undefined
  const note = typeof body?.note === 'string' ? body.note.trim() : ''

  if (status !== 'CONFIRMED' && status !== 'CANCELLED' && status !== 'COMPLETED') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const appt = await prisma.appointment.findUnique({ where: { id } })
  if (!appt) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updated = await prisma.$transaction(async (tx) => {
    const a = await tx.appointment.update({
      where: { id },
      data: {
        status,
        notes: note || undefined,
      },
      include: {
        patient: true,
        doctor: { include: { user: true } },
        slot: true,
      },
    })
    if (status === 'CANCELLED') {
      await tx.timeSlot.update({
        where: { id: appt.slotId },
        data: { isBooked: false },
      })
    }
    return a
  })

  return NextResponse.json(updated)
}
