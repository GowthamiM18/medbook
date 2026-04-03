/**
 * Server-side booking for AI tool create_appointment (matches /api/appointments POST rules).
 */
import { format, isValid, parseISO } from 'date-fns'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { generateUniqueAppointmentToken } from '@/lib/appointment-token'
import { normalizePhone10 } from '@/lib/phone'

export type CreateAppointmentArgs = {
  doctor_id?: string
  doctor_name?: string
  date: string
  time: string
  reason: string
}

export type CreateAppointmentToolResult =
  | {
      ok: true
      message: string
      doctorName: string
      date: string
      time: string
      tokenNumber: string
      appointmentId: string
    }
  | { ok: false; error: string }

function normName(s: string) {
  return s
    .toLowerCase()
    .replace(/^dr\.?\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseDateToYmd(input: string): string | null {
  const t = input.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t
  const iso = parseISO(t)
  if (isValid(iso)) return format(iso, 'yyyy-MM-dd')
  const d = new Date(t)
  if (!Number.isNaN(d.getTime())) return format(d, 'yyyy-MM-dd')
  return null
}

/** Models often use a stale year (e.g. 2024); align to current calendar year for slot lookup. */
function normalizeYmdYear(ymd: string): string {
  const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return ymd
  const y = parseInt(m[1], 10)
  const cy = new Date().getFullYear()
  if (y < cy) return `${cy}-${m[2]}-${m[3]}`
  return ymd
}

/** Normalize to HH:mm as stored on TimeSlot (24h). */
function parseTimeToSlot(input: string): string | null {
  const s = input.trim().toUpperCase().replace(/\s+/g, '')
  let m = s.match(/^(\d{1,2}):(\d{2})$/)
  if (m) {
    const h = Math.min(23, parseInt(m[1], 10))
    const min = Math.min(59, parseInt(m[2], 10))
    return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
  }
  m = s.match(/^(\d{1,2}):(\d{2})(AM|PM)$/)
  if (m) {
    let h = parseInt(m[1], 10)
    const min = parseInt(m[2], 10)
    if (m[3] === 'PM' && h < 12) h += 12
    if (m[3] === 'AM' && h === 12) h = 0
    return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
  }
  m = s.match(/^(\d{1,2})(AM|PM)$/)
  if (m) {
    let h = parseInt(m[1], 10)
    if (m[2] === 'PM' && h < 12) h += 12
    if (m[2] === 'AM' && h === 12) h = 0
    return `${String(h).padStart(2, '0')}:00`
  }
  return null
}

export async function executeCreateAppointment(
  raw: Record<string, unknown>,
  patientId: string | undefined
): Promise<CreateAppointmentToolResult> {
  if (!patientId?.trim()) {
    return {
      ok: false,
      error: 'User must be signed in to book. Ask them to log in from the login page, then try again.',
    }
  }

  const doctor_id = String(raw.doctor_id ?? '').trim()
  const doctor_name = String(raw.doctor_name ?? '').trim()
  const dateRaw = String(raw.date ?? '').trim()
  const timeRaw = String(raw.time ?? '').trim()
  const reason = String(raw.reason ?? '').trim()

  if ((!doctor_id && !doctor_name) || !dateRaw || !timeRaw || !reason) {
    return {
      ok: false,
      error:
        'Missing booking fields. Need doctor_id (from the roster) or doctor_name, plus date, time, and reason.',
    }
  }

  let ymd = parseDateToYmd(dateRaw)
  if (!ymd) {
    return {
      ok: false,
      error: `Could not parse date "${dateRaw}". Use YYYY-MM-DD (e.g. 2026-04-15).`,
    }
  }
  ymd = normalizeYmdYear(ymd)

  const hhmm = parseTimeToSlot(timeRaw)
  if (!hhmm) {
    return {
      ok: false,
      error: `Could not parse time "${timeRaw}". Use 24h HH:mm (e.g. 14:00) or 12h with AM/PM.`,
    }
  }

  let doctor: (Prisma.DoctorGetPayload<{ include: { user: true } }>) | null = null

  if (doctor_id) {
    doctor = await prisma.doctor.findUnique({
      where: { id: doctor_id },
      include: { user: true },
    })
    if (!doctor) {
      return {
        ok: false,
        error: `doctor_id "${doctor_id}" is not in our system. Use only doctor_id values from the live roster — do not invent IDs.`,
      }
    }
  }

  if (!doctor && doctor_name) {
    const doctors = await prisma.doctor.findMany({
      include: { user: true },
    })
    const target = normName(doctor_name)
    doctor =
      doctors.find((d) => {
        const n = normName(d.user.name)
        return n.includes(target) || target.includes(n) || normName(doctor_name) === n
      }) ?? null
  }

  if (!doctor) {
    const doctors = await prisma.doctor.findMany({
      include: { user: true },
    })
    const names = doctors.map((d) => `${d.user.name} (id: ${d.id})`).slice(0, 16)
    return {
      ok: false,
      error: names.length
        ? `No doctor matched that request. Registered doctors: ${names.join('; ')}. Ask the user to pick from this list only.`
        : 'No doctors are registered yet. Cannot complete booking.',
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: patientId },
    select: { phone: true, name: true },
  })
  const patientPhone = normalizePhone10(user?.phone ?? '')
  if (!patientPhone) {
    return {
      ok: false,
      error:
        'Patient profile has no valid 10-digit mobile number. They must update their account before booking.',
    }
  }

  let slot = await prisma.timeSlot.findFirst({
    where: {
      doctorId: doctor.id,
      date: ymd,
      startTime: hhmm,
      isBooked: false,
    },
  })

  if (!slot) {
    const alts = await prisma.timeSlot.findMany({
      where: { doctorId: doctor.id, date: ymd, isBooked: false },
      orderBy: { startTime: 'asc' },
      take: 8,
      select: { startTime: true },
    })
    const list = alts.map((a) => a.startTime).join(', ')
    return {
      ok: false,
      error: list
        ? `No open slot at ${hhmm} on ${ymd} for ${doctor.user.name}. Open times that day: ${list}. Ask the user to pick one.`
        : `No open slots on ${ymd} for ${doctor.user.name}. Suggest another date or doctor.`,
    }
  }

  const slotId = slot.id

  try {
    const appointment = await prisma.$transaction(async (tx) => {
      const tokenNumber = await generateUniqueAppointmentToken(tx)
      const created = await tx.appointment.create({
        data: {
          patientId,
          doctorId: doctor.id,
          slotId,
          symptoms: reason,
          status: 'CONFIRMED',
          tokenNumber,
          patientPhone,
        },
      })
      await tx.timeSlot.update({
        where: { id: slotId },
        data: { isBooked: true },
      })
      return { ...created, tokenNumber }
    })

    return {
      ok: true,
      message: `Booked with ${doctor.user.name} on ${ymd} at ${hhmm}. Queue token ${appointment.tokenNumber}.`,
      doctorName: doctor.user.name,
      date: ymd,
      time: hhmm,
      tokenNumber: appointment.tokenNumber,
      appointmentId: appointment.id,
    }
  } catch (e) {
    console.error('[executeCreateAppointment]', e)
    return {
      ok: false,
      error: 'Database error while booking. Slot may have been taken — ask the user to pick another time.',
    }
  }
}
