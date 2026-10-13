import type { CountryCode } from '@/lib/countries'
import type { PriceComparison } from '@/lib/data/costs'

/** Everything the postcard story needs, gathered on the server */
export interface StoryData {
  date: string
  year: number
  month: number // 0-based
  day: number
  weekday: string
  country: CountryCode
  countryName: string
  /** 2000+ dates use the Gen Z sticker style */
  genZ: boolean
  days: number
  /** Calendar years between then and now (37 for 1989 → 2026) */
  yearsAgo: number
  /** Exact elapsed time, e.g. 36 years, 11 months and 4 days */
  elapsed: { years: number; months: number; days: number }
  thisYear: number
  song: { title: string; artist: string; chart: string; previewUrl?: string } | null
  front: {
    headline: string
    summary?: string
    photo?: string
    year: number
    sameYear: boolean
    more: { headline: string; year: number }[]
  } | null
  prices: { items: PriceComparison[]; currencySymbol: string; local: boolean }
  /** US stamp price for the year (25¢ in 1989), shown on the postage stamps */
  stampValue: string | null
  twins: number
  issued: string
  cardId: string
}
