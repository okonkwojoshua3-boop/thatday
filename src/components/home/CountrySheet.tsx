'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { COUNTRIES, REGIONS, flagSrc, getCountry, type CountryCode } from '@/lib/countries'

// Figma 04 — Country picker. A bottom sheet on phones, a panel under the pill on desktop.

const EXIT_MS = 240
const SWIPE_CLOSE = 100

export default function CountrySheet({
  value,
  suggested,
  onChange,
  onClose,
}: {
  value: CountryCode
  /** The visitor's own country, if we could tell */
  suggested: CountryCode | null
  onChange: (code: CountryCode) => void
  onClose: () => void
}) {
  const panel = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)

  // Stable across renders so the setup effect below runs once
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

  function choose(code: CountryCode) {
    onChange(code)
    close()
  }

  // Lock page scroll, focus the current choice, Esc closes, Tab stays inside
  useEffect(() => {
    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    const opener = document.activeElement as HTMLElement | null
    panel.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus({ preventScroll: true })

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
      if (e.key !== 'Tab' || !panel.current) return
      const items = panel.current.querySelectorAll<HTMLElement>('button')
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      root.style.overflow = prevOverflow
      opener?.focus({ preventScroll: true })
    }
  }, [close])

  // Swipe down on the grabber area to dismiss
  const drag = useRef<{ y: number; dy: number } | null>(null)
  function onDragStart(e: React.PointerEvent) {
    if (window.matchMedia('(min-width: 48rem)').matches) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { y: e.clientY, dy: 0 }
    panel.current!.style.transition = 'none'
  }
  function onDragMove(e: React.PointerEvent) {
    if (!drag.current) return
    const dy = Math.max(0, e.clientY - drag.current.y)
    drag.current.dy = dy
    panel.current!.style.transform = `translateY(${dy}px)`
  }
  function onDragEnd() {
    if (!drag.current) return
    const { dy } = drag.current
    drag.current = null
    const el = panel.current!
    el.style.transition = ''
    el.style.transform = ''
    if (dy > SWIPE_CLOSE) close()
  }

  const suggestion = suggested ?? (value !== 'world' ? value : null)

  return (
    <div className="fixed inset-0 z-40" data-closing={closing || undefined}>
      <div aria-hidden="true" onClick={close} className="sheet-scrim absolute inset-0 bg-black/36" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="country-sheet-title"
        className="sheet-panel absolute inset-x-0 bottom-0 flex max-h-[calc(100svh-43px)] flex-col rounded-t-[32px] bg-canvas text-ink shadow-[0_-8px_30px_rgba(0,0,0,0.18)] md:inset-x-auto md:top-[100px] md:right-16 md:bottom-auto md:max-h-[calc(100svh-132px)] md:w-[390px] md:rounded-[28px] md:shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
      >
        {/* Grabber: swipe target on phones */}
        <div
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
          className="flex shrink-0 cursor-grab touch-none justify-center pt-2.5 pb-3.5 md:cursor-auto md:pb-2"
        >
          <span className="h-1 w-9 rounded-[2px] bg-ink-muted md:hidden" />
        </div>

        <div className="flex flex-col gap-[18px] overflow-y-auto overscroll-contain px-6 [scrollbar-width:none] pb-[34px]">
          <div className="flex flex-col gap-[18px]">
            <h2 id="country-sheet-title" className="font-serif text-[32px] leading-[42px] tracking-[-0.01em]">
              Whose <em className="italic">history</em>?
            </h2>
            <p className="text-[14px] leading-[18px] text-ink-secondary">Charts, headlines and prices change by country.</p>
          </div>

          <div role="radiogroup" aria-labelledby="country-sheet-title" className="flex flex-col gap-[18px]">
            <SectionLabel>Suggested for you</SectionLabel>
            <div className="grid grid-cols-2 gap-2.5">
              {suggestion && (
                <SuggestedCard
                  code={suggestion}
                  hint={suggestion === suggested ? 'Your region' : 'Last picked'}
                  selected={value === suggestion}
                  onClick={() => choose(suggestion)}
                />
              )}
              <SuggestedCard code="world" hint="Global charts" selected={value === 'world'} onClick={() => choose('world')} />
            </div>

            {REGIONS.map(region => (
              <div key={region} className="flex flex-col gap-3">
                <SectionLabel>{region}</SectionLabel>
                <div className="grid grid-cols-4">
                  {COUNTRIES.filter(c => c.region === region).map(c => (
                    <FlagOption key={c.code} code={c.code} name={c.name} selected={value === c.code} onClick={() => choose(c.code)} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[12px] leading-[17px] text-ink-muted">
            Some charts and prices start later than 1950 — we’ll flag any gaps for the year you pick.
          </p>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] leading-[13px] font-medium tracking-[0.1em] text-ink-muted uppercase">{children}</p>
}

function SuggestedCard({
  code,
  hint,
  selected,
  onClick,
}: {
  code: CountryCode
  hint: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex h-[68px] items-center gap-2.5 rounded-[18px] bg-card px-3 text-left border transition-[transform,border-color] duration-150 ease-out active:scale-[0.97] ${selected ? 'border-ink ring-1 ring-ink ring-inset' : 'border-line'}`}
    >
      <span className="relative shrink-0">
        <Flag code={code} className="size-10" />
        {selected && <Check className="absolute -right-1 -bottom-1 size-[18px]" />}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[14px] leading-[18px] font-semibold">{getCountry(code).name}</span>
        <span className="truncate text-[12px] leading-4 text-ink-muted">{hint}</span>
      </span>
    </button>
  )
}

function FlagOption({
  code,
  name,
  selected,
  onClick,
}: {
  code: CountryCode
  name: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5 rounded-2xl pb-1 transition-transform duration-150 ease-out active:scale-[0.94]"
    >
      <span className="relative flex size-[60px] items-center justify-center">
        <span
          aria-hidden="true"
          className={`absolute inset-0 rounded-full border-2 border-ink transition-[opacity,transform] duration-200 ease-out ${selected ? 'opacity-100' : 'scale-90 opacity-0'}`}
        />
        <Flag code={code} className="size-[52px]" />
        {selected && <Check className="absolute right-0 bottom-0 size-[18px]" />}
      </span>
      <span
        className={`px-1 text-center text-[12px] leading-4 ${selected ? 'font-semibold text-ink' : 'font-medium text-ink-secondary group-hover:text-ink'}`}
      >
        {name}
      </span>
    </button>
  )
}

export function Flag({ code, className }: { code: CountryCode; className: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- tiny static SVGs, no optimisation needed
  return <img src={flagSrc(code)} alt="" aria-hidden="true" className={`shrink-0 rounded-full ${className}`} />
}

function Check({ className }: { className: string }) {
  return (
    <span aria-hidden="true" className={`flex items-center justify-center rounded-full border-2 border-canvas bg-ink text-canvas ${className}`}>
      <svg viewBox="0 0 14 14" fill="none" className="size-[70%]">
        <path d="M4 7.2 6 9l4-4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
