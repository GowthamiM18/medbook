'use client'
// src/app/login/page.tsx — patients / appointment booking
import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../auth.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [registeredBanner, setRegisteredBanner] = useState(false)

  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get('registered') === '1') {
      setRegisteredBanner(true)
      router.replace('/login', { scroll: false })
    }
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      const session = await getSession()
      if (session?.user?.role === 'ADMIN') {
        setLoading(false)
        router.push('/admin/overview')
        router.refresh()
        return
      }
      const params = new URLSearchParams(window.location.search)
      let next = params.get('callbackUrl') || '/book'
      if (!next.startsWith('/') || next.startsWith('//')) next = '/book'
      setLoading(false)
      router.push(next)
      router.refresh()
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoDot} /> Udumula Hospital Appointment Booking
        </Link>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.sub}>Sign in to book and manage your appointments</p>

        {registeredBanner && (
          <div className={styles.infoBanner}>
            Account created. Sign in with the email and password you just used.
          </div>
        )}
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        <Link href="/admin/login" className={styles.adminPortalLink}>
          Login as Hospital Admin
        </Link>

        <div className={styles.demoBox}>
          <p>Demo patient:</p>
          <code>patient@demo.com / password123</code>
        </div>

        <p className={styles.switch}>
          Don't have an account? <Link href="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
