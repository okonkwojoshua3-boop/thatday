export function encodeCardId(date: string, isBirthday: boolean, country = 'world'): string {
  const payload = JSON.stringify({ d: date, b: isBirthday ? 1 : 0, c: country })
  return btoa(payload).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export function decodeCardId(id: string): { date: string; isBirthday: boolean; country: string } | null {
  try {
    const padded = id.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice((id.length * 3) % 4 !== 0 ? 0 : 2)
    const payload = JSON.parse(atob(padded))
    if (typeof payload.d !== 'string') return null
    return { date: payload.d, isBirthday: payload.b === 1, country: payload.c ?? 'world' }
  } catch {
    return null
  }
}
