'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './admin.module.css'

const links = [
  { href: '/admin/overview', label: 'Overview' },
  { href: '/admin/appointments', label: 'Appointments' },
  { href: '/admin/doctors', label: 'Doctors List' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandTitle}>Udumula Hospital</div>
        <div className={styles.brandSub}>Admin</div>
      </div>
      {links.map(({ href, label }) => {
        const active =
          href === '/admin/overview'
            ? pathname === '/admin/overview' || pathname === '/admin'
            : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
          >
            {label}
          </Link>
        )
      })}
    </aside>
  )
}
