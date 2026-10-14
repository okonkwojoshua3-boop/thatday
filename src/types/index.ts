export interface Song {
  title: string
  artist: string
  chart: string
  /** The year this pick belongs to (can differ by one from the chosen year) */
  year: number
  /** chart: a real year-end chart No.1 · hit: the defining hit, no chart existed · week: this week's live chart */
  basis: 'chart' | 'hit' | 'week'
  albumArt?: string
  /** 30-second iTunes preview */
  previewUrl?: string
  url?: string
}

export interface HistoricalEvent {
  title: string
  description: string
  year: number
  wikiUrl?: string
  thumbnail?: string
}

export interface FamousPerson {
  name: string
  profession: string
  birthYear?: number
  wikiUrl?: string
  thumbnail?: string
}

export type HistoricalCosts = Record<string, number | undefined>

export interface CostItem {
  key: string
  label: string
  emoji: string
}
