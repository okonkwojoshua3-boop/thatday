import type { HistoricalCosts, CostItem } from '@/types'
import { fuelPrice } from './fuel'

export interface CostsWithMeta {
  costs: HistoricalCosts
  items: CostItem[]
  currencySymbol: string
  currencyCode: string
}

type YearMap = Record<number, HistoricalCosts>

// Everyday prices by country, rebuilt Oct 2026 from official average-price series
// (BLS, ONS, StatCan, ABS, Destatis, INSEE, Japan Retail Price Survey, NBS, Stats SA,
// KNBS, SPTrans) where they exist, and back-cast from today's price with World Bank
// CPI where they don't. Values are in today's currency (DM ÷1.95583, francs ÷6.55957,
// old cedis ÷10,000). An item is missing for years before its series starts.
// Fuel lives in ./fuel.ts.

// ── US (USD) ──
//   bread: BLS Handbook of Labor Statistics 1975 Table 131 / 1976 Table
//   movieTicket: NATO/Cinema United Annual Average U.S. Ticket Price (1948-20
//   eggs: BLS Handbook of Labor Statistics 1975/1976 (1950-1975,
const usCosts: YearMap = {
  1950: { bread: 0.143, movieTicket: 0.4, eggs: 0.604 },
  1955: { bread: 0.177, movieTicket: 0.53, eggs: 0.606 },
  1960: { bread: 0.203, movieTicket: 0.75, eggs: 0.573 },
  1965: { bread: 0.209, movieTicket: 1.02, eggs: 0.527 },
  1970: { bread: 0.243, movieTicket: 1.53, eggs: 0.614 },
  1975: { bread: 0.36, movieTicket: 2.03, eggs: 0.77 },
  1980: { bread: 0.509, movieTicket: 2.69, eggs: 0.844 },
  1985: { bread: 0.553, movieTicket: 3.55, eggs: 0.804 },
  1990: { bread: 0.695, movieTicket: 4.22, eggs: 1.01 },
  1995: { bread: 0.791, movieTicket: 4.35, eggs: 0.924 },
  2000: { bread: 0.93, movieTicket: 5.39, eggs: 0.913 },
  2005: { bread: 1.04, movieTicket: 6.41, eggs: 1.22 },
  2010: { bread: 1.37, movieTicket: 7.89, eggs: 1.66 },
  2015: { bread: 1.44, movieTicket: 8.43, eggs: 2.47 },
  2020: { bread: 1.45, movieTicket: 9.18, eggs: 1.51 },
  2024: { bread: 1.97, movieTicket: 11.31, eggs: 3.17 },
  2025: { bread: 1.87, movieTicket: 11.31, eggs: 4.25 },
  2026: { bread: 1.82, movieTicket: 11.72, eggs: 2.27 },
}

const US_ITEMS: CostItem[] = [
  { key: 'gas', label: 'Gallon of gas', emoji: '⛽' },
  { key: 'bread', label: 'Pound of bread', emoji: '🍞' },
  { key: 'movieTicket', label: 'Movie ticket', emoji: '🎬' },
  { key: 'eggs', label: 'Dozen eggs', emoji: '🥚' },
]

// ── UK (GBP) ──
//   bread: ONS RPI average prices (MM23): CZOH white sliced 800g
//   eggs: ONS RPI average prices: CZNU Eggs size 4 (55-60g) per dozen
//   movieTicket: Terra Media UK cinema average ticket price 1936-2000 (https:
//   beer: ONS RPI average prices CZMS Draught lager, per pint (CPI back-cast before 1990)
const gbCosts: YearMap = {
  1950: { bread: 0.023, eggs: 0.2, movieTicket: 0.075, beer: 0.081 },
  1955: { bread: 0.031, eggs: 0.28, movieTicket: 0.089, beer: 0.106 },
  1960: { bread: 0.048, eggs: 0.25, movieTicket: 0.127, beer: 0.12 },
  1965: { bread: 0.062, eggs: 0.22, movieTicket: 0.189, beer: 0.143 },
  1970: { bread: 0.09, eggs: 0.2, movieTicket: 0.306, beer: 0.179 },
  1975: { bread: 0.16, eggs: 0.36, movieTicket: 0.612, beer: 0.331 },
  1980: { bread: 0.33, eggs: 0.64, movieTicket: 1.42, beer: 0.647 },
  1985: { bread: 0.4, eggs: 0.84, movieTicket: 1.71, beer: 0.915 },
  1990: { bread: 0.5, eggs: 1.05, movieTicket: 2.81, beer: 1.22 },
  1995: { bread: 0.52, eggs: 1.18, movieTicket: 3.48, beer: 1.66 },
  2000: { bread: 0.52, eggs: 1.38, movieTicket: 4.35, beer: 2 },
  2005: { bread: 0.71, eggs: 1.55, movieTicket: 4.71, beer: 2.41 },
  2010: { bread: 1.2, eggs: 2.83, movieTicket: 5.95, beer: 2.94 },
  2015: { bread: 1.04, eggs: 2.29, movieTicket: 7.21, beer: 3.45 },
  2020: { bread: 1.05, eggs: 1.96, movieTicket: 6.75, beer: 3.78 },
  2024: { bread: 1.4, eggs: 3.24, movieTicket: 7.73, beer: 4.77 },
  2025: { bread: 1.4, eggs: 3.31, movieTicket: 8.01, beer: 4.83 },
  2026: { bread: 1.45, eggs: 3.07, movieTicket: 8.27, beer: 5.34 },
}

const GB_ITEMS: CostItem[] = [
  { key: 'petrol', label: 'Litre of petrol', emoji: '⛽' },
  { key: 'bread', label: 'Loaf of bread (800 g)', emoji: '🍞' },
  { key: 'eggs', label: 'Dozen eggs', emoji: '🥚' },
  { key: 'movieTicket', label: 'Cinema ticket', emoji: '🎬' },
  { key: 'beer', label: 'Pint of lager', emoji: '🍺' },
]

// ── Nigeria (NGN) ──
//   bread: NBS Selected Food Prices Watch (CPI back-cast before 2016)
//   rice: NBS Selected Food Prices Watch (https://nigerianstat.gov.ng/ (CPI back-cast before 2016)
//   coke: Anchor: Numbeo country page, (CPI back-cast)
//   eggs: NBS Selected Food Prices Watch (https://nigerianstat.gov.ng/ (CPI back-cast before 2016)
const ngCosts: YearMap = {
  1970: { bread: 0.122, rice: 0.088, coke: 0.046, eggs: 0.177 },
  1975: { bread: 0.232, rice: 0.168, coke: 0.089, eggs: 0.339 },
  1980: { bread: 0.496, rice: 0.36, coke: 0.189, eggs: 0.724 },
  1985: { bread: 1.01, rice: 0.73, coke: 0.384, eggs: 1.47 },
  1990: { bread: 2.96, rice: 2.14, coke: 1.13, eggs: 4.32 },
  1995: { bread: 20.62, rice: 14.94, coke: 7.87, eggs: 30.09 },
  2000: { bread: 36.28, rice: 26.28, coke: 13.84, eggs: 52.93 },
  2005: { bread: 75.25, rice: 54.51, coke: 28.71, eggs: 109.8 },
  2010: { bread: 122.6, rice: 88.8, coke: 46.77, eggs: 178.8 },
  2015: { bread: 194.8, rice: 141.1, coke: 74.34, eggs: 284.2 },
  2016: { bread: 225.4, rice: 163.29, eggs: 328.84 },
  2020: { bread: 302.45, rice: 338.58, coke: 141.7, eggs: 454.17 },
  2024: { bread: 904.02, rice: 1022, coke: 327.1, eggs: 1310 },
  2025: { bread: 1605, rice: 2068, coke: 402.4, eggs: 2976 },
  2026: { bread: 1667, rice: 1842, coke: 465.17, eggs: 2882 },
}

const NG_ITEMS: CostItem[] = [
  { key: 'fuel', label: 'Litre of fuel', emoji: '⛽' },
  { key: 'bread', label: 'Loaf of bread', emoji: '🍞' },
  { key: 'rice', label: '1 kg of rice', emoji: '🍚' },
  { key: 'coke', label: 'Bottle of Coke', emoji: '🥤' },
  { key: 'eggs', label: 'Dozen eggs', emoji: '🥚' },
]

// ── South Africa (ZAR) ──
//   bread: Stats SA "Making rands and sense of price data" (https://www (CPI back-cast before 2017)
//   eggs: Anchor: Numbeo country page, (CPI back-cast)
//   movieTicket: Anchor: Numbeo country page, (CPI back-cast)
//   beer: Anchor: Numbeo country page, (CPI back-cast)
const zaCosts: YearMap = {
  1970: { bread: 0.216, eggs: 0.452, movieTicket: 1.29, beer: 0.263 },
  1975: { bread: 0.337, eggs: 0.707, movieTicket: 2.01, beer: 0.412 },
  1980: { bread: 0.596, eggs: 1.25, movieTicket: 3.55, beer: 0.727 },
  1985: { bread: 1.15, eggs: 2.4, movieTicket: 6.84, beer: 1.4 },
  1990: { bread: 2.34, eggs: 4.9, movieTicket: 13.95, beer: 2.85 },
  1995: { bread: 3.99, eggs: 8.35, movieTicket: 23.79, beer: 4.87 },
  2000: { bread: 5.51, eggs: 11.53, movieTicket: 32.85, beer: 6.72 },
  2005: { bread: 6.83, eggs: 14.3, movieTicket: 40.72, beer: 8.33 },
  2010: { bread: 9.18, eggs: 19.22, movieTicket: 54.76, beer: 11.2 },
  2015: { bread: 11.96, eggs: 25.04, movieTicket: 71.34, beer: 14.59 },
  2017: { bread: 13.41 },
  2020: { bread: 13.51, eggs: 31.54, movieTicket: 89.84, beer: 18.37 },
  2024: { bread: 18.68, eggs: 39.1, movieTicket: 111.4, beer: 22.78 },
  2025: { bread: 18.93, eggs: 40.35, movieTicket: 114.9, beer: 23.51 },
  2026: { bread: 19.61, eggs: 42.13, movieTicket: 120, beer: 24.54 },
}

const ZA_ITEMS: CostItem[] = [
  { key: 'petrol', label: 'Litre of petrol', emoji: '⛽' },
  { key: 'bread', label: 'Loaf of bread', emoji: '🍞' },
  { key: 'eggs', label: 'Dozen eggs', emoji: '🥚' },
  { key: 'movieTicket', label: 'Movie ticket', emoji: '🎬' },
  { key: 'beer', label: 'Bottle of beer (500 ml)', emoji: '🍺' },
]

// ── Brazil (BRL) ──
//   bread: Procon-SP bakery survey, Sept 2024: R$22.54/kg (https://agen (CPI back-cast)
//   busRide: SPTrans 'Tarifas' page, 'Histórico de Tarifas' table (decree
//   coffee: Anchor: Numbeo country page, (CPI back-cast)
//   beer: Anchor: Numbeo country page, (CPI back-cast)
const brCosts: YearMap = {
  1995: { bread: 3.7, busRide: 0.65, coffee: 1.58, beer: 1.02 },
  2000: { bread: 5.3, busRide: 1.25, coffee: 2.26, beer: 1.47 },
  2005: { bread: 8.03, busRide: 2, coffee: 3.42, beer: 2.22 },
  2010: { bread: 10.1, busRide: 2.7, coffee: 4.3, beer: 2.79 },
  2015: { bread: 13.97, busRide: 3.5, coffee: 5.95, beer: 3.87 },
  2020: { bread: 17.45, busRide: 4.4, coffee: 7.43, beer: 4.83 },
  2024: { bread: 22.54, busRide: 4.4, coffee: 9.6, beer: 6.24 },
  2025: { bread: 23.67, busRide: 5, coffee: 10.09, beer: 6.55 },
  2026: { bread: 24.71, busRide: 5.3, coffee: 10.53, beer: 6.84 },
}

const BR_ITEMS: CostItem[] = [
  { key: 'petrol', label: 'Litre of petrol', emoji: '⛽' },
  { key: 'bread', label: 'Kilo of pão francês', emoji: '🍞' },
  { key: 'busRide', label: 'Bus fare (São Paulo)', emoji: '🚌' },
  { key: 'coffee', label: 'Cup of coffee', emoji: '☕' },
  { key: 'beer', label: 'Bottle of beer', emoji: '🍺' },
]

// ── India (INR) ──
//   bread: Anchor: Numbeo country page, (CPI back-cast)
//   rice: Anchor: Numbeo country page, (CPI back-cast)
//   movieTicket: Ormax Media Box Office Reports: 2019 (CPI back-cast before 2018)
//   chai: Anchor: see notes | Index: World Bank FP.CPI.TOTL (https://a (CPI back-cast)
//   autoFare: See per-change sources in changes_sources | pre-2007: World  (CPI back-cast before 2007)
const inCosts: YearMap = {
  1960: { bread: 0.466, rice: 0.641, movieTicket: 1.59, chai: 0.124, autoFare: 0.34 },
  1965: { bread: 0.627, rice: 0.863, movieTicket: 2.14, chai: 0.167, autoFare: 0.458 },
  1970: { bread: 0.848, rice: 1.17, movieTicket: 2.89, chai: 0.225, autoFare: 0.619 },
  1975: { bread: 1.48, rice: 2.04, movieTicket: 5.04, chai: 0.393, autoFare: 1.08 },
  1980: { bread: 1.8, rice: 2.47, movieTicket: 6.12, chai: 0.477, autoFare: 1.31 },
  1985: { bread: 2.8, rice: 3.86, movieTicket: 9.55, chai: 0.745, autoFare: 2.05 },
  1990: { bread: 4.23, rice: 5.82, movieTicket: 14.43, chai: 1.13, autoFare: 3.09 },
  1995: { bread: 6.96, rice: 9.58, movieTicket: 23.73, chai: 1.85, autoFare: 5.08 },
  2000: { bread: 10.02, rice: 13.79, movieTicket: 34.16, chai: 2.66, autoFare: 7.31 },
  2005: { bread: 12.18, rice: 16.76, movieTicket: 41.51, chai: 3.24, autoFare: 8.89 },
  2010: { bread: 18.44, rice: 25.37, movieTicket: 62.86, chai: 4.9, autoFare: 19 },
  2015: { bread: 27.06, rice: 37.24, movieTicket: 92.27, chai: 7.2, autoFare: 25 },
  2018: { movieTicket: 104 },
  2019: { movieTicket: 106 },
  2020: { bread: 33.74, rice: 46.43, movieTicket: 110.2, chai: 8.97, autoFare: 25 },
  2022: { movieTicket: 119 },
  2024: { bread: 41.96, rice: 57.75, movieTicket: 134, chai: 11.16, autoFare: 30 },
  2025: { bread: 42.97, rice: 59.13, movieTicket: 161, chai: 11.43, autoFare: 30 },
  2026: { bread: 45.12, rice: 62.09, movieTicket: 169, chai: 12, autoFare: 30 },
}

const IN_ITEMS: CostItem[] = [
  { key: 'petrol', label: 'Litre of petrol', emoji: '⛽' },
  { key: 'bread', label: 'Loaf of bread', emoji: '🍞' },
  { key: 'rice', label: '1 kg of rice', emoji: '🍚' },
  { key: 'movieTicket', label: 'Movie ticket', emoji: '🎬' },
  { key: 'chai', label: 'Cup of chai', emoji: '🍵' },
  { key: 'autoFare', label: 'Auto-rickshaw flag fare', emoji: '🛺' },
]

// ── Canada (CAD) ──
//   bread: Statistics Canada Table 18-10-0002-01 (1995-2022) (CPI back-cast before 1995)
//   eggs: Statistics Canada Tables 18-10-0002-01 (CPI back-cast before 1995)
//   movieTicket: Cineplex Inc. annual results releases: FY2016 release (2015  (CPI back-cast before 2015)
//   coffee: Anchor: Numbeo country page, (CPI back-cast)
const caCosts: YearMap = {
  1950: { bread: 0.172, eggs: 0.217, movieTicket: 0.911, coffee: 0.395 },
  1955: { bread: 0.189, eggs: 0.238, movieTicket: 1.03, coffee: 0.445 },
  1960: { bread: 0.205, eggs: 0.258, movieTicket: 1.13, coffee: 0.489 },
  1965: { bread: 0.228, eggs: 0.287, movieTicket: 1.22, coffee: 0.53 },
  1970: { bread: 0.27, eggs: 0.341, movieTicket: 1.48, coffee: 0.641 },
  1975: { bread: 0.441, eggs: 0.556, movieTicket: 2.11, coffee: 0.916 },
  1980: { bread: 0.712, eggs: 0.897, movieTicket: 3.21, coffee: 1.39 },
  1985: { bread: 0.957, eggs: 1.21, movieTicket: 4.59, coffee: 1.99 },
  1990: { bread: 1.16, eggs: 1.47, movieTicket: 5.72, coffee: 2.48 },
  1995: { bread: 1.27, eggs: 1.6, movieTicket: 6.39, coffee: 2.77 },
  2000: { bread: 1.35, eggs: 1.86, movieTicket: 6.96, coffee: 3.01 },
  2005: { bread: 1.77, eggs: 2.26, movieTicket: 7.8, coffee: 3.38 },
  2010: { bread: 2.52, eggs: 2.66, movieTicket: 8.49, coffee: 3.68 },
  2015: { bread: 2.93, eggs: 3.32, movieTicket: 9.23, coffee: 4 },
  2020: { bread: 2.97, eggs: 3.72, movieTicket: 10.63, coffee: 4.33 },
  2024: { bread: 3.44, eggs: 4.6, movieTicket: 13.09, coffee: 5.08 },
  2025: { bread: 3.49, eggs: 4.86, movieTicket: 13.29, coffee: 5.18 },
  2026: { bread: 3.63, eggs: 4.83, movieTicket: 13.91, coffee: 5.33 },
}

const CA_ITEMS: CostItem[] = [
  { key: 'gas', label: 'Litre of gas', emoji: '⛽' },
  { key: 'bread', label: 'Loaf of bread', emoji: '🍞' },
  { key: 'eggs', label: 'Dozen eggs', emoji: '🥚' },
  { key: 'movieTicket', label: 'Movie ticket', emoji: '🎬' },
  { key: 'coffee', label: 'Cup of coffee', emoji: '☕' },
]

// ── Australia (AUD) ──
//   bread: ABS cat. 6403.0 / 6403.0.55.001 Average Retail Prices of Sel (CPI back-cast before 1965)
//   eggs: ABS cat. 6403.0 / 6403.0.55.001 Average Retail Prices of Sel (CPI back-cast before 1965)
//   beer: ABS cat. 6403.0 / 6403.0.55.001 Average Retail Prices of Sel (CPI back-cast before 1980)
//   flatWhite: Anchor: Numbeo country page, (CPI back-cast)
//   movieTicket: Screen Australia, Australian cinema ticket prices 1976-2025  (CPI back-cast before 1980)
const auCosts: YearMap = {
  1960: { bread: 0.147, eggs: 0.541, beer: 0.163, flatWhite: 0.293, movieTicket: 1.16 },
  1965: { bread: 0.16, eggs: 0.59, beer: 0.177, flatWhite: 0.32, movieTicket: 1.27 },
  1970: { bread: 0.21, eggs: 0.59, beer: 0.208, flatWhite: 0.375, movieTicket: 1.48 },
  1975: { bread: 0.43, eggs: 0.87, beer: 0.339, flatWhite: 0.611, movieTicket: 2.42 },
  1980: { bread: 0.63, eggs: 1.36, beer: 0.56, flatWhite: 1.01, movieTicket: 4 },
  1985: { bread: 0.99, eggs: 1.84, beer: 0.98, flatWhite: 1.5, movieTicket: 5.4 },
  1990: { bread: 1.32, eggs: 2.07, beer: 1.5, flatWhite: 2.2, movieTicket: 6.61 },
  1995: { bread: 1.69, eggs: 2.44, beer: 1.81, flatWhite: 2.49, movieTicket: 7.17 },
  2000: { bread: 2.29, eggs: 2.89, beer: 2.36, flatWhite: 2.74, movieTicket: 8.39 },
  2005: { bread: 2.66, eggs: 3.2, beer: 2.85, flatWhite: 3.18, movieTicket: 9.94 },
  2010: { bread: 3.61, eggs: 4.28, beer: 3.68, flatWhite: 3.68, movieTicket: 12.26 },
  2015: { bread: 4.04, eggs: 5.21, beer: 4.12, flatWhite: 4.13, movieTicket: 13.6 },
  2020: { bread: 4.36, eggs: 5.62, beer: 4.45, flatWhite: 4.45, movieTicket: 14.23 },
  2024: { bread: 5.21, eggs: 6.71, beer: 5.31, flatWhite: 5.31, movieTicket: 17.26 },
  2025: { bread: 5.36, eggs: 6.9, beer: 5.46, flatWhite: 5.47, movieTicket: 17.9 },
  2026: { bread: 5.57, eggs: 7.17, beer: 5.68, flatWhite: 5.68, movieTicket: 18.6 },
}

const AU_ITEMS: CostItem[] = [
  { key: 'petrol', label: 'Litre of petrol', emoji: '⛽' },
  { key: 'bread', label: 'Loaf of bread', emoji: '🍞' },
  { key: 'eggs', label: 'Dozen eggs', emoji: '🥚' },
  { key: 'beer', label: 'Pot of beer (285 ml)', emoji: '🍺' },
  { key: 'flatWhite', label: 'Cafe coffee', emoji: '☕' },
  { key: 'movieTicket', label: 'Movie ticket', emoji: '🎬' },
]

// ── Germany (EUR) ──
//   bread: Statistisches Bundesamt, "Preise ausgewählter Güter 1948 bis
//   eggs: Statistisches Bundesamt, "Preise ausgewählter Güter 1948 bis
//   beer: Statistisches Bundesamt, "Preise ausgewählter Güter 1948 bis
//   coffee: Anchor: Numbeo country page, (CPI back-cast)
//   cinema: 1950-1970: Statistisches Bundesamt, "Preise ausgewählter Güt
const deCosts: YearMap = {
  1950: { bread: 0.22, eggs: 1.34, cinema: 0.61 },
  1955: { bread: 0.34, eggs: 1.42, cinema: 0.67 },
  1960: { bread: 0.39, eggs: 1.28, beer: 0.32, coffee: 0.63, cinema: 0.8 },
  1965: { bread: 0.53, eggs: 1.48, beer: 0.32, coffee: 0.722, cinema: 1.09 },
  1970: { bread: 0.66, eggs: 1.16, beer: 0.33, coffee: 0.814, cinema: 1.55 },
  1975: { bread: 1.03, eggs: 1.36, beer: 0.4, coffee: 1.1, cinema: 2.5 },
  1980: { bread: 1.32, eggs: 1.55, beer: 0.42, coffee: 1.33, cinema: 3.22 },
  1985: { bread: 1.55, eggs: 1.62, beer: 0.48, coffee: 1.61, cinema: 3.8 },
  1990: { bread: 1.73, eggs: 1.62, beer: 0.5, coffee: 1.73, cinema: 4.14 },
  1995: { bread: 2.03, eggs: 1.69, beer: 0.58, coffee: 2.06, cinema: 4.86 },
  2000: { bread: 2.2, eggs: 1.74, beer: 0.58, coffee: 2.19, cinema: 5.4 },
  2005: { bread: 2.37, eggs: 2.24, beer: 0.615, coffee: 2.37, cinema: 5.85 },
  2010: { bread: 2.56, eggs: 2.42, beer: 0.666, coffee: 2.56, cinema: 7.27 },
  2015: { bread: 2.75, eggs: 2.6, beer: 0.714, coffee: 2.74, cinema: 8.39 },
  2020: { bread: 2.89, eggs: 2.74, beer: 0.752, coffee: 2.89, cinema: 8.35 },
  2024: { bread: 3.45, eggs: 3.27, beer: 0.898, coffee: 3.45, cinema: 9.64 },
  2025: { bread: 3.53, eggs: 3.34, beer: 0.917, coffee: 3.52, cinema: 10.05 },
  2026: { bread: 3.62, eggs: 3.43, beer: 0.942, coffee: 3.62, cinema: 10.32 },
}

const DE_ITEMS: CostItem[] = [
  { key: 'petrol', label: 'Litre of petrol', emoji: '⛽' },
  { key: 'bread', label: 'Kilo of rye bread', emoji: '🍞' },
  { key: 'eggs', label: 'Dozen eggs', emoji: '🥚' },
  { key: 'beer', label: 'Bottle of beer (shop)', emoji: '🍺' },
  { key: 'coffee', label: 'Cup of coffee', emoji: '☕' },
  { key: 'cinema', label: 'Cinema ticket', emoji: '🎬' },
]

// ── France (EUR) ──
//   baguette: INSEE BDM idbank 000442615 "Prix moyens annuels de vente au  (CPI back-cast before 1965)
//   metro: Fourastié-Sauvy "Métro (ticket) 2e classe et classe unique" 
//   cinema: CNC "Fréquentation des salles de cinéma" workbook, sheet fre
//   coffee: INSEE BDM idbank 000442802 "Tasse de café simple au comptoir (CPI back-cast before 1975)
//   wine: Fourastié-Sauvy database "Vin 11°" (INSEE-based, litre 11° b
const frCosts: YearMap = {
  1950: { baguette: 0.03, metro: 0.021, cinema: 0.11 },
  1955: { baguette: 0.048, metro: 0.03, cinema: 0.19, wine: 0.092 },
  1960: { baguette: 0.055, metro: 0.05, cinema: 0.28, coffee: 0.065, wine: 0.164 },
  1965: { baguette: 0.066, metro: 0.056, cinema: 0.47, coffee: 0.078, wine: 0.175 },
  1970: { baguette: 0.087, metro: 0.105, cinema: 0.73, coffee: 0.096, wine: 0.211 },
  1975: { baguette: 0.137, metro: 0.13, cinema: 1.32, coffee: 0.146, wine: 0.292 },
  1980: { baguette: 0.255, metro: 0.248, cinema: 2.46, coffee: 0.236, wine: 0.438 },
  1985: { baguette: 0.396, metro: 0.401, cinema: 3.8, coffee: 0.434, wine: 0.716 },
  1990: { baguette: 0.479, metro: 0.486, cinema: 4.78, coffee: 0.611, wine: 0.894 },
  1995: { baguette: 0.585, metro: 0.671, cinema: 5.3, coffee: 0.874, wine: 0.826 },
  2000: { baguette: 0.64, metro: 0.774, cinema: 5.39, coffee: 1.12, wine: 0.917 },
  2005: { baguette: 0.75, metro: 1.07, cinema: 5.87, coffee: 1.34, wine: 1.02 },
  2010: { baguette: 0.838, metro: 1.2, cinema: 6.33, coffee: 1.38, wine: 1.41 },
  2015: { baguette: 0.863, metro: 1.41, cinema: 6.48, coffee: 1.53, wine: 1.67 },
  2020: { baguette: 0.946, metro: 1.49, cinema: 6.63, coffee: 1.54, wine: 1.75 },
  2024: { baguette: 1.02, metro: 1.74, cinema: 7.42, coffee: 1.56, wine: 2 },
  2025: { baguette: 1.01, metro: 2.5, cinema: 7.42, coffee: 1.56, wine: 2.02 },
  2026: { baguette: 1.04, metro: 2.55, cinema: 7.6, coffee: 1.6, wine: 2.07 },
}

const FR_ITEMS: CostItem[] = [
  { key: 'petrol', label: 'Litre of petrol', emoji: '⛽' },
  { key: 'baguette', label: 'Baguette', emoji: '🥖' },
  { key: 'metro', label: 'Metro ticket', emoji: '🚇' },
  { key: 'cinema', label: 'Cinema ticket', emoji: '🎬' },
  { key: 'coffee', label: 'Café (cup)', emoji: '☕' },
  { key: 'wine', label: 'Bottle of table wine', emoji: '🍷' },
]

// ── Japan (JPY) ──
//   rice: Statistics Bureau of Japan, Retail Price Survey, "主要品目の東京都区部
//   ramen: Statistics Bureau of Japan, Retail Price Survey, "主要品目の東京都区部 (CPI back-cast before 1965)
//   sushi: Statistics Bureau of Japan, Retail Price Survey, "主要品目の東京都区部 (CPI back-cast before 1970)
//   cinema: Statistics Bureau of Japan, Retail Price Survey, "主要品目の東京都区部
//   metro: Fares: Tokyo Metro 170 -> 180 yen (Mar 2023), (CPI back-cast)
const jpCosts: YearMap = {
  1950: { rice: 495, cinema: 64.6 },
  1955: { rice: 545, cinema: 133 },
  1960: { rice: 494, ramen: 47.3, sushi: 116.1, cinema: 119, metro: 30.58 },
  1965: { rice: 680, ramen: 62.9, sushi: 154.5, cinema: 236, metro: 40.67 },
  1970: { rice: 930, ramen: 96, sushi: 200, cinema: 351, metro: 52.67 },
  1975: { rice: 1495, ramen: 211, sushi: 476, cinema: 982, metro: 90.27 },
  1980: { rice: 2071, ramen: 311, sushi: 685, cinema: 1357, metro: 124.4 },
  1985: { rice: 2394, ramen: 383, sushi: 812, cinema: 1496, metro: 142.6 },
  1990: { rice: 2466, ramen: 451, sushi: 930, cinema: 1615, metro: 152.4 },
  1995: { rice: 2608, ramen: 486, sushi: 1058, cinema: 1796, metro: 163 },
  2000: { rice: 1978, ramen: 543, sushi: 1211, cinema: 1800, metro: 165.5 },
  2005: { rice: 2040, ramen: 559, sushi: 1248, cinema: 1800, metro: 161.9 },
  2010: { rice: 1739, ramen: 594, sushi: 1371, cinema: 1800, metro: 161.2 },
  2015: { rice: 2285, ramen: 567, sushi: 1289, cinema: 1800, metro: 167 },
  2020: { rice: 2426, ramen: 563, sushi: 1353, cinema: 1834, metro: 170 },
  2024: { rice: 2951, ramen: 572, sushi: 1633, cinema: 1933, metro: 180 },
  2025: { rice: 4928, ramen: 604, sushi: 1742, cinema: 1933, metro: 180 },
  2026: { rice: 2860, ramen: 616.1, sushi: 1777, cinema: 1972, metro: 180 },
}

const JP_ITEMS: CostItem[] = [
  { key: 'petrol', label: 'Litre of petrol', emoji: '⛽' },
  { key: 'rice', label: '5 kg of rice', emoji: '🍚' },
  { key: 'ramen', label: 'Bowl of ramen', emoji: '🍜' },
  { key: 'sushi', label: 'Nigiri sushi set', emoji: '🍣' },
  { key: 'cinema', label: 'Cinema ticket', emoji: '🎬' },
  { key: 'metro', label: 'Metro ticket', emoji: '🚇' },
]

// ── Kenya (KES) ──
//   bread: KNBS Economic Survey 2024, Table 3.15c 'Annual Average Retai (CPI back-cast before 2019)
//   rice: Anchor: Numbeo country page, (CPI back-cast)
//   coke: Anchor: Numbeo country page, (CPI back-cast)
//   matatu: Anchor: Numbeo country page, (CPI back-cast)
//   eggs: Anchor: Numbeo country page, (CPI back-cast)
const keCosts: YearMap = {
  1970: { bread: 0.228, rice: 0.63, coke: 0.252, matatu: 0.314, eggs: 0.668 },
  1975: { bread: 0.383, rice: 1.06, coke: 0.424, matatu: 0.53, eggs: 1.13 },
  1980: { bread: 0.705, rice: 1.95, coke: 0.78, matatu: 0.974, eggs: 2.07 },
  1985: { bread: 1.32, rice: 3.65, coke: 1.46, matatu: 1.82, eggs: 3.87 },
  1990: { bread: 2.21, rice: 6.12, coke: 2.44, matatu: 3.05, eggs: 6.49 },
  1995: { bread: 6.45, rice: 17.87, coke: 7.13, matatu: 8.92, eggs: 18.94 },
  2000: { bread: 9.71, rice: 26.89, coke: 10.73, matatu: 13.42, eggs: 28.5 },
  2005: { bread: 14.15, rice: 39.2, coke: 15.65, matatu: 19.56, eggs: 41.55 },
  2010: { bread: 25.48, rice: 70.59, coke: 28.18, matatu: 35.22, eggs: 74.84 },
  2015: { bread: 38.27, rice: 106, coke: 42.32, matatu: 52.9, eggs: 112.4 },
  2019: { bread: 48.41 },
  2020: { bread: 48.29, rice: 141.4, coke: 56.43, matatu: 70.53, eggs: 149.9 },
  2024: { bread: 66.46, rice: 181.7, coke: 72.52, matatu: 90.65, eggs: 192.6 },
  2025: { bread: 66.43, rice: 189.1, coke: 75.47, matatu: 94.34, eggs: 200.4 },
  2026: { bread: 70.42, rice: 200.41, coke: 80, matatu: 100, eggs: 212.46 },
}

const KE_ITEMS: CostItem[] = [
  { key: 'petrol', label: 'Litre of petrol', emoji: '⛽' },
  { key: 'bread', label: 'Loaf of bread (400 g)', emoji: '🍞' },
  { key: 'rice', label: '1 kg of rice', emoji: '🍚' },
  { key: 'coke', label: 'Bottle of Coke', emoji: '🥤' },
  { key: 'matatu', label: 'Matatu (bus) fare', emoji: '🚌' },
  { key: 'eggs', label: 'Dozen eggs', emoji: '🥚' },
]

// ── Ghana (GHS) ──
//   bread: Anchor: Numbeo country page, (CPI back-cast)
//   rice: Anchor: Numbeo country page, (CPI back-cast)
//   trotro: 2026 minimum fare GHS 5.50: GPRTU/GRTCC fare schedule effect (CPI back-cast)
//   waakye: Anchor: see notes | Index: World Bank FP.CPI.TOTL (https://a (CPI back-cast)
//   eggs: Anchor: Numbeo country page, (CPI back-cast)
const ghCosts: YearMap = {
  2000: { bread: 0.391, rice: 0.727, trotro: 0.264, waakye: 0.337, eggs: 0.654 },
  2005: { bread: 1.07, rice: 1.99, trotro: 0.723, waakye: 0.921, eggs: 1.79 },
  2010: { bread: 2.03, rice: 3.78, trotro: 1.37, waakye: 1.75, eggs: 3.4 },
  2015: { bread: 3.72, rice: 6.91, trotro: 2.51, waakye: 3.2, eggs: 6.22 },
  2017: { trotro: 3.81 },
  2020: { bread: 6.23, rice: 11.58, trotro: 4.61, waakye: 5.36, eggs: 10.42 },
  2024: { bread: 15.25, rice: 28.35, trotro: 5.99, waakye: 13.13, eggs: 25.51 },
  2025: { bread: 17.41, rice: 32.38, trotro: 5.09, waakye: 15, eggs: 29.13 },
  2026: { bread: 18.25, rice: 33.93, trotro: 5.5, waakye: 15.72, eggs: 30.53 },
}

const GH_ITEMS: CostItem[] = [
  { key: 'petrol', label: 'Litre of petrol', emoji: '⛽' },
  { key: 'bread', label: 'Loaf of bread', emoji: '🍞' },
  { key: 'rice', label: '1 kg of rice', emoji: '🍚' },
  { key: 'trotro', label: 'Trotro fare', emoji: '🚌' },
  { key: 'waakye', label: 'Waakye plate', emoji: '🍛' },
  { key: 'eggs', label: 'Dozen eggs', emoji: '🥚' },
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

  // Prices compound, so fill gaps along a growth curve rather than a straight line
  const t = (year - lo) / (hi - lo)
  const a = map[lo], b = map[hi]
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  const result: HistoricalCosts = {}
  for (const key of keys) {
    const av = a[key], bv = b[key]
    if (av === undefined || bv === undefined) continue
    const v = av > 0 && bv > 0 ? av * Math.pow(bv / av, t) : av + (bv - av) * t
    result[key] = parseFloat(v.toFixed(v < 1 ? 3 : 2))
  }
  return result
}

export function getCostsForYear(year: number, country = 'world'): CostsWithMeta {
  const map = COUNTRY_COSTS[country] ?? usCosts
  const items = COUNTRY_ITEMS[country] ?? US_ITEMS
  const { symbol, code } = CURRENCY_META[country] ?? { symbol: '$', code: 'USD' }
  return { costs: { ...interpolate(map, year) }, items, currencySymbol: symbol, currencyCode: code }
}

// ── US first-class postage (cents), by the year each rate took effect ────────
const US_POSTAGE: [number, number][] = [
  [1932, 3], [1958, 4], [1963, 5], [1968, 6], [1971, 8], [1974, 10], [1975, 13],
  [1978, 15], [1981, 20], [1985, 22], [1988, 25], [1991, 29], [1995, 32], [1999, 33],
  [2001, 34], [2002, 37], [2006, 39], [2007, 41], [2008, 42], [2009, 44], [2012, 45],
  [2013, 46], [2014, 49], [2016, 47], [2017, 49], [2018, 50], [2019, 55], [2021, 58],
  [2022, 60], [2023, 66], [2024, 73], [2025, 78], [2026, 82],
]

/** US first-class stamp price in cents for a year */
export function usPostageCents(year: number): number {
  let cents = US_POSTAGE[0][1]
  for (const [from, c] of US_POSTAGE) if (year >= from) cents = c
  return cents
}

function dataYears(country: string) {
  const years = Object.keys(COUNTRY_COSTS[country] ?? usCosts).map(Number)
  return { first: Math.min(...years), latest: Math.max(...years) }
}

export interface PriceComparison {
  key: string
  label: string
  then: number
  now: number
  /** Postage is shown in cents (25¢) rather than dollars */
  cents?: boolean
  /** The year the "now" price is from */
  nowYear: number
}

/** Up to four everyday prices, then and now, for the Results ticket stubs */
export function getThenVsNow(
  year: number,
  country = 'world',
  date?: string,
): { items: PriceComparison[]; currencySymbol: string; local: boolean; nowYear: number; since: number } {
  const thisYear = new Date().getFullYear()
  const { first, latest } = dataYears(country)
  // "Today" is the newest year we have data for
  const nowYear = Math.min(thisYear, latest)
  const then = getCostsForYear(year, country)
  const now = getCostsForYear(nowYear, country)
  const local = country !== 'world' && country !== 'us'

  // Fuel comes from its own researched series: the exact regulated price on the
  // day where there is one, else that year's average; none before records start
  const fuelThen = fuelPrice(country, date ?? `${year}-07-01`)
  const fuelNow = fuelPrice(country, new Date().toISOString().slice(0, 10))
  // Before the price table starts we'd only be guessing, so only fuel remains
  if (year < first) then.costs = {}
  if (fuelThen) then.costs[fuelThen.key] = fuelThen.price
  if (fuelNow) now.costs[fuelNow.key] = fuelNow.price

  const pick = (key: string, label?: string): PriceComparison | null => {
    const item = then.items.find(i => i.key === key)
    const a = then.costs[key]
    const b = now.costs[key]
    if (!item || a == null || b == null) return null
    const asOf = key === fuelNow?.key ? fuelNow.year : nowYear
    return { key, label: label ?? item.label, then: a, now: b, nowYear: asOf }
  }

  let items: PriceComparison[]
  if (!local) {
    items = [
      pick('gas'),
      { key: 'postage', label: 'Postage stamp', then: usPostageCents(year), now: usPostageCents(thisYear), cents: true, nowYear: thisYear },
      pick('movieTicket', 'Cinema ticket'),
      pick('bread'),
    ].filter((i): i is PriceComparison => i !== null)
  } else {
    items = then.items.map(i => pick(i.key)).filter((i): i is PriceComparison => i !== null).slice(0, 4)
  }
  return { items, currencySymbol: then.currencySymbol, local, nowYear, since: first }
}
