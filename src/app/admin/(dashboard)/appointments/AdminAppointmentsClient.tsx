'use client'

import { useState } from 'react'
import styles from '../../admin.module.css'

export type AppointmentRow = {
  id: string
  status: string
  notes?: string | null
  tokenNumber: string
  patientPhone: string
  patient: { id: string; name: string; email: string; phone: string }
  doctor: { specialty: string; fee: number; user: { name: string } }
  slot: { date: string; startTime: string; endTime: string }
}

function statusClass(status: string, notes?: string | null) {
  if (status === 'CANCELLED' && String(notes || '').toUpperCase().startsWith('RESCHEDULE:')) {
    return styles.statusRescheduled
  }
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

function statusLabel(status: string, notes?: string | null) {
  if (status === 'CANCELLED' && String(notes || '').toUpperCase().startsWith('RESCHEDULE:')) {
    return 'Rescheduled'
  }
  switch (status) {
    case 'PENDING':
      return 'Pending Review'
    case 'CONFIRMED':
      return 'Confirmed'
    case 'COMPLETED':
      return 'Completed'
    case 'CANCELLED':
      return 'Declined'
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
  return `${dateStr} · ${formatTime(start)} - ${formatTime(end)}`
}

export default function AdminAppointmentsClient({
  initialRows,
  doctorSnapshot,
}: {
  initialRows: AppointmentRow[]
  doctorSnapshot: { totalDoctors: number; activeDoctors: number; onLeaveDoctors: number }
}) {
  const [rows, setRows] = useState<AppointmentRow[]>(initialRows)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [noteById, setNoteById] = useState<Record<string, string>>({})
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')

  async function patchStatus(id: string, status: 'CONFIRMED' | 'CANCELLED', note?: string) {
    setError(null)
    setBusyId(id)
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note: note || '' }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error || 'Could not update appointment')
        return
      }
      const updated: AppointmentRow = await res.json()
      setRows((prev) => prev.map((r) => (r.id === id ? updated : r)))
      if (status === 'CANCELLED') setNoteById((prev) => ({ ...prev, [id]: '' }))
    } finally {
      setBusyId(null)
    }
  }

  if (rows.length === 0) {
    return <p className={styles.empty}>No appointments yet.</p>
  }

  const todayYmd = new Date().toISOString().slice(0, 10)
  const pendingApprovals = rows.filter((r) => r.status === 'PENDING').length
  const todaysConsultations = rows.filter((r) => r.status === 'CONFIRMED' && r.slot.date === todayYmd).length
  const dailyPatientFlow = rows.filter((r) => r.slot.date === todayYmd).length
  const dailyRevenue = rows
    .filter((r) => r.slot.date === todayYmd && (r.status === 'CONFIRMED' || r.status === 'COMPLETED'))
    .reduce((sum, r) => sum + Number(r.doctor?.fee || 0), 0)
  const departments = Array.from(new Set(rows.map((r) => r.doctor.specialty))).sort()
  const filteredRows = rows.filter((r) => {
    const depOk = departmentFilter === 'All' || r.doctor.specialty === departmentFilter
    const label = statusLabel(r.status, r.notes)
    const statusOk = statusFilter === 'All' || label === statusFilter
    const dateOk = !dateFilter || r.slot.date === dateFilter
    return depOk && statusOk && dateOk
  })

  return (
    <>
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{pendingApprovals}</div>
          <div className={styles.statLabel}>Pending Approvals</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{todaysConsultations}</div>
          <div className={styles.statLabel}>Today's Consultations</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {doctorSnapshot.activeDoctors} / {doctorSnapshot.totalDoctors}
          </div>
          <div className={styles.statLabel}>
            Doctor Availability (On leave: {doctorSnapshot.onLeaveDoctors})
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>₹{dailyRevenue}</div>
          <div className={styles.statLabel}>Total Revenue / Patient Flow ({dailyPatientFlow})</div>
        </div>
      </div>

      <div className={styles.filterRow}>
        <select
          className={styles.filterControl}
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="All">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          className={styles.filterControl}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Rescheduled">Rescheduled</option>
          <option value="Completed">Completed</option>
          <option value="Declined">Declined</option>
        </select>
        <input
          className={styles.filterControl}
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {error && (
        <p className={styles.empty} style={{ color: '#b91c1c', marginBottom: 16 }}>
          {error}
        </p>
      )}
      <div className={styles.tableWrap}>
        <table className={`${styles.table} ${styles.tableCondensed}`}>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Specialist</th>
              <th>Requested Time</th>
              <th>Status</th>
              <th>Quick Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((r) => {
              const note = noteById[r.id] ?? ''
              const done = r.status === 'CONFIRMED' || r.status === 'COMPLETED'
              return (
                <tr key={r.id}>
                  <td>{r.patient.name}</td>
                  <td>
                    <strong>{r.doctor.user.name}</strong>
                    <div style={{ color: '#64748b', fontSize: 12 }}>{r.doctor.specialty}</div>
                  </td>
                  <td>{formatDateCell(r.slot.date, r.slot.startTime, r.slot.endTime)}</td>
                  <td>
                    <span className={`${styles.status} ${statusClass(r.status, r.notes)}`}>
                      {statusLabel(r.status, r.notes)}
                    </span>
                  </td>
                  <td>
                    <input
                      className={styles.noteInput}
                      placeholder="Reason if rescheduled"
                      value={note}
                      onChange={(e) => setNoteById((prev) => ({ ...prev, [r.id]: e.target.value }))}
                    />
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.btnApprove}
                        disabled={done || busyId === r.id}
                        onClick={() => patchStatus(r.id, 'CONFIRMED')}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className={styles.btnOutline}
                        disabled={busyId === r.id}
                        onClick={() => {
                          if (!note.trim()) {
                            setError('Quick Note is required for Reschedule/Decline.')
                            return
                          }
                          patchStatus(r.id, 'CANCELLED', `RESCHEDULE: ${note.trim()}`)
                        }}
                      >
                        Reschedule / Decline
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
