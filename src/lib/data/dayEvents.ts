// Events dated to an exact day (not just "on this day in some year"), read from
// Wikipedia pages that list events by date:
//   - the year article ("1987"): world events, every year
//   - "{year} in {country}": national events (most countries, most years)
//   - national history timelines, for countries whose year pages are thin
// Pages are fetched as raw wikitext and cached for a day.

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const MONTH_RE = MONTHS.join('|')

// Title form used by "{year} in {country}" pages
const YEAR_PAGE_NAME: Record<string, string> = {
  us: 'the United States', gb: 'the United Kingdom', ca: 'Canada', au: 'Australia',
  de: 'Germany', fr: 'France', in: 'India', jp: 'Japan', ng: 'Nigeria', gh: 'Ghana',
  ke: 'Kenya', za: 'South Africa', br: 'Brazil',
}

const TIMELINES: Record<string, string[]> = {
  ng: ['Timeline of Nigerian history'],
  gh: ['Timeline of Ghanaian history'],
  ke: ['Timeline of Kenya'],
}

// Strict country match for world events: names, demonyms and major cities only.
// (Broad words like "President" would tag Ecuador's president as US news.)
const STRICT: Record<string, RegExp> = {
  us: /\b(United States|U\.S\.|American|Washington, D\.C\.|New York|California|Texas)\b/,
  gb: /\b(United Kingdom|Britain|British|England|English|Scotland|Scottish|Wales|Welsh|Northern Ireland|London)\b/,
  ca: /\b(Canada|Canadian|Ottawa|Toronto|Montreal|Quebec|Vancouver)\b/,
  au: /\b(Australia|Australian|Sydney|Melbourne|Canberra|Brisbane|Perth)\b/,
  de: /\b(Germany|German|West Germany|East Germany|Berlin|Bonn|Munich|Hamburg)\b/,
  fr: /\b(France|French|Paris|Lyon|Marseille)\b/,
  in: /\b(India|Indian|New Delhi|Delhi|Mumbai|Bombay|Calcutta|Kolkata)\b/,
  jp: /\b(Japan|Japanese|Tokyo|Osaka|Kyoto|Hiroshima)\b/,
  ng: /\b(Nigeria|Nigerian|Lagos|Abuja|Biafra|Biafran)\b/,
  gh: /\b(Ghana|Ghanaian|Accra|Kumasi|Gold Coast)\b/,
  ke: /\b(Kenya|Kenyan|Nairobi|Mombasa)\b/,
  za: /\b(South Africa|South African|Johannesburg|Cape Town|Pretoria|Soweto|Durban)\b/,
  br: /\b(Brazil|Brazilian|Brasil|brasileir[oa]s?|Rio de Janeiro|São Paulo|Brasília)\b/,
}

/** Whether an event's text is clearly about this country (strict: names, demonyms, big cities) */
export function isLocal(text: string, country: string): boolean {
  return country === 'world' || !!STRICT[country]?.test(text)
}

// Sections that list people or office holders, not events
const SKIP_SECTION = /^(births?|deaths?|incumbents?|governors?|federal government|references|notes|see also|external links|further reading|nobel prizes|sources|bibliography)\b/i

export type DayEvent = {
  /** Plain text of the event */
  text: string
  /** Linked article titles, in order */
  links: string[]
  source: 'country' | 'year' | 'timeline'
}

async function raw(title: string, depth = 0): Promise<string> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/index.php?title=${encodeURIComponent(title.replace(/ /g, '_'))}&action=raw`,
      { headers: { 'User-Agent': 'ThatDay/1.0 (time-capsule app)' }, next: { revalidate: 86400 } },
    )
    if (!res.ok) return ''
    const text = await res.text()
    const redirect = /^#REDIRECT\s*\[\[([^\]|#]+)/i.exec(text)
    return redirect && depth < 1 ? raw(redirect[1], depth + 1) : text
  } catch {
    return ''
  }
}

/** Wikitext to plain text, collecting link targets */
export function clean(wikitext: string): { text: string; links: string[] } {
  let s = wikitext
    .replace(/<ref[^>]*\/>/gi, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
  // Templates, innermost first (keep a ship/convert name where it's the only text is not worth it)
  for (let i = 0; i < 5 && /\{\{[^{}]*\}\}/.test(s); i++) s = s.replace(/\{\{[^{}]*\}\}/g, '')
  s = s.replace(/\[\[(?:File|Image):[^\]]*\]\]/gi, '')
  const links: string[] = []
  s = s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target: string, label?: string) => {
    links.push(target.trim())
    return (label ?? target).trim()
  })
  s = s
    .replace(/\[https?:\/\/\S+\s+([^\]]+)\]/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/'''?/g, '')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .replace(/^[\s–—:\-,;]+/, '')
    .trim()
  return { text: s, links }
}

const SEP = String.raw`\s*(?:&ndash;|&mdash;|–|—|-|:)\s*`

/**
 * Raw wikitext snippets dated to month/day. `needYear` is for timelines, where
 * the year comes from headings or a table's year column rather than the page.
 */
export function eventsOn(wikitext: string, month: number, day: number, needYear?: number): string[] {
  const target = MONTHS[month - 1]
  const out: string[] = []
  let skipping = false
  let ctxMonth: string | null = null
  let ctxYear: number | null = null
  let parentDate: { m: string; d: number } | null = null

  const hit = (m: string | null, d: number) =>
    m === target && d === day && (needYear === undefined || ctxYear === needYear)

  for (const line of wikitext.split('\n')) {
    const heading = /^(={2,6})\s*(.+?)\s*\1\s*$/.exec(line)
    if (heading) {
      const name = heading[2].replace(/\[\[|\]\]/g, '')
      if (heading[1].length === 2) skipping = SKIP_SECTION.test(name)
      const m = new RegExp(`^(${MONTH_RE})$`).exec(name)
      if (m) ctxMonth = m[1]
      const y = /\b(1[89]\d\d|20\d\d)\b/.exec(name)
      if (y && !m) ctxYear = Number(y[1])
      parentDate = null
      continue
    }
    if (skipping) continue

    // ";January" definition-list month headers (country year pages)
    const dl = new RegExp(`^;\\s*\\[?\\[?(${MONTH_RE})\\]?\\]?\\s*$`).exec(line)
    if (dl) {
      ctxMonth = dl[1]
      parentDate = null
      continue
    }

    // Table rows: "| 1895 || 29 January || text"
    if (/^\|(?![-}])/.test(line)) {
      const cells = line.slice(1).split('||').map(c => c.replace(/^[^|[\]]*=\s*"[^"]*"\s*\|/, '').replace(/^\s*rowspan="?\d+"?\s*\|/, '').trim())
      let date: { m: string; d: number } | null = null
      for (const c of cells) {
        if (/^(1[89]\d\d|20\d\d)$/.test(c)) ctxYear = Number(c)
        const a = new RegExp(`^(\\d{1,2})\\s+(${MONTH_RE})$`).exec(c)
        const b = new RegExp(`^(${MONTH_RE})\\s+(\\d{1,2})$`).exec(c)
        if (a) date = { m: a[2], d: Number(a[1]) }
        if (b) date = { m: b[1], d: Number(b[2]) }
      }
      const text = cells.reduce((x, c) => (c.length > x.length ? c : x), '')
      if (date && hit(date.m, date.d) && text.length > 20) out.push(text)
      continue
    }

    const bullet = /^(\*+)\s*(.*)$/.exec(line)
    if (!bullet) continue
    const depth = bullet[1].length
    let body = bullet[2]
    let date: { m: string; d: number } | null = null

    const md = new RegExp(`^\\[?\\[?(${MONTH_RE})\\s+(\\d{1,2})\\]?\\]?(?:,?\\s*\\[?\\[?\\d{4}\\]?\\]?)?(?=${SEP}|\\s*$)`).exec(body)
    const dm = new RegExp(`^\\[?\\[?(\\d{1,2})\\s+(${MONTH_RE})\\]?\\]?(?:\\s*\\[?\\[?\\d{4}\\]?\\]?)?(?=${SEP}|\\s*$)`).exec(body)
    const dOnly = /^(\d{1,2})(?=\s*(?:&ndash;|&mdash;|–|—|-|:)\s)/.exec(body)
    if (md) date = { m: md[1], d: Number(md[2]) }
    else if (dm) date = { m: dm[2], d: Number(dm[1]) }
    else if (dOnly && ctxMonth) date = { m: ctxMonth, d: Number(dOnly[1]) }
    const matched = md ?? dm ?? (date ? dOnly : null)
    if (matched) body = body.slice(matched[0].length)

    if (depth === 1) {
      parentDate = date
      if (date && hit(date.m, date.d) && body.replace(/[\s–—:\-]/g, '').length > 0) out.push(body)
    } else if (!date && parentDate && hit(parentDate.m, parentDate.d)) {
      out.push(body)
    } else if (date && hit(date.m, date.d)) {
      out.push(body)
    }
  }
  return out
}

function toEvents(snippets: string[], source: DayEvent['source']): DayEvent[] {
  return snippets
    .map(s => ({ ...clean(s), source }))
    .filter(e => e.text.length > 20)
}

/**
 * Events on this exact date. `local` happened in the chosen country; `world`
 * is everything the year article has for the day (for "world" these match).
 */
export async function getDatedEvents(
  year: number,
  month: number,
  day: number,
  country = 'world',
): Promise<{ local: DayEvent[]; world: DayEvent[] }> {
  const local = country !== 'world' && YEAR_PAGE_NAME[country]
  const [yearPage, countryPage, ...timelines] = await Promise.all([
    raw(String(year)),
    local ? raw(`${year} in ${YEAR_PAGE_NAME[country]}`) : Promise.resolve(''),
    ...(local ? (TIMELINES[country] ?? []).map(t => raw(t)) : []),
  ])

  const world = toEvents(eventsOn(yearPage, month, day), 'year')
  if (!local) return { local: world, world }

  const strict = STRICT[country]
  const seen = new Set<string>()
  const localEvents = [
    ...toEvents(eventsOn(countryPage, month, day), 'country'),
    ...timelines.flatMap(t => toEvents(eventsOn(t, month, day, year), 'timeline')),
    ...world.filter(e => strict?.test(e.text)),
  ].filter(e => {
    const key = e.text.slice(0, 60).toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  return { local: localEvents, world }
}
