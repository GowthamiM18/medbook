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
    const body = (await req.json()) as {
      doctorId?: string
      slotId?: string
      symptoms?: string
      rescheduleFrom?: string
    }
    const doctorId = String(body.doctorId ?? '').trim()
    const slotId = String(body.slotId ?? '').trim()
    const symptoms = String(body.symptoms ?? '').trim()
    const rescheduleFrom = String(body.rescheduleFrom ?? '').trim()

    if (!doctorId || !slotId) {
      return NextResponse.json({ error: 'doctorId and slotId are required' }, { status: 400 })
    }

    const slot = await prisma.timeSlot.findUnique({ where: { id: slotId } })
    if (!slot || slot.isBooked) {
      return NextResponse.json({ error: 'Slot no longer available' }, { status: 409 })
    }
    if (slot.doctorId !== doctorId) {
      return NextResponse.json(
        {
          error:
            'Selected slot does not belong to this doctor. Please pick a slot again from the selected doctor.',
        },
        { status: 400 }
      )
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
      let oldSlotId: string | null = null
      if (rescheduleFrom) {
        const oldAppt = await tx.appointment.findFirst({
          where: {
            id: rescheduleFrom,
            patientId: session.user.id,
          },
          select: { id: true, slotId: true },
        })
        if (!oldAppt) {
          throw new Error('Reschedule source appointment not found for this user.')
        }
        oldSlotId = oldAppt.slotId
        await tx.appointment.update({
          where: { id: oldAppt.id },
          data: {
            status: 'CANCELLED',
            notes: 'Rescheduled by patient',
          },
        })
      }

      const tokenNumber = await generateUniqueAppointmentToken(tx)

      const created = await tx.appointment.create({
        data: {
          patientId: session.user.id,
          doctorId,
          slotId,
          symptoms,
          status: 'PENDING',
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
      if (oldSlotId && oldSlotId !== slotId) {
        await tx.timeSlot.update({
          where: { id: oldSlotId },
          data: { isBooked: false },
        })
      }

      return created
    })

    return NextResponse.json(appointment)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Booking failed due to a server/database issue. Please retry in a moment.' },
      { status: 500 }
    )
  }
}
