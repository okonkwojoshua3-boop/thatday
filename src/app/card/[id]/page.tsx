import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { decodeCardId } from '@/lib/utils/cardId'
import { formatDisplayDate, getDateParts, isValidDate } from '@/lib/utils/date'
import { computeLifeStats } from '@/lib/stats/lifeStats'
import { getSongForYear } from '@/lib/data/songs'
import { getEventsForDate } from '@/lib/data/events'

const PAGE_BG = '#0c0c0e'
const BORDER = 18  // perforated border width in px
const HOLE_R = 7   // perforation hole radius
const HOLE_GAP = 17 // center-to-center spacing

const COUNTRY_FLAGS: Record<string, string> = {
  world: '🌍', us: '🇺🇸', gb: '🇬🇧', ng: '🇳🇬', za: '🇿🇦', br: '🇧🇷',
}
const COUNTRY_NAMES: Record<string, string> = {
  world: 'Worldwide', us: 'United States', gb: 'United Kingdom',
  ng: 'Nigeria', za: 'South Africa', br: 'Brazil',
}

const MONTH_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
const MONTH_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December']

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

  const heroImage = event?.thumbnail ?? song?.albumArt ?? null

  const agoText = lifeStats.years > 0
    ? `${lifeStats.years} yrs, ${lifeStats.months % 12} mo ago`
    : `${lifeStats.days} days ago`

  const dateLabel = `${MONTH_FULL[month - 1].toUpperCase()} ${day}, ${year}`
  const stampDate = `${MONTH_ABBR[month - 1]} ${String(day).padStart(2,'0')} ${year}`

  return (
    <main
      className="min-h-svh flex flex-col items-center justify-center px-4 py-12 gap-6"
      style={{ background: PAGE_BG }}
    >
      {/* ── Stamp ── */}
      <div className="relative w-full max-w-[360px]" style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.7))' }}>

        {/* White stamp body */}
        <div className="relative" style={{ background: '#fff', borderRadius: 3 }}>

          {/* Inner content — overflow-hidden so image doesn't bleed into perf area */}
          <div
            className="overflow-hidden"
            style={{ margin: BORDER, borderRadius: 1 }}
          >
            {/* ── Hero image ── */}
            <div className="relative" style={{ height: 230 }}>
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={event?.title ?? dateLabel}
                  fill
                  className="object-cover"
                  sizes="360px"
                  priority
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(145deg, #1c1c2e 0%, #0f0f1e 100%)' }}
                >
                  <span
                    className="tabular-nums select-none"
                    style={{ fontSize: 80, fontWeight: 900, color: 'rgba(255,255,255,0.07)', letterSpacing: '-0.05em' }}
                  >
                    {year}
                  </span>
                </div>
              )}

              {/* Gradient scrim — bottom */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 40%, rgba(0,0,0,0.55) 100%)' }}
              />

              {/* Top-right: stamp denomination */}
              <div className="absolute top-3 right-3 flex flex-col items-center"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  padding: '4px 8px',
                  borderRadius: 2,
                }}
              >
                <span style={{ fontSize: 7, fontWeight: 800, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase' }}>
                  Forever
                </span>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{year}</span>
              </div>

              {/* Top-left: birthday badge */}
              {isBirthday && (
                <div
                  className="absolute top-3 left-3"
                  style={{
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 20,
                    letterSpacing: '0.04em',
                  }}
                >
                  🎉 Birthday Edition
                </div>
              )}

              {/* Bottom: event title overlay */}
              {event && (
                <div className="absolute bottom-3 left-3 right-12">
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 2 }}>
                    On this day
                  </p>
                  <p style={{ color: '#fff', fontSize: 11, fontWeight: 600, lineHeight: 1.35 }} className="line-clamp-2">
                    {event.title}
                  </p>
                </div>
              )}
            </div>

            {/* ── Label section ── */}
            <div style={{ background: '#fdf8f2', padding: '14px 16px 16px' }}>

              {/* Country + cancellation date */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.3em', color: '#bba888', textTransform: 'uppercase', marginBottom: 3 }}>
                    {COUNTRY_FLAGS[country] ?? '🌍'} {COUNTRY_NAMES[country] ?? country}
                  </p>
                  <h1
                    style={{
                      fontSize: 19,
                      fontWeight: 900,
                      letterSpacing: '0.04em',
                      color: '#111',
                      lineHeight: 1.1,
                      textTransform: 'uppercase',
                    }}
                  >
                    {dateLabel}
                  </h1>
                  <p style={{ fontSize: 10, color: '#9b7e5a', marginTop: 3, fontWeight: 500 }}>{agoText}</p>
                </div>

                {/* Cancellation postmark */}
                <svg width="56" height="56" viewBox="0 0 56 56" className="shrink-0 opacity-25 -rotate-6 mt-0.5">
                  <circle cx="28" cy="28" r="26" fill="none" stroke="#6b4f2e" strokeWidth="1.5" />
                  <circle cx="28" cy="28" r="20" fill="none" stroke="#6b4f2e" strokeWidth="0.75" />
                  <path d="M8 28 Q13 23 18 28 Q23 33 28 28 Q33 23 38 28 Q43 33 48 28" fill="none" stroke="#6b4f2e" strokeWidth="1.2" />
                  <text x="28" y="22" textAnchor="middle" fontSize="5.5" fontWeight="800" fill="#6b4f2e" letterSpacing="2">THATDAY</text>
                  <text x="28" y="30" textAnchor="middle" fontSize="6" fill="#6b4f2e" letterSpacing="0.5">{stampDate}</text>
                  <text x="28" y="38" textAnchor="middle" fontSize="4.5" fill="#6b4f2e" letterSpacing="2.5">APP</text>
                </svg>
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px dashed #ddd0b8', marginBottom: 10 }} />

              {/* Song + stat row */}
              <div className="flex items-center justify-between gap-3">
                {song ? (
                  <div className="flex items-center gap-2 min-w-0">
                    {song.albumArt && (
                      <div className="shrink-0 w-7 h-7 rounded overflow-hidden">
                        <Image src={song.albumArt} alt={song.title} width={28} height={28} className="object-cover" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', color: '#bba888', textTransform: 'uppercase', marginBottom: 1 }}>#1 Song</p>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#2a1f12' }} className="truncate">{song.title}</p>
                      <p style={{ fontSize: 10, color: '#9b7e5a' }} className="truncate">{song.artist}</p>
                    </div>
                  </div>
                ) : <div />}

                <div className="text-right shrink-0">
                  <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', color: '#bba888', textTransform: 'uppercase', marginBottom: 1 }}>Days lived</p>
                  <p style={{ fontSize: 17, fontWeight: 900, color: '#111', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                    {lifeStats.days.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Perforation strips ── */}

          {/* Top */}
          <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: BORDER }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `radial-gradient(circle at 50% 0%, ${PAGE_BG} ${HOLE_R}px, transparent ${HOLE_R}px)`,
              backgroundSize: `${HOLE_GAP}px ${BORDER}px`,
              backgroundRepeat: 'repeat-x',
              backgroundPosition: `${HOLE_GAP / 2}px 0`,
            }} />
          </div>

          {/* Bottom */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: BORDER }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `radial-gradient(circle at 50% 100%, ${PAGE_BG} ${HOLE_R}px, transparent ${HOLE_R}px)`,
              backgroundSize: `${HOLE_GAP}px ${BORDER}px`,
              backgroundRepeat: 'repeat-x',
              backgroundPosition: `${HOLE_GAP / 2}px 0`,
            }} />
          </div>

          {/* Left */}
          <div className="absolute top-0 left-0 bottom-0 pointer-events-none" style={{ width: BORDER }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `radial-gradient(circle at 0% 50%, ${PAGE_BG} ${HOLE_R}px, transparent ${HOLE_R}px)`,
              backgroundSize: `${BORDER}px ${HOLE_GAP}px`,
              backgroundRepeat: 'repeat-y',
              backgroundPosition: `0 ${HOLE_GAP / 2}px`,
            }} />
          </div>

          {/* Right */}
          <div className="absolute top-0 right-0 bottom-0 pointer-events-none" style={{ width: BORDER }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `radial-gradient(circle at 100% 50%, ${PAGE_BG} ${HOLE_R}px, transparent ${HOLE_R}px)`,
              backgroundSize: `${BORDER}px ${HOLE_GAP}px`,
              backgroundRepeat: 'repeat-y',
              backgroundPosition: `0 ${HOLE_GAP / 2}px`,
            }} />
          </div>
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div className="flex gap-3 w-full max-w-[360px]">
        <Link
          href={`/rewind/${date}${country !== 'world' ? `?country=${country}` : ''}`}
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-center text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium"
        >
          Full Rewind
        </Link>
        <Link
          href="/"
          className="flex-1 rounded-2xl bg-white px-4 py-3 text-sm text-center font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
        >
          Try Your Date
        </Link>
      </div>
    </main>
  )
}
