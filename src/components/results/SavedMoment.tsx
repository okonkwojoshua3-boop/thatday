'use client'

import PostcardCard, { BoxBadge, parts } from '@/components/box/PostcardCard'
import { usePostcards } from '@/lib/postcards'

// Figma 14 · Saved moment: after "Save" on the passport the postcard drops
// onto a fanned pile and the envelope badge ticks up.

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// Back-to-front fan (Figma: −8°, 0°, +7°), scaled to 0.66
const FAN = [
  { x: 24, y: 34, rot: -8 },
  { x: 37, y: 35, rot: 0 },
  { x: 53, y: 35, rot: 7 },
]

export default function SavedMoment({
  current,
  onViewBox,
  onKeepGoing,
}: {
  current: string
  onViewBox: () => void
  onKeepGoing: () => void
}) {
  const { saved } = usePostcards()
  const mine = saved.find(p => p.key === current)
  const others = saved.filter(p => p.key !== current).slice(-2)
  const pile = mine ? [...others, mine] : others
  const offset = FAN.length - pile.length
  const { y, m, d } = parts(current.split('|')[0])
  const n = saved.length

  return (
    <main className="story-enter flex min-h-svh flex-col bg-canvas text-ink">
      <div className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col px-6 pt-14 pb-8">
        <div className="flex justify-end">
          <BoxBadge count={n} fresh />
        </div>

        <div className="relative mx-auto mt-[116px] h-[220px] w-[300px]" aria-hidden="true">
          {pile.map((p, i) => {
            const f = FAN[i + offset]
            const isNew = p.key === current
            return (
              <div
                key={p.key}
                className="absolute top-0 left-0 w-[342px] origin-top-left"
                style={{ transform: `translate(${f.x}px, ${f.y}px) rotate(${f.rot}deg) scale(0.66)` }}
              >
                <div className={isNew ? 'pile-drop' : ''}>
                  <PostcardCard p={p} className="shadow-[0_10px_24px_rgba(0,0,0,0.12)]" />
                </div>
                {isNew && (
                  <span className="absolute -top-0 -right-8 rotate-7 rounded-full bg-ink px-[15px] py-1.5 text-[18px] leading-6 font-medium text-canvas">
                    Just saved
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <h1 className="story-in mt-[60px] text-center font-serif text-[40px] leading-[52px] tracking-[-0.01em]" style={{ '--i': 3 } as React.CSSProperties}>
          Into the box it goes
        </h1>
        <p className="story-in text-center text-[14px] leading-[18px] text-ink-secondary" style={{ '--i': 4 } as React.CSSProperties}>
          {d} {MONTH_NAMES[m]} {y} is {n === 1 ? 'your first postcard' : `now one of ${n} postcards`}.
          <br />
          Find them any time from the envelope at the top.
        </p>

        <div className="mt-auto flex flex-col gap-2.5 pt-10">
          <button
            type="button"
            onClick={onViewBox}
            className="h-14 rounded-full bg-ink text-[16px] font-medium text-canvas transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            View postcard box
          </button>
          <button
            type="button"
            onClick={onKeepGoing}
            className="h-14 rounded-full border-[1.5px] border-ink text-[16px] font-medium transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            Keep going
          </button>
        </div>
      </div>
    </main>
  )
}
