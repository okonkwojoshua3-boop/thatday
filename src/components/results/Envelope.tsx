'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Brand, MaskIcon, Postmark, PostageStamp, Sticker } from './art'
import type { StoryData } from './types'
import { feel, play } from '@/lib/feedback'

// Figma 12 · 1–2: the day arrives as mail. The seal breaks, the flap swings up,
// a postcard slides out, then the story begins.

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const AUTO_OPEN_MS = 1200
const OPEN_MS = 700 // seal 160 + flap 320 + postcard rising

// Gen Z stickers around the envelope, relative to its top-left (Figma 2021:54566)
const ENVELOPE_STICKERS = [
  { src: '/results/genz/env-sparkle.png', x: 21.2, y: -31.2, w: 49.7, h: 49.7 },
  { src: '/results/genz/env-smiley.png', x: 253.8, y: -43, w: 70.7, h: 71.7 },
  { src: '/results/genz/env-heart.png', x: -11.7, y: 214, w: 63.3, h: 64.7 },
  { src: '/results/genz/env-play.png', x: 250.5, y: 213.3, w: 65.3, h: 60 },
]

export default function Envelope({ data, onRead }: { data: StoryData; onRead: () => void }) {
  const [phase, setPhase] = useState<'sealed' | 'opening' | 'open'>('sealed')

  function open() {
    if (phase !== 'sealed') return
    setPhase('opening')
  }

  // Breaks the seal by itself after a beat
  useEffect(() => {
    if (phase !== 'sealed') return
    const t = window.setTimeout(() => setPhase('opening'), AUTO_OPEN_MS)
    return () => window.clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'opening') return
    // The seal cracks, then the flap and postcard slide
    feel('seal', 'medium')
    play('swish', 160)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      onRead()
      return
    }
    const t = window.setTimeout(() => setPhase('open'), OPEN_MS)
    return () => window.clearTimeout(t)
  }, [phase, onRead])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Enter' && e.key !== ' ') return
      e.preventDefault()
      if (phase === 'sealed') setPhase('opening')
      else if (phase === 'open') onRead()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, onRead])

  const opened = phase !== 'sealed'
  const ago = data.yearsAgo === 0 ? 'This year' : `${data.yearsAgo} ${data.yearsAgo === 1 ? 'year' : 'years'} ago`

  return (
    <main
      data-phase={phase}
      onClick={phase === 'sealed' ? open : phase === 'open' ? onRead : undefined}
      className="envelope-scene relative flex min-h-svh cursor-pointer flex-col items-center overflow-hidden bg-canvas px-6 pt-16 pb-14 text-ink select-none"
    >
      <Brand />

      <div className="env-header mt-[90px] flex flex-col items-center text-center">
        <h1 className="font-serif text-[40px] leading-[42px] tracking-[-0.01em]">
          A postcard from
          <br />
          <em className="italic">
            {data.day} {MONTH_NAMES[data.month]} {data.year}
          </em>
        </h1>
        <p className="mt-5 font-mono text-[12px] leading-4 font-medium tracking-[0.08em] text-ink-muted uppercase">
          {ago} · {data.countryName}
        </p>
      </div>

      {/* Envelope: 310×206, tilted −3° */}
      <div className="env-body relative mt-[52px] h-[206px] w-[310px]">
        <div className="relative size-full -rotate-3 perspective-[800px]">
          {/* Open flap, standing up behind the postcard. Unfolds from the top edge
              as the closed flap (below) folds away, so no z-index swap is needed. */}
          <svg
            viewBox="0 0 310 112"
            fill="none"
            aria-hidden="true"
            className="env-flap absolute -top-[108px] left-0 h-28 w-[310px] origin-bottom overflow-visible text-ink"
          >
            <path d="M4 112 155 4 306 112Z" className="fill-card" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>

          {/* The postcard inside */}
          <div className="env-postcard absolute top-[-118px] left-[37px] flex h-[166px] w-[236px] gap-2.5 rounded-[4px] border border-ink bg-canvas p-3 shadow-[0_8px_16px_rgba(0,0,0,0.08)]">
            <div className="relative h-[100px] w-[124px] shrink-0 overflow-hidden rounded-[2px] bg-card">
              {data.front?.photo ? (
                <Image
                  src={data.front.photo}
                  alt=""
                  fill
                  sizes="124px"
                  className={`object-cover ${data.genZ ? '' : 'grayscale'}`}
                />
              ) : (
                <MaskIcon src="/icons/halftone/song.png" className="absolute inset-4 text-ink" />
              )}
            </div>
            <div className="flex flex-1 flex-col pt-0.5">
              <p className="font-serif text-[18px] leading-[18px] italic">
                Greetings
                <br />
                from {data.year}
              </p>
              <span className="mt-[22px] h-px w-full bg-ink-muted" />
              <span className="mt-[13px] h-px w-full bg-ink-muted" />
              <span className="mt-[13px] h-px w-full bg-ink-muted" />
            </div>
          </div>

          {/* Front pocket */}
          <div className="absolute inset-0 rounded-[6px] border-[1.5px] border-ink bg-card shadow-[0_16px_32px_rgba(0,0,0,0.10)]">
            {/* Side folds show once the flap is up */}
            <svg viewBox="0 0 310 206" fill="none" aria-hidden="true" className="env-sides absolute inset-0 size-full text-ink">
              <path d="M4 4 120 118 4 202M306 4 190 112 306 202" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>

            {/* Sealed face: address line, stamp and postmark */}
            <div className="env-face absolute inset-0">
              <span className="absolute top-[150px] left-6 font-serif text-[20px] leading-[26px] italic">To: you</span>
              <span className="absolute top-[176px] left-6 h-px w-[110px] bg-ink-muted" />
              <PostageStamp genZ={data.genZ} value={data.stampValue} className="absolute top-4 left-[228px]" />
              <Postmark
                day={String(data.day).padStart(2, '0')}
                month={MONTHS[data.month]}
                year={data.year}
                className="absolute top-[34px] left-[146px] -rotate-8 text-ink"
              />
            </div>
          </div>

          {/* Closed flap with the wax seal; swings up on its top edge */}
          <div className="env-closed-flap absolute top-0 left-0 h-28 w-[310px] origin-top">
            <svg viewBox="0 0 310 112" fill="none" aria-hidden="true" className="absolute inset-0 size-full overflow-visible text-ink">
              <path d="M4 4 155 112 306 4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <span className="env-seal absolute top-[84px] left-[127px] flex size-14 items-center justify-center rounded-full bg-ink font-serif text-[24px] text-canvas italic">
              TD
            </span>
          </div>
        </div>

        {data.genZ && ENVELOPE_STICKERS.map((s, i) => <Sticker key={s.src} {...s} delay={300 + i * 80} />)}
      </div>

      <div className="mt-auto flex flex-col items-center gap-3">
        {!opened && (
          <span aria-hidden="true" className="env-tap relative flex size-11 items-center justify-center rounded-full border-[1.5px] border-dashed border-ink">
            <span className="size-3 rounded-full bg-ink" />
          </span>
        )}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation()
            if (phase === 'sealed') open()
            else onRead()
          }}
          className={`text-[14px] leading-[18px] text-ink-secondary transition-opacity duration-300 ${phase === 'opening' ? 'opacity-0' : ''}`}
        >
          {opened ? 'Tap to read' : 'Tap to open'}
        </button>
      </div>
    </main>
  )
}
