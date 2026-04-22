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

// Keywords matched against Wikipedia's short description (e.g. "Nigerian footballer")
const COUNTRY_KEYWORDS: Record<string, string[]> = {
  us: ['American', 'United States'],
  gb: ['British', 'English', 'Scottish', 'Welsh', 'Irish', 'Northern Irish'],
  ng: ['Nigerian', 'Nigeria'],
  za: ['South African', 'South Africa'],
  br: ['Brazilian', 'Brazil'],
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
      next: { revalidate: 86400 },
    })
    if (!res.ok) return []
    const data: WikiResponse = await res.json()

    // Use full pool so filtering has enough to work with
    const all = (data.births ?? []).filter((b) => b.pages?.[0])

    const keywords = country !== 'world' ? (COUNTRY_KEYWORDS[country] ?? []) : []

    let pool: typeof all
    if (keywords.length > 0) {
      const relevant = all.filter((b) =>
        keywords.some((k) =>
          b.pages?.[0]?.description?.includes(k) || b.text?.includes(k)
        )
      )
      const rest = all.filter((b) =>
        !keywords.some((k) =>
          b.pages?.[0]?.description?.includes(k) || b.text?.includes(k)
        )
      )
      pool = [...relevant, ...rest]
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
