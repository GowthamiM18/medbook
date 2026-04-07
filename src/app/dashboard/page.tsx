'use client'
// src/app/dashboard/page.tsx
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import styles from './dashboard.module.css'
import AIChat from '@/components/AIChat'

type Appointment = {
  id: string
  status: string
  symptoms: string
  tokenNumber?: string
  createdAt: string
  doctor: { user: { name: string }; specialty: string; location: string }
  slot: { date: string; startTime: string; endTime: string }
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: '#dcfce7',
  PENDING: '#fef9c3',
  CANCELLED: '#fee2e2',
  COMPLETED: '#e0f2fe',
}
const STATUS_TEXT: Record<string, string> = {
  CONFIRMED: '#166534',
  PENDING: '#854d0e',
  CANCELLED: '#991b1b',
  COMPLETED: '#075985',
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [cancelId, setCancelId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') fetchAppointments()
  }, [status])

  async function fetchAppointments() {
    const res = await fetch('/api/appointments')
    const data = await res.json()
    setAppointments(data)
    setLoading(false)
  }

  async function cancelAppointment(id: string) {
    await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' }),
    })
    setCancelId(null)
    fetchAppointments()
  }

  async function handleSignOut() {
    const ok = window.confirm('Are you sure you want to sign out?')
    if (!ok) return
    await signOut({ callbackUrl: '/' })
  }

  if (status === 'loading' || loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  const upcoming = appointments.filter((a) => a.status === 'CONFIRMED')
  const past = appointments.filter((a) => a.status !== 'CONFIRMED')

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoDot} /> Udumula Hospital Appointment Booking
        </Link>
        <nav className={styles.nav}>
          <a className={styles.navActive}>📅 Appointments</a>
          <Link href="/doctors" className={styles.navLink}>🔍 Find Doctors</Link>
        </nav>
        <div className={styles.sidebarBottom}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={styles.userName}>{session?.user?.name}</p>
              <p className={styles.userEmail}>{session?.user?.email}</p>
            </div>
          </div>
          <button className={styles.signOut} onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.greeting}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {session?.user?.name?.split(' ')[0]}
            </h1>
            <p className={styles.headerSub}>Manage your health appointments</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.btnAI} onClick={() => setShowChat(true)}>
              ✨ Book with AI
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>📅</span>
            <div>
              <p className={styles.statNum}>{upcoming.length}</p>
              <p className={styles.statLabel}>Upcoming</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>✅</span>
            <div>
              <p className={styles.statNum}>{appointments.filter(a=>a.status==='COMPLETED').length}</p>
              <p className={styles.statLabel}>Completed</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🏥</span>
            <div>
              <p className={styles.statNum}>{appointments.length}</p>
              <p className={styles.statLabel}>Total visits</p>
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Upcoming appointments</h2>
          {upcoming.length === 0 ? (
            <div className={styles.empty}>
              <p>No upcoming appointments.</p>
              <p className={styles.emptyHint}>
                Doctor names, specialty, and location show up here after you book. Browse all doctors under{' '}
                <Link href="/doctors">Find Doctors</Link> or use <Link href="/book">AI Booking</Link>.
              </p>
              <Link href="/book" className={styles.btnBook}>Book your first appointment →</Link>
            </div>
          ) : (
            <div className={styles.apptList}>
              {upcoming.map((a) => (
                <div key={a.id} className={styles.apptCard}>
                  <div className={styles.apptDateBlock}>
                    <span className={styles.apptDay}>
                      {format(new Date(a.slot.date + 'T00:00:00'), 'MMM')}
                    </span>
                    <span className={styles.apptDate}>
                      {format(new Date(a.slot.date + 'T00:00:00'), 'd')}
                    </span>
                  </div>
                  <div className={styles.apptInfo}>
                    <h3>{a.doctor.user.name}</h3>
                    <p>{a.doctor.specialty} · {a.slot.startTime} – {a.slot.endTime}</p>
                    <p className={styles.apptLocation}>📍 {a.doctor.location}</p>
                    {a.tokenNumber ? (
                      <p className={styles.apptToken}>Token: <strong>{a.tokenNumber}</strong></p>
                    ) : null}
                    {a.symptoms && <p className={styles.apptSymptoms}>"{a.symptoms}"</p>}
                  </div>
                  <div className={styles.apptRight}>
                    <span
                      className={styles.badge}
                      style={{ background: STATUS_COLORS[a.status], color: STATUS_TEXT[a.status] }}
                    >
                      {a.status}
                    </span>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => setCancelId(a.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Past appointments</h2>
            <div className={styles.apptList}>
              {past.map((a) => (
                <div key={a.id} className={styles.apptCard} style={{ opacity: 0.75 }}>
                  <div className={styles.apptDateBlock}>
                    <span className={styles.apptDay}>
                      {format(new Date(a.slot.date + 'T00:00:00'), 'MMM')}
                    </span>
                    <span className={styles.apptDate}>
                      {format(new Date(a.slot.date + 'T00:00:00'), 'd')}
                    </span>
                  </div>
                  <div className={styles.apptInfo}>
                    <h3>{a.doctor.user.name}</h3>
                    <p>{a.doctor.specialty} · {a.slot.startTime} – {a.slot.endTime}</p>
                  </div>
                  <span
                    className={styles.badge}
                    style={{ background: STATUS_COLORS[a.status], color: STATUS_TEXT[a.status] }}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* AI Chat Modal */}
      {showChat && (
        <AIChat
          onClose={() => {
            setShowChat(false)
            fetchAppointments()
          }}
          onAppointmentBooked={() => {
            fetchAppointments()
            router.refresh()
          }}
        />
      )}

      {/* Cancel Confirm */}
      {cancelId && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>Cancel appointment?</h3>
            <p>This action cannot be undone. The slot will become available for others.</p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setCancelId(null)}>Keep it</button>
              <button className={styles.modalConfirm} onClick={() => cancelAppointment(cancelId)}>
                Yes, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
