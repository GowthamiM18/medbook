'use client' // This directive tells Next.js this file uses browser-only features (hooks, clicks)
// AI Health Assistant: left marketing copy + interactive chat on the right
import { useState, useRef, useEffect } from 'react' // React state, DOM ref, and side effects
import { useRouter } from 'next/navigation' // Next.js hook to change pages from the client
import { useSession } from 'next-auth/react'
import { consumeNdjsonChatStream } from '@/lib/chat-stream-client'
import styles from './AIAssistant.module.css' // CSS classes scoped to this component

// First message the AI shows as soon as the user opens the chat (no API call yet)
const OPENING_MESSAGE =
  "Hi! I'm your health assistant. How are you feeling today?"

// If the assistant’s last reply mentions one of these specialties, we show the “See doctors” button
const DOCTOR_TYPE_REGEX =
  /Cardiologist|General Physician|Dermatologist|Pediatrician|Neurologist|Orthopedist/i

/**
 * One chat turn: either the user or the assistant spoke.
 * role = who sent it, content = text they sent.
 */
// (JSDoc above explains the object shape for beginners reading the code.)

export default function AIAssistant() {
  const router = useRouter() // Router instance used to go to /doctors later
  const { data: session } = useSession()

  const [chatOpen, setChatOpen] = useState(false) // false = only left panel + placeholder; true = real chat widget
  const [messages, setMessages] = useState([
    // Initial thread: start with the assistant greeting (matches your design)
    { role: 'assistant', content: OPENING_MESSAGE },
  ])
  const [input, setInput] = useState('') // Controlled text in the message box at the bottom
  const [loading, setLoading] = useState(false) // true while we wait for Claude’s reply
  const bottomRef = useRef(null) // Invisible anchor we scroll to so new messages stay visible

  useEffect(() => {
    // Run whenever `messages` or `loading` changes
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) // Smooth scroll to the latest content
  }, [messages, loading]) // Dependency array: effect re-runs when these change

  /**
   * Opens the right-hand chat widget (and keeps the opening message already in state).
   */
  function handleTryFree() {
    setChatOpen(true) // Flip the UI from placeholder to the full chat card
  }

  /**
   * Sends the current input to POST /api/chat and appends the assistant reply.
   */
  async function send() {
    const trimmed = input.trim() // Remove accidental spaces from the user’s text
    if (!trimmed || loading) return // Do nothing if empty or a request is already in flight

    const userMessage = trimmed // Save the string we will send
    setInput('') // Clear the text box immediately for better UX

    const priorThread = messages // Snapshot of the conversation *before* this new user line
    const conversationHistory = priorThread // API expects prior turns under this name
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]) // Optimistically show user bubble
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]) // Stream fills this bubble
    setLoading(true) // Typing state until first tokens (shown inside empty assistant bubble)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
        }),
      })

      if (!res.ok) {
        let detail = 'Sorry, something went wrong. Please try again.'
        try {
          const j = await res.json()
          detail = j.message || j.error || detail
        } catch {
          /* ignore */
        }
        setMessages((prev) => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last?.role === 'assistant') next[next.length - 1] = { role: 'assistant', content: detail }
          return next
        })
        return
      }

      const { error: streamErr, appointmentCreated } = await consumeNdjsonChatStream(res, (t) => {
        setMessages((prev) => {
          const next = [...prev]
          const i = next.length - 1
          if (i >= 0 && next[i].role === 'assistant') {
            next[i] = { ...next[i], content: next[i].content + t }
          }
          return next
        })
      })

      if (appointmentCreated && session) {
        router.refresh()
      }

      if (streamErr) {
        setMessages((prev) => {
          const next = [...prev]
          const i = next.length - 1
          if (i >= 0 && next[i].role === 'assistant') {
            const cur = next[i].content
            next[i] = {
              role: 'assistant',
              content: cur ? `${cur}\n\n— ${streamErr}` : streamErr,
            }
          }
          return next
        })
      } else {
        setMessages((prev) => {
          const last = prev[prev.length - 1]
          if (last?.role === 'assistant' && String(last.content).trim() === '') {
            return [
              ...prev.slice(0, -1),
              {
                role: 'assistant',
                content: 'I could not generate a reply. Please try again.',
              },
            ]
          }
          return prev
        })
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev]
        const i = next.length - 1
        if (i >= 0 && next[i].role === 'assistant') {
          next[i] = {
            role: 'assistant',
            content: 'Sorry, something went wrong. Please try again in a moment.',
          }
        }
        return next
      })
    }

    setLoading(false)
  }

  /**
   * Enter key submits; Shift+Enter still allows a newline in a bigger textarea (we use input here).
   * @param {import('react').KeyboardEvent<HTMLTextAreaElement>} e
   */
  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      // User pressed Enter without holding Shift
      e.preventDefault() // Stop the browser from inserting a newline in the field
      send() // Trigger the same action as the Send button
    }
  }

  /**
   * Navigate to the public doctor list when the CTA is clicked.
   */
  function goDoctors() {
    router.push('/doctors') // Client-side navigation to the doctor selection page
  }

  // Find the most recent assistant message to decide if we show the doctor CTA
  let lastAssistantText = '' // Default empty string
  for (let i = messages.length - 1; i >= 0; i--) {
    // Walk backward through the thread
    if (messages[i].role === 'assistant') {
      // Stop at the latest assistant reply
      lastAssistantText = messages[i].content // Save its text
      break // Exit the loop early
    }
  }
  const showDoctorsCta =
    !loading && // Don’t flash the button while a reply is loading
    lastAssistantText.length > 0 && // Need some assistant text
    DOCTOR_TYPE_REGEX.test(lastAssistantText) // True when a specialty name appears

  return (
    <section className={styles.section}>
      {/* Full-width band with light grey-green background */}
      <div className={styles.inner}>
        {/* Centered max-width grid: left copy, right chat */}
        <div className={styles.left}>
          {/* Marketing column */}
          <h2 className={styles.title}>Meet your AI health assistant</h2>
          {/* Main heading from the design */}
          <p className={styles.desc}>
            {/* Short explanation for visitors */}
            Just tell our AI how you&apos;re feeling. It&apos;ll understand your symptoms, recommend the right type of
            doctor, and let you know we have availability this week — all in one conversation.
          </p>
          <ul className={styles.checklist}>
            {/* Feature bullets with check marks (match product design) */}
            <li>
              <span className={styles.checkIcon}>✓</span>
              Symptom analysis &amp; specialist matching
            </li>
            <li>
              <span className={styles.checkIcon}>✓</span>
              Real-time availability checking
            </li>
            <li>
              <span className={styles.checkIcon}>✓</span>
              Instant booking confirmation
            </li>
            <li>
              <span className={styles.checkIcon}>✓</span>
              Appointment reminders
            </li>
          </ul>
          <button type="button" className={styles.tryBtn} onClick={handleTryFree}>
            {/* Primary teal CTA */}
            Try it free →
          </button>
        </div>

        <div className={styles.right}>
          {/* Chat column */}
          {!chatOpen ? (
            <div className={styles.placeholder}>
              {/* Shown until the user opts in */}
              Click <strong>Try it free</strong> to open the chat.
            </div>
          ) : (
            <div className={styles.widget}>
              {/* White card chat UI */}
              <div className={styles.widgetHeader}>
                {/* Top bar inside the card */}
                <span className={styles.headerDot} aria-hidden />
                {/* Green “online” dot from the design */}
                <span className={styles.headerTitle}>Udumula Hospital AI</span>
                {/* Product name */}
              </div>

              <div className={styles.messages} role="log" aria-live="polite">
                {/* Scrollable message list; polite live region for screen readers */}
                {messages.map((msg, index) => {
                  // Render every stored turn in order
                  const isUser = msg.role === 'user' // Boolean helper for styling
                  return (
                    <div
                      key={index}
                      className={`${styles.row} ${isUser ? styles.rowUser : styles.rowAi}`}
                    >
                      {/* Row aligns left (AI) or right (user) */}
                      <div className={isUser ? styles.bubbleUser : styles.bubbleAi}>
                        {!isUser && !msg.content && loading ? (
                          <div className={styles.typingBubble} aria-label="Assistant is typing">
                            <span />
                            <span />
                            <span />
                          </div>
                        ) : (
                          msg.content.split('\n').map((line, lineIndex, arr) => (
                            <span key={lineIndex}>
                              {line}
                              {lineIndex < arr.length - 1 ? <br /> : null}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  )
                })}

                <div ref={bottomRef} className={styles.anchor} />
                {/* Scroll target at the end of the list */}
              </div>

              {showDoctorsCta ? (
                <div className={styles.doctorsCta}>
                  {/* Only after the model mentions a specialty */}
                  <button type="button" className={styles.doctorsBtn} onClick={goDoctors}>
                    Show available doctors →
                  </button>
                </div>
              ) : null}

              <div className={styles.inputRow}>
                {/* Composer */}
                <textarea
                  className={styles.input}
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Type your message…"
                  disabled={loading}
                  aria-label="Message to the health assistant"
                />
                {/* Growing text field (2 rows default) */}
                <button
                  type="button"
                  className={styles.sendBtn}
                  onClick={send}
                  disabled={loading || !input.trim()}
                >
                  Send
                </button>
                {/* Submits the textarea */}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
