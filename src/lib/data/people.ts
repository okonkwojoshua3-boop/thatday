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

// Keywords matched against Wikipedia's short description and birth text
const COUNTRY_KEYWORDS: Record<string, string[]> = {
  us: ['American', 'United States', 'U.S.'],
  gb: ['British', 'English', 'Scottish', 'Welsh', 'Irish', 'Northern Irish', 'UK'],
  ng: ['Nigerian', 'Nigeria', 'Yoruba', 'Igbo', 'Hausa', 'Lagosian'],
  za: ['South African', 'South Africa', 'Afrikaner', 'Zulu', 'Xhosa'],
  br: ['Brazilian', 'Brazil', 'Brasil'],
}

function matchesPerson(description: string | undefined, text: string, keywords: string[]): boolean {
  const haystack = `${description ?? ''} ${text}`.toLowerCase()
  return keywords.some((k) => haystack.includes(k.toLowerCase()))
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

    const keywords = country !== 'world' ? (COUNTRY_KEYWORDS[country] ?? []) : []

    let pool: typeof all
    if (keywords.length > 0) {
      pool = all.filter((b) =>
        matchesPerson(b.pages?.[0]?.description, b.text, keywords)
      )
    } else {
      pool = all
    }

    return pool.slice(0, 6).map((b) => {
      const page = b.pages![0]
      return {
        name: page.title.replace(/_/g, ' '),
        profession: page.description ?? 'Notable figure',
        birthYear: b.year,
        wikiUrl: page.content_urls?.desktop?.page,
        thumbnail: page.thumbnail?.source,
      }
    })
  } catch {
    return []
  }
}
