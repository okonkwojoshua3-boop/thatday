import type { LifeStats } from '@/types'
import { formatStat } from '@/lib/stats/lifeStats'

const primary = [
  { key: 'days' as const, label: 'Days', emoji: '📅' },
  { key: 'years' as const, label: 'Years', emoji: '⏳' },
]

const secondary = [
  { key: 'heartbeats' as const, label: 'Heartbeats', emoji: '❤️' },
  { key: 'breaths' as const, label: 'Breaths Taken', emoji: '💨' },
  { key: 'sleepHours' as const, label: 'Hours of Sleep', emoji: '😴' },
  { key: 'meals' as const, label: 'Meals Eaten', emoji: '🍽️' },
  { key: 'weeks' as const, label: 'Weeks', emoji: '📆' },
  { key: 'sunrises' as const, label: 'Sunrises', emoji: '🌅' },
]

export default function LifeStatsSection({ lifeStats }: { lifeStats: LifeStats }) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Since That Day</h2>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {primary.map(({ key, label, emoji }) => (
          <div key={key} className="rounded-2xl border border-zinc-100 bg-white px-6 py-6 flex flex-col gap-1 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <span className="text-xl mb-1">{emoji}</span>
            <span className="text-[2.5rem] font-bold text-zinc-900 tabular-nums leading-none tracking-tight">
              {formatStat(lifeStats[key])}
            </span>
            <span className="text-sm text-zinc-400 mt-1">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {secondary.map(({ key, label, emoji }) => (
          <div key={key} className="rounded-2xl border border-zinc-100 bg-white px-4 py-4 flex flex-col gap-0.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <span className="text-lg mb-1">{emoji}</span>
            <span className="text-xl font-bold text-zinc-800 tabular-nums leading-snug">
              {formatStat(lifeStats[key])}
            </span>
            <span className="text-xs text-zinc-400">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
