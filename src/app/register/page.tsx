'use client'
// src/app/register/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../auth.module.css'
import { isValidPhone10 } from '@/lib/phone'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!isValidPhone10(form.phone)) {
      setError('Enter a valid 10-digit mobile number (e.g. 9876543210 or +91 9876543210).')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          password: form.password,
        }),
      })

      let data: { error?: string; ok?: boolean } = {}
      try {
        data = await res.json()
      } catch {
        setError('Bad response from server. Check deployment logs.')
        return
      }

      if (!res.ok) {
        setError(data.error || `Registration failed (${res.status}).`)
        return
      }

      if (data.ok) {
        router.replace('/login?registered=1')
        router.refresh()
        return
      }

      setError('Registration did not complete. Please try again.')
    } catch {
      setError('Network error. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoDot} /> Udumula Hospital Appointment Booking
        </Link>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.sub}>Start booking appointments in seconds</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Full name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="John Smith"
              required
            />
          </div>
          <div className={styles.field}>
            <label>Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className={styles.field}>
            <label>Phone number (10 digits)</label>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="9876543210"
              required
            />
            <span className={styles.fieldHint}>Indian mobile: 10 digits, or +91 with your number.</span>
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
          </div>
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create account →'}
          </button>
        </form>

        <p className={styles.switch}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
