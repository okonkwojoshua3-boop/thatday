import type { LifeStats } from '@/types'

export function computeLifeStats(dateStr: string): LifeStats {
  const from = new Date(dateStr + 'T00:00:00').getTime()
  const now = Date.now()
  const diffMs = Math.max(0, now - from)

  const days = Math.floor(diffMs / 86_400_000)
  const weeks = Math.floor(days / 7)
  const from_date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  const months =
    (today.getFullYear() - from_date.getFullYear()) * 12 +
    (today.getMonth() - from_date.getMonth())
  const years = today.getFullYear() - from_date.getFullYear() -
    (today.getMonth() < from_date.getMonth() ||
      (today.getMonth() === from_date.getMonth() && today.getDate() < from_date.getDate())
      ? 1 : 0)

  return {
    days,
    weeks,
    months: Math.max(0, months),
    years: Math.max(0, years),
    heartbeats: days * 24 * 60 * 80,
    sleepHours: days * 8,
    meals: days * 3,
    sunrises: days,
    breaths: days * 24 * 60 * 15,
  }
}

export function formatStat(value: number): string {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'B'
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M'
  if (value >= 1_000) return new Intl.NumberFormat('en-US').format(value)
  return String(value)
}
