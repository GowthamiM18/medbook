import { Suspense } from 'react'
import DoctorsPageClient from './DoctorsPageClient'

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 48, textAlign: 'center', color: '#64748b' }}>
          Loading doctors…
        </div>
      }
    >
      <DoctorsPageClient />
    </Suspense>
  )
}
