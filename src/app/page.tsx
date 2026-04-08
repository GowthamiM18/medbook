// src/app/page.tsx
import Link from 'next/link'
import AIAssistant from '@/components/AIAssistant.jsx'
import styles from './home.module.css'

const specialties = [
  { icon: '🫀', name: 'Cardiology', desc: 'Heart & vascular care' },
  { icon: '🧠', name: 'Neurology', desc: 'Brain & nervous system' },
  { icon: '🦴', name: 'Orthopedics', desc: 'Bones & joints' },
  { icon: '🌿', name: 'General Physician', desc: 'Primary care' },
  { icon: '👶', name: 'Pediatrics', desc: 'Children\'s health' },
  { icon: '✨', name: 'Dermatology', desc: 'Skin & hair' },
]

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <span className={styles.logoDot} />
            Udumula Hospital Appointment Booking
          </div>
          <div className={styles.navLinks}>
            <Link href="/login" className={styles.btnOutline}>Sign in</Link>
            <Link href="/register" className={styles.btnPrimary}>Get started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>AI-Powered Healthcare</div>
        <h1 className={styles.heroTitle}>
          Your health,<br />
          <em>booked in seconds.</em>
        </h1>
        <p className={styles.heroSub}>
          Describe your symptoms to our AI assistant and get matched with the right specialist instantly.
          No waiting on hold. No confusion.
        </p>
        <div className={styles.heroCtas}>
          <Link href="/register" className={styles.btnHero}>
            Book an appointment →
          </Link>
          <Link href="/doctors" className={styles.btnHeroOutline}>
            Browse doctors
          </Link>
        </div>

        {/* Floating stats */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>200+</span>
            <span className={styles.statLabel}>Specialists</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>50k+</span>
            <span className={styles.statLabel}>Patients</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>4.9★</span>
            <span className={styles.statLabel}>Rating</span>
          </div>
        </div>
      </section>

      {/* AI Health Assistant — interactive chat + marketing copy */}
      <AIAssistant />

      {/* Specialties */}
      <section className={styles.section} style={{background:'var(--white)'}}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle} style={{textAlign:'center'}}>Browse by specialty</h2>
          <div className={styles.specialtyGrid}>
            {specialties.map(s => (
              <Link key={s.name} href={`/doctors?specialty=${s.name}`} className={styles.specialtyCard}>
                <span className={styles.specialtyIcon}>{s.icon}</span>
                <strong>{s.name}</strong>
                <span>{s.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <span className={styles.logoDot} />
            Udumula Hospital Appointment Booking
          </div>
          <p>© 2026 Udumula Hospital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
