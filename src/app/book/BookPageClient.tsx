'use client'
// src/app/book/BookPageClient.tsx
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { format } from 'date-fns'
import styles from './book.module.css'
import SlotCalendar from '@/components/SlotCalendar.jsx'

type Doctor = {
  id: string; specialty: string; bio: string
  experience: number; rating: number; location: string; fee: number
  user: { name: string }
}
type Slot = { id: string; date: string; startTime: string; endTime?: string; booked?: boolean }

function displaySpecialty(s: string) {
  return s === 'General Practice' ? 'General Physician' : s
}

export default function BookPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()

  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [symptoms, setSymptoms] = useState('')
  const [step, setStep] = useState(1)
  const [booking, setBooking] = useState(false)
  const [confirmation, setConfirmation] = useState<{
    tokenNumber: string
  } | null>(null)

  const doctorId = searchParams.get('doctorId')
  const rescheduleFrom = searchParams.get('rescheduleFrom')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/book')
  }, [status, router])

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    if (doctorId && doctors.length) {
      const d = doctors.find(d => d.id === doctorId)
      if (d) { setSelectedDoctor(d); setStep(2) }
    }
  }, [doctorId, doctors])

  useEffect(() => {
    if (selectedDoctor) {
      // Avoid stale slot/doctor combinations after doctor change.
      setSelectedSlot(null)
      fetchSlots()
    }
  }, [selectedDoctor])

  async function fetchDoctors() {
    const res = await fetch('/api/doctors')
    const data = await res.json()
    setDoctors(data)
  }

  async function fetchSlots() {
    if (!selectedDoctor) return
    setSlotsLoading(true)
    try {
      const res = await fetch(`/api/doctors/${selectedDoctor.id}/slots`)
      const data = await res.json()
      setSlots(data)
    } finally {
      setSlotsLoading(false)
    }
  }

  async function book() {
    if (!selectedDoctor || !selectedSlot) return
    setBooking(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          slotId: selectedSlot.id,
          symptoms: symptoms.trim(),
          rescheduleFrom: rescheduleFrom || undefined,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setConfirmation({
          tokenNumber: data.tokenNumber ?? '',
        })
      } else {
        const err = await res.json().catch(() => ({}))
        alert((err as { error?: string }).error || 'Booking failed. Please try again.')
      }
    } catch {
      alert('Network error while booking. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (confirmation) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2>Appointment booked!</h2>
          <p>
            Your appointment with <strong>{selectedDoctor?.user.name}</strong> on{' '}
            <strong>{selectedSlot?.date}</strong> at <strong>{selectedSlot?.startTime}</strong> has been booked.
          </p>
          <div className={styles.tokenBox}>
            <span className={styles.tokenLabel}>Your Reference ID</span>
            <span className={styles.tokenValue}>{confirmation.tokenNumber || '—'}</span>
            <span className={styles.tokenHint}>Show this Reference ID at the hospital reception desk.</span>
          </div>
          <p className={styles.tokenHint}>Our team will review and confirm your slot shortly.</p>
          <Link href="/dashboard" className={styles.btnPrimary}>
            View my appointments →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}><span className={styles.logoDot} /> Udumula Hospital Appointment Booking</Link>
        <Link href="/dashboard" className={styles.navLink}>← Dashboard</Link>
      </nav>

      <div className={styles.container}>
        <div className={styles.progress}>
          {['Choose Doctor', 'Pick a Slot', 'Confirm'].map((label, i) => (
            <div key={label} className={styles.progressItem}>
              <div className={`${styles.progressDot} ${step > i ? styles.done : step === i+1 ? styles.active : ''}`}>
                {step > i ? '✓' : i + 1}
              </div>
              <span className={step === i+1 ? styles.progressLabelActive : styles.progressLabel}>{label}</span>
              {i < 2 && <div className={`${styles.progressLine} ${step > i+1 ? styles.lineDone : ''}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className={styles.step}>
            <h2>Choose a doctor</h2>
            {doctors.length === 0 ? (
              <div className={styles.emptyDoctors}>
                <p>No doctors are available yet.</p>
                <p>
                  Your database has no doctor profiles or time slots. From the <code>medbook</code> project
                  folder run <code>npm run db:seed</code>, then refresh this page.
                </p>
                <p className={styles.emptyDoctorsSub}>
                  This is normal after switching to PostgreSQL — data from the old SQLite file does not
                  copy over automatically.
                </p>
              </div>
            ) : null}
            <div className={styles.doctorGrid}>
              {doctors.map(d => (
                <button
                  key={d.id}
                  className={`${styles.doctorCard} ${selectedDoctor?.id === d.id ? styles.doctorSelected : ''}`}
                  onClick={() => setSelectedDoctor(d)}
                >
                  <div className={styles.docAvatar}>
                    {d.user.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div className={styles.docInfo}>
                    <strong>{d.user.name}</strong>
                    <span>{displaySpecialty(d.specialty)}</span>
                    <span>⭐ {d.rating} · ₹{d.fee}</span>
                  </div>
                </button>
              ))}
            </div>
            <button
              className={styles.nextBtn}
              disabled={!selectedDoctor || doctors.length === 0}
              onClick={() => setStep(2)}
            >
              Continue →
            </button>
          </div>
        )}

        {step === 2 && selectedDoctor && (
          <div className={styles.step}>
            {slotsLoading ? (
              <p style={{ color: 'var(--slate)' }}>Loading available slots…</p>
            ) : slots.length === 0 ? (
              <p style={{ color: 'var(--slate)' }}>No open slots for this doctor right now. Try another doctor or check back later.</p>
            ) : (
              <SlotCalendar
                doctorName={selectedDoctor.user.name}
                doctorSpecialty={displaySpecialty(selectedDoctor.specialty)}
                doctorLocation={selectedDoctor.location}
                slots={slots}
                selectedSlot={selectedSlot}
                onSlotSelect={setSelectedSlot}
                onContinue={() => setStep(3)}
                continueDisabled={!selectedSlot}
              />
            )}
          </div>
        )}

        {step === 3 && selectedDoctor && selectedSlot && (
          <div className={styles.step}>
            <h2>Confirm your appointment</h2>
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Doctor</span>
                <strong>{selectedDoctor.user.name}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Specialty</span>
                <strong>{displaySpecialty(selectedDoctor.specialty)}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Date</span>
                <strong>{format(new Date(selectedSlot.date + 'T00:00:00'), 'EEEE, MMM d yyyy')}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Time</span>
                <strong>{selectedSlot.startTime} – {selectedSlot.endTime ?? '—'}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Location</span>
                <strong>{selectedDoctor.location}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Fee</span>
                <strong>₹{selectedDoctor.fee}</strong>
              </div>
            </div>

            <div className={styles.symptomsSection}>
              <label>Describe your symptoms or reason for visit</label>
              <textarea
                className={styles.symptomsInput}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Chest pain and shortness of breath for the past 2 days..."
                rows={4}
              />
            </div>

            <div className={styles.stepNav}>
              <button className={styles.backBtn} onClick={() => setStep(2)}>← Back</button>
              <button
                className={styles.confirmBtn}
                disabled={booking}
                onClick={book}
              >
                {booking ? 'Booking...' : 'Confirm booking →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
