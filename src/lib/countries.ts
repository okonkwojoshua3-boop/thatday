// Countries the data layer has tables for. Keep in sync with the lookup
// tables in src/lib/data and COUNTRY_LABELS in rewind/[date]/page.tsx.
export const COUNTRIES = [
  { code: 'world', name: 'Worldwide', region: null },
  { code: 'ng', name: 'Nigeria', region: 'Africa' },
  { code: 'gh', name: 'Ghana', region: 'Africa' },
  { code: 'ke', name: 'Kenya', region: 'Africa' },
  { code: 'za', name: 'South Africa', region: 'Africa' },
  { code: 'us', name: 'United States', region: 'Americas' },
  { code: 'ca', name: 'Canada', region: 'Americas' },
  { code: 'br', name: 'Brazil', region: 'Americas' },
  { code: 'gb', name: 'United Kingdom', region: 'Europe' },
  { code: 'de', name: 'Germany', region: 'Europe' },
  { code: 'fr', name: 'France', region: 'Europe' },
  { code: 'in', name: 'India', region: 'Asia-Pacific' },
  { code: 'jp', name: 'Japan', region: 'Asia-Pacific' },
  { code: 'au', name: 'Australia', region: 'Asia-Pacific' },
] as const

export type CountryCode = (typeof COUNTRIES)[number]['code']
export type Country = (typeof COUNTRIES)[number]

export const REGIONS = ['Africa', 'Americas', 'Europe', 'Asia-Pacific'] as const

export const COUNTRY_KEY = 'thatday-country'

export function isCountryCode(code: string | null | undefined): code is CountryCode {
  return COUNTRIES.some(c => c.code === code)
}

export function getCountry(code: CountryCode): Country {
  return COUNTRIES.find(c => c.code === code) ?? COUNTRIES[0]
}

/** Round flag artwork from Figma (public/flags) */
export const flagSrc = (code: CountryCode) => `/flags/${code}.svg`

const TIMEZONES: [RegExp, CountryCode][] = [
  [/^Africa\/Lagos$/, 'ng'],
  [/^Africa\/Accra$/, 'gh'],
  [/^Africa\/Nairobi$/, 'ke'],
  [/^Africa\/Johannesburg$/, 'za'],
  [/^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|St_Johns|Regina|Montreal)$/, 'ca'],
  [/^America\/(Sao_Paulo|Fortaleza|Recife|Bahia|Belem|Manaus|Cuiaba|Porto_Velho|Maceio)$/, 'br'],
  [/^(America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Boise|Indiana\/.+|Kentucky\/.+)|Pacific\/Honolulu)$/, 'us'],
  [/^Europe\/(London|Belfast)$/, 'gb'],
  [/^Europe\/Berlin$/, 'de'],
  [/^Europe\/Paris$/, 'fr'],
  [/^Asia\/(Kolkata|Calcutta)$/, 'in'],
  [/^Asia\/Tokyo$/, 'jp'],
  [/^Australia\//, 'au'],
]

/**
 * Best guess at the visitor's country: time zone first (browsers often default
 * to en-US wherever you are), then the locale's region.
 */
export function detectCountry(): CountryCode | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const byZone = TIMEZONES.find(([re]) => re.test(tz))?.[1]
    if (byZone) return byZone
    for (const lang of navigator.languages ?? [navigator.language]) {
      const region = new Intl.Locale(lang).region?.toLowerCase()
      if (region && region !== 'world' && isCountryCode(region)) return region
    }
    return null
  } catch {
    return null
  }
}
