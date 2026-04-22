import type { FamousPerson } from '@/types'
import Image from 'next/image'

export default function PeopleSection({ people }: { people: FamousPerson[] }) {
  if (!people.length) return null
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Famous Birthdays on This Day</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {people.slice(0, 6).map((person) => (
          <a
            key={person.name}
            href={person.wikiUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-zinc-100 bg-white px-4 py-4 flex items-center gap-3 hover:border-zinc-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
          >
            <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden bg-zinc-100 ring-1 ring-zinc-200">
              {person.thumbnail ? (
                <Image
                  src={person.thumbnail}
                  alt={person.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm font-semibold">
                  {person.name[0]}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-zinc-800 text-sm font-medium leading-tight truncate group-hover:text-zinc-900 transition-colors">
                {person.name}
              </p>
              <p className="text-zinc-400 text-xs mt-0.5 truncate leading-snug">{person.profession}</p>
              {person.birthYear && (
                <p className="text-zinc-300 text-xs mt-0.5">b. {person.birthYear}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
