'use client'

import { useCallback, useState } from 'react'
import TimeMachine from './TimeMachine'
import Welcome from './Welcome'

// Welcome → Time Machine date picker
export default function HomeFlow() {
  const [step, setStep] = useState<'welcome' | 'picker'>('welcome')
  const start = useCallback(() => setStep('picker'), [])
  const back = useCallback(() => setStep('welcome'), [])

  if (step === 'welcome') return <Welcome onStart={start} />
  return <TimeMachine onBack={back} />
}
