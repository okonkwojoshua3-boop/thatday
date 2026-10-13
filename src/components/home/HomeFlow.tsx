'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'
import OnThisDay from './OnThisDay'
import TimeMachine from './TimeMachine'
import Welcome from './Welcome'

// First visit: Welcome → Time Machine. Returning visitors (seen the splash
// before; layout.tsx marks <html data-returning>) land on On this day.
// `/?pick=1` (from Results and the box) goes straight to the Time Machine.
export default function HomeFlow({ skipWelcome = false }: { skipWelcome?: boolean }) {
  const [step, setStep] = useState<'start' | 'picker'>(skipWelcome ? 'picker' : 'start')
  const pick = useCallback(() => setStep('picker'), [])
  const back = useCallback(() => setStep('start'), [])

  // Client-only screens read localStorage and the local date as they mount
  const hydrated = useSyncExternalStore(noop, () => true, () => false)
  const returning = useSyncExternalStore(noop, () => !!document.documentElement.dataset.returning, () => false)

  if (step === 'start' && !returning) return <Welcome onStart={pick} />
  if (!hydrated) return <main className="min-h-svh bg-canvas" />
  if (step === 'start') return <OnThisDay onPick={pick} />
  return <TimeMachine onBack={back} />
}

const noop = () => () => {}
