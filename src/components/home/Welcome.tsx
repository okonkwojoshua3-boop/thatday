'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

// Figma 02 — Welcome (photos). Placeholder moments until we pull real ones.
const ARCHES = [
  { src: '/welcome/moon.jpg', year: 1969, alt: 'Buzz Aldrin on the Moon, 1969' },
  { src: '/welcome/ali.jpg', year: 1967, alt: 'Muhammad Ali, 1967' },
  { src: '/welcome/fela.jpg', year: 1986, alt: 'Fela Kuti performing, 1986' },
  { src: '/welcome/mandela.jpg', year: 1994, alt: 'Nelson Mandela, 1994' },
]

const ITEMS = [
  { icon: '/icons/halftone/song.png', label: 'a song,' },
  { icon: '/icons/halftone/headline.png', label: 'a headline,' },
  { icon: '/icons/halftone/price.png', label: 'a price.' },
]

const EPOCH = Date.UTC(1950, 0, 1)

function daysSince1950() {
  const now = new Date()
  return Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - EPOCH) / 86_400_000)
}

export default function Welcome({ onStart }: { onStart: () => void }) {
  // Counted on the visitor's own day, after mount, since the page is prerendered
  const [days, setDays] = useState<number | null>(null)
  useEffect(() => setDays(daysSince1950()), [])

  // Desktop: Enter starts, once the splash is out of the way
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Enter' || e.repeat) return
      if (!document.documentElement.dataset.splash) return
      if (e.target instanceof HTMLElement && e.target.closest('button, a, input, textarea, select')) return
      onStart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onStart])

  return (
    <main className="flex min-h-svh flex-col items-center bg-canvas px-6 pt-[60px] pb-10 text-ink md:justify-center md:py-16 short:py-8">
      <div className="flex w-full max-w-[342px] flex-col items-center gap-6 md:max-w-[640px] md:gap-8 short:gap-6">
        {/* Counter pill */}
        <p
          className="welcome-reveal flex h-[34px] items-center gap-2 rounded-full bg-ink pr-4 pl-3.5 font-mono text-[14px] font-medium text-canvas"
          style={{ '--i': 0 } as React.CSSProperties}
        >
          <StopwatchIcon />
          <span>
            {days === null ? <span className="invisible">00,000</span> : days.toLocaleString('en-US')} days and counting
          </span>
        </p>

        {/* Photo arches */}
        <ul className="flex gap-2.5 md:gap-4" aria-label="Moments from history">
          {ARCHES.map((a, i) => (
            <li
              key={a.year}
              className="welcome-reveal relative h-[132px] w-[74px] overflow-hidden rounded-full border-[3px] border-card shadow-[0_8px_20px_rgba(0,0,0,0.10)] md:h-[172px] md:w-[108px] short:h-[148px] short:w-[92px]"
              style={{ '--i': 1 + i } as React.CSSProperties}
            >
              <Image src={a.src} alt={a.alt} fill sizes="108px" className="object-cover grayscale" priority />
              <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-card px-2 py-[3px] font-mono text-[10px] leading-[13px] font-medium text-ink md:bottom-3.5 md:text-[12px] md:leading-4">
                {a.year}
              </span>
            </li>
          ))}
        </ul>

        {/* Headline + inline line */}
        <div className="flex flex-col items-center gap-2.5 md:gap-3.5">
          <h1
            className="welcome-reveal text-center font-serif text-[44px] leading-none tracking-[-0.01em] md:text-[64px]"
            style={{ '--i': 5 } as React.CSSProperties}
          >
            Every day <br className="md:hidden" />
            leaves <em className="italic">a mark.</em>
          </h1>
          <p
            className="welcome-reveal flex items-center gap-2.5 text-[18px] text-ink-secondary md:text-[20px]"
            style={{ '--i': 6 } as React.CSSProperties}
          >
            {ITEMS.map(item => (
              <span key={item.label} className="flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="size-6 shrink-0 bg-ink md:size-[26px]"
                  style={{ mask: `url(${item.icon}) center / contain no-repeat`, WebkitMask: `url(${item.icon}) center / contain no-repeat` }}
                />
                {item.label}
              </span>
            ))}
          </p>
        </div>

        {/* Story card */}
        <figure
          className="welcome-reveal relative h-[232px] w-full overflow-hidden rounded-3xl shadow-[0_8px_20px_rgba(0,0,0,0.10)] md:h-[240px]"
          style={{ '--i': 7 } as React.CSSProperties}
        >
          <Image
            src="/welcome/berlin.jpg"
            alt="Crowds at the Brandenburg Gate as the Berlin Wall falls, 1989"
            fill
            sizes="(min-width: 768px) 640px, 342px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent from-25% to-black/85" />
          <figcaption className="absolute inset-x-5 bottom-5 flex flex-col gap-1 text-white">
            <span className="font-mono text-[10px] font-medium tracking-[0.08em] text-white/75 uppercase">
              On a day like yours
            </span>
            <span className="font-serif text-[28px] leading-tight md:text-[32px]">9 Nov 1989</span>
            <span className="text-[14px] text-white/85">The Berlin Wall falls. What was playing on the radio?</span>
          </figcaption>
        </figure>
      </div>

      {/* CTA */}
      <div
        className="welcome-reveal mt-auto flex w-full max-w-[342px] flex-col items-center gap-3 pt-10 md:mt-12 md:max-w-[320px] md:pt-0 short:mt-8"
        style={{ '--i': 8 } as React.CSSProperties}
      >
        <button
          type="button"
          onClick={onStart}
          className="flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-ink text-[16px] font-medium text-canvas transition-transform duration-150 ease-out active:scale-[0.97] md:h-14"
        >
          Find your day <span aria-hidden="true">→</span>
        </button>
        <p className="text-[12px] text-ink-muted">
          Any date from 1950 to yesterday.<span className="hidden md:inline"> Press Enter to start.</span>
        </p>
      </div>
    </main>
  )
}

function StopwatchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="8" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 8V5.5M5.5 1.5h3M11 3.5l-0.8 0.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
