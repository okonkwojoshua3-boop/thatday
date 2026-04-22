import type { HistoricalEvent } from '@/types'

interface WikiPage {
  title: string
  thumbnail?: { source?: string }
  content_urls?: { desktop?: { page?: string } }
}

interface WikiEvent {
  text: string
  year: number
  pages?: WikiPage[]
}

interface WikiResponse {
  events?: WikiEvent[]
}

const COUNTRY_LANG: Record<string, string> = {
  world: 'en', us: 'en', gb: 'en', ng: 'en', za: 'en', br: 'pt',
}

const COUNTRY_KEYWORDS: Record<string, string[]> = {
  us: ['United States', 'American', 'America', 'Congress', 'White House', 'Washington', 'U.S.'],
  gb: ['Britain', 'British', 'England', 'English', 'Scotland', 'Scottish', 'Wales', 'Welsh',
       'United Kingdom', 'London', 'Parliament', 'Westminster', 'Royal', 'Crown', 'BBC'],
  ng: ['Nigeria', 'Nigerian', 'Lagos', 'Abuja', 'Kano', 'Biafra', 'Yoruba', 'Igbo', 'Hausa',
       'Nollywood', 'Niger Delta'],
  za: ['South Africa', 'South African', 'Johannesburg', 'Cape Town', 'Pretoria', 'apartheid',
       'Mandela', 'Zulu', 'Soweto', 'ANC'],
  br: ['Brazil', 'Brazilian', 'São Paulo', 'Rio de Janeiro', 'Brasília', 'Amazon', 'Brasil'],
}

function toHistoricalEvent(e: WikiEvent): HistoricalEvent {
  return {
    title: e.text.split('.')[0].trim(),
    description: e.text,
    year: e.year,
    wikiUrl: e.pages?.[0]?.content_urls?.desktop?.page,
    thumbnail: e.pages?.[0]?.thumbnail?.source,
  }
}

export async function getEventsForDate(
  month: number,
  day: number,
  country = 'world',
): Promise<HistoricalEvent[]> {
  try {
    const lang = COUNTRY_LANG[country] ?? 'en'
    const url = `https://${lang}.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ThatDay/1.0 (time-capsule app)' },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return []

    const data: WikiResponse = await res.json()
    // Use the full pool — Wikipedia returns 40–60 events per date
    const all = (data.events ?? []).filter((e) => e.text && e.year)

    const keywords = country !== 'world' ? (COUNTRY_KEYWORDS[country] ?? []) : []
    if (keywords.length > 0) {
      const relevant = all.filter((e) => keywords.some((k) => e.text.includes(k)))
      const rest     = all.filter((e) => !keywords.some((k) => e.text.includes(k)))
      // Return up to 5 country-relevant events, padding with general ones if needed
      return [...relevant, ...rest].slice(0, 5).map(toHistoricalEvent)
    }

    return all.slice(0, 5).map(toHistoricalEvent)
  } catch {
    return []
  }
}
