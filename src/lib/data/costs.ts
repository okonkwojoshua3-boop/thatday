import type { HistoricalCosts, CostItem } from '@/types'

export interface CostsWithMeta {
  costs: HistoricalCosts
  items: CostItem[]
  currencySymbol: string
  currencyCode: string
}

type YearMap = Record<number, HistoricalCosts>

// ── US (USD) — gallon gas, bread, movie, eggs, coffee, new car ───────────────
const usCosts: YearMap = {
  1950: { gas: 0.18, bread: 0.14, movieTicket: 0.53, eggs: 0.60, coffee: 0.05, newCar: 1510 },
  1955: { gas: 0.22, bread: 0.18, movieTicket: 0.70, eggs: 0.61, coffee: 0.10, newCar: 1910 },
  1960: { gas: 0.31, bread: 0.20, movieTicket: 0.70, eggs: 0.57, coffee: 0.15, newCar: 2610 },
  1965: { gas: 0.31, bread: 0.21, movieTicket: 0.85, eggs: 0.53, coffee: 0.20, newCar: 2590 },
  1970: { gas: 0.36, bread: 0.24, movieTicket: 1.55, eggs: 0.62, coffee: 0.25, newCar: 3542 },
  1975: { gas: 0.57, bread: 0.35, movieTicket: 2.05, eggs: 0.77, coffee: 0.50, newCar: 4950 },
  1980: { gas: 1.25, bread: 0.51, movieTicket: 2.69, eggs: 0.84, coffee: 0.75, newCar: 7609 },
  1985: { gas: 1.12, bread: 0.78, movieTicket: 3.55, eggs: 0.80, coffee: 1.00, newCar: 9005 },
  1990: { gas: 1.16, bread: 0.89, movieTicket: 4.23, eggs: 1.00, coffee: 1.25, newCar: 15472 },
  1995: { gas: 1.15, bread: 0.92, movieTicket: 4.35, eggs: 1.16, coffee: 1.50, newCar: 17137 },
  2000: { gas: 1.51, bread: 1.99, movieTicket: 5.39, eggs: 0.96, coffee: 1.75, newCar: 21850 },
  2005: { gas: 2.30, bread: 2.02, movieTicket: 6.41, eggs: 1.12, coffee: 2.00, newCar: 28400 },
  2010: { gas: 2.79, bread: 2.79, movieTicket: 7.89, eggs: 1.54, coffee: 2.25, newCar: 29217 },
  2015: { gas: 2.43, bread: 2.50, movieTicket: 8.61, eggs: 2.00, coffee: 2.75, newCar: 33560 },
  2020: { gas: 2.17, bread: 2.98, movieTicket: 9.16, eggs: 1.81, coffee: 3.45, newCar: 37851 },
  2024: { gas: 3.31, bread: 4.22, movieTicket: 11.00, eggs: 3.50, coffee: 4.95, newCar: 48401 },
}

const US_ITEMS: CostItem[] = [
  { key: 'gas',         label: 'Gallon of gas',   emoji: '⛽' },
  { key: 'bread',       label: 'Loaf of bread',   emoji: '🍞' },
  { key: 'movieTicket', label: 'Movie ticket',     emoji: '🎬' },
  { key: 'eggs',        label: 'Dozen eggs',       emoji: '🥚' },
  { key: 'coffee',      label: 'Cup of coffee',    emoji: '☕' },
  { key: 'newCar',      label: 'Average new car',  emoji: '🚗' },
]

// ── UK (GBP) — petrol/litre, bread, eggs, cinema, pint of beer, cup of tea ──
const gbCosts: YearMap = {
  1950: { petrol: 0.05, bread: 0.07, eggs: 0.22, movieTicket: 0.20, beer: 0.06, tea: 0.04 },
  1955: { petrol: 0.07, bread: 0.08, eggs: 0.24, movieTicket: 0.23, beer: 0.09, tea: 0.05 },
  1960: { petrol: 0.07, bread: 0.10, eggs: 0.26, movieTicket: 0.25, beer: 0.12, tea: 0.06 },
  1965: { petrol: 0.08, bread: 0.11, eggs: 0.28, movieTicket: 0.30, beer: 0.15, tea: 0.07 },
  1970: { petrol: 0.09, bread: 0.13, eggs: 0.30, movieTicket: 0.38, beer: 0.18, tea: 0.08 },
  1975: { petrol: 0.17, bread: 0.22, eggs: 0.46, movieTicket: 0.75, beer: 0.32, tea: 0.12 },
  1980: { petrol: 0.35, bread: 0.38, eggs: 0.58, movieTicket: 1.40, beer: 0.58, tea: 0.22 },
  1985: { petrol: 0.42, bread: 0.50, eggs: 0.70, movieTicket: 2.40, beer: 0.80, tea: 0.35 },
  1990: { petrol: 0.44, bread: 0.55, eggs: 0.86, movieTicket: 3.20, beer: 1.10, tea: 0.50 },
  1995: { petrol: 0.56, bread: 0.62, eggs: 1.00, movieTicket: 4.20, beer: 1.60, tea: 0.70 },
  2000: { petrol: 0.76, bread: 0.78, eggs: 1.10, movieTicket: 5.20, beer: 2.00, tea: 1.00 },
  2005: { petrol: 0.90, bread: 0.90, eggs: 1.22, movieTicket: 6.50, beer: 2.40, tea: 1.30 },
  2010: { petrol: 1.20, bread: 1.20, eggs: 1.50, movieTicket: 8.00, beer: 3.00, tea: 1.80 },
  2015: { petrol: 1.12, bread: 1.10, eggs: 1.75, movieTicket: 10.00, beer: 3.60, tea: 2.20 },
  2020: { petrol: 1.05, bread: 1.12, eggs: 1.89, movieTicket: 10.50, beer: 4.20, tea: 2.70 },
  2024: { petrol: 1.50, bread: 1.45, eggs: 2.50, movieTicket: 14.00, beer: 6.00, tea: 3.20 },
}

const GB_ITEMS: CostItem[] = [
  { key: 'petrol',      label: 'Litre of petrol',  emoji: '⛽' },
  { key: 'bread',       label: 'Loaf of bread',    emoji: '🍞' },
  { key: 'eggs',        label: 'Dozen eggs',        emoji: '🥚' },
  { key: 'movieTicket', label: 'Cinema ticket',     emoji: '🎬' },
  { key: 'beer',        label: 'Pint of beer',      emoji: '🍺' },
  { key: 'tea',         label: 'Cup of tea',        emoji: '🍵' },
]

// ── Nigeria (NGN) — fuel/litre, bread, 1kg rice, Coke 35cl, dozen eggs, bus fare
// Sources: NNPC pump prices, NBS Consumer Price Survey, CBN Annual Reports
const ngCosts: YearMap = {
  1970: { fuel: 0.06,   bread: 0.08,    rice: 0.10,    coke: 0.06,   eggs: 0.12,    busRide: 0.05   },
  1975: { fuel: 0.08,   bread: 0.15,    rice: 0.25,    coke: 0.10,   eggs: 0.20,    busRide: 0.08   },
  1980: { fuel: 0.20,   bread: 0.25,    rice: 0.45,    coke: 0.20,   eggs: 0.40,    busRide: 0.15   },
  1985: { fuel: 0.39,   bread: 0.50,    rice: 0.90,    coke: 0.35,   eggs: 0.65,    busRide: 0.30   },
  1990: { fuel: 0.60,   bread: 1.50,    rice: 2.80,    coke: 0.80,   eggs: 2.50,    busRide: 0.80   },
  1995: { fuel: 1.50,   bread: 8.00,    rice: 15.00,   coke: 4.00,   eggs: 12.00,   busRide: 3.00   },
  2000: { fuel: 3.00,   bread: 25.00,   rice: 40.00,   coke: 12.00,  eggs: 50.00,   busRide: 10.00  },
  2005: { fuel: 4.00,   bread: 40.00,   rice: 60.00,   coke: 20.00,  eggs: 80.00,   busRide: 15.00  },
  2010: { fuel: 65.00,  bread: 70.00,   rice: 100.00,  coke: 35.00,  eggs: 150.00,  busRide: 30.00  },
  2015: { fuel: 87.00,  bread: 150.00,  rice: 180.00,  coke: 60.00,  eggs: 350.00,  busRide: 60.00  },
  2020: { fuel: 162.00, bread: 300.00,  rice: 450.00,  coke: 150.00, eggs: 700.00,  busRide: 150.00 },
  2024: { fuel: 730.00, bread: 1200.00, rice: 2000.00, coke: 400.00, eggs: 2500.00, busRide: 600.00 },
}

const NG_ITEMS: CostItem[] = [
  { key: 'fuel',    label: 'Litre of fuel',   emoji: '⛽' },
  { key: 'bread',   label: 'Loaf of bread',   emoji: '🍞' },
  { key: 'rice',    label: '1 kg of rice',    emoji: '🍚' },
  { key: 'coke',    label: 'Bottle of Coke',  emoji: '🥤' },
  { key: 'eggs',    label: 'Dozen eggs',       emoji: '🥚' },
  { key: 'busRide', label: 'Bus (danfo) fare', emoji: '🚌' },
]

// ── South Africa (ZAR) — petrol/litre, bread, eggs, movie, Castle beer, coffee
// Sources: AA South Africa, Stats SA CPI, Ster-Kinekor historical pricing
const zaCosts: YearMap = {
  1970: { petrol: 0.08,  bread: 0.12,  eggs: 0.20,  movieTicket: 0.30,  beer: 0.12,  coffee: 0.10  },
  1975: { petrol: 0.14,  bread: 0.20,  eggs: 0.35,  movieTicket: 0.50,  beer: 0.20,  coffee: 0.18  },
  1980: { petrol: 0.28,  bread: 0.36,  eggs: 0.55,  movieTicket: 0.80,  beer: 0.35,  coffee: 0.28  },
  1985: { petrol: 0.50,  bread: 0.60,  eggs: 0.80,  movieTicket: 1.20,  beer: 0.55,  coffee: 0.50  },
  1990: { petrol: 0.65,  bread: 0.90,  eggs: 1.10,  movieTicket: 2.50,  beer: 0.85,  coffee: 0.80  },
  1995: { petrol: 1.35,  bread: 1.70,  eggs: 2.50,  movieTicket: 10.00, beer: 2.20,  coffee: 4.00  },
  2000: { petrol: 2.40,  bread: 2.80,  eggs: 4.00,  movieTicket: 22.00, beer: 3.50,  coffee: 6.00  },
  2005: { petrol: 5.00,  bread: 4.50,  eggs: 7.00,  movieTicket: 35.00, beer: 5.50,  coffee: 10.00 },
  2010: { petrol: 8.50,  bread: 7.00,  eggs: 12.00, movieTicket: 50.00, beer: 8.00,  coffee: 18.00 },
  2015: { petrol: 11.50, bread: 11.50, eggs: 16.00, movieTicket: 70.00, beer: 13.00, coffee: 28.00 },
  2020: { petrol: 14.50, bread: 14.50, eggs: 36.00, movieTicket: 85.00, beer: 19.00, coffee: 38.00 },
  2024: { petrol: 22.00, bread: 21.00, eggs: 58.00, movieTicket: 130.00, beer: 25.00, coffee: 50.00 },
}

const ZA_ITEMS: CostItem[] = [
  { key: 'petrol',      label: 'Litre of petrol',   emoji: '⛽' },
  { key: 'bread',       label: 'Loaf of bread',     emoji: '🍞' },
  { key: 'eggs',        label: 'Dozen eggs',         emoji: '🥚' },
  { key: 'movieTicket', label: 'Movie ticket',       emoji: '🎬' },
  { key: 'beer',        label: 'Can of Castle beer', emoji: '🍺' },
  { key: 'coffee',      label: 'Cup of coffee',      emoji: '☕' },
]

// ── Brazil (BRL) — gasolina/litre, bread, coffee (essential!), beer, bus, cinema
// Sources: ANP fuel surveys, IBGE IPCA, ANTP transport data
// Note: BRL introduced July 1994; pre-1994 values are inflation-adjusted equivalents
const brCosts: YearMap = {
  1960: { petrol: 0.003, bread: 0.03,  coffee: 0.02,  beer: 0.03,  busRide: 0.01,  movieTicket: 0.04  },
  1970: { petrol: 0.01,  bread: 0.08,  coffee: 0.05,  beer: 0.06,  busRide: 0.03,  movieTicket: 0.10  },
  1980: { petrol: 0.02,  bread: 0.12,  coffee: 0.08,  beer: 0.10,  busRide: 0.05,  movieTicket: 0.15  },
  1985: { petrol: 0.05,  bread: 0.20,  coffee: 0.14,  beer: 0.18,  busRide: 0.08,  movieTicket: 0.25  },
  1990: { petrol: 0.10,  bread: 0.35,  coffee: 0.25,  beer: 0.30,  busRide: 0.12,  movieTicket: 0.45  },
  1995: { petrol: 0.65,  bread: 1.20,  coffee: 0.70,  beer: 1.00,  busRide: 0.50,  movieTicket: 2.50  },
  2000: { petrol: 1.30,  bread: 2.00,  coffee: 1.20,  beer: 2.50,  busRide: 1.00,  movieTicket: 5.00  },
  2005: { petrol: 2.30,  bread: 3.00,  coffee: 1.80,  beer: 3.50,  busRide: 1.80,  movieTicket: 9.00  },
  2010: { petrol: 2.70,  bread: 4.00,  coffee: 2.50,  beer: 4.50,  busRide: 2.30,  movieTicket: 14.00 },
  2015: { petrol: 3.50,  bread: 5.50,  coffee: 3.50,  beer: 6.00,  busRide: 3.50,  movieTicket: 22.00 },
  2020: { petrol: 4.20,  bread: 6.50,  coffee: 4.50,  beer: 6.50,  busRide: 4.05,  movieTicket: 25.00 },
  2024: { petrol: 5.89,  bread: 9.00,  coffee: 8.00,  beer: 8.50,  busRide: 4.80,  movieTicket: 35.00 },
}

const BR_ITEMS: CostItem[] = [
  { key: 'petrol',      label: 'Litre of gasolina', emoji: '⛽' },
  { key: 'bread',       label: 'Bread (pão)',        emoji: '🍞' },
  { key: 'coffee',      label: 'Cup of coffee',      emoji: '☕' },
  { key: 'beer',        label: 'Bottle of beer',     emoji: '🍺' },
  { key: 'busRide',     label: 'Bus fare (ônibus)',  emoji: '🚌' },
  { key: 'movieTicket', label: 'Cinema ticket',      emoji: '🎬' },
]

const COUNTRY_COSTS: Record<string, YearMap> = {
  world: usCosts, us: usCosts, gb: gbCosts, ng: ngCosts, za: zaCosts, br: brCosts,
}

const COUNTRY_ITEMS: Record<string, CostItem[]> = {
  world: US_ITEMS, us: US_ITEMS, gb: GB_ITEMS, ng: NG_ITEMS, za: ZA_ITEMS, br: BR_ITEMS,
}

const CURRENCY_META: Record<string, { symbol: string; code: string }> = {
  world: { symbol: '$',  code: 'USD' },
  us:    { symbol: '$',  code: 'USD' },
  gb:    { symbol: '£',  code: 'GBP' },
  ng:    { symbol: '₦',  code: 'NGN' },
  za:    { symbol: 'R',  code: 'ZAR' },
  br:    { symbol: 'R$', code: 'BRL' },
}

function interpolate(map: YearMap, year: number): HistoricalCosts {
  const sorted = Object.keys(map).map(Number).sort((a, b) => a - b)
  if (year <= sorted[0]) return map[sorted[0]]
  if (year >= sorted[sorted.length - 1]) return map[sorted[sorted.length - 1]]

  let lo = sorted[0], hi = sorted[sorted.length - 1]
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i] <= year && year <= sorted[i + 1]) { lo = sorted[i]; hi = sorted[i + 1]; break }
  }
  if (lo === hi) return map[lo]

  const t = (year - lo) / (hi - lo)
  const a = map[lo], b = map[hi]
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  const result: HistoricalCosts = {}
  for (const key of keys) {
    const av = a[key], bv = b[key]
    if (av !== undefined && bv !== undefined) {
      result[key] = parseFloat((av + (bv - av) * t).toFixed(2))
    }
  }
  return result
}

export function getCostsForYear(year: number, country = 'world'): CostsWithMeta {
  const map = COUNTRY_COSTS[country] ?? usCosts
  const items = COUNTRY_ITEMS[country] ?? US_ITEMS
  const { symbol, code } = CURRENCY_META[country] ?? { symbol: '$', code: 'USD' }
  return { costs: interpolate(map, year), items, currencySymbol: symbol, currencyCode: code }
}
