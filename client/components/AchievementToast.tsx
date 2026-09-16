import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export interface AchievementToastData {
  name: string
  description: string
  icon?: string
  href?: string
}

let toastQueue: AchievementToastData[] = []
let toastSubscribers = new Set<(toasts: AchievementToastData[]) => void>()

// --- Sound ---
// A shared AudioContext, resumed on the first user interaction so browser
// autoplay restrictions don't silently swallow the sound.
let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return null

  if (!audioContext) {
    audioContext = new AudioContextClass()
    const resume = () => {
      audioContext?.resume().catch(() => {})
    }
    window.addEventListener('pointerdown', resume, { once: true })
    window.addEventListener('keydown', resume, { once: true })
  }

  return audioContext
}

function playAchievementSound() {
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime

    // Quick ascending two-note chime (C6 -> G6)
    ;[1046.5, 1568.0].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.value = freq

      const start = now + i * 0.1
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.25, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(start)
      osc.stop(start + 0.4)
    })
  } catch {
    // Web Audio blocked or unavailable — fail silently, toast still shows
  }
}

export function showAchievementToast(toast: AchievementToastData) {
  toastQueue = [...toastQueue, toast]
  toastSubscribers.forEach((subscriber) => subscriber(toastQueue))
  playAchievementSound()
}

export function AchievementToastContainer() {
  const [toasts, setToasts] = useState<AchievementToastData[]>([])
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setToasts(toastQueue)
    const subscriber = (nextToasts: AchievementToastData[]) => setToasts(nextToasts)
    toastSubscribers.add(subscriber)
    return () => {
      toastSubscribers.delete(subscriber)
    }
  }, [])

  useEffect(() => {
    if (toasts.length === 0 || isHovered) return

    const timeout = window.setTimeout(() => {
      toastQueue = toastQueue.slice(1)
      setToasts((current) => current.slice(1))
    }, 5000)

    return () => window.clearTimeout(timeout)
  }, [toasts, isHovered])

  if (toasts.length === 0) return null

  const content = (
    <div
      className="fixed right-5 top-5 z-[9999] flex w-[min(92vw,360px)] flex-col gap-3 pointer-events-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {toasts.slice(0, 3).map((toast, index) => (
        <button
          key={`${toast.name}-${index}`}
          type="button"
          onClick={() => {
            window.location.assign(toast.href ?? '/profile')
          }}
          className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-[var(--color-green)] bg-[var(--color-surface)] p-4 text-left shadow-xl ring-1 ring-black/5 transition-transform hover:scale-[1.01] animate-[fadeIn_0.25s_ease-out]"
        >
          <img
            src={toast.icon ?? '/Images/achievements/default.png'}
            alt={toast.name}
            className="h-12 w-12 rounded-full object-cover"
          />

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-green)]">
              Achievement unlocked
            </p>
            <h3 className="mt-2 text-lg font-[family-name:var(--font-display)] font-[var(--font-weight-heading-bold)] text-[var(--color-text)]">
              {toast.name}
            </h3>
            <p className="mt-1 text-sm text-[var(--color-text-soft)]">{toast.description}</p>
          </div>
        </button>
      ))}
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content
}