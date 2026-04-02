// src/app/admin/(dashboard)/appointments/page.tsx
import { prisma } from '@/lib/prisma'
import AdminAppointmentsClient from './AdminAppointmentsClient'
import styles from '../../admin.module.css'

export const dynamic = 'force-dynamic'

export default async function AdminAppointmentsPage() {
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

  const initialRows = JSON.parse(JSON.stringify(appointments))

  return (
    <>
      <h1 className={styles.pageTitle}>Appointments</h1>
      <p className={styles.pageDesc}>
        All patient bookings from the database. Mark as completed or cancel (cancelling frees the time slot).
      </p>

      <div className={styles.card}>
        <AdminAppointmentsClient initialRows={initialRows} />
      </div>
    </>
  )
}
