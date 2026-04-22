'use client'

import { useState } from 'react'

export default function CopyLinkButton({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const base = 'rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200'
  const styles = {
    dark: copied
      ? `${base} bg-zinc-700 text-zinc-300 scale-95`
      : `${base} bg-white text-zinc-900 hover:bg-zinc-100 active:scale-95`,
    light: copied
      ? `${base} bg-zinc-100 text-zinc-600 scale-95`
      : `${base} bg-zinc-900 text-white hover:bg-zinc-700 active:scale-95`,
  }

  return (
    <button onClick={handleCopy} className={styles[variant]}>
      {copied ? '✓ Copied' : 'Copy Link'}
    </button>
  )
}
