'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn, signOut, getSession } from 'next-auth/react'
import styles from './adminLogin.module.css'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getSession().then((session) => {
      if (session?.user?.role === 'ADMIN') {
        const params = new URLSearchParams(window.location.search)
        const cb = params.get('callbackUrl')
        router.replace(
          cb && cb.startsWith('/admin') && !cb.startsWith('/admin/login') ? cb : '/admin/overview'
        )
      }
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    const session = await getSession()
    if (session?.user?.role !== 'ADMIN') {
      await signOut({ redirect: false })
      setError('This portal is for hospital staff only. Patient accounts cannot sign in here.')
      setLoading(false)
      return
    }

    const params = new URLSearchParams(window.location.search)
    let next = params.get('callbackUrl') || '/admin/overview'
    if (!next.startsWith('/admin') || next.startsWith('/admin/login')) {
      next = '/admin/overview'
    }
    if (next.startsWith('//')) next = '/admin/overview'

    setLoading(false)
    router.push(next)
    router.refresh()
  }

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.logoMark} aria-hidden>
            ✚
          </div>
          <h1 className={styles.hospitalName}>Udumula Multi-Speciality Hospital</h1>
          <p className={styles.hospitalTag}>Quality care · Trusted since generations</p>
          <p className={styles.portalTitle}>Staff &amp; administration portal</p>
        </header>

        <div className={styles.body}>
          <h2 className={styles.title}>Secure sign-in</h2>
          <p className={styles.sub}>Use the credentials issued by hospital IT. Do not share your password.</p>

          {error && <div className={styles.error}>{error}</div>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="admin-email">Work email</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@udumulahospital.com"
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? 'Signing in…' : 'Enter administration'}
            </button>
          </form>

          <p className={styles.hint}>
            Demo admin: <code>admin@udumulahospital.com</code> / <code>admin123</code>
            <br />
            Run <code>npm run db:seed</code> if the account is missing.
          </p>
        </div>
      </div>

      <div className={styles.footerLinks}>
        <Link href="/login">Patient login — book appointments</Link>
        <Link href="/" className={styles.patientLink}>
          ← Back to hospital website
        </Link>
      </div>
    </div>
  )
}
