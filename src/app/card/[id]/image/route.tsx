import { ImageResponse } from 'next/og'
import { decodeCardId } from '@/lib/utils/cardId'
import { getDateParts, isValidDate } from '@/lib/utils/date'
import { getFrontPage, splitHeadline } from '@/lib/data/events'
import { getSongForYear } from '@/lib/data/songs'
import { getCountry, isCountryCode } from '@/lib/countries'

// "Save image" from the Postcard box (Figma 14): the saved day as a PNG postcard.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const INK = '#18181b'
const PAPER = '#fbf8f2'

// Instrument Serif as TTF (Satori can't read woff2). Google serves TTF to non-browser agents.
let serif: Promise<ArrayBuffer | null> | null = null
function loadSerif() {
  serif ??= (async () => {
    try {
      const css = await (await fetch('https://fonts.googleapis.com/css2?family=Instrument+Serif')).text()
      const url = /src: url\((.+?)\) format\('(?:truetype|opentype)'\)/.exec(css)?.[1]
      return url ? await (await fetch(url)).arrayBuffer() : null
    } catch {
      return null
    }
  })()
  return serif
}

export async function GET(_req: Request, ctx: RouteContext<'/card/[id]/image'>) {
  const { id } = await ctx.params
  const card = decodeCardId(id)
  if (!card || !isValidDate(card.date)) return new Response('Not found', { status: 404 })

  const country = isCountryCode(card.country) ? card.country : 'world'
  const { year, month, day } = getDateParts(card.date)
  const [front, song, font] = await Promise.all([
    getFrontPage(month, day, year, country),
    getSongForYear(year, country, card.date),
    loadSerif(),
  ])
  const headline = front ? splitHeadline(front.lead.title).headline : 'A quiet day'
  const ago = new Date().getFullYear() - year
  const serifFamily = font ? 'Instrument Serif' : 'serif'

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: PAPER }}>
        <div
          style={{
            width: 1040,
            height: 640,
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
            border: `2px solid ${INK}`,
            borderRadius: 40,
            padding: '44px 52px',
            color: INK,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: serifFamily, fontSize: 84, lineHeight: 1 }}>
                {`${day} ${MONTHS[month - 1]} ${year}`}
              </div>
              <div style={{ marginTop: 12, fontSize: 26, letterSpacing: 2, color: '#a1a1aa', textTransform: 'uppercase' }}>
                {`${getCountry(country).name} · ${ago} ${ago === 1 ? 'yr' : 'yrs'} ago`}
              </div>
            </div>
            <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
              That<span style={{ color: '#a1a1aa' }}>Day</span>
            </div>
          </div>
          <div style={{ marginTop: 36, borderTop: '3px dashed #ece6dc', display: 'flex' }} />
          <div style={{ marginTop: 40, display: 'flex', gap: 40, flex: 1 }}>
            {front?.lead.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>
              <img
                src={front.lead.thumbnail}
                alt=""
                width={360}
                height={320}
                style={{ objectFit: 'cover', borderRadius: 12, filter: year < 2000 ? 'grayscale(1)' : undefined }}
              />
            ) : (
              <div style={{ width: 360, height: 320, borderRadius: 12, background: PAPER, display: 'flex' }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ fontFamily: serifFamily, fontSize: 64, lineHeight: 1.05 }}>{headline}</div>
              {song && (
                <div style={{ marginTop: 'auto', fontSize: 30, color: '#71717a' }}>{`Song of the year: ${song.title} · ${song.artist}`}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 800,
      fonts: font ? [{ name: 'Instrument Serif', data: font, weight: 400, style: 'normal' }] : undefined,
      headers: {
        'Content-Disposition': `attachment; filename="thatday-${card.date}.png"`,
        'Cache-Control': 'public, max-age=3600',
      },
    },
  )
}
