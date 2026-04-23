import type { FamousPerson } from '@/types'

interface WikiBirth {
  text: string
  year: number
  pages?: Array<{
    title: string
    thumbnail?: { source?: string }
    content_urls?: { desktop?: { page?: string } }
    description?: string
  }>
}

interface WikiResponse {
  births?: WikiBirth[]
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

// Keywords matched against Wikipedia's short description and birth text
const COUNTRY_KEYWORDS: Record<string, string[]> = {
  us: ['American', 'United States', 'U.S.'],
  gb: ['British', 'English', 'Scottish', 'Welsh', 'Irish', 'Northern Irish', 'UK'],
  ng: ['Nigerian', 'Nigeria', 'Nollywood', 'Afrobeats', 'Afropop', 'Lagos', 'Abuja', 'Yoruba', 'Igbo', 'Hausa', 'Lagosian', 'Warri', 'Enugu', 'Kano'],
  za: ['South African', 'South Africa', 'Afrikaner', 'Zulu', 'Xhosa', 'Cape Town', 'Johannesburg', 'Durban', 'Soweto'],
  br: ['Brazilian', 'Brazil', 'Brasil', 'Rio de Janeiro', 'São Paulo', 'Sao Paulo'],
  in: ['Indian', 'India', 'Bollywood', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Punjabi', 'Gujarati', 'Mumbai', 'Delhi', 'Kolkata', 'Chennai'],
  ca: ['Canadian', 'Canada', 'Quebec', 'Ontario', 'Alberta', 'British Columbia', 'Toronto', 'Vancouver', 'Montreal'],
  au: ['Australian', 'Australia', 'New South Wales', 'Victoria', 'Queensland', 'ANZAC', 'Sydney', 'Melbourne'],
  de: ['German', 'Germany', 'Bavaria', 'Prussia', 'Austrian', 'Berlin', 'Hamburg', 'Munich', 'Frankfurt'],
  fr: ['French', 'France', 'Paris', 'Lyon', 'Marseille', 'Normandy', 'Breton', 'Alsatian'],
  jp: ['Japanese', 'Japan', 'Tokyo', 'Samurai', 'Shogun', 'Edo', 'Osaka', 'Kyoto', 'J-pop', 'anime'],
  ke: ['Kenyan', 'Kenya', 'Nairobi', 'Kikuyu', 'Luo', 'Maasai', 'Mombasa', 'East African'],
  gh: ['Ghanaian', 'Ghana', 'Accra', 'Ashanti', 'Akan', 'Gold Coast', 'Fante', 'Kumasi', 'Highlife'],
}

// Primary search term for supplementary Wikipedia queries
const COUNTRY_SEARCH_TERMS: Record<string, string> = {
  us: 'American', gb: 'British', ng: 'Nigerian', za: 'South African',
  br: 'Brazilian', in: 'Indian', ca: 'Canadian', au: 'Australian',
  de: 'German', fr: 'French', jp: 'Japanese', ke: 'Kenyan', gh: 'Ghanaian',
}

function matchesPerson(description: string | undefined, text: string, keywords: string[]): boolean {
  const haystack = `${description ?? ''} ${text}`.toLowerCase()
  return keywords.some((k) => haystack.includes(k.toLowerCase()))
}

// Supplementary search: queries Wikipedia for "[Country] born [Day] [Month]"
// Used when the primary "On This Day" API returns fewer than 3 country-specific results.
async function searchWikipediaBornOn(month: number, day: number, country: string): Promise<FamousPerson[]> {
  const term = COUNTRY_SEARCH_TERMS[country]
  if (!term) return []

  const monthName = MONTH_NAMES[month - 1]
  const query = `${term} born ${day} ${monthName}`

  try {
    // Step 1: search for page titles matching the query
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=15&format=json&origin=*`
    const searchRes = await fetch(searchUrl, { next: { revalidate: 86400 } })
    if (!searchRes.ok) return []
    const searchData = await searchRes.json()
    const titles: string[] = (searchData.query?.search ?? [])
      .map((r: { title: string }) => r.title)
      .slice(0, 10)
    if (!titles.length) return []

    // Step 2: fetch thumbnail + description for each page in one batch request
    const detailUrl =
      `https://en.wikipedia.org/w/api.php?action=query` +
      `&titles=${titles.map(encodeURIComponent).join('|')}` +
      `&prop=pageimages|description|info&pithumbsize=300&inprop=url` +
      `&format=json&origin=*`
    const detailRes = await fetch(detailUrl, { next: { revalidate: 86400 } })
    if (!detailRes.ok) return []
    const detailData = await detailRes.json()

    const pages = Object.values(detailData.query?.pages ?? {}) as Array<{
      pageid?: number
      title: string
      description?: string
      thumbnail?: { source?: string }
      fullurl?: string
    }>

    const keywords = COUNTRY_KEYWORDS[country] ?? []

    return pages
      .filter((p) => {
        if (!p.pageid || p.pageid < 0) return false
        // Only keep pages whose description/title still matches country keywords
        return matchesPerson(p.description, p.title, keywords)
      })
      .map((p) => ({
        name: p.title.replace(/_/g, ' '),
        profession: p.description ?? 'Notable figure',
        wikiUrl: p.fullurl,
        thumbnail: p.thumbnail?.source,
      }))
  } catch {
    return []
  }
}

export async function getPeopleForDate(
  month: number,
  day: number,
  country = 'world',
): Promise<FamousPerson[]> {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${month}/${day}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ThatDay/1.0 (time-capsule app)' },
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data: WikiResponse = await res.json()

    const all = (data.births ?? []).filter((b) => b.pages?.[0])

    if (country === 'world') {
      return all.slice(0, 6).map((b) => {
        const page = b.pages![0]
        return {
          name: page.title.replace(/_/g, ' '),
          profession: page.description ?? 'Notable figure',
          birthYear: b.year,
          wikiUrl: page.content_urls?.desktop?.page,
          thumbnail: page.thumbnail?.source,
        }
      })
    }

    // Country-specific: filter "On This Day" results by keywords
    const keywords = COUNTRY_KEYWORDS[country] ?? []
    const primary: FamousPerson[] = all
      .filter((b) => matchesPerson(b.pages?.[0]?.description, b.text, keywords))
      .map((b) => {
        const page = b.pages![0]
        return {
          name: page.title.replace(/_/g, ' '),
          profession: page.description ?? 'Notable figure',
          birthYear: b.year,
          wikiUrl: page.content_urls?.desktop?.page,
          thumbnail: page.thumbnail?.source,
        }
      })

    // If fewer than 3 results from the primary source, run a supplementary
    // Wikipedia search which surfaces people not in the curated "On This Day" list
    if (primary.length < 3) {
      const supplementary = await searchWikipediaBornOn(month, day, country)
      const existingNames = new Set(primary.map((p) => p.name.toLowerCase()))
      const merged = [
        ...primary,
        ...supplementary.filter((p) => !existingNames.has(p.name.toLowerCase())),
      ]
      return merged.slice(0, 6)
    }

    return primary.slice(0, 6)
  } catch {
    return []
  }
}
