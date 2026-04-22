import type { NextRequest } from 'next/server'
import { isValidDate, getDateParts } from '@/lib/utils/date'
import { computeLifeStats } from '@/lib/stats/lifeStats'
import { getEventsForDate } from '@/lib/data/events'
import { getPeopleForDate } from '@/lib/data/people'
import { getSongForYear } from '@/lib/data/songs'
import { getCostsForYear } from '@/lib/data/costs'
import type { RewindResponse } from '@/types'

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date')

  if (!date || !isValidDate(date)) {
    return Response.json({ error: 'Invalid date. Use YYYY-MM-DD format.' }, { status: 400 })
  }

  const today = new Date()
  const requestedDate = new Date(date + 'T00:00:00')
  if (requestedDate >= today) {
    return Response.json({ error: 'Date must be in the past.' }, { status: 400 })
  }

  const { year, month, day } = getDateParts(date)

  const todayMonth = today.getMonth() + 1
  const todayDay = today.getDate()
  const isBirthday = todayMonth === month && todayDay === day

  const country = request.nextUrl.searchParams.get('country') ?? 'world'

  const [events, people] = await Promise.all([
    getEventsForDate(month, day, country),
    getPeopleForDate(month, day, country),
  ])

  const song = await getSongForYear(year, country)
  const { costs } = getCostsForYear(year, country)
  const lifeStats = computeLifeStats(date)

  const notableEvent = events.find((e) => e.year <= year) ?? events[0] ?? null

  const response: RewindResponse = {
    date,
    isBirthday,
    song,
    event: notableEvent,
    people,
    costs,
    lifeStats,
  }

  return Response.json(response, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  })
}
