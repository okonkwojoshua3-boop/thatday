'use client'

import { useCallback, useState } from 'react'
import DatePicker from '@/components/DatePicker'
import Welcome from './Welcome'

// Welcome → date picker. The picker step is the old DatePicker until
// the Time Machine screen (Figma 03) replaces it.
export default function HomeFlow() {
  const [step, setStep] = useState<'welcome' | 'picker'>('welcome')
  const start = useCallback(() => setStep('picker'), [])

  if (step === 'welcome') return <Welcome onStart={start} />

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 bg-canvas px-6 py-20 text-ink">
      <h1 className="font-serif text-[44px] leading-none">Find your day</h1>
      <DatePicker />
      <button
        type="button"
        onClick={() => setStep('welcome')}
        className="text-[14px] text-ink-secondary underline-offset-4 hover:underline"
      >
        Back
      </button>
    </main>
  )
}
