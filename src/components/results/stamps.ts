// The stamp card: six stamps the visitor earns by doing things with a day,
// never by what our data happens to cover. Where a card has nothing to do
// (no preview to play, no other headlines), seeing it is enough.

export type StampKey = 'song' | 'front' | 'prices' | 'saved' | 'explorer' | 'share'

export type Stamps = Record<StampKey, boolean>

export const countStamps = (stamps: Stamps) => Object.values(stamps).filter(Boolean).length

/** What's still left to do, as a phrase for each missing stamp */
const TODO: Record<StampKey, string> = {
  song: 'play the song',
  front: 'read more headlines',
  prices: 'check the prices',
  saved: 'save it',
  explorer: 'rewind another day',
  share: 'send it',
}

export function stampsTodo(stamps: Stamps) {
  const left = (Object.keys(TODO) as StampKey[]).filter(k => !stamps[k]).map(k => TODO[k])
  if (left.length === 0) return null
  const text = left.length > 1 ? `${left.slice(0, -1).join(', ')} and ${left.at(-1)}` : left[0]
  return `${text.charAt(0).toUpperCase()}${text.slice(1)} to fill your card.`
}
