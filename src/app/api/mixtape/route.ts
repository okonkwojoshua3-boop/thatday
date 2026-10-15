import type { NextRequest } from 'next/server'
import { getSongForYear } from '@/lib/data/songs'
import { isValidDate } from '@/lib/utils/date'
import { isCountryCode } from '@/lib/countries'

// The Postcard box mixtape: the song of every saved day, looked up fresh so
// older saves get audio too and preview links never go stale. Days that share
// a song (same year and country) become one track.
// ?days=1989-02-14:ng,2003-05-01:world

export interface MixtapeTrack {
  title: string
  artist: string
  year: number
  chart: string
  basis: 'chart' | 'hit' | 'week'
  previewUrl: string | null
  albumArt: string | null
  /** Apple Music page for the full song */
  url: string | null
  /** The saved days this song belongs to, oldest first */
  days: { date: string; country: string }[]
}

const MAX_DAYS = 40

export async function GET(request: NextRequest) {
  const days = (request.nextUrl.searchParams.get('days') ?? '')
    .split(',')
    .map(entry => {
      const [date, country] = entry.split(':')
      return { date, country: isCountryCode(country) ? country : 'world' }
    })
    .filter(d => isValidDate(d.date))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, MAX_DAYS)

  const songs = await Promise.all(days.map(d => getSongForYear(Number(d.date.slice(0, 4)), d.country, d.date)))

  const tracks = new Map<string, MixtapeTrack>()
  songs.forEach((song, n) => {
    if (!song) return
    const key = `${song.title}|${song.artist}`.toLowerCase()
    const track = tracks.get(key)
    if (track) {
      track.days.push(days[n])
      return
    }
    tracks.set(key, {
      title: song.title,
      artist: song.artist,
      year: song.year,
      chart: song.chart,
      basis: song.basis,
      previewUrl: song.previewUrl ?? null,
      // Only iTunes art; other hosts aren't allowed for next/image
      albumArt: song.albumArt?.includes('.mzstatic.com/') ? song.albumArt : null,
      url: song.url ?? null,
      days: [days[n]],
    })
  })

  return Response.json(
    { tracks: [...tracks.values()] },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
  )
}
