export function ThatDayLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        {/* Outer ring */}
        <circle cx="17" cy="17" r="15.5" stroke="#111111" strokeWidth="1.5" />
        {/* Inner tick marks at 12, 3, 6, 9 */}
        <line x1="17" y1="4" x2="17" y2="7.5" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="17" x2="26.5" y2="17" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="17" y1="30" x2="17" y2="26.5" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4" y1="17" x2="7.5" y2="17" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
        {/* Center dot */}
        <circle cx="17" cy="17" r="1.75" fill="#111111" />
        {/* Hour hand pointing to ~10 o'clock */}
        <line x1="17" y1="17" x2="11.2" y2="11.2" stroke="#111111" strokeWidth="1.75" strokeLinecap="round" />
        {/* Minute hand pointing to ~2 o'clock */}
        <line x1="17" y1="17" x2="22.5" y2="10.5" stroke="#111111" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
      <span className="text-[1.35rem] font-bold tracking-tight text-zinc-900 leading-none">
        That<span className="text-zinc-400">Day</span>
      </span>
    </div>
  )
}
