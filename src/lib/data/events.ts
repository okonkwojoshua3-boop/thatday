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

function toHistoricalEvent(e: WikiEvent): HistoricalEvent {
  return {
    title: e.text.split('.')[0].trim(),
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
