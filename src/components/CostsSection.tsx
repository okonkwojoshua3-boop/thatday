import type { HistoricalCosts, CostItem } from '@/types'

function formatPrice(value: number, symbol: string): string {
  if (value >= 1000) return `${symbol}${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  if (value >= 100) return `${symbol}${value.toFixed(0)}`
  return `${symbol}${value.toFixed(2)}`
}

export default function CostsSection({
  costs,
  items,
  year,
  currencySymbol = '$',
  currencyCode = 'USD',
}: {
  costs: HistoricalCosts
  items: CostItem[]
  year: number
  currencySymbol?: string
  currencyCode?: string
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          What Things Cost in {year}
        </h2>
        <span className="text-[11px] text-zinc-300 font-medium">{currencyCode}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map(({ key, label, emoji }) => {
          const val = costs[key]
          if (val === undefined) return null
          return (
            <div
              key={key}
              className="rounded-2xl border border-zinc-100 bg-white px-4 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            >
              <p className="text-xl mb-2">{emoji}</p>
              <p className="text-zinc-900 font-bold text-lg tabular-nums leading-none">
                {formatPrice(val, currencySymbol)}
              </p>
              <p className="text-zinc-400 text-xs mt-1">{label}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
