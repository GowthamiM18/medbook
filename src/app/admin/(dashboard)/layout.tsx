// Dashboard shell: sidebar + main (all routes under /admin except /admin/login)
import Link from 'next/link'
import AdminSidebar from '../AdminSidebar'
import styles from '../admin.module.css'

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <AdminSidebar />
      <div className={styles.main}>
        <div className={styles.topBar}>
          <Link href="/" className={styles.linkHome}>
            ← Back to site
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
