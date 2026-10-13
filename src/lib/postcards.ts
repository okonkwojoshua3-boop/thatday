'use client'

import { useCallback, useSyncExternalStore } from 'react'

// Small localStorage-backed arrays (shared days, saved postcards, recently
// opened days). Empty on the server; every subscriber updates on change.

const listeners = new Set<() => void>()
const cache = new Map<string, unknown[]>()

function read<T>(key: string): T[] {
  if (!cache.has(key)) {
    let value: unknown[] = []
    try {
      const parsed = JSON.parse(localStorage.getItem(key) ?? '[]')
      if (Array.isArray(parsed)) value = parsed
    } catch {}
    cache.set(key, value)
  }
  return cache.get(key) as T[]
}

function write<T>(key: string, next: T[]) {
  cache.set(key, next)
  try {
    localStorage.setItem(key, JSON.stringify(next))
  } catch {}
  listeners.forEach(l => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key) cache.delete(e.key)
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

const EMPTY: never[] = []

export function useStored<T>(key: string) {
  const list = useSyncExternalStore(
    subscribe,
    () => read<T>(key),
    () => EMPTY as T[],
  )
  const update = useCallback((fn: (prev: T[]) => T[]) => write(key, fn(read<T>(key))), [key])
  return [list, update] as const
}

/** True once mounted on the client, so stored lists are real (not the empty server snapshot) */
export function useHydrated() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )
}
const noop = () => () => {}

/** Days the visitor has shared (dates). Earns the sixth stamp. */
export const SHARED_KEY = 'thatday-shared'

// ── Postcards (Figma 14 · Postcard box) ──────────────────────────────────────

/** A snapshot of a day, enough to draw it in the box without refetching */
export interface Postcard {
  key: string // "date|country"
  date: string
  country: string
  countryName: string
  headline: string | null
  song: string | null
  photo: string | null
  genZ: boolean
  stamps: number
  stampValue: string | null
  cardId: string
  savedAt?: number
  openedAt?: number
}

/** Saved postcards, oldest first. Items before v2 were plain "date|country" strings and are dropped. */
export const SAVED_KEY = 'thatday-postcards-v2'
/** Days opened but not necessarily saved, newest first */
export const RECENT_KEY = 'thatday-recent'

const RECENT_MAX = 8

export function usePostcards() {
  const [saved, setSaved] = useStored<Postcard>(SAVED_KEY)
  const [recent, setRecent] = useStored<Postcard>(RECENT_KEY)

  const save = useCallback(
    (p: Postcard) => setSaved(prev => [...prev.filter(x => x.key !== p.key), { ...p, savedAt: Date.now() }]),
    [setSaved],
  )
  const remove = useCallback((key: string) => setSaved(prev => prev.filter(x => x.key !== key)), [setSaved])
  const restore = useCallback(
    (p: Postcard) => setSaved(prev => [...prev.filter(x => x.key !== p.key), p].sort((a, b) => (a.savedAt ?? 0) - (b.savedAt ?? 0))),
    [setSaved],
  )
  const markOpened = useCallback(
    (p: Postcard) => setRecent(prev => [{ ...p, openedAt: Date.now() }, ...prev.filter(x => x.key !== p.key)].slice(0, RECENT_MAX)),
    [setRecent],
  )

  return { saved, recent, save, remove, restore, markOpened }
}
