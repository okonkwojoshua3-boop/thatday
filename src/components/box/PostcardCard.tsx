import Image from 'next/image'
import Link from 'next/link'
import { PostageStamp } from '@/components/results/art'
import type { Postcard } from '@/lib/postcards'

// Figma 14 — one saved day as a postcard: date + stamp header, then a
// photo and the headline under a dashed tear line.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function parts(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return { y, m: m - 1, d }
}

export function shortDate(date: string) {
  const { y, m, d } = parts(date)
  return `${d} ${MONTHS[m]} ${y}`
}

export function yearsAgo(date: string) {
  return new Date().getFullYear() - parts(date).y
}

export function savedAgo(ts?: number) {
  if (!ts) return null
  const days = Math.floor((Date.now() - ts) / 86_400_000)
  if (days <= 0) return 'Saved today'
  if (days === 1) return 'Saved yesterday'
  if (days < 30) return `Saved ${days} days ago`
  const months = Math.floor(days / 30)
  return months < 12 ? `Saved ${months} ${months === 1 ? 'month' : 'months'} ago` : `Saved ${Math.floor(months / 12)}+ years ago`
}

/** Photo area: B&W photo before 2000, a little sticker pile from 2000 */
export function PostcardPhoto({ p, className = '' }: { p: Postcard; className?: string }) {
  return (
    <span className={`relative block overflow-hidden rounded-[4px] bg-canvas ${className}`}>
      {p.genZ ? (
        <>
          <Image src="/icons/stickers/cd.png" alt="" width={70} height={70} className="absolute top-[6%] left-[3%] w-[52%] max-w-none -rotate-8" />
          <Image src="/icons/stickers/newsphone.png" alt="" width={60} height={75} className="absolute top-[2%] left-[48%] w-[40%] max-w-none rotate-8" />
          <Image src="/icons/stickers/smiley.png" alt="" width={63} height={63} className="absolute top-[56%] left-[60%] w-[34%] max-w-none" />
        </>
      ) : p.photo ? (
        <Image src={p.photo} alt="" fill sizes="124px" className="object-cover grayscale" />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-[18%] bg-ink"
          style={{ mask: 'url(/icons/halftone/headline.png) center / contain no-repeat', WebkitMask: 'url(/icons/halftone/headline.png) center / contain no-repeat' }}
        />
      )}
    </span>
  )
}

/** Stamp at 40×48 (the 64×78 postage stamp at 0.625) */
function MiniStamp({ p }: { p: Postcard }) {
  return (
    <span className="block h-12 w-10">
      <span className="block origin-top-left scale-[0.625]">
        <PostageStamp genZ={p.genZ} value={p.stampValue} />
      </span>
    </span>
  )
}

export default function PostcardCard({
  p,
  open = true,
  onClick,
  className = '',
  style,
}: {
  p: Postcard
  /** Collapsed cards only show the header strip, like a wallet */
  open?: boolean
  onClick?: () => void
  className?: string
  style?: React.CSSProperties
}) {
  const ago = yearsAgo(p.date)
  const body = (
    <>
      <span className="flex items-start justify-between">
        <span className="flex flex-col">
          <span className="font-serif text-[28px] leading-7">{shortDate(p.date)}</span>
          <span className="mt-1 font-mono text-[10px] leading-[13px] font-medium tracking-[0.06em] text-ink-muted uppercase">
            {p.countryName} · {ago} {ago === 1 ? 'yr' : 'yrs'} ago
          </span>
        </span>
        <MiniStamp p={p} />
      </span>
      {open && (
        <>
          <span className="mt-3.5 block border-t-[1.5px] border-dashed border-line" />
          <span className="mt-4 flex gap-3.5">
            <PostcardPhoto p={p} className="h-[108px] w-[124px] shrink-0" />
            <span className="flex min-w-0 flex-1 flex-col pt-0.5">
              <span className="line-clamp-3 font-serif text-[24px] leading-6">{p.headline ?? 'A quiet day'}</span>
              {p.song && <span className="mt-auto truncate text-[12px] leading-4 text-ink-secondary">No.1: {p.song}</span>}
            </span>
          </span>
        </>
      )}
    </>
  )

  const cls = `flex h-[216px] w-full flex-col justify-start rounded-[14px] border border-ink bg-card px-[18px] pt-3 text-left text-ink shadow-[0_-4px_16px_rgba(0,0,0,0.10)] ${className}`
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls} style={style} aria-label={`Postcard from ${shortDate(p.date)}`}>
        {body}
      </button>
    )
  }
  return (
    <div className={cls} style={style}>
      {body}
    </div>
  )
}

/** Envelope badge with the number of saved postcards; links to the box */
export function BoxBadge({ count, fresh = false, className = '' }: { count: number; fresh?: boolean; className?: string }) {
  return (
    <Link
      href="/box"
      aria-label={`Postcard box, ${count} saved`}
      className={`relative flex h-9 items-center gap-2 rounded-full border border-line bg-card pr-3.5 pl-3 text-[14px] font-medium text-ink shadow-[0_2px_4px_rgba(0,0,0,0.06)] transition-transform duration-150 ease-out active:scale-[0.96] ${className}`}
    >
      <svg viewBox="0 0 18 14" fill="none" className="h-3.5 w-[18px]" aria-hidden="true">
        <rect x="1" y="1" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 2.5 9 8l7-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span key={count} className="badge-tick tabular-nums">
        {count}
      </span>
      {fresh && <span className="absolute -top-1 -right-1 size-2.5 rounded-full border-2 border-canvas bg-ink" />}
    </Link>
  )
}
