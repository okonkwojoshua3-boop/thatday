import { getDateParts } from '@/lib/utils/date'
import { getFrontPage, splitHeadline } from '@/lib/data/events'
import { hasBirthdayTwins } from '@/lib/data/people'
import { getSongForYear } from '@/lib/data/songs'
import { getThenVsNow, usPostageCents } from '@/lib/data/costs'
import { encodeCardId } from '@/lib/utils/cardId'
import { getCountry, type CountryCode } from '@/lib/countries'
import type { StoryData } from '@/components/results/types'

// Everything a postcard story shows, gathered on the server. Shared by the
// results page and the share page so a friend sees exactly what was sent.

const DAY_MS = 86_400_000

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

/** `date` must already be a valid YYYY-MM-DD */
export async function buildStory(date: string, country: CountryCode): Promise<StoryData> {
  const { year, month, day } = getDateParts(date)
  const then = new Date(year, month - 1, day)
  const today = new Date()
  const isBirthday = today.getMonth() + 1 === month && today.getDate() === day

  const [front, twins, song] = await Promise.all([
    getFrontPage(month, day, year, country),
    hasBirthdayTwins(month, day, country),
    getSongForYear(year, country, date),
  ])

  const usStamps = country === 'world' || country === 'us'
  const lead = front && splitHeadline(front.lead.title)

  return {
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
    song: song && { title: song.title, artist: song.artist, chart: song.chart, year: song.year, basis: song.basis, previewUrl: song.previewUrl },
    front: front && lead && {
      headline: lead.headline,
      summary: lead.deck ?? front.lead.summary,
      photo: front.lead.thumbnail,
      year: front.lead.year,
      sameYear: front.sameYear,
      more: front.more.map(e => ({ headline: splitHeadline(e.title).headline, year: e.year })),
    },
    prices: getThenVsNow(year, country, date),
    stampValue: usStamps ? `${usPostageCents(year)}¢` : null,
    twins,
    issued: today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    cardId: encodeCardId(date, isBirthday, country),
  }
}

