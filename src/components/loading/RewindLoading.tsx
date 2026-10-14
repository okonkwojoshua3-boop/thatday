'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Flap } from '@/components/home/FlipBoard'
import { haptic, play } from '@/lib/feedback'

// Figma 06 — Loading · Rewinding. Shown while the results page renders on the
// server. We can't see the server's real progress, so the board and checklist
// run on a timer; if the page is ready first, it simply replaces this screen.

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const RACE_MS = 1200
const STEP_MS = [600, 1100, 1600, 2100]

type Sticker = { src: string; w: number; h: number; x: number; y: number }

// Sticker PNGs include their drop shadows; offsets are each image's render bounds
// relative to the 30px icon slot (Figma 06, landed 2005).
const STEPS: { label: (year: number) => string; halftone: string; sticker: Sticker }[] = [
  {
    label: y => `Tuning the radio to ${y}`,
    halftone: '/icons/halftone/song.png',
    sticker: { src: '/icons/stickers/cd.png', w: 36.8, h: 36.8, x: -3.4, y: -1.2 },
  },
  {
    label: () => 'Reading the front pages',
    halftone: '/icons/halftone/headline.png',
    sticker: { src: '/icons/stickers/newsphone.png', w: 30.1, h: 37.7, x: 0, y: -2.1 },
  },
  {
    label: () => 'Checking what things cost',
    halftone: '/icons/halftone/price.png',
    sticker: { src: '/icons/stickers/tag.png', w: 36.2, h: 30.7, x: -3.4, y: 0 },
  },
  {
    label: () => 'Finding your birthday twins',
    halftone: '/icons/halftone/cake.png',
    sticker: { src: '/icons/stickers/cake.png', w: 30, h: 30.9, x: 0, y: -0.6 },
  },
]

// Gen Z decorations drifting around the 390px column
const DECOR: (Sticker & { delay: number })[] = [
  { src: '/icons/stickers/cd-large.png', w: 45.9, h: 63.7, x: 0, y: 181.8, delay: 0 },
  { src: '/icons/stickers/sparkle-blue.png', w: 42.5, h: 42.5, x: 290.8, y: 165.6, delay: 120 },
  { src: '/icons/stickers/heart.png', w: 47.4, h: 47.9, x: 19.7, y: 700, delay: 240 },
  { src: '/icons/stickers/smiley.png', w: 62.6, h: 62.5, x: 309.9, y: 683.2, delay: 360 },
]

function parse(date: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]) - 1, Number(m[3])]
  if (mo < 0 || mo > 11 || d < 1 || d > 31) return null
  return { y, m: mo, d }
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export default function RewindLoading({ date }: { date: string }) {
  const target = parse(date)
  const [now] = useState(() => new Date().getFullYear())
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // No per-frame racing: the board and steps move in a few calm jumps
      const id = window.setInterval(() => setElapsed(e => e + 500), 500)
      return () => window.clearInterval(id)
    }
    const start = performance.now()
    let raf = 0
    const tick = () => {
      const t = performance.now() - start
      setElapsed(t)
      if (t < STEP_MS[STEP_MS.length - 1] + 100) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!target) return <main className="min-h-svh bg-canvas" />

  return <Rewinding target={target} now={now} elapsed={elapsed} />
}

function Rewinding({ target, now, elapsed }: { target: { y: number; m: number; d: number }; now: number; elapsed: number }) {
  const genZ = target.y >= 2000
  const race = Math.min(1, elapsed / RACE_MS)
  const shownYear = Math.round(now - (now - target.y) * easeOut(race))
  const done = STEP_MS.filter(ms => elapsed >= ms).length
  const landed = done === STEPS.length
  // Progress creeps within the current step so the bar never stalls
  const prevMs = STEP_MS[done - 1] ?? 0
  const nextMs = STEP_MS[done] ?? prevMs
  const partial = landed ? 0 : Math.min(1, (elapsed - prevMs) / Math.max(1, nextMs - prevMs))
  const progress = landed ? 1 : (done + partial * 0.9) / STEPS.length
  const yearsAgo = now - target.y

  // Flaps clack as the year races back, each step ticks off, then it lands
  useEffect(() => {
    if (shownYear !== now) play('flap')
  }, [shownYear, now])
  useEffect(() => {
    if (done > 0 && done < STEPS.length) play('tick')
    if (done === STEPS.length) {
      play('chime')
      haptic('success')
    }
  }, [done])

  const chars = `${String(target.d).padStart(2, '0')}${MONTHS[target.m]}${shownYear}`

  return (
    <main className="loading-enter relative flex min-h-svh flex-col items-center overflow-hidden bg-canvas px-6 pt-16 pb-16 text-ink md:pt-12">
      {genZ && (
        <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 h-[844px] w-[390px] -translate-x-1/2">
          {DECOR.map(s => (
            <Image
              key={s.src}
              src={s.src}
              alt=""
              width={Math.round(s.w)}
              height={Math.round(s.h)}
              priority
              className="sticker-drift absolute max-w-none"
              style={{ left: s.x, top: s.y, width: s.w, height: s.h, animationDelay: `${s.delay}ms` }}
            />
          ))}
        </div>
      )}

      <Brand />

      {/* Board: day and month are already set, the year races back */}
      <div aria-hidden="true" className="mt-[110px] flex gap-3.5 md:mt-[120px] md:gap-[21px]">
        {[chars.slice(0, 2), chars.slice(2, 5), chars.slice(5)].map((group, g) => (
          <span key={g} className="flex gap-1 md:gap-1.5">
            {[...group].map((ch, i) => (
              <Flap key={i} ch={ch} size="loading" />
            ))}
          </span>
        ))}
      </div>

      <h1 role="status" className="mt-10 text-center font-serif text-[40px] leading-[41px] tracking-[-0.01em] md:mt-[38px] md:text-[64px] md:leading-[65px]">
        Rewinding to <br className="md:hidden" />
        <em className="italic">
          {target.d} {MONTH_NAMES[target.m]} {target.y}
        </em>
        …
      </h1>

      <p className="mt-8 font-mono text-[12px] leading-4 font-medium tracking-[0.06em] text-ink-muted uppercase md:mt-[39px]">
        {yearsAgo === 0 ? 'This year' : `${yearsAgo} ${yearsAgo === 1 ? 'year' : 'years'} ago`} ·{' '}
        {landed ? 'Ready' : `${Math.round(progress * 100)}%`}
      </p>
      <div className="mt-3 h-[3px] w-[200px] overflow-hidden rounded-[2px] bg-line md:w-[320px]">
        <div
          className="h-full origin-left rounded-[2px] bg-ink transition-transform duration-300 ease-(--ease-out)"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <ul className="mt-[67px] flex w-full max-w-[310px] flex-col gap-4 md:mt-[65px]">
        {STEPS.map((step, i) => {
          const state = i < done ? 'done' : i === done ? 'doing' : 'pending'
          return (
            <li
              key={i}
              className={`flex min-h-[26px] items-center gap-3 transition-opacity duration-300 ${state === 'done' && !genZ ? 'opacity-55' : ''}`}
            >
              {genZ ? (
                <span className={`relative size-[30px] shrink-0 transition-opacity duration-300 ${state === 'pending' ? 'opacity-35' : ''}`}>
                  <Image
                    src={step.sticker.src}
                    alt=""
                    width={Math.round(step.sticker.w)}
                    height={Math.round(step.sticker.h)}
                    priority
                    className="absolute max-w-none"
                    style={{ left: step.sticker.x, top: step.sticker.y, width: step.sticker.w, height: step.sticker.h }}
                  />
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className={`size-[26px] shrink-0 bg-ink transition-opacity duration-300 ${state === 'pending' ? 'opacity-35' : ''}`}
                  style={{ mask: `url(${step.halftone}) center / contain no-repeat`, WebkitMask: `url(${step.halftone}) center / contain no-repeat` }}
                />
              )}
              <span
                className={`flex-1 text-[16px] leading-[21px] ${state === 'doing' ? 'font-medium text-ink' : state === 'pending' ? 'text-ink-muted' : genZ ? 'text-ink-secondary' : 'text-ink'}`}
              >
                {step.label(target.y)}
              </span>
              <StepState state={state} genZ={genZ} />
            </li>
          )
        })}
      </ul>

      <p className="mt-auto pt-12 text-center">
        {landed ? (
          <span key="landed" className="loading-swap font-serif text-[20px] leading-[26px] text-ink-secondary italic">
            Here it comes…
          </span>
        ) : (
          <span className="text-[12px] leading-4 text-ink-muted">Taking a while? We’ll show what’s ready.</span>
        )}
      </p>
    </main>
  )
}

function StepState({ state, genZ }: { state: 'done' | 'doing' | 'pending'; genZ: boolean }) {
  if (state === 'done') {
    return (
      <span
        aria-label="done"
        className={`check-pop flex size-5 shrink-0 items-center justify-center rounded-full ${genZ ? 'bg-era-green text-white' : 'bg-ink text-canvas'}`}
      >
        <svg viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden="true">
          <path d="M6 10.4 8.7 13 14 7.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    )
  }
  if (state === 'doing') {
    return (
      <svg viewBox="0 0 20 20" className="step-spin size-5 shrink-0" aria-label="in progress">
        <circle cx="10" cy="10" r="9" fill="none" strokeWidth="2" className="stroke-line" />
        <path d="M10 1a9 9 0 0 1 9 9" fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-ink" />
      </svg>
    )
  }
  return <span aria-label="waiting" className="size-5 shrink-0 rounded-full border-2 border-line" />
}

function Brand() {
  return (
    <p className="flex items-center gap-2 text-[16px] leading-[21px] font-bold tracking-[-0.02em]">
      <svg viewBox="0 0 88 88" fill="none" className="size-[22px]" aria-hidden="true">
        <circle cx="44" cy="44" r="40.12" stroke="currentColor" strokeWidth="3.88" />
        <g stroke="currentColor" strokeWidth="3.88" strokeLinecap="round">
          <line x1="44" y1="10.35" x2="44" y2="19.41" />
          <line x1="77.65" y1="44" x2="68.59" y2="44" />
          <line x1="44" y1="77.65" x2="44" y2="68.59" />
          <line x1="10.35" y1="44" x2="19.41" y2="44" />
        </g>
        <line x1="44" y1="44" x2="28.99" y2="28.99" stroke="currentColor" strokeWidth="4.53" strokeLinecap="round" />
        <line x1="44" y1="44" x2="58.2" y2="27.2" stroke="currentColor" strokeWidth="3.24" strokeLinecap="round" />
        <circle cx="44" cy="44" r="4.53" fill="currentColor" />
      </svg>
      <span>
        That<span className="text-ink-muted">Day</span>
      </span>
    </p>
  )
}
