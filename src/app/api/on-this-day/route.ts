import type { NextRequest } from 'next/server'
import { getDayHighlights } from '@/lib/data/events'
import { getChartEntry } from '@/lib/data/songs'
import { getThenVsNow } from '@/lib/data/costs'
import { isCountryCode } from '@/lib/countries'

// Figma 13 — "On this day" for returning visitors: today's date across a few years.
// The client sends its own month/day so the visitor's time zone decides "today".

export interface DayYear {
  year: number
  headline: string
  song: string | null
  price: string | null
}

function shortLabel(label: string) {
  const word = label.split(' ').at(-1) ?? label
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function money(value: number, symbol: string, cents?: boolean) {
  if (cents || (symbol === '$' && value < 1)) return `${Math.round(value * (cents ? 1 : 100))}¢`
  if (value >= 100) return `${symbol}${Math.round(value).toLocaleString('en-US')}`
  return `${symbol}${value.toFixed(2)}`
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const month = Number(params.get('month'))
  const day = Number(params.get('day'))
  const countryParam = params.get('country')
  const country = isCountryCode(countryParam) ? countryParam : 'world'
  if (!(month >= 1 && month <= 12 && day >= 1 && day <= 31)) {
    return Response.json({ error: 'Pass month and day' }, { status: 400 })
  }

  const highlights = await getDayHighlights(month, day, country)
  const years: DayYear[] = highlights.map(({ year, headline }) => {
    const song = getChartEntry(year, country)
    const { items, currencySymbol } = getThenVsNow(year, country)
    const first = items[0]
    return {
      year,
      headline,
      song: song?.title ?? null,
      price: first ? `${shortLabel(first.label)} ${money(first.then, currencySymbol, first.cents)}` : null,
    }
  })

  return Response.json(
    { years },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  )
}
