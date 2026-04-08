// src/app/admin/(dashboard)/overview/page.tsx
import { prisma } from '@/lib/prisma'
import styles from '../../admin.module.css'

export default async function AdminOverviewPage() {
  const todayYmd = new Date().toISOString().slice(0, 10)
  const [totalAppointments, totalDoctors, pendingApprovals, todaysConsultations, todaysRows] = await Promise.all([
    prisma.appointment.count(),
    prisma.doctor.count(),
    prisma.appointment.count({
      where: { status: 'PENDING' },
    }),
    prisma.appointment.count({
      where: { status: 'CONFIRMED', slot: { date: todayYmd } },
    }),
    prisma.appointment.findMany({
      where: { slot: { date: todayYmd }, status: { in: ['CONFIRMED', 'COMPLETED'] } },
      include: { doctor: { select: { fee: true } } },
    }),
  ])
  const totalRevenue = todaysRows.reduce((sum, r) => sum + Number(r.doctor.fee || 0), 0)
  const patientFlow = todaysRows.length

  return (
    <>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      <p className={styles.pageDesc}>Hospital operations and clinical flow at a glance.</p>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{pendingApprovals}</div>
          <div className={styles.statLabel}>Pending Approvals</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{todaysConsultations}</div>
          <div className={styles.statLabel}>Today's Consultations</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalDoctors}</div>
          <div className={styles.statLabel}>Doctor Availability Snapshot</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>₹{totalRevenue}</div>
          <div className={styles.statLabel}>Total Revenue / Patient Flow ({patientFlow})</div>
        </div>
      </div>

      <div className={styles.card}>
        <p style={{ margin: 0, color: '#64748b', fontSize: 15, lineHeight: 1.6 }}>
          Use <strong>Patient List</strong> for the Master Appointment Queue and approvals, and{' '}
          <strong>Doctor Schedules</strong> for staffing visibility.
        </p>
      </div>
    </>
  )
}
