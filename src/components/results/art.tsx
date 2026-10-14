import Image from 'next/image'

// Line art and keepsake pieces for Figma 12 (Results · Postcard story).
// Ink lines use currentColor so they follow the theme; stamps are printed
// paper (cream + ink) in both themes, like the real thing.

const STAMP_PAPER = '#fbf8f2'
const STAMP_INK = '#18181b'

// Pieces are `relative` unless the caller positions them absolutely
const position = (className: string) => (/\babsolute\b/.test(className) ? className : `relative ${className}`)

/** Halftone or any PNG icon tinted through a CSS mask */
export function MaskIcon({ src, className, color }: { src: string; className: string; color?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block shrink-0 ${color ? '' : 'bg-current'} ${className}`}
      style={{
        backgroundColor: color,
        mask: `url(${src}) center / contain no-repeat`,
        WebkitMask: `url(${src}) center / contain no-repeat`,
      }}
    />
  )
}

/** A positioned sticker PNG. Box = its render bounds (shadow included) from Figma. */
export function Sticker({
  src,
  x,
  y,
  w,
  h,
  className = '',
  delay = 0,
}: {
  src: string
  x: number
  y: number
  w: number
  h: number
  className?: string
  delay?: number
}) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={Math.round(w)}
      height={Math.round(h)}
      className={`sticker-drift pointer-events-none absolute max-w-none ${className}`}
      style={{ left: x, top: y, width: w, height: h, animationDelay: `${delay}ms` }}
    />
  )
}

/** Small perforated stamp (64×78) with the song icon and a denomination */
export function PostageStamp({ genZ, value, className = '' }: { genZ: boolean; value: string | null; className?: string }) {
  return (
    <span className={`block h-[78px] w-16 ${position(className)}`} style={{ color: STAMP_INK }}>
      {/* SVG includes a drop shadow: 4px each side, 2px above, 6px below */}
      <Image src="/results/perf64.svg" alt="" width={72} height={86} className="absolute -top-0.5 -left-1 max-w-none" style={{ width: 72, height: 86 }} />
      <span className="absolute top-[7px] left-[7px] h-16 w-[50px] border" style={{ borderColor: STAMP_INK }} />
      {genZ ? (
        <Image src="/results/genz/stamp-cd.png" alt="" width={47} height={47} className="absolute top-[7px] left-[9px] max-w-none" style={{ width: 46.3, height: 46.3 }} />
      ) : (
        <MaskIcon src="/icons/halftone/song.png" className="absolute top-3 left-3.5 size-9" color={STAMP_INK} />
      )}
      {value && (
        <span className="absolute top-12 right-2.5 font-serif text-[16px] leading-[21px]">{value}</span>
      )}
    </span>
  )
}

/** Big perforated stamp (88×108) for the stamp card */
export function CardStamp({
  children,
  collected,
  genZ,
  empty,
  className = '',
}: {
  children?: React.ReactNode
  collected: boolean
  genZ: boolean
  empty?: boolean
  className?: string
}) {
  return (
    <span className={`block h-[108px] w-[88px] ${position(className)}`} style={{ color: STAMP_INK }}>
      <Image
        src={empty ? '/results/perfShare.svg' : '/results/perf88.svg'}
        alt=""
        width={88}
        height={108}
        className="absolute inset-0 max-w-none"
        style={{ width: 88, height: 108 }}
      />
      {children}
      {collected && !empty && (
        <span className="stamp-cancel absolute top-[74px] left-[58px] size-10">
          {genZ ? (
            <span className="absolute top-[7px] left-[7px] flex size-[26px] items-center justify-center rounded-full border-2 border-white bg-era-green text-white shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
              <svg viewBox="0 0 16 12" fill="none" className="w-3.5">
                <path d="M1.3 6 6 11.3l9.5-9.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          ) : (
            <svg viewBox="0 0 40 40" fill="none" className="size-10">
              <circle cx="20" cy="20" r="19.25" stroke={STAMP_INK} strokeWidth="1.5" opacity="0.55" />
              <path d="M13.3 20 18 25.3l9.5-9.5" stroke={STAMP_INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
            </svg>
          )}
        </span>
      )}
    </span>
  )
}

/** Round postmark: rings with the date, and four wavy cancel lines */
export function Postmark({ day, month, year, className = '' }: { day: string; month: string; year: number; className?: string }) {
  return (
    <span className={`block h-16 w-[150px] ${position(className)}`}>
      <svg viewBox="0 0 150 64" fill="none" className="absolute inset-0 size-full overflow-visible">
        <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="1" />
        {[11, 23, 35, 47].map(y => (
          <path key={y} d={`M66 ${y + 3}q10 -6 20 0t20 0t20 0t20 0`} stroke="currentColor" strokeWidth="1.5" />
        ))}
      </svg>
      <span className="absolute top-[23px] left-[18px] w-[29px] text-center font-mono text-[8px] leading-[9px] font-medium">
        {day} {month}
        <br />
        {year}
      </span>
    </span>
  )
}

/** Two crossing ink lines behind the "years ago" stat */
export function InkLines({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 390 240" fill="none" preserveAspectRatio="none" aria-hidden="true" className={className}>
      <path d="M-20 200C90 120 200 40 420 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d="M-10 60C120 150 300 170 410 110" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function LongArrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 39 10" fill="none" aria-hidden="true" className={className}>
      <path d="M0 4.625H38M33 8.625L38 4.625L33 0.625" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CloseIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className={className}>
      <path d="M0.75 0.75L10.75 10.75M10.75 0.75L0.75 10.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function Brand({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 text-[16px] leading-[21px] font-bold tracking-[-0.02em] ${className}`}>
      <svg viewBox="0 0 88 88" fill="none" className="size-[22px]" aria-hidden="true">
        <circle cx="44" cy="44" r="40.12" stroke="currentColor" strokeWidth="3.88" />
        <g stroke="currentColor" strokeWidth="3.88" strokeLinecap="round">
          <line x1="44" y1="10.35" x2="44" y2="19.41" />
          <line x1="77.65" y1="44" x2="68.59" y2="44" />
          <line x1="44" y1="77.65" x2="44" y2="68.59" />
          <line x1="10.35" y1="44" x2="19.41" y2="44" />
        </g>
        <line x1="44" y1="44" x2="28.99" y2="28.99" stroke="currentColor" strokeWidth="4.53" strokeLinecap="round" />
        <line x1="44" y1="44" x2="58.2" y2="27.2" stroke="currentColor" strokeWidth="3.24" strokeLinecap="round" />
        <circle cx="44" cy="44" r="4.53" fill="currentColor" />
      </svg>
      <span>
        That<span className="text-ink-muted">Day</span>
      </span>
    </span>
  )
}

export { STAMP_INK, STAMP_PAPER }
