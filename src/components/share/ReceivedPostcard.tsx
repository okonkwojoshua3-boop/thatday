'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import Envelope, { type EnvelopeSticker } from '@/components/results/Envelope'
import { Brand, Sticker } from '@/components/results/art'
import { Passport } from '@/components/results/cards'
import type { StoryData } from '@/components/results/types'

// Figma 09 — Share page · received postcard. The day arrives sealed and
// addressed to the friend, then opens to a read-only passport.

// Render bounds from the Figma frames (shadow and rotation baked in). Header
// stickers sit on a 390-wide strip from the kicker's top (frame y 150); the rest
// are relative to the envelope's box (frame x 40, y 346) so they move with it.
const HEADER_STICKERS: EnvelopeSticker[] = [
  { src: '/share/sealed-sparklePink.png', x: 318.3, y: 14.3, w: 41.5, h: 41.5 },
  { src: '/share/sealed-omg.png', x: 0, y: 86, w: 75.4, h: 64.9 },
]

const ENVELOPE_STICKERS: EnvelopeSticker[] = [
  { src: '/share/sealed-smiley.png', x: 253.8, y: -43, w: 70.5, h: 71.4 },
  { src: '/share/sealed-sparkleBlue.png', x: 21.2, y: -31.2, w: 49.6, h: 49.6 },
  { src: '/share/sealed-cd.png', x: 247.2, y: 74, w: 68.7, h: 71.5 },
  { src: '/share/sealed-heart.png', x: -11.7, y: 214, w: 63.2, h: 64.4 },
  { src: '/share/sealed-play.png', x: 250.5, y: 213.3, w: 65.2, h: 59.9 },
]

// Opened screen: render bounds on the 390-wide frame
const OPENED_STICKERS: EnvelopeSticker[] = [
  { src: '/share/opened-sparkleBlue.png', x: 34.8, y: 99.6, w: 42.5, h: 42.5 },
  { src: '/share/opened-heart.png', x: 317.9, y: 118.9, w: 57.9, h: 59 },
  { src: '/share/opened-smiley.png', x: 313.6, y: 627.6, w: 70.7, h: 70.7 },
]

const i = (n: number) => ({ '--i': n }) as React.CSSProperties

export default function ReceivedPostcard({ data }: { data: StoryData }) {
  const [opened, setOpened] = useState(false)
  const read = useCallback(() => setOpened(true), [])

  if (!opened) {
    return (
      <Envelope
        data={data}
        onRead={read}
        kicker="Someone sent you"
        stickers={ENVELOPE_STICKERS}
        headerStickers={HEADER_STICKERS}
        soundtrack={false}
        footer={
          data.genZ && (
            <span className="share-tag mt-8 flex h-[34px] -rotate-4 items-center gap-2 rounded-full border-[3px] border-white bg-[#c6f432] px-3 text-[12px] font-medium text-[#18181b] shadow-[0_6px_12px_rgba(0,0,0,0.18)]">
              <span className="flex items-center gap-1 font-mono">
                NEW
                <svg viewBox="0 0 16 12" fill="none" className="w-3" aria-hidden="true">
                  <path d="M1.3 6 6 11.3l9.5-9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              a postcard just for you
            </span>
          )
        }
      />
    )
  }

  const story = `/rewind/${data.date}${data.country === 'world' ? '' : `?country=${data.country}`}`

  return (
    <main className="story-enter relative min-h-svh overflow-hidden bg-canvas text-ink">
      {data.genZ && (
        <div aria-hidden="true" className="pointer-events-none absolute top-0 left-1/2 z-10 h-full w-[390px] -translate-x-1/2">
          {OPENED_STICKERS.map((s, n) => (
            <Sticker key={s.src} {...s} delay={500 + n * 80} />
          ))}
        </div>
      )}

      <div className="relative mx-auto flex min-h-svh w-full max-w-[390px] flex-col px-6 pt-16 pb-7">
        <Brand className="self-center" />
        <h1 className="story-in mt-[38px] text-center font-serif text-[32px] leading-[35px] tracking-[-0.01em]" style={i(0)}>
          A day, sent to you
        </h1>

        <Passport data={data} last={['Weekday', data.weekday]} className="mt-[21px]" />

        <div className="story-in mt-auto flex flex-col gap-2.5 pt-[26px]" style={i(6)}>
          <Link
            href={story}
            className="flex h-14 items-center justify-center rounded-full bg-ink text-[16px] font-medium text-canvas transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            Open the full story
          </Link>
          <Link
            href="/?pick=1"
            className="flex h-14 items-center justify-center rounded-full border-[1.5px] border-ink text-[16px] font-medium transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            Find your own day
          </Link>
        </div>
      </div>
    </main>
  )
}
