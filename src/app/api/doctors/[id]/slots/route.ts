// src/app/api/doctors/[id]/slots/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function buildDaySlots() {
  const out: { startTime: string; endTime: string }[] = []
  for (let mins = 9 * 60; mins <= 16 * 60 + 30; mins += 15) {
    if (mins >= 13 * 60 && mins < 14 * 60) continue
    const end = mins + 15
    const sh = Math.floor(mins / 60)
    const sm = mins % 60
    const eh = Math.floor(end / 60)
    const em = end % 60
    out.push({
      startTime: `${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}`,
      endTime: `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`,
    })
  }
  return out
}

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

async function ensureDoctorHasSlots(doctorId: string) {
  const existing = await prisma.timeSlot.count({ where: { doctorId } })
  if (existing > 0) return

  const rows: { doctorId: string; date: string; startTime: string; endTime: string }[] = []
  const template = buildDaySlots()
  for (let i = 1; i <= 21; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const dow = d.getDay()
    if (dow === 0 || dow === 6) continue
    const date = ymd(d)
    for (const t of template) {
      rows.push({
        doctorId,
        date,
        startTime: t.startTime,
        endTime: t.endTime,
      })
    }
  }
  if (rows.length) await prisma.timeSlot.createMany({ data: rows })
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  const doctorId = params.id

  await ensureDoctorHasSlots(doctorId)

  const slots = await prisma.timeSlot.findMany({
    where: {
      doctorId,
      isBooked: false,
      OR: [
        { startTime: { gte: '09:00', lte: '12:45' } },
        { startTime: { gte: '14:00', lte: '16:30' } },
      ],
      ...(date && { date }),
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  })

  return NextResponse.json(slots)
}
