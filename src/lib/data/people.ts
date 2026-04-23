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

function matchesPerson(description: string | undefined, text: string, keywords: string[]): boolean {
  const haystack = `${description ?? ''} ${text}`.toLowerCase()
  return keywords.some((k) => haystack.includes(k.toLowerCase()))
}

// Fetches all members of the Wikipedia category "DD Month births" (e.g. "21 November births"),
// then batch-fetches descriptions and filters by country keywords.
// This is far more accurate than free-text search, which returns country/demographic articles.
async function searchWikipediaBornOn(month: number, day: number, country: string): Promise<FamousPerson[]> {
  const keywords = COUNTRY_KEYWORDS[country] ?? []
  if (!keywords.length) return []

  const monthName = MONTH_NAMES[month - 1]
  const categoryTitle = `Category:${day} ${monthName} births`

  try {
    // Step 1: list all people in the "DD Month births" Wikipedia category (up to 200)
    const catUrl =
      `https://en.wikipedia.org/w/api.php?action=query&list=categorymembers` +
      `&cmtitle=${encodeURIComponent(categoryTitle)}&cmlimit=200&cmtype=page` +
      `&format=json&origin=*`
    const catRes = await fetch(catUrl, { next: { revalidate: 86400 } })
    if (!catRes.ok) return []
    const catData = await catRes.json()
    const titles: string[] = (catData.query?.categorymembers ?? []).map(
      (m: { title: string }) => m.title,
    )
    if (!titles.length) return []

    // Step 2: batch-fetch thumbnails + descriptions (max 50 titles per request)
    const results: FamousPerson[] = []
    for (let i = 0; i < titles.length && results.length < 12; i += 50) {
      const batch = titles.slice(i, i + 50)
      const detailUrl =
        `https://en.wikipedia.org/w/api.php?action=query` +
        `&titles=${batch.map(encodeURIComponent).join('|')}` +
        `&prop=pageimages|description|info&pithumbsize=300&inprop=url` +
        `&format=json&origin=*`
      const detailRes = await fetch(detailUrl, { next: { revalidate: 86400 } })
      if (!detailRes.ok) continue
      const detailData = await detailRes.json()

      const pages = Object.values(detailData.query?.pages ?? {}) as Array<{
        pageid?: number
        title: string
        description?: string
        thumbnail?: { source?: string }
        fullurl?: string
      }>

      for (const p of pages) {
        if (!p.pageid || p.pageid < 0) continue
        if (!matchesPerson(p.description, p.title, keywords)) continue
        results.push({
          name: p.title.replace(/_/g, ' '),
          profession: p.description ?? 'Notable figure',
          wikiUrl: p.fullurl,
          thumbnail: p.thumbnail?.source,
        })
      }
    }

    return results
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
