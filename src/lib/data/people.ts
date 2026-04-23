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

// Wikidata entity IDs for each supported country
const WIKIDATA_COUNTRY_QID: Record<string, string> = {
  us: 'Q30',
  gb: 'Q145',
  ng: 'Q1033',
  za: 'Q258',
  br: 'Q155',
  in: 'Q668',
  ca: 'Q16',
  au: 'Q408',
  de: 'Q183',
  fr: 'Q142',
  jp: 'Q17',
  ke: 'Q114',
  gh: 'Q117',
}

// Keywords used to filter the primary Wikipedia "On This Day" API results
const COUNTRY_KEYWORDS: Record<string, string[]> = {
  us: ['American', 'United States', 'U.S.'],
  gb: ['British', 'English', 'Scottish', 'Welsh', 'Irish', 'Northern Irish', 'UK'],
  ng: ['Nigerian', 'Nigeria', 'Nollywood', 'Afrobeats', 'Afropop', 'Lagos', 'Abuja', 'Yoruba', 'Igbo', 'Hausa'],
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

// Queries Wikidata for people born on a specific month/day from a given country,
// then fetches Wikipedia thumbnails for those who have an English Wikipedia article.
async function searchWikidataBornOn(month: number, day: number, country: string): Promise<FamousPerson[]> {
  const qid = WIKIDATA_COUNTRY_QID[country]
  if (!qid) return []

  const sparql = `
    SELECT DISTINCT ?person ?personLabel (SAMPLE(?occ) AS ?occupation) ?article (COUNT(DISTINCT ?sitelink) AS ?fame) WHERE {
      ?person wdt:P31 wd:Q5.
      ?person wdt:P569 ?birth.
      FILTER(MONTH(?birth) = ${month} && DAY(?birth) = ${day})
      ?person wdt:P27 wd:${qid}.
      OPTIONAL {
        ?person wdt:P106 ?occItem.
        ?occItem rdfs:label ?occ.
        FILTER(LANG(?occ) = "en")
      }
      OPTIONAL {
        ?article schema:about ?person;
                 schema:isPartOf <https://en.wikipedia.org/>.
      }
      OPTIONAL { ?sitelink schema:about ?person. }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    } GROUP BY ?person ?personLabel ?article
    ORDER BY DESC(?fame)
    LIMIT 20
  `

  try {
    const sparqlUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparql)}`
    const sparqlRes = await fetch(sparqlUrl, {
      headers: { Accept: 'application/json', 'User-Agent': 'ThatDay/1.0' },
      next: { revalidate: 86400 },
    })
    if (!sparqlRes.ok) return []
    const sparqlData = await sparqlRes.json()
    const bindings: Array<Record<string, { value: string }>> = sparqlData.results?.bindings ?? []

    // Deduplicate by name and build intermediate list
    const seen = new Set<string>()
    const candidates: Array<{
      name: string
      occupation: string
      wikiUrl: string
      wikiTitle: string
    }> = []

    for (const b of bindings) {
      const name = b.personLabel?.value
      if (!name || seen.has(name)) continue
      seen.add(name)

      const articleUrl = b.article?.value ?? ''
      const wikiTitle = articleUrl
        ? decodeURIComponent(articleUrl.replace('https://en.wikipedia.org/wiki/', '').replace(/_/g, ' '))
        : ''

      candidates.push({
        name,
        occupation: b.occupation?.value ?? 'Notable figure',
        wikiUrl: articleUrl,
        wikiTitle,
      })
    }

    if (!candidates.length) return []

    // Batch-fetch Wikipedia thumbnails for people with English Wikipedia articles
    const titlesWithWiki = candidates.filter((p) => p.wikiTitle).map((p) => p.wikiTitle)
    const thumbMap: Record<string, string> = {}

    if (titlesWithWiki.length) {
      try {
        const detailUrl =
          `https://en.wikipedia.org/w/api.php?action=query` +
          `&titles=${titlesWithWiki.slice(0, 50).map(encodeURIComponent).join('|')}` +
          `&prop=pageimages&pithumbsize=300&format=json&origin=*`
        const detailRes = await fetch(detailUrl, { next: { revalidate: 86400 } })
        if (detailRes.ok) {
          const detailData = await detailRes.json()
          const pages = Object.values(detailData.query?.pages ?? {}) as Array<{
            title: string
            thumbnail?: { source?: string }
          }>
          for (const page of pages) {
            if (page.thumbnail?.source) thumbMap[page.title] = page.thumbnail.source
          }
        }
      } catch { /* thumbnail fetch is best-effort */ }
    }

    return candidates.map((p) => ({
      name: p.name,
      profession: p.occupation,
      wikiUrl: p.wikiUrl || undefined,
      thumbnail: thumbMap[p.wikiTitle] ?? undefined,
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

    // If fewer than 3 results from the primary source, query Wikidata which has
    // structured birth dates and country data — far more comprehensive than the
    // curated "On This Day" list for non-Western countries.
    if (primary.length < 3) {
      const supplementary = await searchWikidataBornOn(month, day, country)
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
