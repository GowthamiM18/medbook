'use client'
// src/components/AIChat.tsx
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { consumeNdjsonChatStream } from '@/lib/chat-stream-client'
import styles from './AIChat.module.css'

type Message = { role: 'user' | 'assistant'; content: string }

export default function AIChat({
  onClose,
  onAppointmentBooked,
}: {
  onClose: () => void
  /** Called after the AI successfully created an appointment (refresh dashboard list). */
  onAppointmentBooked?: () => void
}) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your health assistant. How are you feeling today?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')

    const conversationHistory = messages
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ message: userMsg, conversationHistory }),
      })

      if (!res.ok) {
        let detail = 'Sorry, something went wrong. Please try again.'
        try {
          const j = (await res.json()) as { error?: string; message?: string }
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

      if (appointmentCreated) {
        onAppointmentBooked?.()
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
          if (last?.role === 'assistant' && last.content.trim() === '') {
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
            content: 'Sorry, something went wrong. Please try again.',
          }
        }
        return next
      })
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function goBook() {
    onClose()
    router.push('/book')
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.chatWindow}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.aiAvatar}>AI</div>
            <div>
              <p className={styles.aiName}>Udumula Hospital AI</p>
              <p className={styles.aiStatus}>
                <span className={styles.onlineDot} /> Online
              </p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.bookBtn} onClick={goBook}>
              Book appointment
            </button>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`${styles.message} ${m.role === 'user' ? styles.userMsg : styles.botMsg}`}
            >
              {m.role === 'assistant' && (
                <div className={styles.botAvatarSmall}>AI</div>
              )}
              <div className={styles.bubble}>
                {m.role === 'assistant' && !m.content && loading ? (
                  <div className={styles.typingBubble}>
                    <span />
                    <span />
                    <span />
                  </div>
                ) : (
                  m.content.split('\n').map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < m.content.split('\n').length - 1 && <br />}
                    </span>
                  ))
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick suggestions */}
        {messages.length === 1 && (
          <div className={styles.suggestions}>
            {[
              'I have chest pain',
              'My back hurts',
              'I need a checkup',
              'Headaches & dizziness',
            ].map((s) => (
              <button key={s} className={styles.suggestion} onClick={() => { setInput(s); }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className={styles.inputArea}>
          <textarea
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Describe your symptoms..."
            rows={1}
          />
          <button
            className={styles.sendBtn}
            onClick={send}
            disabled={loading || !input.trim()}
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
