// src/app/admin/(dashboard)/appointments/page.tsx
import { prisma } from '@/lib/prisma'
import AdminAppointmentsClient from './AdminAppointmentsClient'
import styles from '../../admin.module.css'

export const dynamic = 'force-dynamic'

export default async function AdminAppointmentsPage() {
  const todayYmd = new Date().toISOString().slice(0, 10)
  const appointments = await prisma.appointment.findMany({
    include: {
      patient: {
        select: { id: true, name: true, email: true, phone: true },
      },
      doctor: {
        include: {
          user: { select: { name: true } },
        },
      },
      slot: {
        select: { date: true, startTime: true, endTime: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalDoctors = await prisma.doctor.count()
  const activeDoctorSlots = await prisma.timeSlot.findMany({
    where: {
      date: { gte: todayYmd },
      isBooked: false,
    },
    select: { doctorId: true },
    distinct: ['doctorId'],
  })
  const activeDoctors = activeDoctorSlots.length
  const onLeaveDoctors = Math.max(0, totalDoctors - activeDoctors)

  const initialRows = JSON.parse(JSON.stringify(appointments))

  return (
    <>
      <h1 className={styles.pageTitle}>Admin Dashboard</h1>
      <p className={styles.pageDesc}>
        Master appointment queue for approvals, reschedules, and clinical flow tracking.
      </p>

      <div className={styles.card}>
        <AdminAppointmentsClient
          initialRows={initialRows}
          doctorSnapshot={{
            totalDoctors,
            activeDoctors,
            onLeaveDoctors,
          }}
        />
      </div>
    </>
  )
}
