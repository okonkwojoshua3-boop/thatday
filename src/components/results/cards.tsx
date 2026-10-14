'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { PriceComparison } from '@/lib/data/costs'
import { CardStamp, InkLines, LongArrow, MaskIcon, Postmark, PostageStamp, STAMP_INK, Sticker } from './art'
import type { StoryData } from './types'
import { countStamps, stampsTodo, type StampKey, type Stamps } from './stamps'
import { feel } from '@/lib/feedback'

// Figma 12 · 3–8: one keepsake per card. Children with `story-in` and a --i
// index enter in a 50ms stagger; stamps land last.

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// Northern-hemisphere seasons by month, for the Gen Z song line
const SEASONS = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter']

const i = (n: number) => ({ '--i': n }) as React.CSSProperties

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="story-in text-center font-mono text-[12px] leading-4 font-medium tracking-[0.08em] text-ink-muted uppercase" style={i(0)}>
      {children}
    </p>
  )
}

function Title({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`story-in mt-1.5 text-center font-serif text-[32px] leading-[35px] tracking-[-0.01em] ${className}`} style={i(1)}>
      {children}
    </h2>
  )
}

export function Hint({ children = 'Tap to continue →' }: { children?: React.ReactNode }) {
  return <p className="text-center text-[12px] leading-4 text-ink-muted">{children}</p>
}

// ── 3 · Years ago ─────────────────────────────────────────────────────────────

// Cards only render on the client (after the envelope), so window is available
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useCountUp(target: number, ms = 900) {
  const [reduce] = useState(prefersReducedMotion)
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (reduce) return
    const start = performance.now()
    let raf = 0
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / ms)
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms, reduce])
  return reduce ? target : value
}

export function YearsCard({ data }: { data: StoryData }) {
  const days = useCountUp(data.days)
  const { years, months, days: d } = data.elapsed
  const parts = [
    years && `${years} ${years === 1 ? 'year' : 'years'}`,
    months && `${months} ${months === 1 ? 'month' : 'months'}`,
    `${d} ${d === 1 ? 'day' : 'days'}`,
  ].filter(Boolean) as string[]
  const elapsedText = parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}` : parts[0]

  // One dot per year since; the first is you, the last is this (unfinished) year
  const dots = Math.max(1, data.yearsAgo)
  const cols = dots > 45 ? 12 : 9
  const size = dots > 45 ? 18 : 26
  const gap = dots > 45 ? 9 : 12

  return (
    <div className="relative flex flex-1 flex-col">
      <InkLines className="story-in pointer-events-none absolute top-[10px] -right-6 -left-6 h-60 w-[calc(100%+48px)] text-ink" />
      <div className="mt-auto flex flex-col items-center pt-[clamp(120px,28svh,250px)] text-center">
        <h2 className="story-in font-serif text-[44px] leading-[44px] tracking-[-0.01em]" style={i(1)}>
          You just went back
        </h2>
        <p className="story-in mt-0.5 font-serif text-[64px] leading-[64px] tracking-[-0.02em] italic tabular-nums" style={i(2)}>
          {days.toLocaleString('en-US')} {data.days === 1 ? 'day' : 'days'}.
        </p>
        <p className="story-in mt-5 text-[16px] leading-[22px] text-ink-secondary" style={i(3)}>
          {elapsedText}.
          <br />
          One dot for every year since.
        </p>
      </div>
      <div className="mt-auto pt-12">
        <div
          className="grid justify-between"
          style={{ gridTemplateColumns: `repeat(${cols}, ${size}px)`, rowGap: gap }}
          aria-label={`${dots} years`}
        >
          {Array.from({ length: dots }, (_, n) => (
            <span
              key={n}
              className={`dot-pop relative rounded-full border-[1.5px] border-ink ${n === 0 ? 'bg-ink' : ''}`}
              style={{ width: size, height: size, animationDelay: `${300 + n * 18}ms` }}
            >
              {n === dots - 1 && n > 0 && <span className="absolute inset-y-0 left-0 w-1/2 rounded-l-full bg-ink" />}
            </span>
          ))}
        </div>
        <div className="mt-3.5 flex justify-between font-mono text-[12px] leading-4 font-medium text-ink-muted">
          <span>{data.year}</span>
          <span>{data.thisYear}</span>
        </div>
      </div>
    </div>
  )
}

// ── 4 · No.1 song ─────────────────────────────────────────────────────────────

// Say exactly what the pick is: a chart's No.1 for the year, this week's chart,
// or (before a country had charts) the year's defining hit
function songKicker(song: StoryData['song']) {
  if (!song) return 'On the radio'
  if (song.basis === 'week') return 'No.1 this week'
  return song.basis === 'chart' ? `No.1 of ${song.year}` : `The sound of ${song.year}`
}

function songSource(song: NonNullable<StoryData['song']>) {
  if (song.basis === 'week') return song.chart
  return song.basis === 'chart' ? `${song.chart}, year-end` : `biggest hit of ${song.year}`
}

export function SongCard({
  data,
  onPlayingChange,
}: {
  data: StoryData
  onPlayingChange: (playing: boolean) => void
}) {
  const song = data.song
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlayingState] = useState(false)
  const setPlaying = (value: boolean) => {
    setPlayingState(value)
    onPlayingChange(value)
  }

  // Leaving the card stops the music and lets the story run again
  useEffect(() => () => onPlayingChange(false), [onPlayingChange])

  function toggle(e: React.MouseEvent) {
    e.stopPropagation()
    const el = audio.current
    if (!el) return
    if (el.paused) el.play().catch(() => setPlaying(false))
    else el.pause()
  }

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="mt-[50px] w-full">
        <Kicker>{songKicker(song)}</Kicker>
        <Title>What everyone was humming</Title>
      </div>

      {/* Postcard 318×388, tilted −2° */}
      <div className="story-drop relative mt-[39px] w-[318px] max-w-full -rotate-2" style={i(2)}>
        <div className="relative rounded-[4px] border border-ink bg-card p-3 shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
          <div className="relative flex h-[220px] items-start justify-center overflow-visible bg-canvas pt-4">
            {data.genZ ? (
              <Image src="/results/genz/song-cd.png" alt="" width={241} height={241} className="absolute -top-[2px] left-[22px] max-w-none" style={{ width: 241, height: 241 }} />
            ) : (
              <MaskIcon src="/results/record-large.png" className="size-[187px] text-ink" />
            )}
          </div>
          <div className="px-1.5">
            <p className="mt-4 truncate font-serif text-[32px] leading-[32px]">{song?.title ?? 'Off the charts'}</p>
            <p className="mt-1.5 truncate text-[14px] leading-[18px] text-ink-secondary">
              {song ? `${song.artist} · ${songSource(song)}` : 'No song on record for this year yet'}
            </p>
          </div>
          <span className="mt-3.5 block h-px bg-line" />
          <p className="mt-3.5 px-1.5 pb-2 font-serif text-[18px] leading-[23px] text-ink-secondary italic">
            {data.genZ ? `“On every ringtone that ${SEASONS[data.month]}.”` : `“Played on every radio that ${song?.basis === 'week' ? 'week' : 'year'}.”`}
          </p>
        </div>
        <span className="story-stamp absolute -top-[18px] right-[4px] rotate-6" style={i(4)}>
          <PostageStamp genZ={data.genZ} value={data.stampValue} />
        </span>
        {data.genZ && (
          <>
            <Sticker src="/results/genz/song-omg.png" x={-36} y={-20} w={83.3} h={76} delay={500} />
            <Sticker src="/results/genz/song-sparkle.png" x={-17} y={-19} w={49.7} h={49.7} delay={560} />
            <Sticker src="/results/genz/song-heart.png" x={278} y={382} w={63.3} h={65} delay={620} />
          </>
        )}
      </div>

      <div className="mt-auto flex flex-col items-center gap-[23px] pt-8">
        {song?.previewUrl && (
          <>
            <audio
              ref={audio}
              src={song.previewUrl}
              preload="none"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
            />
            <button
              type="button"
              onClick={toggle}
              className="story-in flex h-[49px] items-center gap-2.5 rounded-full bg-ink px-8 text-[16px] font-medium text-canvas transition-transform duration-150 ease-out active:scale-[0.97]"
              style={i(5)}
            >
              {playing ? (
                <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
                  <rect x="2" y="1" width="3" height="10" rx="1" fill="currentColor" />
                  <rect x="7" y="1" width="3" height="10" rx="1" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
                  <path d="M2.5 1.2v9.6L10.8 6z" fill="currentColor" />
                </svg>
              )}
              {playing ? 'Pause preview' : 'Play 30s preview'}
            </button>
          </>
        )}
        <Hint />
      </div>
    </div>
  )
}

// ── 5 · Front page ────────────────────────────────────────────────────────────

export function FrontPageCard({ data, onMore }: { data: StoryData; onMore?: () => void }) {
  const front = data.front
  const stories = front ? [{ headline: front.headline, year: front.year }, ...front.more] : []
  const [index, setIndex] = useState(0)
  const story = stories[index]
  const isLead = index === 0
  const sameYear = story ? story.year === data.year : false

  const dateline = sameYear
    ? `${data.weekday}, ${data.day} ${MONTH_NAMES[data.month]} ${data.year}`
    : story
      ? `${data.day} ${MONTH_NAMES[data.month]} ${story.year} · On this day`
      : ''
  const headline = story?.headline ?? 'A quiet day in the papers'
  const size = headline.length > 110 ? 'text-[22px] leading-[25px]' : headline.length > 60 ? 'text-[28px] leading-[30px]' : 'text-[40px] leading-[40px]'
  const others = stories.length - 1

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="mt-[50px] w-full">
        <Kicker>On the front page</Kicker>
        <Title>What the world woke up to</Title>
      </div>

      {/* Clipping 318 wide, tilted 1° and taped down */}
      <div className="story-drop relative mt-[37px] w-[318px] max-w-full rotate-1" style={i(2)}>
        <div key={index} className="clip-swap bg-card px-3 pt-3.5 pb-4 shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
          <p className="text-center font-serif text-[28px] leading-9 tracking-[0.02em] uppercase">The Daily World</p>
          <span className="block h-0.5 bg-ink" />
          <p className="mt-1 text-center font-mono text-[10px] leading-[13px] font-medium tracking-[0.06em] uppercase">{dateline}</p>
          <span className="mt-[5px] block h-px bg-ink" />
          <p className={`mt-2.5 font-serif ${size}`}>{headline}</p>
          {isLead && front?.photo && (
            <div className="relative mt-2.5 h-[180px] overflow-hidden bg-canvas">
              <Image src={front.photo} alt="" fill sizes="294px" className={`object-cover ${data.genZ ? '' : 'grayscale'}`} />
            </div>
          )}
          {isLead && front?.summary && <p className="mt-3 line-clamp-3 text-[14px] leading-5 text-ink-secondary">{front.summary}</p>}
        </div>
        <span className="story-tape absolute -top-2.5 -left-4 h-6 w-[72px] -rotate-30 bg-[#ebd9c6]/75" style={i(4)} />
        <span className="story-tape absolute -top-2 left-[262px] h-6 w-[72px] rotate-28 bg-[#ebd9c6]/75" style={i(5)} />
      </div>

      <div className="mt-auto flex flex-col items-center gap-5 pt-8">
        {others > 0 && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              setIndex(n => (n + 1) % stories.length)
              onMore?.()
            }}
            className="story-in flex h-[52px] items-center rounded-full border-[1.5px] border-ink px-[26px] text-[16px] font-medium transition-transform duration-150 ease-out active:scale-[0.97]"
            style={i(6)}
          >
            {isLead ? `${others} more ${others === 1 ? 'headline' : 'headlines'}` : index < others ? 'Next headline' : 'Back to the top story'}
          </button>
        )}
        <Hint />
      </div>
    </div>
  )
}

// ── 6 · Then vs now ───────────────────────────────────────────────────────────

function price(value: number, symbol: string, cents?: boolean) {
  if (cents) return `${Math.round(value)}¢`
  if (value >= 100) return `${symbol}${Math.round(value).toLocaleString('en-US')}`
  return `${symbol}${value.toFixed(2)}`
}

function Ticket({ item, symbol, year, index }: { item: PriceComparison; symbol: string; year: number; index: number }) {
  const then = price(item.then, symbol, item.cents)
  const now = price(item.now, symbol, item.cents)
  const long = Math.max(then.length, now.length) > 6
  const mult = item.then > 0 ? item.now / item.then : 0
  return (
    <div
      className="ticket-in relative h-[100px] rounded-xl border border-line bg-card"
      style={{ animationDelay: `${200 + index * 60}ms` }}
    >
      <p className="absolute top-4 left-5 font-mono text-[10px] leading-[13px] font-medium tracking-[0.08em] text-ink-muted uppercase">{item.label}</p>
      <p className={`absolute top-9 left-5 font-serif ${long ? 'text-[28px] leading-10' : 'text-[40px] leading-10'}`}>{then}</p>
      <p className="absolute top-[78px] left-5 font-mono text-[10px] leading-[13px] font-medium tracking-[0.04em] text-ink-muted">{year}</p>
      <LongArrow className="absolute top-[50px] left-[118px] h-2.5 w-[39px] text-ink-muted" />
      <p className={`absolute top-9 right-[64px] w-[120px] text-right font-serif italic ${long ? 'text-[28px] leading-10' : 'text-[40px] leading-10'}`}>{now}</p>
      <p className="absolute top-[78px] right-[64px] font-mono text-[10px] leading-[13px] font-medium tracking-[0.04em] text-ink-muted">{item.nowYear >= new Date().getFullYear() ? 'TODAY' : item.nowYear}</p>
      {/* Tear line with notches */}
      <span className="absolute inset-y-0 left-[289px] border-l-[1.5px] border-dashed border-line" />
      <span className="absolute -top-2 left-[282px] size-4 rounded-full border border-line bg-canvas [clip-path:inset(50%_0_0_0)]" />
      <span className="absolute -bottom-2 left-[282px] size-4 rounded-full border border-line bg-canvas [clip-path:inset(0_0_50%_0)]" />
      <p className="absolute top-[42px] right-0 w-[52px] text-center font-mono text-[12px] leading-4 font-medium">
        {mult >= 1000 ? `×${(mult / 1000).toFixed(1)}k` : mult >= 10 ? `×${Math.round(mult)}` : `×${mult.toFixed(1)}`}
      </p>
    </div>
  )
}

export function PricesCard({ data }: { data: StoryData }) {
  const { items, currencySymbol, local, since } = data.prices
  const title = local ? `What ${data.countryName} paid` : 'A dollar went further'
  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-[50px]">
        <Kicker>What things cost</Kicker>
        <Title>{title}</Title>
      </div>
      <div className="mt-[29px] flex flex-col gap-3">
        {items.map((item, n) => (
          <Ticket key={item.key} item={item} symbol={currencySymbol} year={data.year} index={n} />
        ))}
        {items.length === 0 && (
          <p className="story-in text-[16px] leading-[21px] text-ink-secondary" style={i(3)}>
            Our {data.countryName} price records start in {since}. Pick a later year to see what things cost.
          </p>
        )}
      </div>
      <div className="mt-auto pt-8">
        {items.length > 0 ? (
          <Hint>{local ? `${data.countryName} averages` : 'US averages'}, estimated between survey years. Tap to continue →</Hint>
        ) : (
          <Hint />
        )}
      </div>
    </div>
  )
}

// ── 7 · Stamp card ────────────────────────────────────────────────────────────

const STAMP_ORDER: StampKey[] = ['song', 'front', 'prices', 'saved', 'explorer', 'share']

export function StampsCard({ data, stamps: got }: { data: StoryData; stamps: Stamps }) {
  const count = countStamps(got)
  const g = data.genZ

  // Each collected stamp lands with a thud as it presses in
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timers = STAMP_ORDER.filter(k => got[k]).map(k =>
      window.setTimeout(() => feel('thud', 'light'), 250 + STAMP_ORDER.indexOf(k) * 120 + 120),
    )
    return () => timers.forEach(t => window.clearTimeout(t))
    // Only when the card first shows
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sticker = (src: string, box: { x: number; y: number; w: number; h: number }) => (
    <Image src={src} alt="" width={Math.round(box.w)} height={Math.round(box.h)} className="absolute max-w-none" style={{ left: box.x, top: box.y, width: box.w, height: box.h }} />
  )
  const icon = (halftone: string, src: string, box: { x: number; y: number; w: number; h: number }) =>
    g ? sticker(src, box) : <MaskIcon src={halftone} className="absolute top-[21px] left-[15px] size-[58px]" color={STAMP_INK} />
  const word = (text: string, src: string, box: { x: number; y: number; w: number; h: number }) =>
    g ? sticker(src, box) : <span className="absolute inset-x-0 top-[28px] text-center font-serif text-[36px] leading-[52px] italic">{text}</span>

  // Collected stamps say what you got; empty ones say how to get them
  const stamps: { key: StampKey; label: string; todo: string; rot: string; body: React.ReactNode }[] = [
    {
      key: 'song',
      label: data.song?.basis === 'hit' ? 'Song of the year' : 'The No.1',
      todo: 'Play the song',
      rot: '-rotate-3',
      body: icon('/icons/halftone/song.png', '/results/genz/stamp-cd-60.png', { x: 8, y: 14, w: 74.3, h: 74.3 }),
    },
    { key: 'front', label: 'Front page', todo: 'Read the papers', rot: 'rotate-2', body: icon('/icons/halftone/headline.png', '/results/genz/stamp-newsphone-60.png', { x: 13, y: 12, w: 62.7, h: 77 }) },
    { key: 'prices', label: 'The prices', todo: 'Check the prices', rot: '-rotate-1', body: icon('/icons/halftone/price.png', '/results/genz/stamp-tag-60.png', { x: 8, y: 21, w: 73.3, h: 63 }) },
    { key: 'saved', label: 'In the box', todo: 'Save it', rot: 'rotate-3', body: word('Kept', '/icons/stickers/heart.png', { x: 12, y: 18, w: 63.3, h: 64 }) },
    { key: 'explorer', label: 'Another day', todo: 'Rewind another', rot: '-rotate-2', body: word('Again', '/icons/stickers/sparkle-blue.png', { x: 16, y: 20, w: 56.7, h: 56.7 }) },
    { key: 'share', label: 'Sent', todo: 'Share it', rot: '', body: word('Sent', '/results/genz/stamps-smiley.png', { x: 14, y: 18, w: 59.7, h: 61.3 }) },
  ]

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="mt-[50px]">
        <Kicker>Your stamp card</Kicker>
        <Title>
          You collected {count} of 6
        </Title>
      </div>

      <div className="story-drop relative mt-[33px] rounded-2xl border border-line bg-card px-5 pt-5 pb-6" style={i(2)}>
        {g && (
          <>
            <Sticker src="/results/genz/stamps-sparkle.png" x={2.8} y={-22.4} w={42.7} h={42.7} delay={600} />
            <Sticker src="/results/genz/stamps-smiley.png" x={289.3} y={-35.1} w={59.7} h={61.3} delay={660} />
          </>
        )}
        <div className="flex justify-between font-mono text-[10px] leading-[13px] font-medium">
          <span className="tracking-[0.08em] uppercase">
            ThatDay · {String(data.day).padStart(2, '0')} {MONTHS[data.month]} {data.year}
          </span>
          <span className="tracking-[0.04em]">{count}/6</span>
        </div>
        <span className="mt-[11px] block h-px bg-line" />
        <div className="mt-5 grid grid-cols-3 justify-items-center gap-y-6">
          {stamps.map((s, n) => (
            <div key={s.key} className="flex w-[104px] flex-col items-center">
              <span className={`${got[s.key] ? 'stamp-press' : 'block'} ${s.rot}`} style={{ animationDelay: `${250 + n * 120}ms` }}>
                <CardStamp collected={got[s.key]} genZ={g} empty={!got[s.key]}>
                  {got[s.key] ? (
                    s.body
                  ) : (
                    <span className="absolute inset-x-0 top-[28px] text-center font-serif text-[40px] leading-[52px] text-ink-muted">+</span>
                  )}
                </CardStamp>
              </span>
              <span className={`mt-2.5 text-[12px] leading-4 ${got[s.key] ? 'text-ink-secondary' : 'text-ink-muted'}`}>
                {got[s.key] ? s.label : s.todo}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="story-in mt-7 text-center font-serif text-[18px] leading-[23px] text-ink-secondary italic" style={i(6)}>
        {stampsTodo(got) ?? 'Every stamp collected. Nicely done.'}
      </p>
      <div className="mt-auto pt-8">
        <Hint />
      </div>
    </div>
  )
}

// ── 8 · Passport ──────────────────────────────────────────────────────────────

const PASSPORT_STICKERS = [
  { src: '/results/genz/pass-cd.png', x: 6.8, y: 22, w: 113, h: 115 },
  { src: '/results/genz/pass-newsphone.png', x: 122, y: 2, w: 88, h: 103.7 },
  { src: '/results/genz/pass-sparkle.png', x: 186.8, y: 5.6, w: 42.7, h: 42.7 },
  { src: '/results/genz/pass-smiley.png', x: 190.5, y: 28.5, w: 82, h: 81.3 },
  { src: '/results/genz/pass-play.png', x: 263.3, y: 5.2, w: 71.3, h: 67.3 },
  { src: '/results/genz/pass-omg.png', x: 115.8, y: 86, w: 80.7, h: 68.7 },
  { src: '/results/genz/pass-heart.png', x: 15.4, y: 84.4, w: 58, h: 58.7 },
]

function mrz(s: string) {
  return s.toUpperCase().replace(/[^A-Z0-9]+/g, '')
}

/** The passport itself: the story's last card, and what a friend sees on the share page */
export function Passport({ data, last, className = '' }: { data: StoryData; last: [string, string]; className?: string }) {
  const firstPrice = data.prices.items[0]
  const dd = String(data.day).padStart(2, '0')
  const dateShort = `${dd} ${MONTHS[data.month].charAt(0)}${MONTHS[data.month].slice(1).toLowerCase()} ${data.year}`
  const line1 = `TD<<${dd}${MONTHS[data.month]}${data.year}<<${mrz(data.countryName)}`.padEnd(37, '<')
  const line2 = `${mrz(data.song?.title ?? 'NOSONG')}<<${mrz(data.front?.headline ?? 'QUIETDAY')}`.slice(0, 37).padEnd(37, '<')

  return (
    <div className={`story-drop relative overflow-hidden rounded-[20px] border border-ink bg-card shadow-[0_16px_32px_rgba(0,0,0,0.08)] ${className}`} style={i(1)}>
      <div className="relative h-[140px] overflow-hidden bg-canvas">
        {data.genZ ? (
          PASSPORT_STICKERS.map((s, n) => <Sticker key={s.src} {...s} delay={300 + n * 60} />)
        ) : data.front?.photo ? (
          <Image src={data.front.photo} alt="" fill sizes="342px" className="object-cover grayscale" />
        ) : (
          <MaskIcon src="/icons/halftone/song.png" className="absolute top-4 left-1/2 size-28 -translate-x-1/2 text-ink" />
        )}
      </div>
      <Postmark day={dd} month={MONTHS[data.month]} year={data.year} className="absolute top-[118px] left-[196px] -rotate-10 text-ink opacity-70" />
      <span className="story-stamp absolute top-[104px] left-[262px] rotate-4" style={i(4)}>
        <PostageStamp genZ={data.genZ} value={data.stampValue} />
      </span>

      <div className="relative px-5 pt-5">
        <p className="font-mono text-[12px] leading-4 font-medium tracking-[0.08em]">MY THATDAY PASSPORT</p>
        <p className="mt-0.5 font-mono text-[8px] leading-[10px] font-medium tracking-[0.08em] text-ink-muted">POSTCARD · PASSPORT · KEEPSAKE</p>
        <div className="mt-2 flex">
          <div className="w-[148px]">
            <p className="font-serif text-[64px] leading-[64px]">{data.yearsAgo}</p>
            <p className="-mt-1 font-serif text-[24px] leading-[24px] italic">{data.yearsAgo === 1 ? 'year back' : 'years back'}</p>
          </div>
          <dl className="mt-1.5 grid flex-1 grid-cols-[auto_1fr] gap-x-3 gap-y-3 text-[12px] leading-4">
            <dt className="text-ink-secondary">Date</dt>
            <dd className="text-right font-medium">{dateShort}</dd>
            <dt className="text-ink-secondary">Region</dt>
            <dd className="truncate text-right font-medium">{data.countryName}</dd>
            <dt className="text-ink-secondary">Issued</dt>
            <dd className="text-right font-medium">{data.issued}</dd>
          </dl>
        </div>
        <span className="mt-4 block h-px bg-line" />
        <div className="mt-[15px] grid grid-cols-2 gap-x-2.5 gap-y-[18px] pb-6">
          {[
            [data.song?.basis === 'hit' ? 'Song of the year' : 'No.1 song', data.song?.title ?? '—'],
            [data.front && !data.front.sameYear ? `Front page · ${data.front.year}` : 'Front page', data.front?.headline ?? '—'],
            [firstPrice?.label ?? 'Prices', firstPrice ? price(firstPrice.then, data.prices.currencySymbol, firstPrice.cents) : '—'],
            last,
          ].map(([label, value]) => (
            <div key={label} className="min-w-0">
              <p className="font-mono text-[8px] leading-[10px] font-medium tracking-[0.08em] text-ink-muted uppercase">{label}</p>
              <p className="mt-1 truncate font-serif text-[20px] leading-5">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-canvas px-5 pt-3 pb-[22px]">
        <p className="font-mono text-[10px] leading-[15px] font-medium tracking-[0.06em] break-all">
          {line1}
          <br />
          {line2}
        </p>
      </div>
    </div>
  )
}

export function PassportCard({
  data,
  stamps,
  saved,
  onSend,
  onSave,
  onPickAnother,
}: {
  data: StoryData
  stamps: Stamps
  saved: boolean
  onSend: () => void
  onSave: () => void
  onPickAnother: () => void
}) {
  return (
    <div className="flex flex-1 flex-col">
      <h2 className="story-in mt-9 text-center font-serif text-[32px] leading-[35px] tracking-[-0.01em]" style={i(0)}>
        Your day, stamped and sealed
      </h2>

      <Passport data={data} last={['Stamps', `${countStamps(stamps)} of 6`]} className="mt-[21px]" />

      <div className="mt-auto flex flex-col gap-[20px] pt-7">
        <div className="story-in flex gap-2" style={i(6)}>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              onSend()
            }}
            className="h-[52px] flex-[220] rounded-full bg-ink text-[16px] font-medium text-canvas transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            Send this postcard
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              onSave()
            }}
            aria-pressed={saved}
            className="flex h-[52px] flex-[114] items-center justify-center gap-1.5 rounded-full border-[1.5px] border-ink text-[16px] font-medium transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            {saved ? (
              <>
                <svg viewBox="0 0 16 12" fill="none" className="w-3.5" aria-hidden="true">
                  <path d="M1.3 6 6 11.3l9.5-9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Saved
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation()
            onPickAnother()
          }}
          className="text-[14px] leading-[18px] font-medium text-ink-secondary hover:text-ink"
        >
          Pick another day
        </button>
      </div>
    </div>
  )
}
