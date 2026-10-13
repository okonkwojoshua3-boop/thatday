'use client'

import { useParams } from 'next/navigation'
import RewindLoading from '@/components/loading/RewindLoading'

export default function Loading() {
  const { date } = useParams<{ date: string }>()
  return <RewindLoading date={date} />
}
