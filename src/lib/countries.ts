// Countries the data layer has tables for. Keep in sync with the lookup
// tables in src/lib/data and COUNTRY_LABELS in rewind/[date]/page.tsx.
export const COUNTRIES = [
  { code: 'world', flag: '🌍', name: 'Worldwide' },
  { code: 'us', flag: '🇺🇸', name: 'United States' },
  { code: 'gb', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'ca', flag: '🇨🇦', name: 'Canada' },
  { code: 'au', flag: '🇦🇺', name: 'Australia' },
  { code: 'de', flag: '🇩🇪', name: 'Germany' },
  { code: 'fr', flag: '🇫🇷', name: 'France' },
  { code: 'in', flag: '🇮🇳', name: 'India' },
  { code: 'jp', flag: '🇯🇵', name: 'Japan' },
  { code: 'ng', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'gh', flag: '🇬🇭', name: 'Ghana' },
  { code: 'ke', flag: '🇰🇪', name: 'Kenya' },
  { code: 'za', flag: '🇿🇦', name: 'South Africa' },
  { code: 'br', flag: '🇧🇷', name: 'Brazil' },
] as const

export type CountryCode = (typeof COUNTRIES)[number]['code']

export const COUNTRY_KEY = 'thatday-country'

export function isCountryCode(code: string | null): code is CountryCode {
  return COUNTRIES.some(c => c.code === code)
}
