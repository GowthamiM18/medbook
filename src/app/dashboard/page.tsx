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
  doctor: { id: string; user: { name: string }; specialty: string; location: string }
  slot: { date: string; startTime: string; endTime: string }
}

const BADGE_CLASS: Record<string, string> = {
  PENDING: styles.badgePending,
  CONFIRMED: styles.badgeConfirmed,
  RESCHEDULED: styles.badgeRescheduled,
  COMPLETED: styles.badgeNeutral,
  CANCELLED: styles.badgeNeutral,
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  RESCHEDULED: 'Rescheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

type PrescriptionItem = {
  id: string
  medicine: string
  doctor: string
  date: string
  status: 'Active' | 'Completed'
}

type TestResultItem = {
  id: string
  test: string
  date: string
  status: 'Normal' | 'Pending' | 'Review'
}

function displaySpecialty(s: string) {
  return s === 'General Practice' ? 'General Physician' : s
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [detailsAppt, setDetailsAppt] = useState<Appointment | null>(null)

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

  function goToReschedule(a: Appointment) {
    router.push(`/book?doctorId=${encodeURIComponent(a.doctor.id)}&rescheduleFrom=${encodeURIComponent(a.id)}`)
  }

  if (status === 'loading' || loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  const upcoming = appointments.filter((a) => ['PENDING', 'CONFIRMED', 'RESCHEDULED'].includes(a.status))
  const past = appointments.filter((a) => ['COMPLETED', 'CANCELLED'].includes(a.status))
  const totalVisits = appointments.length
  const clinicalRecords = appointments.length
  const recentPrescriptions: PrescriptionItem[] = []
  const testResults: TestResultItem[] = []

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoDot} /> Udumula Hospital Appointment Booking
        </Link>
        <nav className={styles.nav}>
          <a className={styles.navActive}>📅 Appointments</a>
          <Link href="/doctors" className={styles.navLink}>🔍 Specialist Directory</Link>
          <Link href="/dashboard?tab=test-results" className={styles.navLink}>📄 Test Results</Link>
          <Link href="/dashboard?tab=prescriptions" className={styles.navLink}>📋 Prescriptions</Link>
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
            <span className={`${styles.statIcon} ${styles.iconCalendar}`}>📅</span>
            <div>
              <p className={styles.statNum}>{upcoming.length}</p>
              <p className={styles.statLabel}>Upcoming</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={`${styles.statIcon} ${styles.iconPrescription}`}>💊</span>
            <div>
              <p className={styles.statNum}>{recentPrescriptions.length > 0 ? recentPrescriptions.length : '--'}</p>
              <p className={styles.statLabel}>Recent Prescriptions</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={`${styles.statIcon} ${styles.iconVisits}`}>🏥</span>
            <div>
              <p className={styles.statNum}>{totalVisits}</p>
              <p className={styles.statLabel}>Total visits</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <span className={`${styles.statIcon} ${styles.iconRecords}`}>📑</span>
            <div>
              <p className={styles.statNum}>{clinicalRecords}</p>
              <p className={styles.statLabel}>Clinical Records</p>
            </div>
          </div>
        </div>

        <div className={styles.healthGrid}>
          <section className={styles.healthCard}>
            <div className={styles.healthCardHeader}>
              <h3>Recent Prescriptions</h3>
              <button className={styles.linkBtn} disabled={recentPrescriptions.length === 0}>View all</button>
            </div>
            <div className={styles.healthList}>
              {recentPrescriptions.length === 0 ? (
                <div className={styles.healthEmpty}>
                  <p>No recent prescriptions found.</p>
                  <p>Your medical history will appear here.</p>
                </div>
              ) : recentPrescriptions.map((item) => (
                <div key={item.id} className={styles.healthListItem}>
                  <span className={styles.listDot} />
                  <div className={styles.healthInfo}>
                    <p className={styles.healthTitle}>{item.medicine}</p>
                    <p className={styles.healthMeta}>{item.doctor} · {item.date}</p>
                  </div>
                  <span
                    className={`${styles.healthBadge} ${
                      item.status === 'Active' ? styles.healthBadgeSuccess : styles.healthBadgeNeutral
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.healthCard}>
            <div className={styles.healthCardHeader}>
              <h3>Test Results</h3>
              <button className={styles.linkBtn} disabled={testResults.length === 0}>View all</button>
            </div>
            <div className={styles.healthList}>
              {testResults.length === 0 ? (
                <div className={styles.healthEmpty}>
                  <p>No pending lab results.</p>
                  <p>Your medical history will appear here.</p>
                </div>
              ) : testResults.map((item) => (
                <div key={item.id} className={styles.healthListItem}>
                  <span className={styles.listDot} />
                  <div className={styles.healthInfo}>
                    <p className={styles.healthTitle}>{item.test}</p>
                    <p className={styles.healthMeta}>{item.date}</p>
                  </div>
                  <span
                    className={`${styles.healthBadge} ${
                      item.status === 'Normal'
                        ? styles.healthBadgeSuccess
                        : item.status === 'Pending'
                          ? styles.healthBadgeInfo
                          : styles.healthBadgeWarning
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Upcoming */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Upcoming appointments</h2>
          {upcoming.length === 0 ? (
            <div className={styles.empty}>
              <p>No upcoming appointments.</p>
              <p className={styles.emptyHint}>
                Doctor names, specialty, and location show up here after you book. Browse all doctors under{' '}
                <Link href="/doctors">Specialist Directory</Link> or use <Link href="/book">AI Booking</Link>.
              </p>
              <Link href="/book" className={styles.btnBook}>Book your first appointment →</Link>
            </div>
          ) : (
            <div className={styles.apptList}>
              {upcoming.map((a) => {
                const status = a.status
                return (
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
                    <p>{displaySpecialty(a.doctor.specialty)} · {a.slot.startTime} - {a.slot.endTime}</p>
                    <p className={styles.apptLocation}>📍 {a.doctor.location}</p>
                    {a.tokenNumber ? (
                      <p className={styles.apptToken}>Reference ID: <strong>{a.tokenNumber}</strong></p>
                    ) : null}
                    {a.symptoms && <p className={styles.apptSymptoms}>"{a.symptoms}"</p>}
                  </div>
                  <div className={styles.apptRight}>
                    <span className={`${styles.badge} ${BADGE_CLASS[status] || styles.badgeNeutral}`}>
                      {STATUS_LABEL[status] || status}
                    </span>
                    {status === 'PENDING' ? (
                      <button className={styles.cancelBtn} onClick={() => setCancelId(a.id)}>
                        Cancel Request
                      </button>
                    ) : null}
                    {status === 'CONFIRMED' ? (
                      <div className={styles.inlineActions}>
                        <button
                          className={styles.secondaryBtn}
                          onClick={() => goToReschedule(a)}
                        >
                          Reschedule
                        </button>
                        <button
                          className={styles.primaryGhostBtn}
                          onClick={() => setDetailsAppt(a)}
                        >
                          View Details
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              )})}
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
                    <p>{displaySpecialty(a.doctor.specialty)} · {a.slot.startTime} – {a.slot.endTime}</p>
                  </div>
                  <span className={`${styles.badge} ${BADGE_CLASS[a.status] || styles.badgeNeutral}`}>
                    {STATUS_LABEL[a.status] || a.status}
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

      {detailsAppt && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>Appointment Details</h3>
            <p style={{ marginBottom: 14 }}>Full consultation information</p>
            <div className={styles.detailsGrid}>
              <div className={styles.detailsRow}>
                <span>Doctor</span>
                <strong>{detailsAppt.doctor.user.name}</strong>
              </div>
              <div className={styles.detailsRow}>
                <span>Specialty</span>
                <strong>{displaySpecialty(detailsAppt.doctor.specialty)}</strong>
              </div>
              <div className={styles.detailsRow}>
                <span>Reference ID</span>
                <strong>{detailsAppt.tokenNumber || '—'}</strong>
              </div>
              <div className={styles.detailsRow}>
                <span>Time</span>
                <strong>
                  {format(new Date(detailsAppt.slot.date + 'T00:00:00'), 'EEEE, MMM d yyyy')} ·{' '}
                  {detailsAppt.slot.startTime} - {detailsAppt.slot.endTime}
                </strong>
              </div>
              <div className={styles.detailsRow}>
                <span>Hospital Location</span>
                <strong>{detailsAppt.doctor.location}</strong>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setDetailsAppt(null)}>
                Close
              </button>
              <button
                className={styles.modalConfirm}
                onClick={() => {
                  setDetailsAppt(null)
                  goToReschedule(detailsAppt)
                }}
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
