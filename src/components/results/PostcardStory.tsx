'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Brand, CloseIcon } from './art'
import { FrontPageCard, PassportCard, PricesCard, SongCard, StampsCard, YearsCard } from './cards'
import Envelope from './Envelope'
import { SHARED_KEY, STAMPS_KEY, usePostcards, useStored, type Postcard } from '@/lib/postcards'
import { countStamps, type StampKey, type Stamps } from './stamps'
import SavedMoment from './SavedMoment'
import type { StoryData } from './types'
import { feel, haptic, play } from '@/lib/feedback'
import { duckSoundtrack, setSection, stopSoundtrack } from '@/lib/soundtrack'
import SoundToggle from '@/components/ui/SoundToggle'

// Figma 12 — Results · Postcard story. Envelope first, then a Spotify-style
// story: tap right for next, left for back, hold to pause.

const CARD_MS = 7000
const HOLD_MS = 220

const CARDS = ['years', 'song', 'front', 'prices', 'stamps', 'passport'] as const

export default function PostcardStory({ data }: { data: StoryData }) {
  const router = useRouter()
  const [opened, setOpened] = useState(false)
  const [index, setIndex] = useState(0)
  const [held, setHeld] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const [shared, setShared] = useStored<string>(SHARED_KEY)
  const [earned, setEarned] = useStored<string>(STAMPS_KEY)
  const { saved, recent, save: savePostcard, restore, markOpened } = usePostcards()
  const [savedMoment, setSavedMoment] = useState(false)
  const isShared = shared.includes(data.date)
  const postcardKey = `${data.date}|${data.country}`
  const savedCard = saved.find(p => p.key === postcardKey)
  const isSaved = !!savedCard

  const has = (key: StampKey) => earned.includes(`${postcardKey}|${key}`)
  const stamps: Stamps = {
    song: has('song'),
    front: has('front'),
    prices: has('prices'),
    saved: isSaved,
    explorer: recent.some(p => p.date !== data.date) || saved.some(p => p.date !== data.date),
    share: isShared,
  }
  const stampCount = countStamps(stamps)
  const earn = useCallback(
    (key: StampKey) => {
      const id = `${postcardKey}|${key}`
      setEarned(prev => (prev.includes(id) ? prev : [...prev, id]))
    },
    [postcardKey, setEarned],
  )

  const snapshot = useCallback(
    (): Postcard => ({
      key: postcardKey,
      date: data.date,
      country: data.country,
      countryName: data.countryName,
      headline: data.front?.headline ?? null,
      song: data.song?.title ?? null,
      photo: data.front?.photo ?? null,
      genZ: data.genZ,
      stamps: stampCount,
      stampValue: data.stampValue,
      cardId: data.cardId,
    }),
    [data, postcardKey, stampCount],
  )

  const last = CARDS.length - 1
  const card = CARDS[index]
  const paused = held || playing

  // Soundtrack: each card adds a layer, the song preview takes over while it
  // plays, and a swoosh marks every card change. It stops when the story closes.
  useEffect(() => setSection(opened ? index : 0), [opened, index])
  useEffect(() => duckSoundtrack(playing), [playing])
  const shown = useRef(index)
  useEffect(() => {
    if (opened && index !== shown.current) play('swish')
    shown.current = index
  }, [opened, index])
  useEffect(() => () => stopSoundtrack(), [])

  // Seeing a card earns its stamp when there's nothing more to do on it
  useEffect(() => {
    if (!opened) return
    if (card === 'prices') earn('prices')
    if (card === 'song' && !data.song?.previewUrl) earn('song')
    if (card === 'front' && !data.front?.more.length) earn('front')
  }, [opened, card, data, earn])

  // Keep the box's copy of this postcard up to date as stamps come in
  useEffect(() => {
    if (savedCard && savedCard.stamps !== stampCount) restore({ ...savedCard, stamps: stampCount })
  }, [savedCard, stampCount, restore])

  const onPlayingChange = useCallback(
    (value: boolean) => {
      setPlaying(value)
      if (value) earn('song')
    },
    [earn],
  )

  const next = useCallback(() => setIndex(n => Math.min(last, n + 1)), [last])
  const prev = useCallback(() => setIndex(n => Math.max(0, n - 1)), [])
  const pickAnother = useCallback(() => router.push('/?pick=1'), [router])
  const read = useCallback(() => {
    setOpened(true)
    markOpened(snapshot())
  }, [markOpened, snapshot])

  function flash(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(t => (t === message ? null : t)), 2200)
  }

  async function send() {
    const url = `${window.location.origin}/card/${data.cardId}`
    const title = `A postcard from ${data.day} ${new Date(data.year, data.month).toLocaleString('en-GB', { month: 'long' })} ${data.year}`
    try {
      if (navigator.share) {
        await navigator.share({ title, text: `${title} — what was playing, the front page, what things cost.`, url })
      } else {
        await navigator.clipboard.writeText(url)
        flash('Link copied')
      }
      if (!isShared) {
        flash(stampCount === 5 ? 'Last stamp collected' : 'Stamp collected')
        feel('thud', 'success')
      }
      setShared(prev => (prev.includes(data.date) ? prev : [...prev, data.date]))
    } catch (e) {
      // Closing the share sheet isn't an error worth showing
      if ((e as Error)?.name !== 'AbortError') flash('Couldn’t share that, try again')
    }
  }

  function save() {
    if (!isSaved) savePostcard({ ...snapshot(), stamps: countStamps({ ...stamps, saved: true }) })
    setSavedMoment(true)
  }

  // Tap zones and hold-to-pause
  const holdTimer = useRef<number | undefined>(undefined)
  const wasHold = useRef(false)
  function onPointerDown(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest('button, a, audio')) return
    wasHold.current = false
    holdTimer.current = window.setTimeout(() => {
      wasHold.current = true
      setHeld(true)
    }, HOLD_MS)
  }
  function onPointerUp() {
    window.clearTimeout(holdTimer.current)
    setHeld(false)
  }
  function onClick(e: React.MouseEvent<HTMLElement>) {
    if ((e.target as HTMLElement).closest('button, a, audio')) return
    if (wasHold.current) return
    const box = e.currentTarget.getBoundingClientRect()
    if (e.clientX - box.left < box.width / 3) {
      if (index > 0) haptic('selection')
      prev()
    } else {
      if (index < last) haptic('selection')
      next()
    }
  }

  useEffect(() => {
    if (!opened) return
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement && e.target.closest('button, a, input')) {
        if (e.key !== 'Escape') return
      }
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'Escape') pickAnother()
      else if (e.key === ' ') {
        e.preventDefault()
        setHeld(h => !h)
      } else return
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [opened, next, prev, pickAnother])

  if (!opened) return <Envelope data={data} onRead={read} />
  if (savedMoment) {
    return (
      <SavedMoment
        current={postcardKey}
        onViewBox={() => router.push('/box')}
        onKeepGoing={() => setSavedMoment(false)}
      />
    )
  }

  return (
    <main
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerUp}
      onClick={onClick}
      className="story-enter min-h-svh bg-canvas text-ink select-none"
    >
      <div className="relative mx-auto flex min-h-svh w-full max-w-[430px] flex-col overflow-hidden px-6 pt-14 pb-14">
        {/* Progress: one bar per card */}
        <div className="flex gap-1" role="progressbar" aria-label="Story" aria-valuemin={1} aria-valuemax={CARDS.length} aria-valuenow={index + 1}>
          {CARDS.map((c, n) => (
            <span key={c} className="h-1 flex-1 overflow-hidden rounded-[2px] bg-ink/12">
              <span
                key={n === index ? `active-${index}` : n}
                onAnimationEnd={n === index && n < last ? next : undefined}
                className={`block h-full origin-left rounded-[2px] bg-ink ${n < index ? '' : n === index ? 'story-bar' : 'scale-x-0'}`}
                style={n === index ? { animationDuration: `${CARD_MS}ms`, animationPlayState: paused ? 'paused' : 'running' } : undefined}
              />
            </span>
          ))}
        </div>

        <div className="mt-[18px] flex items-center justify-between">
          <Brand />
          <div className="flex items-center gap-2">
            <SoundToggle className="size-8" />
            <button
              type="button"
              onClick={pickAnother}
              aria-label="Close and pick another day"
              className="flex size-8 items-center justify-center rounded-full border border-line bg-card transition-transform duration-150 ease-out active:scale-[0.94]"
            >
              <CloseIcon className="size-3" />
            </button>
          </div>
        </div>

        <section key={card} aria-live="polite" className="flex flex-1 flex-col">
          {card === 'years' && <YearsCard data={data} />}
          {card === 'song' && <SongCard data={data} onPlayingChange={onPlayingChange} />}
          {card === 'front' && <FrontPageCard data={data} onMore={() => earn('front')} />}
          {card === 'prices' && <PricesCard data={data} />}
          {card === 'stamps' && <StampsCard data={data} stamps={stamps} />}
          {card === 'passport' && (
            <PassportCard data={data} stamps={stamps} saved={isSaved} onSend={send} onSave={save} onPickAnother={pickAnother} />
          )}
        </section>

        {held && (
          <span className="pointer-events-none absolute top-[88px] left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1 font-mono text-[10px] tracking-[0.08em] text-canvas uppercase">
            Paused
          </span>
        )}
        {toast && (
          <p role="status" className="toast-in pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-[14px] font-medium whitespace-nowrap text-canvas">
            {toast}
          </p>
        )}
      </div>
    </main>
  )
}
