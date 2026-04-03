// src/app/admin/(dashboard)/overview/page.tsx
import { prisma } from '@/lib/prisma'
import styles from '../../admin.module.css'

export default async function AdminOverviewPage() {
  const [totalAppointments, totalDoctors, activeBookings] = await Promise.all([
    prisma.appointment.count(),
    prisma.doctor.count(),
    prisma.appointment.count({
      where: { status: { in: ['PENDING', 'CONFIRMED'] } },
    }),
  ])

  return (
    <>
      <h1 className={styles.pageTitle}>Overview</h1>
      <p className={styles.pageDesc}>Hospital operations at a glance.</p>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalAppointments}</div>
          <div className={styles.statLabel}>Total appointments</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{activeBookings}</div>
          <div className={styles.statLabel}>Pending / confirmed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalDoctors}</div>
          <div className={styles.statLabel}>Doctors on staff</div>
        </div>
      </div>

      <div className={styles.card}>
        <p style={{ margin: 0, color: '#64748b', fontSize: 15, lineHeight: 1.6 }}>
          Use <strong>Appointments</strong> to review bookings and update status. Use{' '}
          <strong>Doctors List</strong> to see all registered specialists.
        </p>
      </div>
    </>
  )
}
