export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import { isValidDate, formatDisplayDate, getMinDate, getMaxDate } from '@/lib/utils/date'
import { isCountryCode } from '@/lib/countries'
import { buildStory } from '@/lib/story'
import PostcardStory from '@/components/results/PostcardStory'

export default async function RewindPage(props: PageProps<'/rewind/[date]'>) {
  const { date } = await props.params
  const searchParams = await (props.searchParams as Promise<Record<string, string>>)
  const country = isCountryCode(searchParams?.country) ? searchParams.country : 'world'

  if (!isValidDate(date)) notFound()
  if (date < getMinDate() || date > getMaxDate()) redirect('/')

  return <PostcardStory data={await buildStory(date, country)} />
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params
  return {
    title: `${isValidDate(date) ? formatDisplayDate(date) : date} — ThatDay`,
    description: `Discover what happened on ${isValidDate(date) ? formatDisplayDate(date) : date}`,
  }
}
