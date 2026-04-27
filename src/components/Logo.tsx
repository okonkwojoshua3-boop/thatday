export function ThatDayLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 sm:gap-2.5 ${className ?? ''}`}>
      <svg className="w-6 h-6 sm:w-[34px] sm:h-[34px] shrink-0" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <circle cx="17" cy="17" r="15.5" stroke="#111111" strokeWidth="1.5" />
        <line x1="17" y1="4" x2="17" y2="7.5" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="17" x2="26.5" y2="17" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="17" y1="30" x2="17" y2="26.5" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4" y1="17" x2="7.5" y2="17" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="17" cy="17" r="1.75" fill="#111111" />
        <line x1="17" y1="17" x2="11.2" y2="11.2" stroke="#111111" strokeWidth="1.75" strokeLinecap="round" />
        <line x1="17" y1="17" x2="22.5" y2="10.5" stroke="#111111" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
      <span className="text-[1rem] sm:text-[1.35rem] font-bold tracking-tight text-zinc-900 leading-none">
        That<span className="text-zinc-400">Day</span>
      </span>
    </div>
  )
}
