import { Suspense } from 'react'
import BookPageClient from './BookPageClient'

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 48, textAlign: 'center', color: '#64748b' }}>
          Loading booking…
        </div>
      }
    >
      <BookPageClient />
    </Suspense>
  )
}
