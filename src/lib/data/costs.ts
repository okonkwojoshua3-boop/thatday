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

// ── India (INR) — petrol/litre, bread, rice/kg, chai, movie ticket, auto fare ─
// Sources: PPAC fuel data, RBI CPI, FICCI Multiplex reports
const inCosts: YearMap = {
  1960: { petrol: 0.30,  bread: 0.25,  rice: 0.30,  chai: 0.05,  movieTicket: 0.30,  autoFare: 0.10  },
  1970: { petrol: 0.57,  bread: 0.50,  rice: 0.50,  chai: 0.10,  movieTicket: 0.50,  autoFare: 0.20  },
  1980: { petrol: 1.97,  bread: 1.20,  rice: 1.50,  chai: 0.25,  movieTicket: 1.50,  autoFare: 0.50  },
  1990: { petrol: 8.50,  bread: 3.00,  rice: 4.00,  chai: 0.75,  movieTicket: 7.00,  autoFare: 2.50  },
  2000: { petrol: 22.00, bread: 10.00, rice: 12.00, chai: 2.00,  movieTicket: 40.00, autoFare: 8.00  },
  2005: { petrol: 40.00, bread: 15.00, rice: 18.00, chai: 4.00,  movieTicket: 80.00, autoFare: 12.00 },
  2010: { petrol: 55.00, bread: 20.00, rice: 25.00, chai: 6.00,  movieTicket: 120.00, autoFare: 20.00 },
  2015: { petrol: 62.00, bread: 30.00, rice: 35.00, chai: 8.00,  movieTicket: 150.00, autoFare: 30.00 },
  2020: { petrol: 71.00, bread: 40.00, rice: 45.00, chai: 12.00, movieTicket: 200.00, autoFare: 40.00 },
  2024: { petrol: 95.00, bread: 55.00, rice: 65.00, chai: 20.00, movieTicket: 280.00, autoFare: 60.00 },
}

const IN_ITEMS: CostItem[] = [
  { key: 'petrol',      label: 'Litre of petrol',  emoji: '⛽' },
  { key: 'bread',       label: 'Loaf of bread',    emoji: '🍞' },
  { key: 'rice',        label: '1 kg of rice',     emoji: '🍚' },
  { key: 'chai',        label: 'Cup of chai',       emoji: '🍵' },
  { key: 'movieTicket', label: 'Movie ticket',      emoji: '🎬' },
  { key: 'autoFare',    label: 'Auto-rickshaw fare',emoji: '🛺' },
]

// ── Canada (CAD) — gas/litre, bread, eggs, coffee, movie, new car ─────────────
const caCosts: YearMap = {
  1950: { gas: 0.26, bread: 0.15, eggs: 0.55, coffee: 0.08, movieTicket: 0.45, newCar: 1500 },
  1960: { gas: 0.34, bread: 0.23, eggs: 0.52, coffee: 0.15, movieTicket: 0.75, newCar: 2700 },
  1970: { gas: 0.44, bread: 0.30, eggs: 0.60, coffee: 0.20, movieTicket: 1.50, newCar: 3600 },
  1980: { gas: 1.25, bread: 0.90, eggs: 1.30, coffee: 0.55, movieTicket: 4.00, newCar: 9500 },
  1990: { gas: 0.55, bread: 1.60, eggs: 1.80, coffee: 1.00, movieTicket: 7.00, newCar: 16000 },
  2000: { gas: 0.72, bread: 2.20, eggs: 2.40, coffee: 1.60, movieTicket: 10.00, newCar: 24000 },
  2010: { gas: 1.03, bread: 3.00, eggs: 3.20, coffee: 2.20, movieTicket: 13.00, newCar: 29000 },
  2015: { gas: 1.20, bread: 3.30, eggs: 4.00, coffee: 2.50, movieTicket: 15.00, newCar: 33500 },
  2020: { gas: 1.10, bread: 3.60, eggs: 4.40, coffee: 2.80, movieTicket: 16.00, newCar: 39000 },
  2024: { gas: 1.65, bread: 4.80, eggs: 5.80, coffee: 3.80, movieTicket: 18.00, newCar: 50000 },
}

const CA_ITEMS: CostItem[] = [
  { key: 'gas',         label: 'Litre of gas',    emoji: '⛽' },
  { key: 'bread',       label: 'Loaf of bread',   emoji: '🍞' },
  { key: 'eggs',        label: 'Dozen eggs',       emoji: '🥚' },
  { key: 'coffee',      label: 'Cup of coffee',   emoji: '☕' },
  { key: 'movieTicket', label: 'Movie ticket',     emoji: '🎬' },
  { key: 'newCar',      label: 'Average new car',  emoji: '🚗' },
]

// ── Australia (AUD) — petrol/litre, bread, eggs, flat white, beer, movie ──────
const auCosts: YearMap = {
  1960: { petrol: 0.24, bread: 0.18, eggs: 0.40, flatWhite: 0.15, beer: 0.10, movieTicket: 0.35 },
  1970: { petrol: 0.30, bread: 0.25, eggs: 0.55, flatWhite: 0.22, beer: 0.18, movieTicket: 0.60 },
  1980: { petrol: 0.65, bread: 0.65, eggs: 1.00, flatWhite: 0.60, beer: 0.55, movieTicket: 3.00 },
  1990: { petrol: 0.60, bread: 1.30, eggs: 2.00, flatWhite: 1.50, beer: 1.80, movieTicket: 8.00 },
  2000: { petrol: 0.92, bread: 2.20, eggs: 2.80, flatWhite: 2.50, beer: 3.50, movieTicket: 12.00 },
  2010: { petrol: 1.35, bread: 3.00, eggs: 4.20, flatWhite: 3.60, beer: 6.00, movieTicket: 16.00 },
  2015: { petrol: 1.30, bread: 3.50, eggs: 5.00, flatWhite: 4.00, beer: 7.50, movieTicket: 19.00 },
  2020: { petrol: 1.25, bread: 3.80, eggs: 5.80, flatWhite: 4.50, beer: 9.00, movieTicket: 22.00 },
  2024: { petrol: 2.10, bread: 5.20, eggs: 8.00, flatWhite: 5.50, beer: 11.50, movieTicket: 26.00 },
}

const AU_ITEMS: CostItem[] = [
  { key: 'petrol',      label: 'Litre of petrol',  emoji: '⛽' },
  { key: 'bread',       label: 'Loaf of bread',    emoji: '🍞' },
  { key: 'eggs',        label: 'Dozen eggs',        emoji: '🥚' },
  { key: 'flatWhite',   label: 'Flat white coffee', emoji: '☕' },
  { key: 'beer',        label: 'Stubby of beer',    emoji: '🍺' },
  { key: 'movieTicket', label: 'Movie ticket',      emoji: '🎬' },
]

// ── Germany (EUR) — petrol/litre, bread, eggs, coffee, beer 0.5L, cinema ──────
// Pre-2002 values converted from DEM at 1.955 DEM/EUR
const deCosts: YearMap = {
  1960: { petrol: 0.40, bread: 0.35, eggs: 0.22, coffee: 0.45, beer: 0.35, cinema: 0.95 },
  1970: { petrol: 0.50, bread: 0.50, eggs: 0.32, coffee: 0.60, beer: 0.48, cinema: 1.50 },
  1980: { petrol: 0.72, bread: 0.75, eggs: 0.55, coffee: 0.90, beer: 0.72, cinema: 3.50 },
  1985: { petrol: 0.74, bread: 0.95, eggs: 0.70, coffee: 1.10, beer: 0.88, cinema: 4.50 },
  1990: { petrol: 0.90, bread: 1.20, eggs: 0.95, coffee: 1.50, beer: 1.10, cinema: 6.00 },
  1995: { petrol: 1.10, bread: 1.50, eggs: 1.20, coffee: 2.00, beer: 1.40, cinema: 7.50 },
  2000: { petrol: 1.25, bread: 1.80, eggs: 1.50, coffee: 2.80, beer: 1.80, cinema: 9.00 },
  2005: { petrol: 1.35, bread: 2.10, eggs: 1.80, coffee: 3.50, beer: 2.20, cinema: 10.50 },
  2010: { petrol: 1.50, bread: 2.30, eggs: 2.10, coffee: 4.00, beer: 2.60, cinema: 12.00 },
  2015: { petrol: 1.30, bread: 2.50, eggs: 2.50, coffee: 4.50, beer: 3.00, cinema: 13.50 },
  2020: { petrol: 1.35, bread: 2.70, eggs: 2.80, coffee: 5.00, beer: 3.50, cinema: 14.50 },
  2024: { petrol: 1.90, bread: 3.60, eggs: 4.20, coffee: 6.50, beer: 4.80, cinema: 17.00 },
}

const DE_ITEMS: CostItem[] = [
  { key: 'petrol',  label: 'Litre of petrol',  emoji: '⛽' },
  { key: 'bread',   label: 'Loaf of bread',    emoji: '🍞' },
  { key: 'eggs',    label: 'Dozen eggs',        emoji: '🥚' },
  { key: 'coffee',  label: 'Cup of coffee',    emoji: '☕' },
  { key: 'beer',    label: 'Beer (0.5L)',       emoji: '🍺' },
  { key: 'cinema',  label: 'Cinema ticket',    emoji: '🎬' },
]

// ── France (EUR) — petrol/litre, baguette, wine/bottle, espresso, metro, cinema
// Pre-2002 values converted from FRF at 6.56 FRF/EUR
const frCosts: YearMap = {
  1960: { petrol: 0.48, baguette: 0.12, wine: 0.40, coffee: 0.25, metro: 0.12, cinema: 0.80 },
  1970: { petrol: 0.62, baguette: 0.18, wine: 0.65, coffee: 0.35, metro: 0.20, cinema: 1.20 },
  1980: { petrol: 1.20, baguette: 0.40, wine: 2.00, coffee: 0.70, metro: 0.45, cinema: 2.50 },
  1985: { petrol: 1.40, baguette: 0.55, wine: 3.00, coffee: 1.00, metro: 0.65, cinema: 3.50 },
  1990: { petrol: 1.25, baguette: 0.75, wine: 4.00, coffee: 1.30, metro: 0.90, cinema: 5.50 },
  1995: { petrol: 0.98, baguette: 0.85, wine: 5.00, coffee: 1.60, metro: 1.10, cinema: 7.00 },
  2000: { petrol: 0.92, baguette: 0.90, wine: 6.50, coffee: 1.90, metro: 1.30, cinema: 8.50 },
  2005: { petrol: 1.20, baguette: 0.95, wine: 7.50, coffee: 2.30, metro: 1.50, cinema: 9.50 },
  2010: { petrol: 1.40, baguette: 1.00, wine: 8.50, coffee: 2.70, metro: 1.70, cinema: 10.50 },
  2015: { petrol: 1.30, baguette: 1.08, wine: 9.50, coffee: 3.20, metro: 1.80, cinema: 12.00 },
  2020: { petrol: 1.35, baguette: 1.15, wine: 10.50, coffee: 3.80, metro: 1.90, cinema: 13.50 },
  2024: { petrol: 1.80, baguette: 1.40, wine: 13.00, coffee: 5.00, metro: 2.15, cinema: 15.00 },
}

const FR_ITEMS: CostItem[] = [
  { key: 'petrol',   label: 'Litre of petrol',    emoji: '⛽' },
  { key: 'baguette', label: 'Baguette',            emoji: '🥖' },
  { key: 'wine',     label: 'Bottle of wine',      emoji: '🍷' },
  { key: 'coffee',   label: 'Espresso',            emoji: '☕' },
  { key: 'metro',    label: 'Metro ticket',         emoji: '🚇' },
  { key: 'cinema',   label: 'Cinema ticket',        emoji: '🎬' },
]

// ── Japan (JPY) — petrol/litre, rice/5kg, ramen bowl, sushi plate, metro, cinema
const jpCosts: YearMap = {
  1960: { petrol: 15,  rice: 280,  ramen: 30,  sushi: 60,   metro: 10,  cinema: 120  },
  1970: { petrol: 32,  rice: 680,  ramen: 80,  sushi: 150,  metro: 20,  cinema: 370  },
  1980: { petrol: 90,  rice: 1600, ramen: 280, sushi: 400,  metro: 80,  cinema: 900  },
  1985: { petrol: 85,  rice: 1800, ramen: 380, sushi: 550,  metro: 110, cinema: 1300 },
  1990: { petrol: 115, rice: 2200, ramen: 450, sushi: 700,  metro: 140, cinema: 1600 },
  2000: { petrol: 96,  rice: 2100, ramen: 520, sushi: 800,  metro: 160, cinema: 1800 },
  2005: { petrol: 120, rice: 2000, ramen: 550, sushi: 850,  metro: 170, cinema: 1800 },
  2010: { petrol: 128, rice: 1950, ramen: 580, sushi: 900,  metro: 175, cinema: 1800 },
  2015: { petrol: 145, rice: 2100, ramen: 620, sushi: 1000, metro: 180, cinema: 1800 },
  2020: { petrol: 128, rice: 2200, ramen: 680, sushi: 1100, metro: 190, cinema: 1800 },
  2024: { petrol: 178, rice: 2900, ramen: 950, sushi: 1400, metro: 205, cinema: 2000 },
}

const JP_ITEMS: CostItem[] = [
  { key: 'petrol', label: 'Litre of petrol', emoji: '⛽' },
  { key: 'rice',   label: '5 kg of rice',    emoji: '🍚' },
  { key: 'ramen',  label: 'Bowl of ramen',   emoji: '🍜' },
  { key: 'sushi',  label: 'Sushi plate',     emoji: '🍣' },
  { key: 'metro',  label: 'Metro ticket',    emoji: '🚇' },
  { key: 'cinema', label: 'Cinema ticket',   emoji: '🎬' },
]

// ── Kenya (KES) — petrol/litre, bread, rice/kg, Coke, matatu fare, eggs ───────
const keCosts: YearMap = {
  1970: { petrol: 0.35,   bread: 0.40,  rice: 0.80,   coke: 0.30,  matatu: 0.20,  eggs: 0.10  },
  1980: { petrol: 1.50,   bread: 1.60,  rice: 3.50,   coke: 1.20,  matatu: 0.80,  eggs: 0.40  },
  1990: { petrol: 6.00,   bread: 5.00,  rice: 10.00,  coke: 4.00,  matatu: 3.00,  eggs: 1.50  },
  2000: { petrol: 30.00,  bread: 22.00, rice: 50.00,  coke: 18.00, matatu: 12.00, eggs: 5.00  },
  2005: { petrol: 65.00,  bread: 40.00, rice: 75.00,  coke: 30.00, matatu: 20.00, eggs: 8.00  },
  2010: { petrol: 90.00,  bread: 55.00, rice: 100.00, coke: 45.00, matatu: 30.00, eggs: 12.00 },
  2015: { petrol: 105.00, bread: 65.00, rice: 120.00, coke: 55.00, matatu: 40.00, eggs: 15.00 },
  2020: { petrol: 90.00,  bread: 70.00, rice: 130.00, coke: 60.00, matatu: 45.00, eggs: 18.00 },
  2024: { petrol: 215.00, bread: 100.00, rice: 180.00, coke: 80.00, matatu: 70.00, eggs: 28.00 },
}

const KE_ITEMS: CostItem[] = [
  { key: 'petrol', label: 'Litre of petrol',   emoji: '⛽' },
  { key: 'bread',  label: 'Loaf of bread',     emoji: '🍞' },
  { key: 'rice',   label: '1 kg of rice',      emoji: '🍚' },
  { key: 'coke',   label: 'Bottle of Coke',    emoji: '🥤' },
  { key: 'matatu', label: 'Matatu (bus) fare', emoji: '🚌' },
  { key: 'eggs',   label: 'Dozen eggs',         emoji: '🥚' },
]

// ── Ghana (GHS) — petrol/litre, bread, rice/kg, waakye plate, trotro, eggs ────
// Values in new GHS (post-2007 redenomination); pre-2007 backward-converted
const ghCosts: YearMap = {
  2000: { petrol: 0.50,  bread: 0.28, rice: 0.60,  waakye: 0.22, trotro: 0.12, eggs: 0.08 },
  2005: { petrol: 0.80,  bread: 0.45, rice: 0.90,  waakye: 0.35, trotro: 0.18, eggs: 0.12 },
  2008: { petrol: 1.50,  bread: 0.80, rice: 2.00,  waakye: 0.70, trotro: 0.40, eggs: 0.22 },
  2010: { petrol: 1.80,  bread: 1.00, rice: 2.50,  waakye: 0.90, trotro: 0.50, eggs: 0.28 },
  2015: { petrol: 4.20,  bread: 2.20, rice: 5.50,  waakye: 1.80, trotro: 1.20, eggs: 0.60 },
  2020: { petrol: 5.50,  bread: 3.50, rice: 8.00,  waakye: 3.00, trotro: 2.00, eggs: 1.00 },
  2024: { petrol: 15.00, bread: 10.00, rice: 25.00, waakye: 9.00, trotro: 5.50, eggs: 3.00 },
}

const GH_ITEMS: CostItem[] = [
  { key: 'petrol', label: 'Litre of petrol',  emoji: '⛽' },
  { key: 'bread',  label: 'Loaf of bread',    emoji: '🍞' },
  { key: 'rice',   label: '1 kg of rice',     emoji: '🍚' },
  { key: 'waakye', label: 'Waakye plate',     emoji: '🍛' },
  { key: 'trotro', label: 'Trotro fare',      emoji: '🚌' },
  { key: 'eggs',   label: 'Dozen eggs',        emoji: '🥚' },
]

const COUNTRY_COSTS: Record<string, YearMap> = {
  world: usCosts, us: usCosts, gb: gbCosts, ng: ngCosts, za: zaCosts, br: brCosts,
  in: inCosts, ca: caCosts, au: auCosts, de: deCosts, fr: frCosts,
  jp: jpCosts, ke: keCosts, gh: ghCosts,
}

const COUNTRY_ITEMS: Record<string, CostItem[]> = {
  world: US_ITEMS, us: US_ITEMS, gb: GB_ITEMS, ng: NG_ITEMS, za: ZA_ITEMS, br: BR_ITEMS,
  in: IN_ITEMS, ca: CA_ITEMS, au: AU_ITEMS, de: DE_ITEMS, fr: FR_ITEMS,
  jp: JP_ITEMS, ke: KE_ITEMS, gh: GH_ITEMS,
}

const CURRENCY_META: Record<string, { symbol: string; code: string }> = {
  world: { symbol: '$',   code: 'USD' },
  us:    { symbol: '$',   code: 'USD' },
  gb:    { symbol: '£',   code: 'GBP' },
  ng:    { symbol: '₦',   code: 'NGN' },
  za:    { symbol: 'R',   code: 'ZAR' },
  br:    { symbol: 'R$',  code: 'BRL' },
  in:    { symbol: '₹',   code: 'INR' },
  ca:    { symbol: 'CA$', code: 'CAD' },
  au:    { symbol: 'A$',  code: 'AUD' },
  de:    { symbol: '€',   code: 'EUR' },
  fr:    { symbol: '€',   code: 'EUR' },
  jp:    { symbol: '¥',   code: 'JPY' },
  ke:    { symbol: 'KSh', code: 'KES' },
  gh:    { symbol: 'GH₵', code: 'GHS' },
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
