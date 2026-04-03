'use client' // Next.js App Router: this file uses hooks and must run on the client
// Slot calendar + time picker for Udumula Hospital booking (plain React + CSS module)
import { useMemo, useState } from 'react' // useMemo caches derived calendar data; useState holds UI state
import styles from './SlotCalendar.module.css' // Scoped styles for this component

/** @typedef {{ id: string, date: string, startTime: string, endTime?: string, booked?: boolean }} SlotProp */

/**
 * Build 30-minute labels from 9:00 AM through 5:00 PM inclusive.
 * @returns {{ key: string, label: string }[]}
 */
function buildStandardTimeSlots() {
  const out = [] // Collect { key: 'HH:mm', label: 'h:mm AM/PM' } for each row
  for (let mins = 9 * 60; mins <= 17 * 60; mins += 30) {
    // Walk minutes from 9:00 to 17:00 in 30-minute steps
    const h24 = Math.floor(mins / 60) // Hour in 24h clock
    const m = mins % 60 // Minutes part (0 or 30)
    const key = `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}` // Stable key for API matching
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12 // Convert to 12h hour part
    const ampm = h24 >= 12 ? 'PM' : 'AM' // Morning vs afternoon label
    const mm = m === 0 ? '00' : '30' // Only half hours in this grid
    const label = `${h12}:${mm} ${ampm}` // Human-readable label shown in the grid
    out.push({ key, label }) // Append one slot row definition
  }
  return out // Full list of standard slot rows
}

const STANDARD_TIME_SLOTS = buildStandardTimeSlots() // Compute once at module load

/**
 * Heading label: avoid "Dr. Dr. Name" when API already stores "Dr. …" on user.name.
 * @param {string} name
 */
function displayNameWithOptionalTitle(name) {
  const t = String(name || '').trim()
  if (!t) return 'your doctor'
  if (/^dr\.?\s/i.test(t)) return t
  return `Dr. ${t}`
}

/**
 * Normalize API/seed time strings to 'HH:mm' for comparison.
 * @param {string} raw
 */
function normalizeStartTime(raw) {
  if (!raw) return '' // Empty input maps to empty key
  const t = String(raw).trim() // Trim whitespace from DB values
  const m24 = t.match(/^(\d{1,2}):(\d{2})$/) // Match 24h-like "9:00" or "09:00"
  if (m24) {
    // Parsed as 24h compact form
    const hh = Number(m24[1]) // Hours
    const mm = Number(m24[2]) // Minutes
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}` // Padded key
  }
  return t // Fallback: return as-is (still might match if seed format changes)
}

/**
 * Calendar month matrix: leading blanks, day numbers, trailing blanks.
 * @param {number} year
 * @param {number} monthIndex 0–11
 */
function buildMonthCells(year, monthIndex) {
  const first = new Date(year, monthIndex, 1) // First day of target month (local)
  const startWeekday = first.getDay() // 0=Sun … 6=Sat (Sunday-first grid)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate() // Last day number
  const cells = [] // Flat list of cell descriptors
  for (let i = 0; i < startWeekday; i++) {
    // Leading padding before day 1
    cells.push({ type: 'empty' }) // Non-interactive placeholder
  }
  for (let d = 1; d <= daysInMonth; d++) {
    // One cell per real calendar day
    const dateObj = new Date(year, monthIndex, d) // Local date instance
    const y = dateObj.getFullYear() // Year part for ISO key
    const mo = String(dateObj.getMonth() + 1).padStart(2, '0') // Month part MM
    const da = String(dateObj.getDate()).padStart(2, '0') // Day part DD
    const dateKey = `${y}-${mo}-${da}` // yyyy-MM-dd key used by API slots
    cells.push({ type: 'day', day: d, dateKey, dateObj }) // Clickable day payload
  }
  while (cells.length % 7 !== 0) {
    // Pad end so rows are full weeks
    cells.push({ type: 'empty' }) // Trailing blanks
  }
  return cells // Complete grid for rendering
}

/**
 * Compare calendar date to "today" at local midnight.
 * @param {Date} d
 */
function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()) // Midnight local
}

/**
 * @param {{ doctorName: string, slots: SlotProp[], selectedSlot: SlotProp | null, onSlotSelect: (s: SlotProp) => void, onBack: () => void, onContinue: () => void, continueDisabled?: boolean }} props
 */
export default function SlotCalendar({
  doctorName, // Doctor display name for the heading
  slots, // All slots (available and optionally booked) for building dots and rows
  selectedSlot, // Currently chosen slot for Continue step
  onSlotSelect, // Parent updates selection when user picks a time
  onBack, // Bottom Back button handler
  onContinue, // Bottom Continue button handler
  continueDisabled = false, // Disables Continue until a slot is chosen
}) {
  const now = new Date() // "Now" for past/today comparisons
  const todayStart = startOfDay(now) // Today at 00:00 local

  const [viewYear, setViewYear] = useState(() => now.getFullYear()) // Year shown in header
  const [viewMonthIndex, setViewMonthIndex] = useState(() => now.getMonth()) // 0–11 month index

  const [selectedDateKey, setSelectedDateKey] = useState(null) // yyyy-MM-dd of focused day (or null)

  const slotsByDate = useMemo(() => {
    const map = {} // dateKey -> SlotProp[]
    for (const s of slots || []) {
      // Walk every slot once
      if (!s.date) continue // Skip malformed rows
      if (!map[s.date]) map[s.date] = [] // Initialize bucket
      map[s.date].push(s) // Append slot under its date
    }
    return map // Shared lookup for dots and time grid
  }, [slots]) // Recompute when slot list changes

  const monthCells = useMemo(
    () => buildMonthCells(viewYear, viewMonthIndex),
    [viewYear, viewMonthIndex]
  ) // Grid cells for visible month

  const monthLabel = useMemo(() => {
    const d = new Date(viewYear, viewMonthIndex, 1) // Any day in month works for label
    return d.toLocaleString('en-US', { month: 'long', year: 'numeric' }) // e.g. April 2026
  }, [viewYear, viewMonthIndex]) // Update when navigating months

  const firstOfView = new Date(viewYear, viewMonthIndex, 1) // First day of viewed month
  const firstOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1) // First day of this month
  const canGoPrev = firstOfView > firstOfCurrentMonth // Do not navigate before current month

  /**
   * @param {string} dateKey
   */
  function dayDotKind(dateKey) {
    const list = slotsByDate[dateKey] || [] // Slots on this day
    if (list.length === 0) return 'none' // No data: no dot
    const allBooked = list.every((x) => x.booked) // Every slot flagged booked
    const anyFree = list.some((x) => !x.booked) // At least one bookable slot
    if (anyFree) return 'green' // Availability present
    if (allBooked) return 'red' // Fully booked
    return 'none' // Defensive fallback
  }

  /**
   * @param {string} dateKey
   */
  function isPastDate(dateKey) {
    const [y, m, d] = dateKey.split('-').map(Number) // Parse ISO parts
    const t = new Date(y, m - 1, d) // Local date
    return t < todayStart // Strictly before today
  }

  /**
   * @param {string} dateKey
   */
  function isTodayDate(dateKey) {
    const [y, m, d] = dateKey.split('-').map(Number) // Parse ISO parts
    const t = new Date(y, m - 1, d) // Local date
    return t.getTime() === todayStart.getTime() // Same calendar day as today
  }

  function goPrevMonth() {
    if (!canGoPrev) return // Guard: stay at earliest allowed month
    const d = new Date(viewYear, viewMonthIndex - 1, 1) // Previous month
    setViewYear(d.getFullYear()) // Update year (handles January wrap)
    setViewMonthIndex(d.getMonth()) // Update month index
  }

  function goNextMonth() {
    const d = new Date(viewYear, viewMonthIndex + 1, 1) // Next month
    setViewYear(d.getFullYear()) // Update year (handles December wrap)
    setViewMonthIndex(d.getMonth()) // Update month index
  }

  /**
   * @param {string} dateKey
   */
  function onPickDate(dateKey) {
    if (isPastDate(dateKey)) return // Ignore clicks on greyed past days
    setSelectedDateKey(dateKey) // Focus this day for slot list
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] // Header labels left-to-right

  return (
    <div className={styles.wrap}>
      {/* Outer white card */}
      <h2 className={styles.title}>Pick a time with {displayNameWithOptionalTitle(doctorName)}</h2>
      {/* Heading: single "Dr." prefix only when name is not already titled */}
      <div className={styles.navRow}>
        {/* Row: prev | month label | next */}
        <button
          type="button"
          className={styles.navBtn}
          onClick={goPrevMonth}
          disabled={!canGoPrev}
          aria-label="Previous month"
        >
          {/* Arrow character */}
          ‹
        </button>
        <div className={styles.monthLabel}>{monthLabel}</div>
        {/* Centered month and year string */}
        <button type="button" className={styles.navBtn} onClick={goNextMonth} aria-label="Next month">
          ›
        </button>
        {/* Next-month control */}
      </div>
      <div className={styles.weekdays}>
        {/* Sun–Sat labels */}
        {weekDays.map((wd) => (
          <div key={wd} className={styles.weekday}>
            {wd}
          </div>
        ))}
      </div>
      <div className={styles.grid}>
        {/* Month body: map each cell */}
        {monthCells.map((cell, idx) => {
          if (cell.type === 'empty') {
            return <div key={`e-${idx}`} className={`${styles.cell} ${styles.empty}`} aria-hidden />
          }
          const { dateKey, day, dateObj } = cell
          const past = isPastDate(dateKey)
          const today = isTodayDate(dateKey)
          const selected = selectedDateKey === dateKey
          const dot = dayDotKind(dateKey)
          return (
            <button
              key={dateKey}
              type="button"
              className={[
                styles.cell,
                past ? styles.past : '',
                today && !selected ? styles.today : '',
                selected ? styles.selected : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onPickDate(dateKey)}
              disabled={past}
              aria-pressed={selected}
              aria-label={`${dateObj.toDateString()}${dot === 'green' ? ', has openings' : ''}${dot === 'red' ? ', fully booked' : ''}`}
            >
              <span>{day}</span>
              <div className={styles.dots}>
                {dot === 'green' ? <span className={`${styles.dot} ${styles.dotGreen}`} title="Openings" /> : null}
                {dot === 'red' ? <span className={`${styles.dot} ${styles.dotRed}`} title="Fully booked" /> : null}
              </div>
            </button>
          )
        })}
      </div>

      {selectedDateKey ? (
        <div className={styles.slotPanel}>
          {/* Times for the chosen yyyy-MM-dd */}
          <p className={styles.slotPanelTitle}>Available times for {selectedDateKey}</p>
          <div className={styles.slotGrid}>
            {STANDARD_TIME_SLOTS.map(({ key, label }) => {
              const dayList = slotsByDate[selectedDateKey] || []
              const match = dayList.find((s) => normalizeStartTime(s.startTime) === key)
              const isBooked = Boolean(match?.booked)
              const isSelected = Boolean(match && selectedSlot?.id === match.id)
              if (!match) {
                return (
                  <button key={key} type="button" className={`${styles.slotBtn} ${styles.missing}`} disabled>
                    {label}
                  </button>
                )
              }
              if (isBooked) {
                return (
                  <button key={key} type="button" className={`${styles.slotBtn} ${styles.booked}`} disabled>
                    {label}
                  </button>
                )
              }
              return (
                <button
                  key={key}
                  type="button"
                  className={`${styles.slotBtn} ${styles.available} ${isSelected ? styles.selected : ''}`}
                  onClick={() => onSlotSelect(match)}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <p className={styles.placeholder}>Select a date on the calendar to see time slots.</p>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.backBtn} onClick={onBack}>
          ← Back
        </button>
        <button type="button" className={styles.continueBtn} disabled={continueDisabled} onClick={onContinue}>
          Continue →
        </button>
      </div>
    </div>
  )
}
