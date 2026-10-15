'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePostcards, useHydrated, type Postcard } from '@/lib/postcards'
import { feel } from '@/lib/feedback'
import PostcardCard, { PostcardPhoto, parts, savedAgo } from './PostcardCard'
import Mixtape from './Mixtape'

// Figma 14 — Postcard box: saved days stacked like a wallet, a timeline by
// decade, the mixtape of their songs, a "recently opened" row and an empty
// state.

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const PITCH = 64 // visible strip of each collapsed card

const storyHref = (p: Postcard) => `/rewind/${p.date}${p.country === 'world' ? '' : `?country=${p.country}`}`

export default function PostcardBox() {
  const router = useRouter()
  const hydrated = useHydrated()
  const { saved, recent, remove, restore } = usePostcards()
  const [view, setView] = useState<'stack' | 'timeline' | 'mixtape'>('stack')
  const [selected, setSelected] = useState<string | null>(null)
  const [toast, setToast] = useState<{ text: string; undo?: Postcard } | null>(null)

  const cards = saved // oldest first; the newest sits in front
  const pulled = cards.find(p => p.key === selected) ?? null
  const unsaved = recent.filter(r => !saved.some(s => s.key === r.key)).slice(0, 4)

  function back() {
    if (pulled) setSelected(null)
    else if (window.history.length > 1) router.back()
    else router.push('/')
  }

  function flash(text: string, undo?: Postcard) {
    setToast({ text, undo })
    window.setTimeout(() => setToast(t => (t?.text === text ? null : t)), 4000)
  }

  async function send(p: Postcard) {
    const url = `${window.location.origin}/card/${p.cardId}`
    try {
      if (navigator.share) await navigator.share({ title: `A postcard from ${p.date}`, url })
      else {
        await navigator.clipboard.writeText(url)
        flash('Link copied')
      }
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') flash('Couldn’t share that, try again')
    }
  }

  function removeCard(p: Postcard) {
    remove(p.key)
    setSelected(null)
    flash('Removed from the box', p)
  }

  // Avoid flashing the empty state before localStorage is read
  if (!hydrated) return <main className="min-h-svh bg-canvas" />

  const years = cards.map(p => parts(p.date).y)
  const summary = cards.length
    ? `${cards.length} ${cards.length === 1 ? 'postcard' : 'postcards'} · ${Math.min(...years)}${cards.length > 1 ? ` → ${Math.max(...years)}` : ''}`
    : null

  return (
    <main className="min-h-svh bg-canvas text-ink">
      <div className="relative mx-auto flex min-h-svh w-full max-w-[430px] flex-col px-6 pt-14 pb-9">
        <div className="flex h-11 items-center justify-between">
          <button
            type="button"
            onClick={back}
            aria-label={pulled ? 'Put the postcard back' : 'Back'}
            className="flex size-10 items-center justify-center rounded-full border border-line bg-card transition-transform duration-150 ease-out active:scale-[0.94]"
          >
            <svg viewBox="0 0 8 14" fill="none" className="h-3.5 w-2" aria-hidden="true">
              <path d="M7 1 1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {cards.length > 0 && !pulled && (
            <div role="radiogroup" aria-label="View" className="flex rounded-full border border-line bg-card p-[5px]">
              {(['stack', 'timeline', 'mixtape'] as const).map(v => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={view === v}
                  onClick={() => setView(v)}
                  className={`h-[34px] rounded-full px-4 text-[14px] font-medium capitalize transition-colors duration-200 ${view === v ? 'bg-ink text-canvas' : 'text-ink-secondary hover:text-ink'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>

        {pulled ? (
          <PulledOut
            p={pulled}
            others={cards.filter(c => c.key !== pulled.key)}
            onPutBack={() => setSelected(null)}
            onSend={() => send(pulled)}
            onRemove={() => removeCard(pulled)}
          />
        ) : (
          <>
            <h1 className="mt-3 font-serif text-[44px] leading-[44px] tracking-[-0.01em]">Postcard box</h1>
            {summary && <p className="mt-1.5 text-[14px] leading-[18px] text-ink-secondary">{summary}</p>}

            {cards.length === 0 ? (
              <Empty />
            ) : view === 'stack' ? (
              <div className="relative mt-9" style={{ height: PITCH * (cards.length - 1) + 216 }}>
                {cards.map((p, n) => (
                  <PostcardCard
                    key={p.key}
                    p={p}
                    open={n === cards.length - 1}
                    onClick={() => {
                      feel('swish', 'light')
                      setSelected(p.key)
                    }}
                    className="stack-card absolute inset-x-0"
                    style={{ top: n * PITCH, animationDelay: `${n * 50}ms` }}
                  />
                ))}
              </div>
            ) : view === 'timeline' ? (
              <Timeline cards={cards} />
            ) : (
              <Mixtape cards={cards} />
            )}

            {unsaved.length > 0 && view === 'stack' && <RecentRow items={unsaved} />}

            {cards.length > 0 && view !== 'mixtape' && (
              <>
                <span className="min-h-8 flex-1" />
                <Link
                  href="/?pick=1"
                  className="flex h-14 shrink-0 items-center justify-center rounded-full bg-ink text-[16px] font-medium text-canvas transition-transform duration-150 ease-out active:scale-[0.97]"
                >
                  Rewind a new day
                </Link>
              </>
            )}
          </>
        )}

        {toast && (
          <p role="status" className="toast-in absolute bottom-28 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-ink py-2 pr-2 pl-4 text-[14px] font-medium whitespace-nowrap text-canvas">
            {toast.text}
            {toast.undo ? (
              <button
                type="button"
                onClick={() => {
                  restore(toast.undo!)
                  setToast(null)
                }}
                className="rounded-full bg-canvas/15 px-3 py-1"
              >
                Undo
              </button>
            ) : (
              <span className="pr-2" />
            )}
          </p>
        )}
      </div>
    </main>
  )
}

// ── Pulled out ────────────────────────────────────────────────────────────────

function PulledOut({
  p,
  others,
  onPutBack,
  onSend,
  onRemove,
}: {
  p: Postcard
  others: Postcard[]
  onPutBack: () => void
  onSend: () => void
  onRemove: () => void
}) {
  const saved = savedAgo(p.savedAt)
  return (
    <>
      <div className="card-lift mt-10">
        <PostcardCard p={p} />
      </div>
      <p className="mt-4 text-center font-mono text-[10px] leading-[13px] font-medium tracking-[0.06em] text-ink-muted uppercase">
        {saved} · Stamps {p.stamps} of 6
      </p>
      <div className="story-in mt-7 flex flex-col gap-2.5" style={{ '--i': 2 } as React.CSSProperties}>
        <Link
          href={storyHref(p)}
          className="flex h-[52px] items-center justify-center rounded-full bg-ink text-[16px] font-medium text-canvas transition-transform duration-150 ease-out active:scale-[0.97]"
        >
          Open the story
        </Link>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onSend}
            className="h-[52px] flex-1 rounded-full border-[1.5px] border-ink text-[16px] font-medium transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            Send
          </button>
          <a
            href={`/card/${p.cardId}/image`}
            download={`thatday-${p.date}.png`}
            className="flex h-[52px] flex-1 items-center justify-center rounded-full border-[1.5px] border-ink text-[16px] font-medium transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            Save image
          </a>
        </div>
        <button type="button" onClick={onRemove} className="mt-2.5 text-[14px] leading-[18px] text-ink-secondary hover:text-ink">
          Remove from box
        </button>
      </div>

      {others.length > 0 && (
        <button
          type="button"
          onClick={onPutBack}
          className="mt-auto -mb-9 flex flex-col items-center pt-10"
          aria-label="Put the postcard back in the stack"
        >
          <span className="text-[12px] leading-4 text-ink-muted">Tap the stack to put it back</span>
          <span className="relative mt-4 block h-[72px] w-full overflow-hidden">
            {others.slice(-2).map((o, n) => (
              <span key={o.key} className="absolute inset-x-0 block" style={{ top: n * 16 }}>
                <PostcardCard p={o} open={false} />
              </span>
            ))}
          </span>
        </button>
      )}
    </>
  )
}

// ── Timeline ──────────────────────────────────────────────────────────────────

const TILTS = ['-rotate-3', 'rotate-2', '-rotate-2', 'rotate-3']

function Timeline({ cards }: { cards: Postcard[] }) {
  const sorted = [...cards].sort((a, b) => a.date.localeCompare(b.date))
  const decades = new Map<number, Postcard[]>()
  for (const p of sorted) {
    const d = Math.floor(parts(p.date).y / 10) * 10
    decades.set(d, [...(decades.get(d) ?? []), p])
  }

  let n = 0
  return (
    <div className="relative mt-[30px] pb-6">
      <span className="absolute top-0 bottom-0 left-3 w-0.5 bg-line" />
      {[...decades].map(([decade, items]) => (
        <section key={decade} className="relative mb-10 pl-8 last:mb-0">
          <span className="absolute top-[7px] left-[7px] size-3 rounded-full bg-ink" />
          <h2 className="font-serif text-[20px] leading-[26px] italic">{decade}s</h2>
          <div className="mt-2.5 flex flex-col gap-6">
            {items.map(p => {
              const { y, m, d } = parts(p.date)
              const tilt = TILTS[n++ % TILTS.length]
              return (
                <Link key={p.key} href={storyHref(p)} className="flex items-start gap-[22px]">
                  <span className={`relative block w-28 shrink-0 rounded-[2px] border border-line bg-card p-1.5 pb-0 shadow-[0_6px_12px_rgba(0,0,0,0.10)] ${tilt}`}>
                    <PostcardPhoto p={p} className="h-24 w-full rounded-none" />
                    <span className="block py-2 text-center font-mono text-[10px] leading-[13px] font-medium tracking-[0.04em] text-ink-secondary">
                      {d} {MONTHS[m]} {y}
                    </span>
                    <span className="absolute -top-2 left-[34px] h-4 w-11 -rotate-4 bg-[#ebd9c6]/80" />
                  </span>
                  <span className="flex min-w-0 flex-col pt-1">
                    <span className="font-serif text-[22px] leading-[22px]">{p.headline ?? 'A quiet day'}</span>
                    {p.song && <span className="mt-2 truncate text-[12px] leading-4 text-ink-secondary">No.1: {p.song}</span>}
                    <span className="mt-1 text-[12px] leading-4 text-ink-muted">{savedAgo(p.savedAt)}</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

// ── Recently opened ───────────────────────────────────────────────────────────

const RECENT_ICONS = [
  { halftone: '/icons/halftone/headline.png', sticker: '/icons/stickers/newsphone.png' },
  { halftone: '/icons/halftone/song.png', sticker: '/icons/stickers/cd.png' },
  { halftone: '/icons/halftone/price.png', sticker: '/icons/stickers/tag.png' },
]

function RecentRow({ items }: { items: Postcard[] }) {
  return (
    <section className="mt-7">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono text-[10px] leading-[13px] font-medium tracking-[0.08em] text-ink-muted uppercase">Recently opened</h2>
        <span className="text-[12px] leading-4 text-ink-muted">Not saved yet</span>
      </div>
      <div className="mt-2 flex gap-3">
        {items.map((p, n) => {
          const { y, m, d } = parts(p.date)
          const icon = RECENT_ICONS[(n - 1 + RECENT_ICONS.length) % RECENT_ICONS.length]
          return (
            <Link
              key={p.key}
              href={storyHref(p)}
              aria-label={`Open ${d} ${MONTHS[m]} ${y}`}
              className={`relative flex h-24 w-[78px] shrink-0 flex-col items-center rounded-xl border border-line transition-transform duration-150 ease-out active:scale-[0.96] ${n === 0 ? 'bg-card' : 'bg-canvas'} ${TILTS[n % TILTS.length]}`}
            >
              {n === 0 ? (
                <>
                  <span className="mt-3.5 font-mono text-[10px] leading-[13px] font-medium tracking-[0.08em] text-ink-muted">{MONTHS[m]}</span>
                  <span className="font-serif text-[40px] leading-10">{d}</span>
                </>
              ) : p.genZ ? (
                <Image src={icon.sticker} alt="" width={60} height={60} className="mt-3.5 size-[54px] object-contain" />
              ) : (
                <span
                  aria-hidden="true"
                  className="mt-3.5 size-[54px] bg-ink"
                  style={{ mask: `url(${icon.halftone}) center / contain no-repeat`, WebkitMask: `url(${icon.halftone}) center / contain no-repeat` }}
                />
              )}
              <span className="absolute bottom-[11px] font-mono text-[10px] leading-[13px] font-medium tracking-[0.04em] text-ink-secondary">{y}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

// ── Empty ─────────────────────────────────────────────────────────────────────

function EmptyPostcard({ className, children }: { className: string; children?: React.ReactNode }) {
  return (
    <span className={`absolute block h-[164px] w-[260px] rounded-[14px] border-2 border-dashed border-ink-muted ${className}`}>
      <span className="absolute top-3.5 left-[200px] h-[54px] w-11 rounded-[2px] border border-dashed border-ink-muted" />
      <span className="absolute top-24 left-[18px] h-0.5 w-[120px] rounded-[1px] bg-line" />
      <span className="absolute top-28 left-[18px] h-0.5 w-24 rounded-[1px] bg-line" />
      <span className="absolute top-32 left-[18px] h-0.5 w-[72px] rounded-[1px] bg-line" />
      {children}
    </span>
  )
}

function Empty() {
  // Box is client-only, so this is the visitor's own date
  const now = new Date()
  const today = `${now.getDate()} ${now.toLocaleDateString('en-GB', { month: 'long' })}`
  return (
    <div className="flex flex-1 flex-col">
      <div className="relative mx-auto mt-[82px] h-[200px] w-[290px]" aria-hidden="true">
        <EmptyPostcard className="top-0 left-5 -rotate-6 opacity-50" />
        <EmptyPostcard className="top-[30px] left-0 rotate-3">
          <span className="absolute top-[22px] left-[18px] font-serif text-[20px] leading-5 text-ink-muted italic">
            Your first one
            <br />
            goes here
          </span>
        </EmptyPostcard>
      </div>
      <h2 className="mt-[86px] text-center font-serif text-[40px] leading-[52px] tracking-[-0.01em]">No postcards yet</h2>
      <p className="text-center text-[16px] leading-[21px] text-ink-secondary">
        Rewind any day and tap Save.
        <br />
        It’ll be waiting for you here.
      </p>
      <Link
        href="/?pick=1"
        className="mt-auto flex h-14 items-center justify-center rounded-full bg-ink text-[16px] font-medium text-canvas transition-transform duration-150 ease-out active:scale-[0.97]"
      >
        Pick a day
      </Link>
      <Link href="/" className="mt-6 text-center text-[14px] leading-[18px] font-medium text-ink-secondary hover:text-ink">
        or see what happened on {today}
      </Link>
    </div>
  )
}
