export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import { isValidDate, getDateParts, formatDisplayDate, getMinDate, getMaxDate } from '@/lib/utils/date'
import { getFrontPage } from '@/lib/data/events'
import { getPeopleForDate } from '@/lib/data/people'
import { getSongForYear } from '@/lib/data/songs'
import { getThenVsNow, usPostageCents } from '@/lib/data/costs'
import { encodeCardId } from '@/lib/utils/cardId'
import { getCountry, isCountryCode } from '@/lib/countries'
import PostcardStory from '@/components/results/PostcardStory'
import type { StoryData } from '@/components/results/types'

const DAY_MS = 86_400_000

// Wikipedia events often read "Cold War: Fall of the Berlin Wall: East Germany opens…".
// Use the middle part as a newspaper headline and the rest as the deck.
function splitHeadline(text: string): { headline: string; deck?: string } {
  const parts = text.split(': ')
  if (parts.length < 3) return { headline: text }
  const deck = parts.slice(2).join(': ')
  return { headline: parts[1], deck: deck.charAt(0).toUpperCase() + deck.slice(1) }
}

// Whole years, months and days from `from` to `to`
function elapsed(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear()
  let months = to.getMonth() - from.getMonth()
  let days = to.getDate() - from.getDate()
  if (days < 0) {
    months -= 1
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  return { years, months, days }
}

export default async function RewindPage(props: PageProps<'/rewind/[date]'>) {
  const { date } = await props.params
  const searchParams = await (props.searchParams as Promise<Record<string, string>>)
  const country = isCountryCode(searchParams?.country) ? searchParams.country : 'world'

  if (!isValidDate(date)) notFound()
  if (date < getMinDate() || date > getMaxDate()) redirect('/')

  const { year, month, day } = getDateParts(date)
  const then = new Date(year, month - 1, day)
  const today = new Date()
  const isBirthday = today.getMonth() + 1 === month && today.getDate() === day

  const [front, people, song] = await Promise.all([
    getFrontPage(month, day, year, country),
    getPeopleForDate(month, day, country),
    getSongForYear(year, country, date),
  ])

  const usStamps = country === 'world' || country === 'us'
  const lead = front && splitHeadline(front.lead.title)

  const data: StoryData = {
    date,
    year,
    month: month - 1,
    day,
    weekday: then.toLocaleDateString('en-GB', { weekday: 'long' }),
    country,
    countryName: getCountry(country).name,
    genZ: year >= 2000,
    days: Math.round((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(year, month - 1, day)) / DAY_MS),
    yearsAgo: today.getFullYear() - year,
    elapsed: elapsed(then, today),
    thisYear: today.getFullYear(),
    song: song && { title: song.title, artist: song.artist, chart: song.chart, previewUrl: song.previewUrl },
    front: front && lead && {
      headline: lead.headline,
      summary: lead.deck ?? front.lead.summary,
      photo: front.lead.thumbnail,
      year: front.lead.year,
      sameYear: front.sameYear,
      more: front.more.map(e => ({ headline: splitHeadline(e.title).headline, year: e.year })),
    },
    prices: getThenVsNow(year, country),
    stampValue: usStamps ? `${usPostageCents(year)}¢` : null,
    twins: people.length,
    issued: today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    cardId: encodeCardId(date, isBirthday, country),
  }

  return <PostcardStory data={data} />
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params
  return {
    title: `${isValidDate(date) ? formatDisplayDate(date) : date} — ThatDay`,
    description: `Discover what happened on ${isValidDate(date) ? formatDisplayDate(date) : date}`,
  }
}
