import Image from 'next/image'
import type { Song } from '@/types'

export default function SongSection({ song, year }: { song: Song | null; year: number }) {
  if (!song) return null
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Song of the Year</h2>
      <div className="flex items-center gap-6 rounded-2xl border border-zinc-100 bg-white px-6 py-6 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">

        <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-zinc-100">
          {song.albumArt ? (
            <Image
              src={song.albumArt}
              alt={`${song.title} cover`}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center [animation:vinyl-spin_5s_linear_infinite]"
              style={{ backgroundImage: 'repeating-radial-gradient(circle, #27272a 0px, #27272a 2px, #3f3f46 2px, #3f3f46 4px)' }}
            >
              <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-zinc-400" />
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-zinc-900 font-semibold text-xl leading-tight truncate">{song.title}</p>
          <p className="text-zinc-500 text-sm mt-1 truncate">{song.artist}</p>
          <p className="text-zinc-300 text-xs mt-1.5 font-medium">{song.chart} · {year}</p>
        </div>
      </div>

      <style>{`
        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}
