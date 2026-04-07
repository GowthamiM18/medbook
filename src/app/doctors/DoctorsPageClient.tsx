'use client'
// src/app/doctors/DoctorsPageClient.tsx
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import styles from './doctors.module.css'

type Doctor = {
  id: string
  specialty: string
  bio: string
  experience: number
  rating: number
  location: string
  fee: number
  user: { name: string }
}

const SPECIALTIES = ['All', 'General Practice', 'Cardiology', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Neurology']

export default function DoctorsPageClient() {
  const searchParams = useSearchParams()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || 'All')

  useEffect(() => {
    fetchDoctors()
  }, [specialty, search])

  async function fetchDoctors() {
    setLoading(true)
    const params = new URLSearchParams()
    if (specialty !== 'All') params.set('specialty', specialty)
    if (search) params.set('search', search)
    const res = await fetch(`/api/doctors?${params}`)
    const data = await res.json()
    setDoctors(data)
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoDot} /> Udumula Hospital Appointment Booking
        </Link>
        <div className={styles.navRight}>
          <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          <Link href="/book" className={styles.btnAI}>✨ AI Booking</Link>
        </div>
      </nav>

      <div className={styles.container}>
        <div className={styles.hero}>
          <h1>Find the right doctor</h1>
          <p>Browse our network of qualified specialists</p>
        </div>

        <div className={styles.filters}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className={styles.specialtyFilter}>
            {SPECIALTIES.map((s) => (
              <button
                key={s}
                className={specialty === s ? styles.filterActive : styles.filterBtn}
                onClick={() => setSpecialty(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingGrid}>
            {[...Array(6)].map((_, i) => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : doctors.length === 0 ? (
          <div className={styles.empty}>
            <p>
              {specialty === 'All' && !search.trim()
                ? 'No doctors are loaded in the database yet.'
                : 'No doctors match your filters.'}
            </p>
            {specialty === 'All' && !search.trim() ? (
              <p className={styles.emptyHint}>
                After moving to PostgreSQL, demo doctors and time slots must be added again. In the{' '}
                <code>medbook</code> folder run: <code>npm run db:seed</code>
                <br />
                <span className={styles.emptySub}>
                  (This refills doctors and slots. Your patient login is kept.)
                </span>
              </p>
            ) : (
              <p className={styles.emptyHint}>Try &quot;All&quot; specialties or clear the search box.</p>
            )}
          </div>
        ) : (
          <div className={styles.grid}>
            {doctors.map((d) => (
              <div key={d.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.doctorAvatar}>
                    {d.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className={styles.doctorName}>{d.user.name}</h3>
                    <span className={styles.specialtyBadge}>{d.specialty}</span>
                  </div>
                </div>
                <p className={styles.bio}>{d.bio}</p>
                <div className={styles.cardMeta}>
                  <span>⭐ {d.rating}</span>
                  <span>🏥 {d.experience}y exp</span>
                  <span>💰 ₹{d.fee}</span>
                </div>
                <p className={styles.location}>📍 {d.location}</p>
                <Link href={`/book?doctorId=${d.id}`} className={styles.bookBtn}>
                  Book appointment →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
