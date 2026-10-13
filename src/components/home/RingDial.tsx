'use client'

import { useRef } from 'react'

// Geometry from the Figma "Year dial" ring (244 × 244): a 300° arc open at the
// bottom, one tick per step, longer ticks and labels on the major steps.
const SIZE = 244
const C = SIZE / 2
const R_ARC = 116
const R_TICK = 108
const R_MINOR = 101
const R_MAJOR = 94
const R_LABEL = 78
const START = -150
const SWEEP = 300

function point(deg: number, r: number) {
  const a = (deg * Math.PI) / 180
  return [C + r * Math.sin(a), C - r * Math.cos(a)] as const
}

function arc(from: number, to: number) {
  const [x0, y0] = point(from, R_ARC)
  const [x1, y1] = point(to, R_ARC)
  return `M ${x0} ${y0} A ${R_ARC} ${R_ARC} 0 ${to - from > 180 ? 1 : 0} 1 ${x1} ${y1}`
}

export type RingDialProps = {
  count: number
  value: number
  onChange: (index: number) => void
  onDragStart?: () => void
  onDragEnd?: () => void
  isMajor: (index: number) => boolean
  label: (index: number) => string | null
  /** Accessible name and spoken value for the slider */
  name: string
  valueText: string
  children: React.ReactNode
  className?: string
}

export default function RingDial({
  count,
  value,
  onChange,
  onDragStart,
  onDragEnd,
  isMajor,
  label,
  name,
  valueText,
  children,
  className = '',
}: RingDialProps) {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const last = count - 1
  const angleOf = (i: number) => START + (last ? (SWEEP * i) / last : 0)
  const valueAngle = angleOf(value)

  function indexFromPointer(e: React.PointerEvent) {
    const box = ref.current!.getBoundingClientRect()
    const dx = e.clientX - (box.left + box.width / 2)
    const dy = e.clientY - (box.top + box.height / 2)
    let deg = (Math.atan2(dx, -dy) * 180) / Math.PI
    // The gap at the bottom snaps to whichever end is closer
    if (deg < START) deg = START
    if (deg > START + SWEEP) deg = START + SWEEP
    return Math.round(((deg - START) / SWEEP) * last)
  }

  function onPointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = true
    onDragStart?.()
    const i = indexFromPointer(e)
    if (i !== value) onChange(i)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return
    const i = indexFromPointer(e)
    if (i !== value) onChange(i)
  }

  function endDrag() {
    if (!dragging.current) return
    dragging.current = false
    onDragEnd?.()
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const step = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }[e.key]
    let next: number | undefined
    if (step) next = value + step
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next === undefined) return
    e.preventDefault()
    e.stopPropagation()
    onChange(Math.max(0, Math.min(last, next)))
  }

  const ticks = []
  const labels = []
  for (let i = 0; i < count; i++) {
    const major = isMajor(i)
    const a = angleOf(i)
    if (i !== value) {
      const [x1, y1] = point(a, R_TICK)
      const [x2, y2] = point(a, major ? R_MAJOR : R_MINOR)
      ticks.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          strokeWidth={major ? 2 : 1.25}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className={major ? 'stroke-ink-secondary' : i < value ? 'stroke-ink' : 'stroke-ink-muted'}
        />,
      )
    }
    const text = label(i)
    if (text) {
      const [x, y] = point(a, R_LABEL)
      labels.push(
        <span
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] leading-[13px] font-medium whitespace-nowrap text-ink-muted"
          style={{ left: `${(x / SIZE) * 100}%`, top: `${(y / SIZE) * 100}%` }}
        >
          {text}
        </span>,
      )
    }
  }

  const [hx, hy] = point(valueAngle, R_ARC)

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={name}
      aria-valuemin={0}
      aria-valuemax={last}
      aria-valuenow={value}
      aria-valuetext={valueText}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      className={`relative cursor-grab touch-none rounded-full outline-none select-none focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-offset-8 focus-visible:ring-offset-canvas active:cursor-grabbing ${className}`}
    >
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <path d={arc(START, valueAngle)} className="stroke-ink" strokeWidth={3} strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
        <path d={arc(valueAngle, START + SWEEP)} className="stroke-line" strokeWidth={3} strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
        {ticks}
        <circle
          cx={hx}
          cy={hy}
          r={12.5}
          strokeWidth={2}
          className="fill-card stroke-ink drop-shadow-[0_3px_4px_rgba(0,0,0,0.18)]"
        />
      </svg>
      <div aria-hidden="true">{labels}</div>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}
