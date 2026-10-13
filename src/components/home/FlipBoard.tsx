'use client'

import { useState } from 'react'

export type DateUnit = 'day' | 'month' | 'year'

export type BoardGroup = {
  unit: DateUnit
  label: string
  chars: string
  disabled?: boolean
}

// Split-flap board (Figma 03). Each group is a button that hands the dial to that unit.
export default function FlipBoard({
  groups,
  active,
  onSelect,
}: {
  groups: BoardGroup[]
  active: DateUnit
  onSelect: (unit: DateUnit) => void
}) {
  return (
    <div className="flex gap-3.5 md:gap-[22px]" role="group" aria-label="Date">
      {groups.map(g => {
        const isActive = g.unit === active && !g.disabled
        return (
          <button
            key={g.unit}
            type="button"
            disabled={g.disabled}
            aria-pressed={isActive}
            aria-label={`${g.label}: ${g.chars}`}
            onClick={() => onSelect(g.unit)}
            className="group flex flex-col items-center disabled:cursor-default"
          >
            <span
              aria-hidden="true"
              className="flex gap-1 transition-opacity duration-200 group-disabled:opacity-35 md:gap-1.5"
            >
              {[...g.chars].map((ch, i) => (
                <Flap key={i} ch={ch} />
              ))}
            </span>
            <span
              aria-hidden="true"
              className={`mt-2 h-0.5 w-full origin-center rounded-[1px] bg-ink transition-transform duration-200 ease-(--ease-out) ${isActive ? 'scale-x-100' : 'scale-x-0'}`}
            />
            <span
              aria-hidden="true"
              className={`mt-1.5 font-mono text-[10px] leading-[13px] font-medium tracking-[0.1em] transition-colors duration-200 ${isActive ? 'text-ink' : 'text-ink-muted'}`}
            >
              {g.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

const FLAP_SIZES = {
  // Time Machine: 32×48 → 52×76 on desktop
  picker: { box: 'h-12 w-8 rounded-[7px] md:h-[76px] md:w-[52px] md:rounded-[11px]', text: 'text-[28px] md:text-[44px]' },
  // Loading: 32×48 → 48×72 on desktop
  loading: { box: 'h-12 w-8 rounded-[7px] md:h-[72px] md:w-12 md:rounded-[10px]', text: 'text-[28px] md:text-[42px]' },
}

// One flap. When the character changes, the old top half falls away over the new one.
export function Flap({ ch, size = 'picker' }: { ch: string; size?: keyof typeof FLAP_SIZES }) {
  const { box, text } = FLAP_SIZES[size]
  const [shown, setShown] = useState(ch)
  const [prev, setPrev] = useState<string | null>(null)
  const [flip, setFlip] = useState(0)

  // Derived state: capture the outgoing character during render
  if (ch !== shown) {
    setPrev(shown)
    setShown(ch)
    setFlip(f => f + 1)
  }

  return (
    <span className={`relative block bg-card shadow-[0_3px_6px_rgba(0,0,0,0.10)] perspective-[300px] ${box}`}>
      <span className="absolute inset-x-0 bottom-0 h-1/2 rounded-b-[inherit] bg-canvas/70" />
      <FlapChar ch={shown} className={text} />
      <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
      {prev !== null && (
        <span
          key={flip}
          onAnimationEnd={() => setPrev(null)}
          className="flap-fall absolute inset-x-0 top-0 h-1/2 overflow-hidden rounded-t-[inherit] bg-card"
        >
          <span className="absolute inset-x-0 top-0 h-[200%]">
            <FlapChar ch={prev} className={text} />
          </span>
        </span>
      )}
    </span>
  )
}

function FlapChar({ ch, className }: { ch: string; className: string }) {
  return (
    <span className={`absolute inset-0 flex items-center justify-center font-semibold tracking-[-0.02em] text-ink tabular-nums ${className}`}>
      {ch}
    </span>
  )
}
