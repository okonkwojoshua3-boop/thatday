export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { decodeCardId } from '@/lib/utils/cardId'
import { getMinDate, isValidDate, parseDate } from '@/lib/utils/date'
import { isCountryCode } from '@/lib/countries'
import { buildStory } from '@/lib/story'
import ReceivedPostcard from '@/components/share/ReceivedPostcard'

// Figma 09 — what a friend sees when someone sends them a postcard

// Links were made in the sender's time zone, so allow up to today in any of them
function decode(id: string) {
  const card = decodeCardId(id)
  const latest = new Date(Date.now() + 14 * 3_600_000).toISOString().slice(0, 10)
  if (!card || !isValidDate(card.date) || card.date < getMinDate() || card.date > latest) return null
  return { date: card.date, country: isCountryCode(card.country) ? card.country : 'world' as const }
}

export default async function CardPage(props: PageProps<'/card/[id]'>) {
  const { id } = await props.params
  const card = decode(id)
  if (!card) notFound()
  return <ReceivedPostcard data={await buildStory(card.date, card.country)} />
}

export async function generateMetadata(props: PageProps<'/card/[id]'>): Promise<Metadata> {
  const { id } = await props.params
  const card = decode(id)
  if (!card) return { title: 'ThatDay' }
  const title = `A postcard from ${parseDate(card.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
  const description = 'The song, the front page, what things cost.'
  const image = { url: `/card/${id}/image?preview=1`, width: 1200, height: 630, alt: title }
  return {
    title: `${title} — ThatDay`,
    description,
    openGraph: { title, description, images: [image], type: 'website', siteName: 'ThatDay' },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  }
}
