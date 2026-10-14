import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { decodeCardId } from '@/lib/utils/cardId'
import { getDateParts, isValidDate } from '@/lib/utils/date'
import { getFrontPage, splitHeadline } from '@/lib/data/events'
import { getSongForYear } from '@/lib/data/songs'
import { usPostageCents } from '@/lib/data/costs'
import { getCountry, isCountryCode } from '@/lib/countries'

// Figma 09 · 4 — the postcard as a 1200×630 PNG. It is the link preview
// (og:image, `?preview=1`) and the "Save image" download from the Postcard box.
// From 2000 the left panel is the sticker collage; before, the front-page photo
// in black and white with a halftone stamp.

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const INK = '#18181b'
const MUTED = '#a1a1aa'
const SECONDARY = '#71717a'
const PAPER = '#fbf8f2'
const LINE = '#e7e2d8'

// Satori needs TTF/OTF; Google serves TTF to non-browser agents
const fonts = new Map<string, Promise<ArrayBuffer | null>>()
function googleFont(query: string) {
  if (!fonts.has(query)) {
    fonts.set(
      query,
      (async () => {
        try {
          const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${query}`)).text()
          const url = /src: url\((.+?)\) format\('(?:truetype|opentype)'\)/.exec(css)?.[1]
          return url ? await (await fetch(url)).arrayBuffer() : null
        } catch {
          return null
        }
      })(),
    )
  }
  return fonts.get(query)!
}

// Local art as data URIs (listed in next.config outputFileTracingIncludes)
const art = new Map<string, Promise<string>>()
function local(path: string) {
  if (!art.has(path)) {
    art.set(path, readFile(join(process.cwd(), 'public', path)).then(b => `data:image/png;base64,${b.toString('base64')}`))
  }
  return art.get(path)!
}

export async function GET(req: Request, ctx: RouteContext<'/card/[id]/image'>) {
  const { id } = await ctx.params
  const card = decodeCardId(id)
  if (!card || !isValidDate(card.date)) return new Response('Not found', { status: 404 })

  const country = isCountryCode(card.country) ? card.country : 'world'
  const { year, month, day } = getDateParts(card.date)
  const genZ = year >= 2000
  const [front, song, serif, sans, sansBold, mono, collage, paper, stampArt] = await Promise.all([
    getFrontPage(month, day, year, country),
    getSongForYear(year, country, card.date),
    googleFont('Instrument+Serif'),
    googleFont('Geist:wght@400'),
    googleFont('Geist:wght@700'),
    googleFont('Geist+Mono:wght@500'),
    genZ ? local('share/og-collage.png') : null,
    local('share/og-stamp-paper.png'),
    local(genZ ? 'share/og-stamp-cd.png' : 'icons/halftone/song.png'),
  ])

  const headline = front ? splitHeadline(front.lead.title).headline : 'A quiet day in the papers'
  const photo = front?.lead.thumbnail
  const ago = new Date().getFullYear() - year
  const when = ago === 0 ? 'THIS YEAR' : `${ago} ${ago === 1 ? 'YEAR' : 'YEARS'} AGO`
  const stampValue = country === 'world' || country === 'us' ? `${usPostageCents(year)}¢` : null
  const songLine = song && `${song.basis === 'hit' ? 'Song of the year' : song.basis === 'week' ? 'No.1 this week' : `No.1 of ${song.year}`}: ${song.title} · ${song.artist}`
  const headlineSize = headline.length > 70 ? 40 : headline.length > 36 ? 48 : 56
  // "23 April 2005" fills the line at 96px; longer dates shrink to clear the stamp
  const dateText = `${day} ${MONTHS[month - 1]} ${year}`
  const dateSize = dateText.length <= 13 ? 96 : Math.floor((96 * 12) / dateText.length)
  const songSize = songLine && songLine.length > 42 ? 20 : 24

  const serifFamily = serif ? 'Instrument Serif' : 'serif'
  const loaded = [
    serif && { name: 'Instrument Serif', data: serif, weight: 400 as const, style: 'normal' as const },
    sans && { name: 'Geist', data: sans, weight: 400 as const, style: 'normal' as const },
    sansBold && { name: 'Geist', data: sansBold, weight: 700 as const, style: 'normal' as const },
    mono && { name: 'Geist Mono', data: mono, weight: 500 as const, style: 'normal' as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 500 | 700; style: 'normal' }[]

  const monoText = { fontFamily: 'Geist Mono', fontWeight: 500, color: MUTED } as const

  const download = !new URL(req.url).searchParams.has('preview')

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: PAPER, fontFamily: 'Geist', color: INK }}>
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 40,
            width: 1120,
            height: 550,
            display: 'flex',
            background: '#fff',
            border: `2px solid ${INK}`,
            borderRadius: 40,
          }}
        />

        {/* Left panel: sticker collage (2000+) or the front-page photo in black and white */}
        {collage ? (
          // eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>
          <img src={collage} alt="" width={440} height={470} style={{ position: 'absolute', left: 80, top: 80 }} />
        ) : (
          <div style={{ position: 'absolute', left: 80, top: 80, width: 440, height: 470, display: 'flex', alignItems: 'center', justifyContent: 'center', background: PAPER, borderRadius: 24, overflow: 'hidden' }}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>
              <img src={photo} alt="" width={440} height={470} style={{ objectFit: 'cover', filter: 'grayscale(1)', borderRadius: 24 }} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>
              <img src={await local('results/record-large.png')} alt="" width={280} height={280} />
            )}
          </div>
        )}

        <div style={{ position: 'absolute', left: 568, top: 92, width: 540, height: 470, display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...monoText, fontSize: 22, letterSpacing: 1.76, height: 29 }}>A POSTCARD FROM</div>
          <div style={{ marginTop: 5, height: 96, display: 'flex', alignItems: 'flex-end', fontFamily: serifFamily, fontSize: dateSize, lineHeight: 1, whiteSpace: 'nowrap' }}>
            {dateText}
          </div>
          <div style={{ ...monoText, marginTop: 10, fontSize: 20, letterSpacing: 1.6, height: 26 }}>
            {`${getCountry(country).name.toUpperCase()} · ${when}`}
          </div>
          <div style={{ marginTop: 20, height: 0, borderTop: `3px dashed ${LINE}`, display: 'flex' }} />
          <div
            style={{
              marginTop: 25,
              fontFamily: serifFamily,
              fontSize: headlineSize,
              lineHeight: 1,
              display: 'block',
              lineClamp: 3,
              maxHeight: headlineSize * 3,
              overflow: 'hidden',
            }}
          >
            {headline}
          </div>
          {songLine && (
            <div style={{ position: 'absolute', top: 358, fontSize: songSize, color: SECONDARY, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 540 }}>
              {songLine}
            </div>
          )}
          <div style={{ position: 'absolute', top: 424, left: 0, width: 540, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', fontSize: 32, fontWeight: 700, letterSpacing: -0.64 }}>
              <span>That</span>
              {/* Satori leaves a gap between sibling spans; pull "Day" back in */}
              <span style={{ marginLeft: -5, color: MUTED }}>Day</span>
            </div>
            <div style={{ ...monoText, fontSize: 20 }}>thatday.space</div>
          </div>
        </div>

        {/* Stamp: 96×117, tilted 5° (paper PNG includes its shadow) */}
        <div style={{ position: 'absolute', left: 1033, top: 72, width: 96, height: 117, display: 'flex', transform: 'rotate(5deg)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img> */}
          <img src={paper} alt="" width={108} height={129} style={{ position: 'absolute', left: -6, top: -3 }} />
          {genZ ? (
            // eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>
            <img src={stampArt} alt="" width={69.5} height={70} style={{ position: 'absolute', left: 13.2, top: 13.6 }} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>
            <img src={stampArt} alt="" width={52} height={52} style={{ position: 'absolute', left: 22, top: 20 }} />
          )}
          {stampValue && (
            <div style={{ position: 'absolute', left: 50, top: 72, width: 34, display: 'flex', justifyContent: 'flex-end', fontFamily: serifFamily, fontSize: 24, color: INK }}>
              {stampValue}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: loaded.length ? loaded : undefined,
      headers: {
        ...(download ? { 'Content-Disposition': `attachment; filename="thatday-${card.date}.png"` } : {}),
        'Cache-Control': 'public, max-age=3600',
      },
    },
  )
}
