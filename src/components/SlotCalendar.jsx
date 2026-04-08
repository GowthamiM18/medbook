'use client'
import { useEffect, useMemo, useState } from 'react'
import styles from './SlotCalendar.module.css'

function buildQuarterHourSlots() {
  const out = []
  for (let mins = 9 * 60; mins <= 16 * 60 + 30; mins += 15) {
    // Exclude lunch break window: 1:00 PM to 1:45 PM.
    if (mins >= 13 * 60 && mins < 14 * 60) continue
    const h24 = Math.floor(mins / 60)
    const m = mins % 60
    const key = `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12
    const mm = String(m).padStart(2, '0')
    const ampm = h24 >= 12 ? 'PM' : 'AM'
    out.push({ key, label: `${h12}:${mm} ${ampm}` })
  }
  return out
}

const STANDARD_TIME_SLOTS = buildQuarterHourSlots()
const ALLOWED_SLOT_KEYS = new Set(STANDARD_TIME_SLOTS.map((s) => s.key))

function slotMins(key) {
  const [h, m] = String(key).split(':').map(Number)
  return h * 60 + m
}

function displayNameWithOptionalTitle(name) {
  const t = String(name || '').trim()
  if (!t) return 'your doctor'
  if (/^dr\.?\s/i.test(t)) return t
  return `Dr. ${t}`
}

function normalizeStartTime(raw) {
  if (!raw) return ''
  const t = String(raw).trim()
  const m24 = t.match(/^(\d{1,2}):(\d{2})$/)
  if (!m24) return t
  return `${String(Number(m24[1])).padStart(2, '0')}:${String(Number(m24[2])).padStart(2, '0')}`
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function toYmd(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function addDays(d, n) {
  const out = new Date(d)
  out.setDate(out.getDate() + n)
  return out
}

export default function SlotCalendar({
  doctorName,
  doctorSpecialty,
  doctorLocation,
  slots,
  selectedSlot,
  onSlotSelect,
  onContinue,
  continueDisabled = false,
}) {
  const now = new Date()
  const todayStart = startOfDay(now)
  const [selectedDateKey, setSelectedDateKey] = useState('')

  const slotsByDate = useMemo(() => {
    const map = {}
    for (const s of slots || []) {
      if (!s?.date) continue
      if (!map[s.date]) map[s.date] = []
      map[s.date].push(s)
    }
    return map
  }, [slots])

  const availableDates = useMemo(() => {
    return Object.keys(slotsByDate)
      .filter((d) => {
        const [y, m, da] = d.split('-').map(Number)
        return new Date(y, m - 1, da) >= todayStart
      })
      .sort((a, b) => (a < b ? -1 : 1))
  }, [slotsByDate, todayStart])

  useEffect(() => {
    if (!availableDates.length) {
      setSelectedDateKey('')
      return
    }
    if (!selectedDateKey || !availableDates.includes(selectedDateKey)) {
      setSelectedDateKey(availableDates[0])
    }
  }, [availableDates, selectedDateKey])

  const daySlots = slotsByDate[selectedDateKey] || []
  const daySlotsInWindow = daySlots.filter((s) => ALLOWED_SLOT_KEYS.has(normalizeStartTime(s.startTime)))
  const availableCount = daySlotsInWindow.filter((s) => !s.booked).length
  const [visitType, setVisitType] = useState('in-clinic')
  const hasDateAndTime = Boolean(selectedDateKey && selectedSlot && selectedSlot.date === selectedDateKey)

  const selectedDateLabel = useMemo(() => {
    if (!selectedDateKey) return 'Select a date'
    const [y, m, d] = selectedDateKey.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
  }, [selectedDateKey])

  const doctorInitials = useMemo(() => {
    return String(doctorName || '')
      .replace(/^dr\.?\s+/i, '')
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'DR'
  }, [doctorName])

  const morningSlots = STANDARD_TIME_SLOTS.filter(({ key }) => slotMins(key) < 12 * 60)
  const afternoonSlots = STANDARD_TIME_SLOTS.filter(({ key }) => slotMins(key) >= 12 * 60)

  function renderSlotGroup(label, slotDefs) {
    return (
      <div className={styles.slotGroup}>
        <p className={styles.groupTitle}>{label}</p>
        <div className={styles.slotGrid}>
          {slotDefs.map(({ key, label: slotLabel }) => {
            const match = daySlots.find((s) => normalizeStartTime(s.startTime) === key)
            const isBooked = Boolean(match?.booked)
            const isSelected = Boolean(match && selectedSlot?.id === match.id)
            const unavailable = !match || isBooked
            return (
              <button
                key={key}
                type="button"
                disabled={unavailable}
                className={`${styles.slotBtn} ${isBooked ? styles.slotBooked : ''} ${!match ? styles.slotMissing : ''} ${isSelected ? styles.slotSelected : ''}`}
                onClick={() => match && onSlotSelect(match)}
              >
                <span>{slotLabel}</span>
                {isBooked ? <span className={styles.bookedTag}>· Booked</span> : null}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.profileHeader}>
        <div className={styles.avatar}>{doctorInitials}</div>
        <div className={styles.profileMeta}>
          <h2 className={styles.doctorName}>{displayNameWithOptionalTitle(doctorName)}</h2>
          <p className={styles.doctorSub}>
            {doctorSpecialty || 'General Physician'} · {doctorLocation || 'Apollo Hospital, Hyderabad'}
          </p>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.leftPanel}>
          <div className={styles.controlBlock}>
            <h3 className={styles.blockTitle}>Select Date</h3>
            <div className={styles.dateScroller}>
              {availableDates.map((dateKey) => {
              const [y, m, d] = dateKey.split('-').map(Number)
              const dateObj = new Date(y, m - 1, d)
              const list = slotsByDate[dateKey] || []
              const hasAvailability = list.some((x) => !x.booked)
              const isPast = startOfDay(dateObj) < todayStart
              const isSelected = selectedDateKey === dateKey
              return (
                <button
                  key={dateKey}
                  type="button"
                  className={`${styles.dayCell} ${isSelected ? styles.daySelected : ''} ${isPast ? styles.dayPast : ''}`}
                  disabled={isPast}
                  onClick={() => setSelectedDateKey(dateKey)}
                >
                  <span className={styles.dayName}>{dateObj.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                  <span className={styles.dayNum}>{dateObj.getDate()}</span>
                  {hasAvailability ? <span className={styles.dayDot} /> : <span className={styles.dayDotMuted} />}
                </button>
              )
              })}
            </div>
          </div>

          <div className={styles.controlBlock}>
            <h3 className={styles.blockTitle}>Visit Type</h3>
            <div className={styles.visitGrid}>
              <button
                type="button"
                className={`${styles.visitCard} ${visitType === 'in-clinic' ? styles.visitCardActive : ''}`}
                onClick={() => setVisitType('in-clinic')}
              >
                <span className={styles.visitIcon}>🏥</span>
                <span>In-clinic</span>
              </button>
              <button
                type="button"
                className={`${styles.visitCard} ${visitType === 'video' ? styles.visitCardActive : ''}`}
                onClick={() => setVisitType('video')}
              >
                <span className={styles.visitIcon}>💻</span>
                <span>Video</span>
              </button>
            </div>
          </div>
        </section>

        <section className={styles.rightPanel}>
          <div className={styles.slotHeader}>
            <p className={styles.slotPanelTitle}>{selectedDateLabel}</p>
            <p className={styles.slotCount}>{availableCount} slots available</p>
          </div>

          <div className={styles.slotList}>
            {renderSlotGroup('Morning', morningSlots)}
            {renderSlotGroup('Afternoon', afternoonSlots)}
          </div>
        </section>
      </div>

      <div className={styles.footerBar}>
        <p className={styles.footerHint}>Choose a date and time to continue</p>
        <button
          type="button"
          className={styles.continueBtn}
          disabled={continueDisabled || !hasDateAndTime}
          onClick={onContinue}
        >
          Confirm booking
        </button>
      </div>
    </div>
  )
}
