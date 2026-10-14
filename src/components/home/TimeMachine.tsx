'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { COUNTRY_KEY, detectCountry, getCountry, isCountryCode, type CountryCode } from '@/lib/countries'
import CountrySheet, { Flag } from './CountrySheet'
import { BoxBadge } from '@/components/box/PostcardCard'
import { usePostcards } from '@/lib/postcards'
import { feel, haptic, play } from '@/lib/feedback'
import SoundToggle from '@/components/ui/SoundToggle'
import FlipBoard, { type BoardGroup, type DateUnit } from './FlipBoard'
import RingDial from './RingDial'
import PhotoCredits from '@/components/ui/PhotoCredits'

// Figma 03 — Date picker · Time Machine

const MIN_YEAR = 1950
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

type Precision = 'full' | 'month' | 'year'
type YMD = { y: number; m: number; d: number } // m is 0-based

const PRECISIONS: { id: Precision; label: string }[] = [
  { id: 'full', label: 'Full date' },
  { id: 'month', label: 'Month & year' },
  { id: 'year', label: 'Year' },
]

// "Surprise me" lands on one of these. Placeholder set until the teaser can
// pull a headline for any day.
const SURPRISES = [
  { date: { y: 1969, m: 6, d: 20 }, text: 'Apollo 11 lands on the Moon.', src: '/welcome/moon.jpg' },
  { date: { y: 1989, m: 10, d: 9 }, text: 'The Berlin Wall falls.', src: '/welcome/berlin.jpg' },
  { date: { y: 1994, m: 4, d: 10 }, text: 'Mandela is sworn in as president.', src: '/welcome/mandela.jpg' },
  { date: { y: 1967, m: 3, d: 28 }, text: 'Muhammad Ali refuses the draft.', src: '/welcome/ali.jpg' },
]

const SPIN_MS = 700
const SPIN_TICK = 70

function daysIn(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate()
}

function yesterday(): YMD {
  const t = new Date()
  t.setDate(t.getDate() - 1)
  return { y: t.getFullYear(), m: t.getMonth(), d: t.getDate() }
}

function clamp(date: YMD, max: YMD): YMD {
  const y = Math.min(Math.max(date.y, MIN_YEAR), max.y)
  const m = y === max.y ? Math.min(date.m, max.m) : date.m
  let d = Math.min(date.d, daysIn(y, m))
  if (y === max.y && m === max.m) d = Math.min(d, max.d)
  return { y, m, d }
}

const pad = (n: number) => String(n).padStart(2, '0')

// Long ticks on the dial; they also click a little heavier
function isMajor(unit: DateUnit, i: number) {
  return unit === 'year' ? (MIN_YEAR + i) % 10 === 0 : unit === 'month' ? i % 3 === 0 : i === 0 || (i + 1) % 5 === 0
}
const unitName = (unit: DateUnit, n: number) => `${n} ${unit}${n === 1 ? '' : 's'}`

export default function TimeMachine({ onBack }: { onBack: () => void }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [max] = useState(yesterday)
  const [date, setDate] = useState<YMD>(() => clamp({ y: 1989, m: 10, d: 9 }, max))
  const [active, setActive] = useState<DateUnit>('year')
  const [precision, setPrecision] = useState<Precision>('full')
  const [dragFrom, setDragFrom] = useState<number | null>(null)
  const [surprise, setSurprise] = useState<(typeof SURPRISES)[number] | null>(null)
  const [spinning, setSpinning] = useState(false)

  // Only ever rendered after the Welcome step, so localStorage is available
  const [country, setCountry] = useState<CountryCode>(() => {
    try {
      const saved = localStorage.getItem(COUNTRY_KEY)
      if (isCountryCode(saved)) return saved
    } catch {}
    return 'world'
  })
  const selectedCountry = getCountry(country)
  const [detected] = useState(detectCountry)
  const [sheetOpen, setSheetOpen] = useState(false)
  const { saved } = usePostcards()

  function chooseCountry(code: CountryCode) {
    setCountry(code)
    try {
      localStorage.setItem(COUNTRY_KEY, code)
    } catch {}
  }

  const update = useCallback(
    (next: Partial<YMD>) => {
      setSurprise(null)
      setDate(prev => clamp({ ...prev, ...next }, max))
    },
    [max],
  )

  // The dial and steppers drive whichever unit is active
  // From 2000 the screen picks up the Gen Z sticker set (Figma 05 · Era style).
  // Held back while Surprise me spins so stickers don't flicker on and off.
  const genZ = !spinning && date.y >= 2000
  const y2k = genZ && date.y === 2000

  // A little sparkle as the stickers pop in (Surprise me has its own landing)
  const wasGenZ = useRef(genZ)
  useEffect(() => {
    if (genZ && !wasGenZ.current && !surprise) {
      play('chime')
      haptic('success')
    }
    wasGenZ.current = genZ
  }, [genZ, surprise])

  const unit: DateUnit = precision === 'year' ? 'year' : precision === 'month' && active === 'day' ? 'month' : active
  const dialIndex = unit === 'year' ? date.y - MIN_YEAR : unit === 'month' ? date.m : date.d - 1
  const dialCount = unit === 'year' ? max.y - MIN_YEAR + 1 : unit === 'month' ? 12 : daysIn(date.y, date.m)

  const setIndex = useCallback(
    (i: number) => {
      if (isMajor(unit, i)) feel('detent', 'medium')
      else feel('tick', 'selection')
      if (unit === 'year') update({ y: MIN_YEAR + i })
      else if (unit === 'month') update({ m: i })
      else update({ d: i + 1 })
    },
    [unit, update],
  )

  const step = useCallback(
    (delta: number) => setIndex(Math.max(0, Math.min(dialCount - 1, dialIndex + delta))),
    [dialCount, dialIndex, setIndex],
  )

  function choosePrecision(p: Precision) {
    if (p !== precision) feel('tick', 'selection')
    setPrecision(p)
    if (p === 'year') setActive('year')
    else if (p === 'month' && active === 'day') setActive('month')
  }

  const open = useCallback(() => {
    if (spinning) return
    const m = precision === 'year' ? 0 : date.m
    const d = precision === 'full' ? date.d : 1
    const dateStr = `${date.y}-${pad(m + 1)}-${pad(d)}`
    const url = country === 'world' ? `/rewind/${dateStr}` : `/rewind/${dateStr}?country=${country}`
    startTransition(() => router.push(url))
  }, [country, date, precision, router, spinning])

  // Surprise me: the board races through random days, then lands on a moment
  const spinTimer = useRef<number | undefined>(undefined)
  function spin() {
    if (spinning) return
    const options = SURPRISES.filter(s => s !== surprise && clamp(s.date, max).y === s.date.y)
    const pick = options[Math.floor(Math.random() * options.length)]
    setPrecision('full')
    setActive('year')
    setSurprise(null)

    feel('lever', 'medium')
    const land = () => {
      setDate(pick.date)
      setSurprise(pick)
      setSpinning(false)
      play('thud')
      play('chime', 90)
      haptic('success')
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return land()

    setSpinning(true)
    const started = performance.now()
    const tick = () => {
      if (performance.now() - started >= SPIN_MS) return land()
      const y = MIN_YEAR + Math.floor(Math.random() * (max.y - MIN_YEAR + 1))
      const m = Math.floor(Math.random() * 12)
      setDate(clamp({ y, m, d: 1 + Math.floor(Math.random() * 28) }, max))
      play('flap')
      spinTimer.current = window.setTimeout(tick, SPIN_TICK)
    }
    tick()
  }
  useEffect(() => () => window.clearTimeout(spinTimer.current), [])

  // Keyboard: ← → step, digits type into the active unit, Enter opens
  const typed = useRef({ buf: '', timer: 0 })
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.repeat && e.key === 'Enter')) return
      const target = e.target instanceof HTMLElement ? e.target : null
      if (target?.closest('input, textarea, select, [role="slider"], [role="dialog"]')) return

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        step(e.key === 'ArrowLeft' ? -1 : 1)
        return
      }
      if (e.key === 'Enter' && !target?.closest('button, a')) {
        open()
        return
      }
      if (!/^\d$/.test(e.key)) return

      const t = typed.current
      window.clearTimeout(t.timer)
      t.buf += e.key
      const need = unit === 'year' ? 4 : 2
      const commit = () => {
        const n = Number(t.buf)
        t.buf = ''
        if (unit === 'year' && n >= MIN_YEAR && n <= max.y) setIndex(n - MIN_YEAR)
        else if (unit === 'month' && n >= 1 && n <= 12) setIndex(n - 1)
        else if (unit === 'day' && n >= 1 && n <= dialCount) setIndex(n - 1)
      }
      if (t.buf.length >= need) commit()
      else t.timer = window.setTimeout(unit === 'year' ? () => (t.buf = '') : commit, 900)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dialCount, max.y, open, setIndex, step, unit])

  const groups: BoardGroup[] = [
    { unit: 'day', label: 'DAY', chars: precision === 'full' ? pad(date.d) : '––', disabled: precision !== 'full' },
    { unit: 'month', label: 'MONTH', chars: precision === 'year' ? '–––' : MONTHS[date.m], disabled: precision === 'year' },
    { unit: 'year', label: 'YEAR', chars: String(date.y) },
  ]

  const centre = unit === 'year' ? String(date.y) : unit === 'month' ? MONTHS[date.m].charAt(0) + MONTHS[date.m].slice(1).toLowerCase() : pad(date.d)
  const valueText = unit === 'year' ? String(date.y) : unit === 'month' ? MONTH_NAMES[date.m] : String(date.d)

  const others = (['day', 'month', 'year'] as const).filter(u => u !== unit && !groups.find(g => g.unit === u)?.disabled)
  const hint =
    dragFrom !== null && dragFrom !== dialIndex
      ? `Travelling ${dragFrom > dialIndex ? 'back' : 'forward'}… ${unitName(unit, Math.abs(dragFrom - dialIndex))}`
      : others.length
        ? `Drag the ring · tap ${others.map(u => u.toUpperCase()).join(' or ')} to switch`
        : 'Drag the ring to pick a year'

  const dial = (
    <RingDial
      count={dialCount}
      value={dialIndex}
      onChange={setIndex}
      onDragStart={() => setDragFrom(dialIndex)}
      onDragEnd={() => setDragFrom(null)}
      isMajor={i => isMajor(unit, i)}
      label={i =>
        unit === 'year'
          ? (MIN_YEAR + i) % 10 === 0 ? `'${String(MIN_YEAR + i).slice(2)}` : null
          : unit === 'month'
            ? i % 3 === 0 ? MONTHS[i] : null
            : i === 0 || (i + 1) % 5 === 0 ? String(i + 1) : null
      }
      name={`Choose ${unit}`}
      valueText={valueText}
      className="size-[244px] md:size-[440px] short:size-[360px]"
    >
      <span className="font-serif text-[60px] leading-none tracking-[-0.02em] text-ink tabular-nums md:text-[106px] short:text-[88px]">
        {centre}
      </span>
      <span className="mt-2 text-[12px] text-ink-muted md:mt-3">drag the ring</span>
    </RingDial>
  )

  const teaser = surprise && (
    <div className="teaser-in flex w-full items-center gap-3.5 rounded-[20px] bg-card py-5 pr-4 pl-[18px] shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
      <span className="relative size-[60px] shrink-0 overflow-hidden rounded-full">
        <Image
          src={surprise.src}
          alt=""
          fill
          sizes="60px"
          className={`object-cover ${surprise.date.y < 2000 ? 'grayscale' : ''}`}
        />
      </span>
      <span className="flex min-w-0 flex-col items-start">
        <span className="font-mono text-[10px] leading-[13px] font-medium tracking-[0.08em] text-ink-muted uppercase">
          You landed on · {surprise.date.d} {MONTHS[surprise.date.m]} {surprise.date.y}
        </span>
        <span className="mt-1 font-serif text-[22px] leading-[24px] text-ink">{surprise.text}</span>
        <span className="mt-2.5 flex items-center gap-3 text-[12px]">
          <button
            type="button"
            onClick={spin}
            className="flex items-center gap-1.5 font-medium text-ink-secondary transition-colors hover:text-ink"
          >
            <SpinIcon /> Spin again
          </button>
          <PhotoCredits className="text-ink-muted" />
        </span>
      </span>
    </div>
  )

  const stepper = (delta: -1 | 1) => (
    <button
      type="button"
      onClick={() => step(delta)}
      disabled={delta < 0 ? dialIndex === 0 : dialIndex === dialCount - 1}
      aria-label={`${delta < 0 ? 'Previous' : 'Next'} ${unit}`}
      className="flex size-11 items-center justify-center rounded-full border border-line bg-card text-[20px] font-medium text-ink shadow-[0_2px_4px_rgba(0,0,0,0.06)] transition-[transform,opacity] duration-150 ease-out active:scale-[0.94] disabled:opacity-40 md:size-[52px]"
    >
      {delta < 0 ? '−' : '+'}
    </button>
  )

  return (
    <main className="tm-enter flex min-h-svh flex-col overflow-x-clip bg-canvas px-6 pt-14 pb-10 text-ink md:px-16 md:pt-12 md:pb-16 short:pb-10">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="flex size-10 items-center justify-center rounded-full border border-line bg-card text-[20px] font-medium shadow-[0_2px_4px_rgba(0,0,0,0.06)] transition-transform duration-150 ease-out active:scale-[0.94]"
        >
          <Arrow className="size-5 rotate-180" />
        </button>
        <div className="flex items-center gap-2">
          <SoundToggle className="size-10" />
          {saved.length > 0 && <BoxBadge count={saved.length} className="h-10" />}
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-label={`Whose history: ${selectedCountry.name}`}
            className="flex h-10 items-center gap-2 rounded-full border border-line bg-card pr-3 pl-2 shadow-[0_2px_4px_rgba(0,0,0,0.06)] transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            <Flag key={country} code={country} className="pill-flag size-[22px]" />
            <span className="text-[14px] font-medium">{selectedCountry.name}</span>
            <MaskIcon src="/icons/ui/chevron-down.svg" className="size-4" />
          </button>
        </div>
      </div>

      <div className="relative mx-auto mt-7 flex w-full max-w-[342px] flex-1 flex-col items-center md:mt-[102px] md:grid md:max-w-[1176px] md:flex-none md:grid-cols-[548px_1fr] md:items-start md:gap-x-9 short:mt-10">
        {genZ && (
          <>
            <EraStickers items={ERA_MOBILE} className="md:hidden" />
            <EraStickers items={y2k ? ERA_DESKTOP.filter(s => s.src !== BUBBLE) : ERA_DESKTOP} className="hidden md:block" />
            {y2k && <EraStickers items={[{ src: Y2K, x: 440, y: 520, w: 223.8, h: 69.8 }]} className="hidden md:block" />}
          </>
        )}

        {/* Left column: headline, precision, board, actions */}
        <div className="flex w-full flex-col items-center md:items-start">
          <h1 className="text-center font-serif text-[40px] leading-none tracking-[-0.01em] md:text-left md:text-[72px]">
            Which day should <br />
            we <em className="italic">open</em>?
          </h1>

          <div
            role="radiogroup"
            aria-label="How precise"
            className="mt-[18px] flex gap-0.5 rounded-full border border-line bg-card p-[3px] md:mt-[26px]"
          >
            {PRECISIONS.map(p => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={precision === p.id}
                onClick={() => choosePrecision(p.id)}
                className={`rounded-full px-3.5 py-[7px] text-[12px] leading-4 font-medium transition-colors duration-200 ${precision === p.id ? 'bg-ink text-canvas' : 'text-ink-secondary hover:text-ink'}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-[26px] md:mt-[34px]">
            <FlipBoard
              groups={groups}
              active={unit}
              onSelect={u => {
                if (u !== unit) feel('tick', 'selection')
                setSurprise(null)
                setActive(u)
              }}
            />
          </div>

          <Actions className="hidden md:mt-20 md:grid short:mt-12" spinning={spinning} surprised={!!surprise} isPending={isPending} onSpin={spin} onOpen={open} />
          <div className="mt-5 hidden w-full max-w-[520px] md:block">
            {teaser ?? <p className="text-[12px] text-ink-muted">Tip: type a date, or use ← → to step through years.</p>}
          </div>
        </div>

        {/* Right column (desktop) / middle (mobile): dial */}
        <div className="relative mt-[33px] flex w-full flex-col items-center md:mt-0">
          <div className="relative flex w-[calc(100%+20px)] items-center justify-center md:w-full">
            <div className="absolute left-0 z-10">{stepper(-1)}</div>
            <div
              className={`transition-opacity duration-300 ${surprise ? 'opacity-35' : ''}`}
              onPointerDownCapture={() => setSurprise(null)}
            >
              {dial}
            </div>
            <div className="absolute right-0 z-10">{stepper(1)}</div>
          </div>

          <p aria-live="polite" className="mt-[26px] text-center text-[12px] text-ink-muted md:hidden">
            {hint}
          </p>
          {teaser && <div className="absolute inset-x-0 top-[214px] md:hidden">{teaser}</div>}

          <Timeline year={date.y} max={max.y} onPick={y => {
            setActive('year')
            update({ y })
          }} />
        </div>

        <div className="relative mt-auto w-full pt-10 md:hidden">
          {genZ && (
            <EraStickers
              items={[y2k ? { src: Y2K, x: 87.8, y: -13, w: 223.8, h: 69.8 } : { src: BUBBLE, x: 259.7, y: -32, w: 83, h: 70.2 }]}
            />
          )}
          <Actions className="" spinning={spinning} surprised={!!surprise} isPending={isPending} onSpin={spin} onOpen={open} />
        </div>
      </div>

      {sheetOpen && (
        <CountrySheet value={country} suggested={detected} onChange={chooseCountry} onClose={() => setSheetOpen(false)} />
      )}
    </main>
  )
}

// Gen Z sticker set (Figma 05 · Era style, 2005 frames). Boxes are render bounds
// (drop shadows included), relative to the content area: mobile from (24, 124),
// desktop from the grid's top-left (160, 190) in the 1440 frame.
const BUBBLE = '/era/bubble.png'
const Y2K = '/era/y2k.png'
type EraSticker = { src: string; x: number; y: number; w: number; h: number }

const ERA_MOBILE: EraSticker[] = [
  { src: '/era/sparkle-blue.png', x: 226.4, y: -17.6, w: 47.5, h: 47.5 },
  { src: '/era/phone.png', x: 294, y: 8.7, w: 72, h: 88 },
  { src: '/era/sparkle-pink.png', x: 4.3, y: 84.3, w: 41.5, h: 41.5 },
  { src: '/era/cd.png', x: -48, y: 126, w: 72, h: 74.6 },
  { src: '/era/smiley.png', x: 303.8, y: 468.2, w: 62.2, h: 67 },
  { src: '/era/heart.png', x: -19.1, y: 494, w: 56.5, h: 56.2 },
]

const ERA_DESKTOP: EraSticker[] = [
  { src: '/era/sparkle-blue.png', x: 388.5, y: -19.5, w: 58.9, h: 58.9 },
  { src: '/era/phone.png', x: 440, y: -63.5, w: 116.4, h: 122.9 },
  { src: '/era/sparkle-pink.png', x: 1008.4, y: 54.4, w: 49.2, h: 49.2 },
  { src: '/era/heart.png', x: 1155.5, y: -10, w: 75.9, h: 78.3 },
  { src: '/era/smiley.png', x: 1123.8, y: 360.3, w: 89.2, h: 90.1 },
  { src: '/era/cd.png', x: -81.9, y: 330, w: 110.8, h: 114.8 },
  { src: BUBBLE, x: 521.4, y: 510, w: 113.3, h: 99.4 },
]

/** Stickers pop in with a little bounce as the year crosses into 2000 */
function EraStickers({ items, className = '' }: { items: EraSticker[]; className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {items.map((s, n) => (
        <Image
          key={s.src}
          src={s.src}
          alt=""
          width={Math.ceil(s.w)}
          height={Math.ceil(s.h)}
          className="era-pop absolute max-w-none"
          style={{ left: s.x, top: s.y, width: s.w, height: s.h, animationDelay: `${n * 50}ms` }}
        />
      ))}
    </div>
  )
}

function Actions({
  className,
  spinning,
  surprised,
  isPending,
  onSpin,
  onOpen,
}: {
  className: string
  spinning: boolean
  surprised: boolean
  isPending: boolean
  onSpin: () => void
  onOpen: () => void
}) {
  return (
    <div className={`grid w-full grid-cols-[137fr_195fr] gap-2.5 md:max-w-[520px] ${className}`}>
      <button
        type="button"
        onClick={onSpin}
        disabled={spinning}
        className={`flex h-14 items-center justify-center gap-2 rounded-full border text-[14px] font-medium shadow-[0_2px_4px_rgba(0,0,0,0.06)] transition-[transform,background-color,color] duration-200 ease-out active:scale-[0.97] md:h-[60px] ${surprised || spinning ? 'border-ink bg-ink text-canvas' : 'border-line bg-card text-ink'}`}
      >
        <MaskIcon src="/icons/ui/lever.svg" className={`size-5 transition-transform duration-200 ease-out ${spinning ? 'rotate-[-24deg]' : ''}`} />
        Surprise me
      </button>
      <button
        type="button"
        onClick={onOpen}
        disabled={isPending || spinning}
        className="flex h-14 items-center justify-center gap-2 rounded-full bg-ink text-[16px] font-medium text-canvas transition-transform duration-150 ease-out active:scale-[0.97] disabled:opacity-60 md:h-[60px]"
      >
        {isPending ? 'Opening…' : <>Open this day <Arrow className="size-4" /></>}
      </button>
    </div>
  )
}

// Desktop: 1950 → today, one tick per year. Click or drag to jump.
function Timeline({ year, max, onPick }: { year: number; max: number; onPick: (y: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const span = max - MIN_YEAR
  const pct = (y: number) => `${((y - MIN_YEAR) / span) * 100}%`

  function pick(e: React.PointerEvent) {
    const box = ref.current!.getBoundingClientRect()
    const t = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width))
    const y = MIN_YEAR + Math.round(t * span)
    if (y !== year) onPick(y)
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      onPointerDown={e => {
        e.currentTarget.setPointerCapture(e.pointerId)
        pick(e)
      }}
      onPointerMove={e => e.buttons & 1 && pick(e)}
      className="relative mt-[90px] hidden h-12 w-[560px] max-w-full cursor-pointer touch-none select-none md:block short:mt-12"
    >
      {Array.from({ length: span + 1 }, (_, i) => {
        const y = MIN_YEAR + i
        const decade = y % 10 === 0
        return (
          <span key={y}>
            <span
              className={`absolute w-px ${decade ? 'top-0 h-[18px] bg-ink-secondary' : 'top-[9px] h-[9px] bg-ink-muted'}`}
              style={{ left: pct(y) }}
            />
            {decade && (
              <span
                className="absolute top-6 -translate-x-1/2 font-mono text-[10px] leading-[13px] font-medium text-ink-muted"
                style={{ left: pct(y) }}
              >
                {y}
              </span>
            )}
          </span>
        )
      })}
      <span
        className="absolute -top-1 h-[26px] w-0.5 -translate-x-1/2 rounded-[1px] bg-ink"
        style={{ left: pct(year) }}
      />
    </div>
  )
}

function MaskIcon({ src, className }: { src: string; className: string }) {
  return (
    <span
      aria-hidden="true"
      className={`shrink-0 bg-current ${className}`}
      style={{ mask: `url(${src}) center / contain no-repeat`, WebkitMask: `url(${src}) center / contain no-repeat` }}
    />
  )
}

// Geist's latin subset has no arrow glyphs, so draw them
function Arrow({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SpinIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3.5">
      <path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v2.8h-2.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
