'use client'

import { useCallback, useSyncExternalStore } from 'react'

// Tiny localStorage-backed lists (shared days, saved postcards) that render
// as empty on the server and update every subscriber when they change.

const listeners = new Set<() => void>()
const cache = new Map<string, string[]>()

function read(key: string): string[] {
  if (!cache.has(key)) {
    let value: string[] = []
    try {
      const parsed = JSON.parse(localStorage.getItem(key) ?? '[]')
      if (Array.isArray(parsed)) value = parsed.filter(v => typeof v === 'string')
    } catch {}
    cache.set(key, value)
  }
  return cache.get(key)!
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

const EMPTY: string[] = []

export function useStoredList(key: string) {
  const list = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => EMPTY,
  )
  const add = useCallback(
    (item: string) => {
      const next = [...read(key).filter(i => i !== item), item]
      cache.set(key, next)
      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch {}
      listeners.forEach(l => l())
    },
    [key],
  )
  return [list, add] as const
}

/** Days the visitor has shared (earns the sixth stamp) */
export const SHARED_KEY = 'thatday-shared'
/** Postcards kept for the Postcard box (Figma 14). Items are "date|country". */
export const SAVED_KEY = 'thatday-postcards'
