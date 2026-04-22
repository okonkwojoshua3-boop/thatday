import Image from 'next/image'
import type { HistoricalEvent } from '@/types'

const COUNTRY_LABELS: Record<string, string> = {
  us: 'United States',
  gb: 'United Kingdom',
  ng: 'Nigeria',
  za: 'South Africa',
  br: 'Brazil',
}

export default function EventSection({ events, country = 'world' }: { events: HistoricalEvent[]; country?: string }) {
  if (!events.length) {
    if (country === 'world') return null
    return (
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">On This Day in History</h2>
        <div className="rounded-2xl border border-zinc-100 bg-white px-6 py-8 text-center shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <p className="text-2xl mb-2">📰</p>
          <p className="text-zinc-500 text-sm">No recorded events from {COUNTRY_LABELS[country] ?? country} found for this date.</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">On This Day in History</h2>
        <span className="text-[11px] text-zinc-300 font-medium">{events.length} events</span>
      </div>

      {/* Horizontal scroll — negative margin lets cards bleed to page edge on mobile */}
      <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {events.map((event, i) => (
          <article
            key={i}
            className="snap-start shrink-0 w-[260px] sm:w-[280px] rounded-2xl border border-zinc-100 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col"
          >
            {/* Image */}
            <div className="relative w-full h-40 bg-zinc-100 shrink-0">
              {event.thumbnail ? (
                <Image
                  src={event.thumbnail}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                  <span className="text-5xl font-bold text-zinc-300 tabular-nums tracking-tight">
                    {event.year}
                  </span>
                </div>
              )}
              {/* Year badge */}
              <span className="absolute top-3 left-3 rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white tabular-nums">
                {event.year}
              </span>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1 gap-2">
              <p className="text-zinc-900 text-sm font-semibold leading-snug line-clamp-2">
                {event.title}
              </p>
              <p className="text-zinc-500 text-xs leading-relaxed line-clamp-4 flex-1">
                {event.description}
              </p>
              {event.wikiUrl && (
                <a
                  href={event.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  Read more
                  <span className="text-[10px]">↗</span>
                </a>
              )}
            </div>
          </article>
        ))}


      </div>
    </section>
  )
}
