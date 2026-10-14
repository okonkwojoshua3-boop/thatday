'use client'

import { setSoundEnabled, useSoundEnabled } from '@/lib/feedback'

/** Speaker button: turns sound, haptics and the story soundtrack on or off */
export default function SoundToggle({ className = '' }: { className?: string }) {
  const on = useSoundEnabled()
  return (
    <button
      type="button"
      onClick={() => setSoundEnabled(!on)}
      aria-pressed={on}
      aria-label="Sound and haptics"
      className={`flex items-center justify-center rounded-full border border-line bg-card text-ink shadow-[0_2px_4px_rgba(0,0,0,0.06)] transition-transform duration-150 ease-out active:scale-[0.94] ${className}`}
    >
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-1/2">
        <path d="M3.5 7.5h2.8L10 4.5v11l-3.7-3H3.5z" fill="currentColor" />
        {on ? (
          <path d="M13 7.2a4 4 0 0 1 0 5.6M15.2 5a7 7 0 0 1 0 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        ) : (
          <path d="m13 8 4 4m0-4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        )}
      </svg>
    </button>
  )
}
