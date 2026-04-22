export function isValidDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false
  const date = new Date(dateStr + 'T00:00:00')
  if (isNaN(date.getTime())) return false
  const [y, m, d] = dateStr.split('-').map(Number)
  return date.getFullYear() === y && date.getMonth() + 1 === m && date.getDate() === d
}

export function parseDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00')
}

export function formatDisplayDate(dateStr: string): string {
  const date = parseDate(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatShortDate(dateStr: string): string {
  const date = parseDate(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getDateParts(dateStr: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateStr.split('-').map(Number)
  return { year, month, day }
}

export function getMinDate(): string {
  return '1950-01-01'
}

export function getMaxDate(): string {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}
