'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'
import TimeMachine from './TimeMachine'
import Welcome from './Welcome'

// Welcome → Time Machine date picker. `/?pick=1` (from Results) skips the welcome.
export default function HomeFlow({ skipWelcome = false }: { skipWelcome?: boolean }) {
  const [step, setStep] = useState<'welcome' | 'picker'>(skipWelcome ? 'picker' : 'welcome')
  const start = useCallback(() => setStep('picker'), [])
  const back = useCallback(() => setStep('welcome'), [])

  // TimeMachine reads localStorage and the time zone as it mounts, so it only renders on the client
  const hydrated = useSyncExternalStore(noop, () => true, () => false)

  if (step === 'welcome') return <Welcome onStart={start} />
  if (!hydrated) return <main className="min-h-svh bg-canvas" />
  return <TimeMachine onBack={back} />
}

const noop = () => () => {}
