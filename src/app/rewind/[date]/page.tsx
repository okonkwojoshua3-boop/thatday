export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { isValidDate, getDateParts, formatDisplayDate, getMinDate, getMaxDate } from '@/lib/utils/date'
import { computeLifeStats } from '@/lib/stats/lifeStats'
import { getEventsForDate } from '@/lib/data/events'
import { getPeopleForDate } from '@/lib/data/people'
import { getSongForYear } from '@/lib/data/songs'
import { getCostsForYear } from '@/lib/data/costs'
import { encodeCardId } from '@/lib/utils/cardId'
import LifeStatsSection from '@/components/LifeStatsSection'
import SongSection from '@/components/SongSection'
import EventSection from '@/components/EventSection'
import PeopleSection from '@/components/PeopleSection'
import CostsSection from '@/components/CostsSection'
import CopyLinkButton from '@/components/CopyLinkButton'
import { ThatDayLogo } from '@/components/Logo'

const COUNTRY_LABELS: Record<string, string> = {
  world: '🌍 Worldwide',
  us:    '🇺🇸 United States',
  gb:    '🇬🇧 United Kingdom',
  ng:    '🇳🇬 Nigeria',
  za:    '🇿🇦 South Africa',
  br:    '🇧🇷 Brazil',
}

export default async function RewindPage(props: PageProps<'/rewind/[date]'>) {
  const { date } = await props.params
  const searchParams = await (props.searchParams as Promise<Record<string, string>>)
  const country = searchParams?.country ?? 'world'

  if (!isValidDate(date)) notFound()
  if (date < getMinDate() || date > getMaxDate()) redirect('/')

  const { year, month, day } = getDateParts(date)

  const today = new Date()
  const isBirthday = (today.getMonth() + 1) === month && today.getDate() === day

  const [events, people] = await Promise.all([
    getEventsForDate(month, day, country),
    getPeopleForDate(month, day, country),
  ])

  const song = await getSongForYear(year, country)
  const { costs, items: costItems, currencySymbol, currencyCode } = getCostsForYear(year, country)
  const lifeStats = computeLifeStats(date)

  const displayEvents = country !== 'world'
    ? events.slice(0, 5)
    : events.filter((e) => e.year <= year).slice(0, 5)

  const cardId = encodeCardId(date, isBirthday, country)
  const agoLabel = lifeStats.years > 0
    ? `${lifeStats.years} years, ${lifeStats.months % 12} months ago`
    : `${lifeStats.days} days ago`

  return (
    <main className="min-h-svh bg-background px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl flex flex-col gap-12">

        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors"
            >
              <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span>
              Pick another date
            </Link>
            <ThatDayLogo />
          </div>

          {isBirthday && (
            <div className="flex items-center gap-2 rounded-xl bg-zinc-900 text-white px-4 py-2.5 w-fit text-sm font-medium">
              🎉 Happy Birthday!
            </div>
          )}

          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
              {formatDisplayDate(date)}
            </h1>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="inline-block rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-500 font-medium">
                {agoLabel}
              </span>
              {country !== 'world' && (
                <span className="inline-block rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-500 font-medium">
                  {COUNTRY_LABELS[country] ?? country}
                </span>
              )}
            </div>
          </div>
        </header>

        <LifeStatsSection lifeStats={lifeStats} />
        <SongSection song={song} year={year} />
        <EventSection events={displayEvents} country={country} />
        <PeopleSection people={people} country={country} />
        <CostsSection costs={costs} items={costItems} year={year} currencySymbol={currencySymbol} currencyCode={currencyCode} />

        {/* Share section */}
        <div className="rounded-2xl bg-zinc-900 px-6 py-7 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
          <div>
            <p className="text-white font-semibold text-base">Share this moment</p>
            <p className="text-zinc-400 text-sm mt-0.5">Send it to someone who was there.</p>
          </div>
          <div className="flex gap-2.5 shrink-0">
            <Link
              href={`/card/${cardId}`}
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-700 hover:border-zinc-600 transition-all"
            >
              View Share Card
            </Link>
            <CopyLinkButton variant="dark" />
          </div>
        </div>

      </div>
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params
  return {
    title: `${isValidDate(date) ? formatDisplayDate(date) : date} — ThatDay`,
    description: `Discover what happened on ${isValidDate(date) ? formatDisplayDate(date) : date}`,
  }
}
