'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { PHOTO_CREDITS } from '@/lib/photoCredits'

// "Photo credits" link + sheet: the CC BY-SA photos need their author,
// licence, source and changes shown somewhere the visitor can reach.

const EXIT_MS = 240

/** `first`: the src of the photo on screen, listed at the top */
export default function PhotoCredits({ className = '', first }: { className?: string; first?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={`underline decoration-ink-muted/50 underline-offset-2 transition-colors hover:text-ink ${className}`}
      >
        Photo credits
      </button>
      {/* Portalled: callers sit inside <p> and transformed (animated) parents */}
      {open && createPortal(<CreditsSheet first={first} onClose={() => setOpen(false)} />, document.body)}
    </>
  )
}

function CreditsSheet({ first, onClose }: { first?: string; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  const credits = first
    ? [...PHOTO_CREDITS.filter(c => c.src === first), ...PHOTO_CREDITS.filter(c => c.src !== first)]
    : PHOTO_CREDITS
  const [closing, setClosing] = useState(false)

  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })
  const closingRef = useRef(false)
  const close = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.setTimeout(() => onCloseRef.current(), reduce ? 0 : EXIT_MS)
  }, [])

  // Lock page scroll, focus the close button, Esc closes, focus returns after
  useEffect(() => {
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    const opener = document.activeElement as HTMLElement | null
    panel.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true })
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      root.style.overflow = prevOverflow
      opener?.focus({ preventScroll: true })
    }
  }, [close])

  return (
    <div className="fixed inset-0 z-40 md:flex md:items-center md:justify-center" data-closing={closing || undefined}>
      <div aria-hidden="true" onClick={close} className="sheet-scrim absolute inset-0 bg-black/36" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="credits-title"
        style={{ transformOrigin: 'center' }}
        className="sheet-panel absolute inset-x-0 bottom-0 flex max-h-[calc(100svh-43px)] flex-col rounded-t-[32px] bg-canvas text-left text-ink shadow-[0_-8px_30px_rgba(0,0,0,0.18)] md:relative md:inset-auto md:max-h-[calc(100svh-96px)] md:w-[440px] md:rounded-[28px] md:shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
      >
        <div className="flex shrink-0 items-center justify-between px-6 pt-6 pb-4">
          <h2 id="credits-title" className="font-serif text-[32px] leading-[36px] tracking-[-0.01em]">
            Photo <em className="italic">credits</em>
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-full border border-line bg-card transition-transform duration-150 ease-out active:scale-[0.94]"
          >
            <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="size-3">
              <path d="M0.75 0.75L10.75 10.75M10.75 0.75L0.75 10.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <ul className="flex flex-col gap-5 overflow-y-auto overscroll-contain px-6 pb-[34px] [scrollbar-width:none]">
          {credits.map(c => (
            <li key={c.src} className="flex gap-3.5">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-card">
                <Image src={c.src} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <div className="flex min-w-0 flex-col gap-1 text-[12px] leading-4 text-ink-secondary">
                <p className="text-[14px] leading-[18px] font-medium text-ink">{c.title}</p>
                <p>{c.author}</p>
                <p>
                  {c.licenceUrl ? (
                    <a href={c.licenceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
                      {c.licence}
                    </a>
                  ) : (
                    c.licence
                  )}
                  {' · '}
                  <a href={c.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">
                    Wikimedia Commons
                  </a>
                </p>
                <p className="text-ink-muted">{c.changes}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
