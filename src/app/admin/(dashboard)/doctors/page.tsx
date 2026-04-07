// src/app/admin/(dashboard)/doctors/page.tsx
import { prisma } from '@/lib/prisma'
import styles from '../../admin.module.css'

export default async function AdminDoctorsPage() {
  const doctors = await prisma.doctor.findMany({
    include: { user: true },
    orderBy: { user: { name: 'asc' } },
  })

  return (
    <>
      <h1 className={styles.pageTitle}>Doctors List</h1>
      <p className={styles.pageDesc}>All specialists registered in the system.</p>

      <div className={styles.card}>
        {doctors.length === 0 ? (
          <p className={styles.empty}>No doctors yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialty</th>
                  <th>Experience (yrs)</th>
                  <th>Rating</th>
                  <th>Fee</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d.id}>
                    <td>{d.user.name}</td>
                    <td>{d.specialty}</td>
                    <td>{d.experience}</td>
                    <td>{d.rating.toFixed(1)}</td>
                    <td>₹{d.fee}</td>
                    <td>{d.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
