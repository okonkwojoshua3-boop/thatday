import type { HistoricalCosts } from '@/types'

interface CostsWithMeta {
  costs: HistoricalCosts
  currencySymbol: string
  currencyCode: string
}

type YearMap = Record<number, HistoricalCosts>

// ── US (USD) ──────────────────────────────────────────────────────────────────
const usCosts: YearMap = {
  1950: { gas: 0.18, bread: 0.12, movieTicket: 0.53, eggs: 0.60, newCar: 1510,  coffee: 0.05 },
  1955: { gas: 0.22, bread: 0.17, movieTicket: 0.70, eggs: 0.61, newCar: 1910,  coffee: 0.10 },
  1960: { gas: 0.31, bread: 0.20, movieTicket: 0.70, eggs: 0.57, newCar: 2610,  coffee: 0.15 },
  1965: { gas: 0.31, bread: 0.21, movieTicket: 0.85, eggs: 0.53, newCar: 2590,  coffee: 0.20 },
  1970: { gas: 0.36, bread: 0.24, movieTicket: 1.55, eggs: 0.62, newCar: 3542,  coffee: 0.25 },
  1975: { gas: 0.57, bread: 0.35, movieTicket: 2.05, eggs: 0.77, newCar: 4950,  coffee: 0.50 },
  1980: { gas: 1.25, bread: 0.51, movieTicket: 2.69, eggs: 0.84, newCar: 7609,  coffee: 0.75 },
  1985: { gas: 1.12, bread: 0.78, movieTicket: 3.55, eggs: 0.80, newCar: 9005,  coffee: 1.00 },
  1990: { gas: 1.16, bread: 0.89, movieTicket: 4.23, eggs: 1.00, newCar: 15472, coffee: 1.25 },
  1995: { gas: 1.15, bread: 0.92, movieTicket: 4.35, eggs: 1.16, newCar: 17137, coffee: 1.50 },
  2000: { gas: 1.51, bread: 1.99, movieTicket: 5.39, eggs: 0.96, newCar: 21850, coffee: 1.75 },
  2005: { gas: 2.30, bread: 2.02, movieTicket: 6.41, eggs: 1.12, newCar: 28400, coffee: 2.00 },
  2010: { gas: 2.79, bread: 2.79, movieTicket: 7.89, eggs: 1.54, newCar: 29217, coffee: 2.25 },
  2015: { gas: 2.43, bread: 2.50, movieTicket: 8.61, eggs: 2.00, newCar: 33560, coffee: 2.75 },
  2020: { gas: 2.17, bread: 2.98, movieTicket: 9.16, eggs: 1.81, newCar: 37851, coffee: 3.45 },
  2024: { gas: 3.31, bread: 4.22, movieTicket: 11.00, eggs: 3.50, newCar: 48401, coffee: 4.95 },
}

// ── UK (GBP) — petrol per gallon equivalent ──────────────────────────────────
const gbCosts: YearMap = {
  1950: { gas: 0.16, bread: 0.07, movieTicket: 0.22, eggs: 0.24, newCar: 844,   coffee: 0.06 },
  1955: { gas: 0.22, bread: 0.08, movieTicket: 0.25, eggs: 0.26, newCar: 950,   coffee: 0.07 },
  1960: { gas: 0.30, bread: 0.10, movieTicket: 0.28, eggs: 0.28, newCar: 1100,  coffee: 0.09 },
  1965: { gas: 0.33, bread: 0.12, movieTicket: 0.35, eggs: 0.30, newCar: 1400,  coffee: 0.11 },
  1970: { gas: 0.37, bread: 0.14, movieTicket: 0.40, eggs: 0.32, newCar: 1800,  coffee: 0.13 },
  1975: { gas: 0.70, bread: 0.22, movieTicket: 0.80, eggs: 0.48, newCar: 3200,  coffee: 0.22 },
  1980: { gas: 1.56, bread: 0.39, movieTicket: 1.50, eggs: 0.60, newCar: 5200,  coffee: 0.40 },
  1985: { gas: 1.90, bread: 0.50, movieTicket: 2.50, eggs: 0.72, newCar: 7200,  coffee: 0.60 },
  1990: { gas: 2.00, bread: 0.56, movieTicket: 3.50, eggs: 0.88, newCar: 9800,  coffee: 0.80 },
  1995: { gas: 2.40, bread: 0.65, movieTicket: 4.50, eggs: 1.02, newCar: 12500, coffee: 1.00 },
  2000: { gas: 3.50, bread: 0.78, movieTicket: 5.50, eggs: 1.10, newCar: 16000, coffee: 1.50 },
  2005: { gas: 4.50, bread: 0.90, movieTicket: 7.00, eggs: 1.25, newCar: 18500, coffee: 1.80 },
  2010: { gas: 5.00, bread: 1.20, movieTicket: 8.50, eggs: 1.52, newCar: 20500, coffee: 2.20 },
  2015: { gas: 4.40, bread: 1.10, movieTicket: 10.00, eggs: 1.80, newCar: 23500, coffee: 2.60 },
  2020: { gas: 4.80, bread: 1.12, movieTicket: 10.00, eggs: 1.89, newCar: 28000, coffee: 3.20 },
  2024: { gas: 6.50, bread: 1.45, movieTicket: 13.00, eggs: 2.50, newCar: 35000, coffee: 4.50 },
}

// ── Nigeria (NGN) ─────────────────────────────────────────────────────────────
const ngCosts: YearMap = {
  1970: { gas: 0.06,  bread: 0.05,  movieTicket: 0.10,  eggs: 0.08,  coffee: 0.04  },
  1975: { gas: 0.08,  bread: 0.07,  movieTicket: 0.15,  eggs: 0.12,  coffee: 0.06  },
  1980: { gas: 0.20,  bread: 0.15,  movieTicket: 0.50,  eggs: 0.25,  coffee: 0.12  },
  1985: { gas: 0.39,  bread: 0.20,  movieTicket: 0.80,  eggs: 0.35,  coffee: 0.18  },
  1990: { gas: 0.70,  bread: 0.40,  movieTicket: 1.50,  eggs: 0.60,  coffee: 0.30  },
  1995: { gas: 1.50,  bread: 0.80,  movieTicket: 2.50,  eggs: 1.00,  coffee: 0.60  },
  2000: { gas: 3.00,  bread: 1.50,  movieTicket: 5.00,  eggs: 2.00,  coffee: 1.20  },
  2005: { gas: 6.50,  bread: 2.50,  movieTicket: 8.00,  eggs: 3.50,  coffee: 2.00  },
  2010: { gas: 13.00, bread: 4.00,  movieTicket: 12.00, eggs: 5.00,  coffee: 3.50  },
  2015: { gas: 30.00, bread: 8.00,  movieTicket: 20.00, eggs: 10.00, coffee: 6.00  },
  2020: { gas: 75.00, bread: 15.00, movieTicket: 40.00, eggs: 18.00, coffee: 12.00 },
  2024: { gas: 700.00, bread: 80.00, movieTicket: 200.00, eggs: 90.00, coffee: 60.00 },
}

// ── South Africa (ZAR) ────────────────────────────────────────────────────────
const zaCosts: YearMap = {
  1970: { gas: 0.10,  bread: 0.07,  movieTicket: 0.30,  eggs: 0.18,  coffee: 0.08  },
  1975: { gas: 0.15,  bread: 0.10,  movieTicket: 0.50,  eggs: 0.25,  coffee: 0.12  },
  1980: { gas: 0.35,  bread: 0.22,  movieTicket: 0.80,  eggs: 0.40,  coffee: 0.22  },
  1985: { gas: 0.60,  bread: 0.40,  movieTicket: 1.20,  eggs: 0.60,  coffee: 0.35  },
  1990: { gas: 0.90,  bread: 0.65,  movieTicket: 2.00,  eggs: 0.80,  coffee: 0.55  },
  1995: { gas: 1.60,  bread: 1.20,  movieTicket: 4.00,  eggs: 1.50,  coffee: 1.00  },
  2000: { gas: 2.80,  bread: 2.20,  movieTicket: 7.00,  eggs: 2.50,  coffee: 2.00  },
  2005: { gas: 5.00,  bread: 3.50,  movieTicket: 12.00, eggs: 4.00,  coffee: 3.50  },
  2010: { gas: 7.80,  bread: 6.50,  movieTicket: 22.00, eggs: 7.00,  coffee: 6.00  },
  2015: { gas: 11.00, bread: 11.00, movieTicket: 60.00, eggs: 12.00, coffee: 10.00 },
  2020: { gas: 13.00, bread: 16.00, movieTicket: 80.00, eggs: 18.00, coffee: 15.00 },
  2024: { gas: 22.00, bread: 24.00, movieTicket: 130.00, eggs: 28.00, coffee: 25.00 },
}

// ── Brazil (BRL) ──────────────────────────────────────────────────────────────
const brCosts: YearMap = {
  1970: { gas: 0.30,  bread: 0.10,  movieTicket: 0.50,  eggs: 0.20,  coffee: 0.12  },
  1975: { gas: 0.50,  bread: 0.20,  movieTicket: 0.80,  eggs: 0.35,  coffee: 0.20  },
  1980: { gas: 0.90,  bread: 0.40,  movieTicket: 1.20,  eggs: 0.60,  coffee: 0.35  },
  1985: { gas: 1.50,  bread: 0.70,  movieTicket: 1.80,  eggs: 1.00,  coffee: 0.60  },
  1990: { gas: 2.20,  bread: 1.00,  movieTicket: 2.50,  eggs: 1.40,  coffee: 0.90  },
  1995: { gas: 0.55,  bread: 0.45,  movieTicket: 2.00,  eggs: 1.20,  coffee: 0.70  },
  2000: { gas: 1.30,  bread: 0.80,  movieTicket: 4.00,  eggs: 1.80,  coffee: 1.20  },
  2005: { gas: 2.30,  bread: 1.50,  movieTicket: 8.00,  eggs: 3.00,  coffee: 2.20  },
  2010: { gas: 2.70,  bread: 2.20,  movieTicket: 12.00, eggs: 4.00,  coffee: 3.00  },
  2015: { gas: 3.50,  bread: 3.50,  movieTicket: 18.00, eggs: 6.00,  coffee: 4.50  },
  2020: { gas: 4.80,  bread: 5.00,  movieTicket: 22.00, eggs: 8.00,  coffee: 6.00  },
  2024: { gas: 6.50,  bread: 8.00,  movieTicket: 35.00, eggs: 12.00, coffee: 10.00 },
}

const COUNTRY_COSTS: Record<string, YearMap> = {
  world: usCosts, us: usCosts, gb: gbCosts, ng: ngCosts, za: zaCosts, br: brCosts,
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
  const lerp = (av: number | undefined, bv: number | undefined) =>
    av !== undefined && bv !== undefined ? parseFloat((av + (bv - av) * t).toFixed(2)) : undefined

  return {
    gas: lerp(a.gas, b.gas),
    bread: lerp(a.bread, b.bread),
    movieTicket: lerp(a.movieTicket, b.movieTicket),
    eggs: lerp(a.eggs, b.eggs),
    newCar: lerp(a.newCar, b.newCar),
    coffee: lerp(a.coffee, b.coffee),
  }
}

export function getCostsForYear(year: number, country = 'world'): CostsWithMeta {
  const map = COUNTRY_COSTS[country] ?? usCosts
  const { symbol, code } = CURRENCY_META[country] ?? { symbol: '$', code: 'USD' }
  return { costs: interpolate(map, year), currencySymbol: symbol, currencyCode: code }
}
