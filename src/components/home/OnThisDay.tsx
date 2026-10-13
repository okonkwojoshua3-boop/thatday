'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { BoxBadge } from '@/components/box/PostcardCard'
import { Brand } from '@/components/results/art'
import { COUNTRY_KEY, isCountryCode } from '@/lib/countries'
import { usePostcards } from '@/lib/postcards'
import type { DayYear } from '@/app/api/on-this-day/route'

// Figma 13 — On this day: returning visitors land on today's date across
// history. Swipe the dial (or the pager) to move between years.

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Polaroids pinned round the dial (Figma 13, frame coordinates)
const POLAROIDS = [
  { key: 'song', x: 14, y: 232, rot: -10, halftone: '/icons/halftone/song.png', sticker: '/icons/stickers/cd.png' },
  { key: 'front', x: 288, y: 244, rot: 8, halftone: '/icons/halftone/headline.png', sticker: '/icons/stickers/newsphone.png' },
  { key: 'price', x: 22, y: 452, rot: 6, halftone: '/icons/halftone/price.png', sticker: '/icons/stickers/tag.png' },
  { key: 'born', x: 282, y: 466, rot: -7, halftone: '/icons/halftone/cake.png', sticker: '/icons/stickers/cake.png' },
] as const

// Gen Z extras floating round the dial (render bounds, shadows included)
const DECOR = [
  { src: '/results/genz/env-sparkle.png', x: 47, y: 246, w: 49.7, h: 49.7 },
  { src: '/results/genz/song-omg.png', x: 35, y: 366, w: 83.3, h: 76 },
  { src: '/results/genz/env-smiley.png', x: 291, y: 366, w: 70.7, h: 71.7 },
  { src: '/results/genz/env-heart.png', x: 187, y: 522, w: 52.8, h: 53.9 },
]

const SWIPE = 40

function Dial({ turn }: { turn: number }) {
  // 60 ticks; every fifth is long. The face turns like a clock as you swipe.
  return (
    <svg viewBox="0 0 280 280" aria-hidden="true" className="absolute inset-0 size-full text-ink">
      <circle cx="140" cy="140" r="139" className="fill-card" stroke="currentColor" strokeWidth="1.5" />
      <g className="dial-face" style={{ transform: `rotate(${turn}deg)` }}>
        {Array.from({ length: 60 }, (_, i) => {
          const major = i % 5 === 0
          const a = (i * 6 * Math.PI) / 180
          const r1 = 134
          const r2 = major ? 122 : 129
          return (
            <line
              key={i}
              x1={140 + r1 * Math.sin(a)}
              y1={140 - r1 * Math.cos(a)}
              x2={140 + r2 * Math.sin(a)}
              y2={140 - r2 * Math.cos(a)}
              stroke="currentColor"
              strokeWidth={major ? 1.5 : 1}
              strokeLinecap="round"
              opacity={major ? 1 : 0.35}
            />
          )
        })}
      </g>
    </svg>
  )
}

export default function OnThisDay({ onPick }: { onPick: () => void }) {
  const router = useRouter()
  const { saved } = usePostcards()
  const [today] = useState(() => new Date())
  const month = today.getMonth()
  const day = today.getDate()

  const [years, setYears] = useState<DayYear[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)

  const [country] = useState(() => {
    try {
      const saved = localStorage.getItem(COUNTRY_KEY)
      return isCountryCode(saved) ? saved : 'world'
    } catch {
      return 'world'
    }
  })

  useEffect(() => {
    let live = true
    fetch(`/api/on-this-day?month=${month + 1}&day=${day}&country=${country}`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((d: { years: DayYear[] }) => {
        if (!live) return
        if (d.years.length) setYears(d.years)
        else setFailed(true)
      })
      .catch(() => live && setFailed(true))
    return () => {
      live = false
    }
  }, [month, day, country])

  const count = years?.length ?? 0
  const current = years?.[index]
  const genZ = (current?.year ?? 0) >= 2000

  function go(next: number) {
    if (!count || next === index || next < 0 || next >= count) return
    setDir(next > index ? 1 : -1)
    setIndex(next)
  }

  function open() {
    if (!current) return
    const date = `${current.year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    router.push(country === 'world' ? `/rewind/${date}` : `/rewind/${date}?country=${country}`)
  }

  // Swipe the dial
  const drag = useRef<number | null>(null)
  function onPointerDown(e: React.PointerEvent) {
    drag.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function onPointerUp(e: React.PointerEvent) {
    if (drag.current === null) return
    const dx = e.clientX - drag.current
    drag.current = null
    if (dx < -SWIPE) go(index + 1)
    else if (dx > SWIPE) go(index - 1)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select')) return
      if (e.key === 'ArrowRight') go(index + 1)
      else if (e.key === 'ArrowLeft') go(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const ago = current ? today.getFullYear() - current.year : null

  return (
    <main className="tm-enter flex min-h-svh flex-col overflow-x-hidden bg-canvas text-ink">
      <div className="relative mx-auto flex min-h-svh w-full max-w-[430px] flex-col px-6 pt-[58px] pb-8">
        <div className="flex h-9 items-center justify-between">
          <Brand />
          {saved.length > 0 && <BoxBadge count={saved.length} />}
        </div>

        <p className="mt-[30px] text-center font-mono text-[12px] leading-4 font-medium tracking-[0.08em] text-ink-muted uppercase">On this day</p>
        <h1 className="text-center font-serif text-[56px] leading-[56px] tracking-[-0.01em]">
          {day} {MONTH_NAMES[month]}
        </h1>
        <button type="button" onClick={onPick} aria-label="Pick another date" className="mx-auto mt-2 p-1 text-ink-muted hover:text-ink">
          <svg viewBox="0 0 12 8" fill="none" className="h-2 w-3" aria-hidden="true">
            <path d="M1 2l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dial + polaroids: a 390×340 stage from the Figma frame (y 232 → 572) */}
        <div className="-mx-6 mt-[30px] flex justify-center">
          <div className="relative h-[340px] w-[390px] shrink-0">
            <div
              role="group"
              aria-label="Swipe for other years"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (drag.current = null)}
              className="absolute top-6 left-1/2 size-[280px] -translate-x-1/2 cursor-grab touch-pan-y rounded-full shadow-[0_16px_32px_rgba(0,0,0,0.08)] select-none active:cursor-grabbing"
            >
              <Dial turn={index * 30} />
              <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-full">
                {current ? (
                  <div key={current.year} className={dir > 0 ? 'year-in-right' : 'year-in-left'}>
                    <p className="text-center font-serif text-[64px] leading-[64px] italic tabular-nums">{current.year}</p>
                    <p className="mt-0.5 text-center font-mono text-[10px] leading-[13px] font-medium tracking-[0.08em] text-ink-muted">
                      {ago} {ago === 1 ? 'YEAR' : 'YEARS'} AGO
                    </p>
                  </div>
                ) : (
                  <p className="font-serif text-[64px] leading-[64px] text-ink-muted italic">{failed ? '—' : '····'}</p>
                )}
              </div>
            </div>

            {current &&
              POLAROIDS.map((p, n) => (
                <div
                  key={`${current.year}-${p.key}`}
                  className="polaroid-land absolute flex h-[104px] w-[88px] flex-col items-center rounded-[2px] border border-line bg-card p-1.5 shadow-[0_6px_12px_rgba(0,0,0,0.12)]"
                  style={{ left: p.x, top: p.y - 232, rotate: `${p.rot}deg`, animationDelay: `${n * 40}ms` }}
                >
                  <span className="relative flex h-[72px] w-[76px] items-center justify-center bg-canvas">
                    {genZ ? (
                      <Image src={p.sticker} alt="" width={60} height={60} className="size-[52px] object-contain" />
                    ) : (
                      <span
                        aria-hidden="true"
                        className={`bg-ink ${p.key === 'born' ? 'size-[60px]' : 'size-[52px]'}`}
                        style={{ mask: `url(${p.halftone}) center / contain no-repeat`, WebkitMask: `url(${p.halftone}) center / contain no-repeat` }}
                      />
                    )}
                  </span>
                  <span className="mt-1 w-full truncate text-center font-serif text-[12px] leading-4 text-ink-secondary italic">
                    {p.key === 'song' ? 'No.1 song' : p.key === 'front' ? 'Front page' : p.key === 'price' ? (current.price ?? 'The prices') : 'Born today'}
                  </span>
                </div>
              ))}

            {genZ &&
              DECOR.map((s, n) => (
                <Image
                  key={s.src}
                  src={s.src}
                  alt=""
                  width={Math.ceil(s.w)}
                  height={Math.ceil(s.h)}
                  className="sticker-drift pointer-events-none absolute max-w-none"
                  style={{ left: s.x, top: s.y - 232, width: s.w, height: s.h, animationDelay: `${200 + n * 60}ms` }}
                />
              ))}
          </div>
        </div>

        <div className="mt-4 flex min-h-[86px] flex-col items-center text-center" aria-live="polite">
          {current && (
            <div key={current.year} className="story-in flex flex-col items-center">
              <p className={`line-clamp-3 font-serif ${current.headline.length > 60 ? 'text-[22px] leading-[26px]' : 'text-[28px] leading-[29px]'}`}>
                {current.headline}
              </p>
              {current.song && (
                <p className="mt-2.5 text-[14px] leading-[18px] text-ink-secondary">Also: “{current.song}” is No.1 on the radio.</p>
              )}
            </div>
          )}
          {failed && <p className="text-[14px] leading-[18px] text-ink-secondary">Couldn’t reach the archive just now.</p>}
        </div>

        {count > 1 && (
          <div className="mt-[18px] flex justify-center gap-1.5" role="tablist" aria-label="Years">
            {years!.map((y, n) => (
              <button
                key={y.year}
                type="button"
                role="tab"
                aria-selected={n === index}
                aria-label={String(y.year)}
                onClick={() => go(n)}
                className={`h-1.5 rounded-[3px] transition-colors duration-300 ${n === index ? 'w-5 bg-ink' : 'w-1.5 bg-ink-muted/50'}`}
              />
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-col items-center gap-4 pt-5">
          <button
            type="button"
            onClick={open}
            disabled={!current}
            className="h-14 w-full rounded-full bg-ink text-[16px] font-medium text-canvas transition-transform duration-150 ease-out active:scale-[0.97] disabled:opacity-50"
          >
            {current ? `Open ${day} ${MONTHS[month]} ${current.year}` : 'Open this day'}
          </button>
          <button type="button" onClick={onPick} className="text-[14px] leading-[18px] font-medium text-ink-secondary hover:text-ink">
            Pick your own date
          </button>
        </div>
      </div>
    </main>
  )
}
