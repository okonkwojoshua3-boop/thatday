'use client'

import { useEffect, useEffectEvent, useRef, useState } from 'react'
import Image from 'next/image'
import type { Postcard } from '@/lib/postcards'
import type { MixtapeTrack } from '@/app/api/mixtape/route'
import { getCountry, isCountryCode } from '@/lib/countries'
import { haptic } from '@/lib/feedback'
import { shortDate } from './PostcardCard'

// Postcard box · Mixtape: the song of every saved day on one cassette, oldest
// first. Side A is the print era (before 2000), Side B the Gen Z era. One
// <audio> plays the 30s previews back to back; the first play comes from a tap,
// so phones let the next tracks follow on the same element.

function songSource(t: MixtapeTrack) {
  if (t.basis === 'week') return t.chart
  return t.basis === 'chart' ? `${t.chart}, year-end` : `biggest hit of ${t.year}`
}

function place(country: string) {
  return isCountryCode(country) && country !== 'world' ? ` · ${getCountry(country).name}` : ''
}

function daysLabel(t: MixtapeTrack) {
  const [first] = t.days
  const more = t.days.length - 1
  return `${shortDate(first.date)}${place(first.country)}${more > 0 ? ` + ${more} more ${more === 1 ? 'day' : 'days'}` : ''}`
}

const isGenZ = (t: MixtapeTrack) => Number(t.days[0].date.slice(0, 4)) >= 2000

const mask = (src: string) => ({ mask: `url(${src}) center / contain no-repeat`, WebkitMask: `url(${src}) center / contain no-repeat` })

export default function Mixtape({ cards }: { cards: Postcard[] }) {
  const query = [...cards]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(p => `${p.date}:${p.country}`)
    .join(',')
  const [result, setResult] = useState<{ query: string; tracks: MixtapeTrack[] | null } | null>(null)

  useEffect(() => {
    let live = true
    fetch(`/api/mixtape?days=${encodeURIComponent(query)}`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then((d: { tracks: MixtapeTrack[] }) => live && setResult({ query, tracks: d.tracks }))
      .catch(() => live && setResult({ query, tracks: null }))
    return () => {
      live = false
    }
  }, [query])

  const loading = result?.query !== query
  const tracks = loading ? [] : (result?.tracks ?? [])

  const audio = useRef<HTMLAudioElement>(null)
  const [current, setCurrent] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const track = current === null ? null : tracks[current]

  function playAt(n: number) {
    const t = tracks[n]
    const a = audio.current
    if (!t?.previewUrl || !a) return
    if (n !== current) {
      a.src = t.previewUrl
      setProgress(0)
    }
    setCurrent(n)
    a.play().catch(() => setPlaying(false))
  }

  function playFrom(n: number) {
    const next = tracks.findIndex((t, i) => i >= n && t.previewUrl)
    if (next >= 0) playAt(next)
    else {
      setPlaying(false)
      setCurrent(null)
      setProgress(0)
    }
  }

  function toggle() {
    haptic('selection')
    const a = audio.current
    if (!a) return
    if (current === null) playFrom(0)
    else if (a.paused) a.play().catch(() => setPlaying(false))
    else a.pause()
  }

  function next() {
    playFrom((current ?? -1) + 1)
  }
  function prev() {
    const before = tracks.findLastIndex((t, i) => i < (current ?? 0) && t.previewUrl)
    playAt(before >= 0 ? before : (current ?? 0))
  }

  // Lock screen and headphone controls
  const onNext = useEffectEvent(next)
  const onPrev = useEffectEvent(prev)
  useEffect(() => {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = track
      ? new MediaMetadata({
          title: track.title,
          artist: track.artist,
          album: `ThatDay mixtape · ${track.year}`,
          artwork: track.albumArt ? [{ src: track.albumArt, sizes: '600x600', type: 'image/jpeg' }] : [],
        })
      : null
    navigator.mediaSession.setActionHandler('nexttrack', () => onNext())
    navigator.mediaSession.setActionHandler('previoustrack', () => onPrev())
    return () => {
      navigator.mediaSession.setActionHandler('nexttrack', null)
      navigator.mediaSession.setActionHandler('previoustrack', null)
    }
  }, [track])

  // Leaving the mixtape stops the tape
  useEffect(() => {
    const a = audio.current
    return () => a?.pause()
  }, [])

  const playable = tracks.filter(t => t.previewUrl).length
  const sideA = tracks.filter(t => !isGenZ(t))
  const sideB = tracks.filter(isGenZ)
  const years = tracks.map(t => t.year)
  const range = tracks.length ? `${Math.min(...years)}${tracks.length > 1 ? ` → ${Math.max(...years)}` : ''}` : ''
  const side = track ? (isGenZ(track) ? 'B' : 'A') : sideA.length ? 'A' : 'B'

  return (
    <div className="flex flex-1 flex-col">
      <audio
        ref={audio}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={next}
        onTimeUpdate={e => {
          const a = e.currentTarget
          if (a.duration) setProgress(a.currentTime / a.duration)
        }}
      />

      <Cassette side={side} range={range} playing={playing} stickers={sideB.length > 0} />

      {loading ? (
        <div className="mt-9 flex flex-col gap-4" aria-busy="true" aria-label="Loading your mixtape">
          {[0, 1, 2].map(n => (
            <span key={n} className="flex items-center gap-3.5">
              <span className="size-12 rounded-[4px] bg-line" />
              <span className="flex flex-1 flex-col gap-2">
                <span className="h-4 w-2/3 rounded-full bg-line" />
                <span className="h-3 w-1/3 rounded-full bg-line" />
              </span>
            </span>
          ))}
        </div>
      ) : tracks.length === 0 ? (
        <p className="mt-9 text-center text-[16px] leading-[21px] text-ink-secondary">
          {result?.tracks ? 'No songs on record for these days yet.' : 'Couldn’t load the tape. Try again in a moment.'}
        </p>
      ) : (
        <>
          <div className="mt-7 flex items-center justify-between">
            <p className="text-[14px] leading-[18px] text-ink-secondary">
              {tracks.length} {tracks.length === 1 ? 'song' : 'songs'}
              {playable > 0 && ` · ${Math.ceil(playable / 2)} min of previews`}
            </p>
            {playable > 0 && (
              <button
                type="button"
                onClick={toggle}
                className="flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium text-canvas transition-transform duration-150 ease-out active:scale-[0.97]"
              >
                <PlayIcon playing={playing} />
                {playing ? 'Pause' : current === null ? 'Play all' : 'Play'}
              </button>
            )}
          </div>

          {[
            { name: 'A', items: sideA, era: 'Before 2000' },
            { name: 'B', items: sideB, era: '2000 on' },
          ].map(
            s =>
              s.items.length > 0 && (
                <section key={s.name} className="mt-8">
                  <h2 className="flex items-baseline justify-between font-mono text-[10px] leading-[13px] font-medium tracking-[0.08em] text-ink-muted uppercase">
                    <span>Side {s.name}</span>
                    <span>{s.era}</span>
                  </h2>
                  <span className="mt-2 block border-t-[1.5px] border-dashed border-line" />
                  <ol>
                    {s.items.map(t => {
                      const n = tracks.indexOf(t)
                      return (
                        <TrackRow
                          key={`${t.title}|${t.artist}`}
                          t={t}
                          n={n}
                          active={n === current}
                          playing={n === current && playing}
                          onPlay={() => {
                            haptic('selection')
                            if (n === current) toggle()
                            else playAt(n)
                          }}
                        />
                      )
                    })}
                  </ol>
                </section>
              ),
          )}
          <span className="min-h-8 flex-1" />
        </>
      )}

      {track && (
        <NowPlaying
          t={track}
          playing={playing}
          progress={progress}
          onToggle={toggle}
          onNext={() => {
            haptic('selection')
            next()
          }}
        />
      )}
    </div>
  )
}

// ── Cassette ──────────────────────────────────────────────────────────────────

function Reel({ spinning }: { spinning: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={`reel-spin size-8 ${spinning ? '' : 'paused'}`} aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {[0, 60, 120, 180, 240, 300].map(a => (
        <path key={a} d="M16 9.5v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${a} 16 16)`} />
      ))}
    </svg>
  )
}

function Cassette({ side, range, playing, stickers }: { side: 'A' | 'B'; range: string; playing: boolean; stickers: boolean }) {
  return (
    <div className="relative mx-auto mt-9 w-full max-w-[318px]">
      <div className="story-drop relative h-[196px] -rotate-1 rounded-[14px] border-[1.5px] border-ink bg-card p-3 shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
        {/* Label */}
        <div className="relative h-[124px] rounded-[6px] border border-line bg-canvas px-3 pt-2.5">
          <div className="flex items-baseline justify-between font-mono text-[10px] leading-[13px] font-medium tracking-[0.08em] text-ink-muted uppercase">
            <span>Side {side}</span>
            <span>{range}</span>
          </div>
          <p className="mt-1 truncate font-serif text-[22px] leading-[26px] italic">Songs from my days</p>
          {/* Tape window */}
          <div className="absolute inset-x-0 bottom-3 mx-auto flex h-11 w-[176px] items-center justify-between rounded-full border-[1.5px] border-ink bg-card px-2">
            <Reel spinning={playing} />
            <span className="h-5 flex-1 border-y border-ink-muted/50" />
            <Reel spinning={playing} />
          </div>
        </div>
        {/* Bottom tab with its screws */}
        <svg viewBox="0 0 200 40" className="absolute bottom-0 left-1/2 h-10 w-[200px] -translate-x-1/2 text-ink" aria-hidden="true">
          <path d="M8 40 20 8h160l12 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="56" cy="26" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="144" cy="26" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {/* Corner screws */}
        {['top-0.5 left-0.5', 'top-0.5 right-0.5', 'bottom-0.5 left-0.5', 'bottom-0.5 right-0.5'].map(at => (
          <span key={at} className={`absolute ${at} size-1.5 rounded-full bg-ink-muted`} />
        ))}
      </div>
      {stickers && (
        <>
          <Image src="/icons/stickers/cd.png" alt="" width={64} height={64} className="sticker-drift absolute -right-[18px] -bottom-3 rotate-12" />
          <Image src="/icons/stickers/sparkle-blue.png" alt="" width={44} height={44} className="sticker-drift absolute -top-5 -left-4" style={{ animationDelay: '120ms' }} />
        </>
      )}
    </div>
  )
}

// ── Tracks ────────────────────────────────────────────────────────────────────

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
      <rect x="2" y="1" width="3" height="10" rx="1" fill="currentColor" />
      <rect x="7" y="1" width="3" height="10" rx="1" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
      <path d="M2.5 1.2v9.6L10.8 6z" fill="currentColor" />
    </svg>
  )
}

function Cover({ t, className }: { t: MixtapeTrack; className: string }) {
  const genZ = isGenZ(t)
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-[4px] bg-canvas ${className}`}>
      {t.albumArt ? (
        <Image src={t.albumArt} alt="" fill sizes="48px" className={`object-cover ${genZ ? '' : 'grayscale'}`} />
      ) : genZ ? (
        <Image src="/icons/stickers/cd.png" alt="" width={74} height={74} className="absolute inset-[8%] size-[84%]" />
      ) : (
        <span aria-hidden="true" className="absolute inset-[16%] bg-ink" style={mask('/icons/halftone/song.png')} />
      )}
    </span>
  )
}

function TrackRow({ t, n, active, playing, onPlay }: { t: MixtapeTrack; n: number; active: boolean; playing: boolean; onPlay: () => void }) {
  const disabled = !t.previewUrl
  return (
    <li className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={onPlay}
        disabled={disabled}
        aria-current={active || undefined}
        aria-label={`${playing ? 'Pause' : 'Play'} ${t.title} by ${t.artist}`}
        className="flex w-full items-center gap-3.5 py-3 text-left transition-transform duration-150 ease-out active:scale-[0.98] disabled:active:scale-100"
      >
        <span className="w-6 shrink-0 font-mono text-[12px] leading-4 font-medium text-ink-muted">
          {playing ? <EqBars /> : String(n + 1).padStart(2, '0')}
        </span>
        <Cover t={t} className={`size-12 ${disabled ? 'opacity-50' : ''}`} />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className={`truncate font-serif text-[20px] leading-6 ${disabled ? 'text-ink-muted' : ''}`}>{t.title}</span>
          <span className="truncate text-[12px] leading-4 text-ink-secondary">
            {t.artist} · {t.year}
          </span>
          <span className="truncate text-[12px] leading-4 text-ink-muted">{disabled ? 'No preview' : daysLabel(t)}</span>
        </span>
      </button>
    </li>
  )
}

function EqBars() {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
      {[0, 160, 320].map(d => (
        <span key={d} className="eq-bar h-full w-[3px] rounded-full bg-ink" style={{ animationDelay: `${-d}ms` }} />
      ))}
    </span>
  )
}

// ── Now playing ───────────────────────────────────────────────────────────────

function Arrow() {
  return (
    <svg viewBox="0 0 10 10" className="size-2.5" aria-hidden="true">
      <path d="M2.5 7.5 7.5 2.5M3.5 2.5h4v4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NowPlaying({ t, playing, progress, onToggle, onNext }: { t: MixtapeTrack; playing: boolean; progress: number; onToggle: () => void; onNext: () => void }) {
  const search = encodeURIComponent(`${t.title} ${t.artist}`)
  const links = [
    { name: 'Apple Music', href: t.url ?? `https://music.apple.com/search?term=${search}` },
    { name: 'Spotify', href: `https://open.spotify.com/search/${search}` },
  ]
  return (
    <div className="toast-in sticky bottom-6 z-10 mt-6 rounded-[20px] bg-ink p-3 text-canvas shadow-[0_12px_24px_rgba(0,0,0,0.16)]">
      <div className="flex items-center gap-3">
        <Cover t={t} className="size-11" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[14px] leading-[18px] font-medium">{t.title}</span>
          <span className="truncate text-[12px] leading-4 text-canvas/60">
            {t.artist} · {songSource(t)}
          </span>
        </span>
        <button
          type="button"
          onClick={onToggle}
          aria-label={playing ? 'Pause' : 'Play'}
          className="flex size-10 items-center justify-center rounded-full bg-canvas text-ink transition-transform duration-150 ease-out active:scale-[0.94]"
        >
          <PlayIcon playing={playing} />
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next song"
          className="flex size-10 items-center justify-center rounded-full transition-transform duration-150 ease-out active:scale-[0.94]"
        >
          <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
            <path d="M1.5 1.6v8.8L8 6z" fill="currentColor" />
            <rect x="8.5" y="1.5" width="2" height="9" rx="1" fill="currentColor" />
          </svg>
        </button>
      </div>
      <span className="mt-3 block h-0.5 overflow-hidden rounded-full bg-canvas/20">
        <span className="block h-full origin-left bg-canvas transition-transform duration-300 ease-linear" style={{ transform: `scaleX(${progress})` }} />
      </span>
      <div className="mt-2.5 flex items-center gap-4 px-0.5">
        <span className="text-[12px] leading-4 text-canvas/60">Full song on</span>
        {links.map(l => (
          <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[12px] leading-4 font-medium hover:underline">
            {l.name}
            <Arrow />
          </a>
        ))}
      </div>
    </div>
  )
}
