'use client'

import { useState } from 'react'
import styles from '../../admin.module.css'

export type AppointmentRow = {
  id: string
  status: string
  tokenNumber: string
  patientPhone: string
  patient: { id: string; name: string; email: string; phone: string }
  doctor: { user: { name: string } }
  slot: { date: string; startTime: string; endTime: string }
}

function statusClass(status: string) {
  switch (status) {
    case 'PENDING':
      return styles.statusPending
    case 'CONFIRMED':
      return styles.statusConfirmed
    case 'COMPLETED':
      return styles.statusCompleted
    case 'CANCELLED':
      return styles.statusCancelled
    default:
      return styles.statusPending
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'PENDING':
      return 'Pending'
    case 'CONFIRMED':
      return 'Confirmed'
    case 'COMPLETED':
      return 'Completed'
    case 'CANCELLED':
      return 'Cancelled'
    default:
      return status
  }
}

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const d = new Date()
  d.setHours(h, m, 0, 0)
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

function formatDateCell(date: string, start: string, end: string) {
  const d = new Date(date + 'T12:00:00')
  const dateStr = d.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  return `${dateStr} · ${formatTime(start)} – ${formatTime(end)}`
}

export default function AdminAppointmentsClient({
  initialRows,
}: {
  initialRows: AppointmentRow[]
}) {
  const [rows, setRows] = useState<AppointmentRow[]>(initialRows)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function patchStatus(id: string, status: 'COMPLETED' | 'CANCELLED') {
    setError(null)
    setBusyId(id)
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error || 'Could not update appointment')
        return
      }
      const updated: AppointmentRow = await res.json()
      setRows((prev) => prev.map((r) => (r.id === id ? updated : r)))
    } finally {
      setBusyId(null)
    }
  }

  if (rows.length === 0) {
    return <p className={styles.empty}>No appointments yet.</p>
  }

  return (
    <>
      {error && (
        <p className={styles.empty} style={{ color: '#b91c1c', marginBottom: 16 }}>
          {error}
        </p>
      )}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Patient name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Token</th>
              <th>Doctor name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const terminal = r.status === 'COMPLETED' || r.status === 'CANCELLED'
              return (
                <tr key={r.id}>
                  <td>{r.patient.name}</td>
                  <td>{r.patient.email}</td>
                  <td>{(r.patientPhone || r.patient.phone) || '—'}</td>
                  <td>
                    <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>
                      {r.tokenNumber || '—'}
                    </span>
                  </td>
                  <td>{r.doctor.user.name}</td>
                  <td>{formatDateCell(r.slot.date, r.slot.startTime, r.slot.endTime)}</td>
                  <td>
                    <span className={`${styles.status} ${statusClass(r.status)}`}>
                      {statusLabel(r.status)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.btnComplete}
                        disabled={terminal || busyId === r.id}
                        onClick={() => patchStatus(r.id, 'COMPLETED')}
                      >
                        Mark completed
                      </button>
                      <button
                        type="button"
                        className={styles.btnCancel}
                        disabled={terminal || busyId === r.id}
                        onClick={() => patchStatus(r.id, 'CANCELLED')}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
