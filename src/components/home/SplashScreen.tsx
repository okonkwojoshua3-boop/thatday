'use client'

import { useEffect, useState } from 'react'

export const SPLASH_KEY = 'td-splash-seen'

// Matches the Figma timeline (01 — Splash): circle 0.35s, ticks 0.70s,
// hands 1.05s, wordmark 1.45s. Hold briefly, then fade out.
const EXIT_AT = 1800
const EXIT_AT_REDUCED = 1200
const EXIT_DURATION = 400

export default function SplashScreen() {
  const [show, setShow] = useState(true)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    let seen = false
    try {
      seen = localStorage.getItem(SPLASH_KEY) === '1'
    } catch {}
    // Returning visitors: the inline script in layout.tsx already hides it via CSS
    if (seen) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => setLeaving(true), reduce ? EXIT_AT_REDUCED : EXIT_AT)
    return () => window.clearTimeout(timer)
  }, [])

  // Any key skips straight to the exit
  useEffect(() => {
    if (leaving) return
    const skip = () => setLeaving(true)
    window.addEventListener('keydown', skip, { once: true })
    return () => window.removeEventListener('keydown', skip)
  }, [leaving])

  // Mark as seen once it starts leaving, so a reload mid-splash replays it.
  // data-splash="leaving" lets the page underneath start its entrance.
  useEffect(() => {
    if (!leaving) return
    document.documentElement.dataset.splash = 'leaving'
    try {
      localStorage.setItem(SPLASH_KEY, '1')
    } catch {}
    const timer = window.setTimeout(() => {
      document.documentElement.dataset.splash = 'seen'
      setShow(false)
    }, EXIT_DURATION)
    return () => window.clearTimeout(timer)
  }, [leaving])

  if (!show) return null

  return (
    <div
      aria-hidden="true"
      data-leaving={leaving || undefined}
      onClick={() => setLeaving(true)}
      className="splash fixed inset-0 z-50 flex items-center justify-center bg-canvas text-ink cursor-pointer select-none"
    >
      <div className="splash-content flex flex-col items-center gap-6">
        <svg className="w-[88px] h-[88px]" viewBox="0 0 88 88" fill="none">
          <circle
            className="splash-ring"
            cx="44"
            cy="44"
            r="40.12"
            pathLength={1}
            stroke="currentColor"
            strokeWidth="3.88"
            strokeLinecap="round"
            transform="rotate(-90 44 44)"
          />
          <g stroke="currentColor" strokeWidth="3.88" strokeLinecap="round">
            <line className="splash-tick" style={{ animationDelay: '650ms' }} x1="44" y1="10.35" x2="44" y2="19.41" />
            <line className="splash-tick" style={{ animationDelay: '690ms' }} x1="77.65" y1="44" x2="68.59" y2="44" />
            <line className="splash-tick" style={{ animationDelay: '730ms' }} x1="44" y1="77.65" x2="44" y2="68.59" />
            <line className="splash-tick" style={{ animationDelay: '770ms' }} x1="10.35" y1="44" x2="19.41" y2="44" />
          </g>
          <line className="splash-hand-hour" x1="44" y1="44" x2="28.99" y2="28.99" stroke="currentColor" strokeWidth="4.53" strokeLinecap="round" />
          <line className="splash-hand-minute" x1="44" y1="44" x2="58.2" y2="27.2" stroke="currentColor" strokeWidth="3.24" strokeLinecap="round" />
          <circle className="splash-hub" cx="44" cy="44" r="4.53" fill="currentColor" />
        </svg>

        <span className="splash-wordmark text-[30px] font-bold tracking-[-0.02em] leading-none">
          That<span className="text-ink-muted">Day</span>
        </span>
      </div>
    </div>
  )
}
