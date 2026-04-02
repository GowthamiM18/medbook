// src/app/api/appointments/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateUniqueAppointmentToken } from '@/lib/appointment-token'
import { normalizePhone10 } from '@/lib/phone'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const appointments = await prisma.appointment.findMany({
    where: { patientId: session.user.id },
    include: {
      doctor: { include: { user: true } },
      slot: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(appointments)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { doctorId, slotId, symptoms } = await req.json()

    const slot = await prisma.timeSlot.findUnique({ where: { id: slotId } })
    if (!slot || slot.isBooked) {
      return NextResponse.json({ error: 'Slot no longer available' }, { status: 409 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { phone: true },
    })
    const patientPhone = normalizePhone10(user?.phone ?? '')
    if (!patientPhone) {
      return NextResponse.json(
        {
          error:
            'A valid 10-digit mobile number is required on your account to book. Re-register with a correct number or ask staff to update your profile.',
        },
        { status: 400 }
      )
    }

    const appointment = await prisma.$transaction(async (tx) => {
      const tokenNumber = await generateUniqueAppointmentToken(tx)

      const created = await tx.appointment.create({
        data: {
          patientId: session.user.id,
          doctorId,
          slotId,
          symptoms,
          status: 'CONFIRMED',
          tokenNumber,
          patientPhone,
        },
        include: {
          doctor: { include: { user: true } },
          slot: true,
        },
      })

      await tx.timeSlot.update({
        where: { id: slotId },
        data: { isBooked: true },
      })

      return created
    })

    return NextResponse.json(appointment)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 })
  }
}
