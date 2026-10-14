import type { HistoricalEvent } from '@/types'
import { getDatedEvents, isLocal, type DayEvent } from './dayEvents'

interface WikiPage {
  title: string
  extract?: string
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

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const COUNTRY_LANG: Record<string, string> = {
  world: 'en', us: 'en', gb: 'en', ng: 'en', za: 'en', br: 'pt',
  in: 'en', ca: 'en', au: 'en', de: 'en', fr: 'en',
  jp: 'en', ke: 'en', gh: 'en',
}

// Primary name used in Wikipedia article titles and search (first entry)
// plus additional keywords for text matching
const COUNTRY_KEYWORDS: Record<string, string[]> = {
  us: [
    'United States', 'American', 'America', 'Congress', 'White House',
    'Washington', 'U.S.', 'NASA', 'New York', 'California', 'Pentagon',
    'Supreme Court', 'Senate', 'House of Representatives', 'President',
  ],
  gb: [
    'Britain', 'British', 'England', 'English', 'Scotland', 'Scottish',
    'Wales', 'Welsh', 'United Kingdom', 'London', 'Parliament', 'Westminster',
    'Royal', 'Crown', 'BBC', 'Prime Minister', 'Buckingham', 'Windsor',
    'Northern Ireland', 'RAF', 'Royal Navy',
  ],
  ng: [
    'Nigeria', 'Nigerian', 'Lagos', 'Abuja', 'Kano', 'Biafra', 'Yoruba',
    'Igbo', 'Hausa', 'Nollywood', 'Niger Delta', 'Boko Haram', 'Olusegun',
    'Obasanjo', 'Abubakar', 'Buhari', 'Tinubu', 'Jonathan', 'Babangida',
    'Abiola', 'Enugu', 'Ibadan', 'Port Harcourt', 'NNPC', 'Biafran',
    'EndSARS', 'Lekki',
  ],
  za: [
    'South Africa', 'South African', 'Johannesburg', 'Cape Town', 'Pretoria',
    'apartheid', 'Mandela', 'Zulu', 'Soweto', 'ANC', 'Mbeki', 'Zuma',
    'Ramaphosa', 'De Klerk', 'Biko', 'Robben Island', 'Botha', 'Afrikaner',
    'Durban', 'Namibia', 'Boer', 'SADF',
  ],
  br: [
    'Brazil', 'Brazilian', 'São Paulo', 'Rio de Janeiro', 'Brasília',
    'Amazon', 'Brasil', 'Lula', 'Bolsonaro', 'Dilma', 'Cardoso', 'Vargas',
    'Petrobras', 'Copa', 'Pelé',
  ],
  in: [
    'India', 'Indian', 'Mumbai', 'Delhi', 'Kolkata', 'Chennai', 'Bangalore',
    'Modi', 'Gandhi', 'Nehru', 'Indira', 'Bollywood', 'BJP', 'Congress',
    'Lok Sabha', 'ISRO', 'Rajya Sabha', 'Hindi', 'Hindustan',
  ],
  ca: [
    'Canada', 'Canadian', 'Toronto', 'Ottawa', 'Montreal', 'Vancouver',
    'Quebec', 'Parliament', 'Trudeau', 'RCMP', 'NHL', 'Alberta', 'Ontario',
    'British Columbia', 'Prairie', 'Confederation',
  ],
  au: [
    'Australia', 'Australian', 'Sydney', 'Melbourne', 'Brisbane', 'Canberra',
    'ANZAC', 'Parliament', 'Labor', 'Liberal', 'Rudd', 'Turnbull', 'Morrison',
    'Albanese', 'New South Wales', 'Victoria', 'Queensland', 'ASIO',
  ],
  de: [
    'Germany', 'German', 'Berlin', 'Munich', 'Hamburg', 'Frankfurt',
    'Bundestag', 'Chancellor', 'Merkel', 'Adenauer', 'Holocaust',
    'Wehrmacht', 'Nazi', 'Reichstag', 'Bundeswehr', 'DDR', 'Weimar',
    'Scholz', 'Schröder', 'Kohl',
  ],
  fr: [
    'France', 'French', 'Paris', 'Macron', 'Hollande', 'Sarkozy',
    'Chirac', 'de Gaulle', 'République', 'Assemblée', 'Résistance',
    'Élysée', 'Lyon', 'Marseille', 'Normandy', 'Vichy', 'Napoleon',
  ],
  jp: [
    'Japan', 'Japanese', 'Tokyo', 'Osaka', 'Kyoto', 'Emperor',
    'Hirohito', 'Akihito', 'Naruhito', 'Hiroshima', 'Nagasaki',
    'Fukushima', 'Toyota', 'Sony', 'Nintendo', 'Shinkansen', 'Meiji',
    'Shogun', 'Samurai', 'Diet', 'LDP',
  ],
  ke: [
    'Kenya', 'Kenyan', 'Nairobi', 'Mombasa', 'Mau Mau', 'Kenyatta',
    'Odinga', 'Kibaki', 'Uhuru', 'Ruto', 'Safaricom', 'Maasai',
    'Kisumu', 'Nakuru', 'Rift Valley',
  ],
  gh: [
    'Ghana', 'Ghanaian', 'Accra', 'Kumasi', 'Nkrumah', 'Rawlings',
    'Mahama', 'Akufo-Addo', 'Ashanti', 'Gold Coast', 'Volta',
    'Tamale', 'Cape Coast', 'ECOWAS',
  ],
}

function matchesCountry(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase()
  return keywords.some((k) => lower.includes(k.toLowerCase()))
}

// First sentence, without cutting at abbreviations like "U.S." or "St."
function firstSentence(text: string): string {
  return /^(.+?[a-z0-9)\]"'”][.!?])(?=\s|$)/.exec(text)?.[1].trim() ?? text.trim()
}

function toHistoricalEvent(e: WikiEvent): HistoricalEvent {
  const title = firstSentence(e.text)
  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    description: e.text,
    year: e.year,
    wikiUrl: e.pages?.[0]?.content_urls?.desktop?.page,
    thumbnail: e.pages?.[0]?.thumbnail?.source,
  }
}

async function fetchPageThumbnails(titles: string[]): Promise<Record<string, string>> {
  if (!titles.length) return {}
  const joined = titles.map((t) => encodeURIComponent(t)).join('|')
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${joined}&prop=pageimages&pithumbsize=400&format=json&formatversion=2`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ThatDay/1.0 (time-capsule app)' },
      cache: 'no-store',
    })
    if (!res.ok) return {}
    const data = await res.json()
    const pages: Array<{ title: string; thumbnail?: { source?: string } }> = data.query?.pages ?? []
    const map: Record<string, string> = {}
    for (const p of pages) {
      if (p.thumbnail?.source) map[p.title] = p.thumbnail.source
    }
    return map
  } catch {
    return {}
  }
}

function cleanSnippet(html: string): string {
  return html
    .replace(/<span[^>]*class="searchmatch"[^>]*>/g, '')
    .replace(/<\/span>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

// Supplement "on this day" with a Wikipedia full-text search for country + date.
// This surfaces articles like "Lekki toll gate shooting" for Nigeria on Oct 20.
async function searchCountryDayEvents(
  month: number,
  day: number,
  countryName: string,
): Promise<HistoricalEvent[]> {
  const monthName = MONTH_NAMES[month - 1]
  // Search for e.g. Nigeria "October 20" across all Wikipedia articles
  const query = encodeURIComponent(`${countryName} "${monthName} ${day}"`)
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&srlimit=8&srprop=snippet&formatversion=2`

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ThatDay/1.0 (time-capsule app)' },
      cache: 'no-store',
    })
    if (!res.ok) return []

    const data = await res.json()
    const results: Array<{ title: string; snippet: string }> = data.query?.search ?? []

    const events: HistoricalEvent[] = []
    for (const r of results) {
      const combinedText = `${r.title} ${r.snippet}`
      const yearMatch = combinedText.match(/\b(1[89]\d{2}|20[0-2]\d)\b/)
      if (!yearMatch) continue

      const year = parseInt(yearMatch[0])
      const description = cleanSnippet(r.snippet)
      if (!description) continue

      events.push({
        title: r.title,
        description,
        year,
        wikiUrl: `https://en.wikipedia.org/wiki/${r.title.replace(/ /g, '_')}`,
      })
    }

    const thumbnails = await fetchPageThumbnails(events.map((e) => e.title))
    return events.map((e) => ({ ...e, thumbnail: thumbnails[e.title] }))
  } catch {
    return []
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
      cache: 'no-store',
    })
    if (!res.ok) return []

    const data: WikiResponse = await res.json()
    const all = (data.events ?? []).filter((e) => e.text && e.year)

    const keywords = country !== 'world' ? (COUNTRY_KEYWORDS[country] ?? []) : []

    if (keywords.length === 0) {
      return all.slice(0, 5).map(toHistoricalEvent)
    }

    const relevant = all.filter((e) => matchesCountry(e.text, keywords))

    // If we already have good country coverage from the feed, return it directly
    if (relevant.length >= 4) {
      return relevant.slice(0, 5).map(toHistoricalEvent)
    }

    // Supplement with a full-text Wikipedia search for this country + date
    const countryName = keywords[0] // e.g. 'Nigeria'
    const searchEvents = await searchCountryDayEvents(month, day, countryName)

    // Deduplicate: skip search results already covered by the feed
    const feedTitles = new Set(relevant.map((e) => e.text.split('.')[0].toLowerCase()))
    const newSearchEvents = searchEvents.filter(
      (s) => !feedTitles.has(s.title.toLowerCase())
    )

    const combined = [
      ...relevant.map(toHistoricalEvent),
      ...newSearchEvents,
    ]

    return combined.slice(0, 5)
  } catch {
    return []
  }
}

export interface FrontPage {
  lead: HistoricalEvent & { summary?: string }
  more: HistoricalEvent[]
  /** Whether the lead happened in the chosen year (otherwise it's "on this day" from another year) */
  sameYear: boolean
}

// Rank same-day events: full sentences over bare article titles, well linked,
// a headline-friendly length, national pages before the world list
function rankDated(events: DayEvent[]): DayEvent[] {
  const score = (e: DayEvent) =>
    (e.text.length >= 40 ? 4 : 0) +
    Math.min(e.links.length, 3) +
    (e.source === 'country' ? 1 : 0) -
    Math.abs(Math.min(e.text.length, 260) - 120) / 80
  return [...events].sort((a, b) => score(b) - score(a))
}

/** Photo and one-line summary from the event's main linked article (not a place or date) */
async function summaryFor(links: string[]): Promise<{ thumbnail?: string; extract?: string; url?: string }> {
  const candidates = links.filter(l => !/^\d{4}$|^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}$/.test(l)).slice(0, 3)
  for (const title of candidates) {
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`, {
        headers: { 'User-Agent': 'ThatDay/1.0 (time-capsule app)' },
        next: { revalidate: 86400 },
      })
      if (!res.ok) continue
      const p: { type?: string; description?: string; extract?: string; thumbnail?: { source?: string }; content_urls?: { desktop?: { page?: string } } } = await res.json()
      if (p.type === 'disambiguation' || /\b(country|city|capital|state|province|continent|town|region|island)\b/i.test(p.description ?? '')) continue
      return { thumbnail: p.thumbnail?.source, extract: p.extract ? firstSentence(p.extract) : undefined, url: p.content_urls?.desktop?.page }
    } catch {}
  }
  return {}
}

function datedToEvent(e: DayEvent, year: number): HistoricalEvent {
  let title = firstSentence(e.text.replace(/\s*See also\b.*$/i, ''))
  title = title.charAt(0).toUpperCase() + title.slice(1)
  return { title: title.length > 200 ? title.slice(0, 197).replace(/\s+\S*$/, '') + '…' : title, description: e.text, year }
}

/**
 * Headlines for the Results "front page", most exact first:
 *  1. the day's curated Wikipedia events from that year (with photos), in the country
 *  2. events dated to that exact day in the country (year / country / timeline pages)
 *  3. for a country with nothing that day, the day's world news
 *  4. otherwise "on this day" from the nearest earlier year (labelled as such)
 */
export async function getFrontPage(
  month: number,
  day: number,
  year: number,
  country = 'world',
): Promise<FrontPage | null> {
  try {
    const lang = COUNTRY_LANG[country] ?? 'en'
    const [feed, dated] = await Promise.all([
      fetch(`https://${lang}.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`, {
        headers: { 'User-Agent': 'ThatDay/1.0 (time-capsule app)' },
        next: { revalidate: 86400 },
      })
        .then((r): Promise<WikiResponse> | WikiResponse => (r.ok ? r.json() : {}))
        .catch((): WikiResponse => ({})),
      getDatedEvents(year, month, day, country),
    ])
    // Modern history only: a 1975 postcard shouldn't lead with 193 AD
    const all = (feed.events ?? []).filter(e => e.text && e.year >= 1900)
    const inCountry = all.filter(e => isLocal(e.text, country))

    // 1. Curated same-year event in the country, with its photo and summary
    const curated = inCountry.filter(e => e.year === year)
    const local = rankDated(dated.local)
    const world = country === 'world' ? [] : rankDated(dated.world)
    const sameDay = [...local, ...world]

    if (curated.length || sameDay.length) {
      if (curated.length) {
        const [lead, ...rest] = curated
        const page = lead.pages?.find(p => p.thumbnail?.source) ?? lead.pages?.[0]
        return {
          lead: { ...toHistoricalEvent(lead), thumbnail: page?.thumbnail?.source, summary: page?.extract ? firstSentence(page.extract) : undefined },
          more: [...rest.map(toHistoricalEvent), ...sameDay.map(e => datedToEvent(e, year))].slice(0, 2),
          sameYear: true,
        }
      }
      // 2 / 3. Dated to this exact day: in the country if anything, else the world
      const pool = local.length ? local : world
      const [lead, ...rest] = pool
      const extra = await summaryFor(lead.links)
      return {
        lead: { ...datedToEvent(lead, year), thumbnail: extra.thumbnail, wikiUrl: extra.url, summary: extra.extract },
        more: rest.slice(0, 2).map(e => datedToEvent(e, year)),
        sameYear: true,
      }
    }

    // 4. Nothing dated to that day: this calendar day in the nearest year,
    // in the country if possible, earlier years before later ones
    const pool = inCountry.length ? inCountry : all
    if (!pool.length) return null
    const distance = (e: WikiEvent) => (e.year <= year ? year - e.year : 1000 + e.year - year)
    const events = [...pool].sort((a, b) => distance(a) - distance(b) || Number(!!b.pages?.[0]?.thumbnail) - Number(!!a.pages?.[0]?.thumbnail))
    const [lead, ...rest] = events
    const page = lead.pages?.find(p => p.thumbnail?.source) ?? lead.pages?.[0]
    return {
      lead: {
        ...toHistoricalEvent(lead),
        thumbnail: page?.thumbnail?.source,
        summary: page?.extract ? firstSentence(page.extract) : undefined,
      },
      more: rest.slice(0, 2).map(toHistoricalEvent),
      sameYear: lead.year === year,
    }
  } catch {
    return null
  }
}

// Wikipedia events often read "Cold War: Fall of the Berlin Wall: East Germany opens…".
// Use the middle part as a newspaper headline and the rest as the deck.
export function splitHeadline(text: string): { headline: string; deck?: string } {
  const parts = text.split(': ')
  if (parts.length < 3) return { headline: text }
  const deck = parts.slice(2).join(': ')
  return { headline: parts[1], deck: deck.charAt(0).toUpperCase() + deck.slice(1) }
}

/**
 * Up to `count` events on this calendar day since 1950, one per decade and
 * spread across the decades, for the returning-visitor "On this day" home.
 */
export async function getDayHighlights(
  month: number,
  day: number,
  country = 'world',
  count = 5,
): Promise<{ year: number; headline: string }[]> {
  try {
    const lang = COUNTRY_LANG[country] ?? 'en'
    // "all" includes Wikipedia's curated "selected" events, which make better headlines
    const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/feed/onthisday/all/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`, {
      headers: { 'User-Agent': 'ThatDay/1.0 (time-capsule app)' },
      next: { revalidate: 86400 },
    })
    if (!res.ok) return []
    const data: WikiResponse & { selected?: WikiEvent[] } = await res.json()
    const thisYear = new Date().getFullYear()
    const selected = new Set((data.selected ?? []).map(e => e.text))
    const seen = new Set<string>()
    let events = [...(data.selected ?? []), ...(data.events ?? [])].filter(
      e => e.text && e.year >= 1950 && e.year < thisYear && !seen.has(e.text) && seen.add(e.text),
    )

    if (country !== 'world') {
      const local = events.filter(e => isLocal(e.text, country))
      if (local.length >= 3) events = local
    }

    const headlineOf = (e: WikiEvent) =>
      splitHeadline(firstSentence(e.text).replace(/\s*\((?:pictured|shown|illustrated)[^)]*\)/g, '')).headline.replace(/\.$/, '')

    // Best event per decade: curated, well linked, and short enough for a headline
    const score = (e: WikiEvent) =>
      (selected.has(e.text) ? 6 : 0) + (e.pages?.length ?? 0) * 2 + (e.pages?.some(p => p.thumbnail) ? 1 : 0) - headlineOf(e).length / 40
    const byDecade = new Map<number, WikiEvent>()
    for (const e of events) {
      const decade = Math.floor(e.year / 10) * 10
      const current = byDecade.get(decade)
      if (!current || score(e) > score(current)) byDecade.set(decade, e)
    }

    // Keep the strongest decades, then show them in order
    return [...byDecade.values()]
      .sort((a, b) => score(b) - score(a))
      .slice(0, count)
      .sort((a, b) => a.year - b.year)
      .map(e => ({ year: e.year, headline: headlineOf(e) }))
  } catch {
    return []
  }
}
