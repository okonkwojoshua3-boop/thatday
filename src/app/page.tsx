import DatePicker from '@/components/DatePicker'
import { ThatDayLogo } from '@/components/Logo'

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center min-h-svh px-6 py-20 bg-background">
      <div className="flex flex-col items-center text-center gap-10 max-w-md w-full">

        <div className="flex flex-col items-center gap-5">
          <ThatDayLogo />
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-400">
            Your personal time capsule
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.05] text-balance">
            Step back<br />in time.
          </h1>
          <p className="text-zinc-500 text-base leading-relaxed max-w-sm">
            Pick any date from 1950 to yesterday.<br />
            Discover songs, events, birthdays, and prices.
          </p>
        </div>

        <DatePicker />

      </div>
    </main>
  )
}
