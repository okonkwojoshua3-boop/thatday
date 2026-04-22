import { notFound } from 'next/navigation'
import Link from 'next/link'
import { decodeCardId } from '@/lib/utils/cardId'
import { formatDisplayDate, getDateParts, isValidDate } from '@/lib/utils/date'
import { computeLifeStats } from '@/lib/stats/lifeStats'
import { getSongForYear } from '@/lib/data/songs'
import { getEventsForDate } from '@/lib/data/events'
import { formatStat } from '@/lib/stats/lifeStats'

function Stamp({ year }: { year: number }) {
  return (
    <div className="relative w-20 -rotate-2 shrink-0 select-none">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #c8b89a 3.5px, transparent 3.5px)',
          backgroundSize: '9px 9px',
        }}
      />
      <div className="relative m-[6px] bg-[#fdf6e8] border border-[#c8b89a] flex flex-col items-center justify-center gap-1 py-3 px-2">
        <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
          <circle cx="17" cy="17" r="15.5" stroke="#9b7e5a" strokeWidth="1.5" />
          <line x1="17" y1="4"  x2="17" y2="7.5"  stroke="#9b7e5a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="30" y1="17" x2="26.5" y2="17" stroke="#9b7e5a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="17" y1="30" x2="17" y2="26.5" stroke="#9b7e5a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4"  y1="17" x2="7.5" y2="17"  stroke="#9b7e5a" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="17" y1="17" x2="11"  y2="11"   stroke="#9b7e5a" strokeWidth="1.75" strokeLinecap="round" />
          <line x1="17" y1="17" x2="23"  y2="10"   stroke="#9b7e5a" strokeWidth="1.25" strokeLinecap="round" />
          <circle cx="17" cy="17" r="2" fill="#9b7e5a" />
        </svg>
        <span className="text-[7px] font-bold tracking-[0.2em] text-[#9b7e5a] uppercase leading-none">Forever</span>
        <span className="text-[10px] font-bold text-[#6b4f2e] tabular-nums leading-none">{year}</span>
      </div>
    </div>
  )
}

function Postmark({ date }: { date: string }) {
  const [y, m, d] = date.split('-')
  return (
    <svg width="90" height="90" viewBox="0 0 80 80" className="opacity-30 -rotate-12 shrink-0">
      <circle cx="40" cy="40" r="37" fill="none" stroke="#9b7e5a" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="30" fill="none" stroke="#9b7e5a" strokeWidth="0.75" />
      <path d="M12 40 Q18 34 24 40 Q30 46 36 40 Q42 34 48 40 Q54 46 60 40 Q66 34 68 40" fill="none" stroke="#9b7e5a" strokeWidth="1.25" />
      <path d="M12 44 Q18 38 24 44 Q30 50 36 44 Q42 38 48 44 Q54 50 60 44 Q66 38 68 44" fill="none" stroke="#9b7e5a" strokeWidth="1.25" />
      <text x="40" y="31" textAnchor="middle" fontSize="7" fontWeight="700" fill="#9b7e5a" letterSpacing="2">THATDAY</text>
      <text x="40" y="42" textAnchor="middle" fontSize="8.5" fill="#9b7e5a" letterSpacing="1">{m}.{d}.{y}</text>
      <text x="40" y="52" textAnchor="middle" fontSize="6" fill="#9b7e5a" letterSpacing="3">APP</text>
    </svg>
  )
}

export default async function CardPage(props: PageProps<'/card/[id]'>) {
  const { id } = await props.params
  const decoded = decodeCardId(id)
  if (!decoded || !isValidDate(decoded.date)) notFound()

  const { date, isBirthday, country } = decoded
  const { year, month, day } = getDateParts(date)
  const lifeStats = computeLifeStats(date)
  const song = await getSongForYear(year)
  const events = await getEventsForDate(month, day, country)
  const event = events.find((e) => e.year <= year) ?? events[0] ?? null

  const agoText = lifeStats.years > 0
    ? `${lifeStats.years} years and ${lifeStats.months % 12} months ago`
    : `${lifeStats.days} days ago`

  const messageParts: string[] = []
  messageParts.push(`That was ${agoText}.`)
  if (song) messageParts.push(`The #1 song was "${song.title}" by ${song.artist}.`)
  if (event) messageParts.push(`On this day in ${event.year}: ${event.description.split('.')[0]}.`)

  return (
    <main className="min-h-svh bg-background flex flex-col items-center justify-center px-4 py-14">
      <div className="w-full max-w-[400px] flex flex-col gap-5">

        {/* Postcard — tilted -5 degrees */}
        <div
          className="relative rounded-xl border border-[#ddd0b8] overflow-hidden -rotate-[5deg]"
          style={{
            background: '#fdf8ee',
            boxShadow:
              '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.10)',
          }}
        >
          {/* Subtle lined-paper texture */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(transparent, transparent 27px, #e6d9c2 27px, #e6d9c2 28px)',
              backgroundSize: '100% 28px',
              opacity: 0.45,
            }}
          />

          {/* Header bar */}
          <div
            className="relative z-10 flex items-center justify-between px-5 py-2 border-b border-[#ddd0b8]"
            style={{ background: '#f5e8cc' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border border-[#c8b89a] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#c8b89a]" />
              </div>
              <span className="text-[8.5px] font-black tracking-[0.5em] uppercase text-[#9b7e5a]">Post Card</span>
            </div>
            {isBirthday && (
              <span className="text-[9.5px] font-semibold text-[#9b7e5a] tracking-wide">🎉 Birthday Edition</span>
            )}
          </div>

          {/* Stamp — pinned top-right */}
          <div className="absolute top-9 right-4 z-20">
            <Stamp year={year} />
          </div>

          {/* Date hero */}
          <div className="relative z-10 px-5 pt-6 pb-5 pr-28">
            <p className="text-[8px] font-bold tracking-[0.35em] uppercase text-[#b8a07a] mb-1.5">
              Greetings from
            </p>
            <h1 className="text-xl font-bold text-zinc-900 leading-snug tracking-tight">
              {formatDisplayDate(date)}
            </h1>
            <p className="text-[10px] text-[#a08060] mt-1 font-medium tracking-wide">{agoText}</p>
          </div>

          {/* Dashed divider */}
          <div className="relative z-10 mx-5 border-t border-dashed border-[#d4c4a8]" />

          {/* Message body */}
          <div className="relative z-10 px-5 py-5">
            <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-[#b8a07a] mb-3">
              Message
            </p>
            <p className="text-zinc-700 text-[13px] leading-6">
              {messageParts.join(' ')}
            </p>
            <p className="text-zinc-600 text-[13px] leading-6 mt-2">
              Since then, your heart has beaten{' '}
              <span className="font-semibold text-zinc-800">{formatStat(lifeStats.heartbeats)}</span>{' '}
              times, you&apos;ve taken{' '}
              <span className="font-semibold text-zinc-800">{formatStat(lifeStats.breaths)}</span>{' '}
              breaths, and lived{' '}
              <span className="font-semibold text-zinc-800">{formatStat(lifeStats.days)}</span>{' '}
              remarkable days.
            </p>
          </div>

          {/* Address section + postmark */}
          <div className="relative z-10 px-5 pb-6 flex items-end gap-4">
            <Postmark date={date} />
            <div className="flex-1 flex flex-col gap-3 mb-1">
              <div className="border-b border-[#d4c4a8]" />
              <div className="border-b border-[#d4c4a8]" />
              <div className="border-b border-[#d4c4a8]" />
              <p className="text-[9px] text-[#b8a07a] tracking-[0.25em] font-semibold text-right uppercase">
                thatday.app
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2.5 -rotate-[5deg]">
          <Link
            href={`/rewind/${date}${country !== 'world' ? `?country=${country}` : ''}`}
            className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-center text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 transition-all font-medium"
          >
            Full Rewind
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-2xl bg-zinc-900 px-4 py-3 text-sm text-center font-semibold text-white hover:bg-zinc-700 transition-colors"
          >
            Try Your Date
          </Link>
        </div>

      </div>
    </main>
  )
}
