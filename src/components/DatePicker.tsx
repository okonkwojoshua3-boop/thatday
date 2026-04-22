'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isValidDate, getMinDate, getMaxDate } from '@/lib/utils/date'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const MIN_YEAR = 1950

const COUNTRIES = [
  { code: 'world', flag: '🌍', name: 'Worldwide' },
  { code: 'us',    flag: '🇺🇸', name: 'United States' },
  { code: 'gb',    flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'ng',    flag: '🇳🇬', name: 'Nigeria' },
  { code: 'za',    flag: '🇿🇦', name: 'South Africa' },
  { code: 'br',    flag: '🇧🇷', name: 'Brazil' },
]

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}
function formatTextInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}
function parseTextInput(text: string): string | null {
  const digits = text.replace(/\D/g, '')
  if (digits.length !== 8) return null
  const mm = digits.slice(0, 2)
  const dd = digits.slice(2, 4)
  const yyyy = digits.slice(4, 8)
  return `${yyyy}-${mm}-${dd}`
}

export default function DatePicker() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Country
  const [country, setCountry] = useState('world')
  const [countryOpen, setCountryOpen] = useState(false)

  // Date text input
  const [textValue, setTextValue] = useState('')
  const [selected, setSelected] = useState('')
  const [error, setError] = useState('')

  // Calendar
  const today = new Date()
  const maxYear = today.getFullYear()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [yearPickerOpen, setYearPickerOpen] = useState(false)
  const [yearInput, setYearInput] = useState('')

  const minDate = getMinDate()
  const maxDate = getMaxDate()

  const containerRef = useRef<HTMLDivElement>(null)
  const yearListRef = useRef<HTMLDivElement>(null)
  const yearInputRef = useRef<HTMLInputElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)

  const allYears = Array.from({ length: maxYear - MIN_YEAR + 1 }, (_, i) => maxYear - i)
  const filteredYears = yearInput.trim()
    ? allYears.filter(y => String(y).startsWith(yearInput.trim()))
    : allYears

  const selectedCountry = COUNTRIES.find(c => c.code === country) ?? COUNTRIES[0]

  useEffect(() => {
    if (!isCalendarOpen && !countryOpen) return
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false)
        setCountryOpen(false)
        setYearPickerOpen(false)
        setYearInput('')
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [isCalendarOpen, countryOpen])

  useEffect(() => {
    if (!yearPickerOpen) return
    yearInputRef.current?.focus()
    yearListRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'center' })
  }, [yearPickerOpen])

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatTextInput(e.target.value)
    setTextValue(formatted)
    setError('')
    const dateStr = parseTextInput(formatted)
    if (dateStr && isValidDate(dateStr) && dateStr >= minDate && dateStr <= maxDate) {
      setSelected(dateStr)
      const [y, m] = dateStr.split('-').map(Number)
      setViewYear(y)
      setViewMonth(m - 1)
    } else {
      setSelected('')
    }
  }

  function handleTextKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); submitDate() }
  }

  function openYearPicker() { setYearInput(''); setYearPickerOpen(true) }
  function commitYear(yr: number) { setViewYear(yr); setYearPickerOpen(false); setYearInput('') }
  function handleYearInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const parsed = parseInt(yearInput)
      if (!isNaN(parsed) && parsed >= MIN_YEAR && parsed <= maxYear) commitYear(parsed)
    }
    if (e.key === 'Escape') { setYearPickerOpen(false); setYearInput('') }
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function selectDay(day: number) {
    const dateStr = toDateStr(viewYear, viewMonth, day)
    if (dateStr < minDate || dateStr > maxDate) return
    setSelected(dateStr)
    setError('')
    setIsCalendarOpen(false)
    setYearPickerOpen(false)
    setYearInput('')
    const [y, m, d] = dateStr.split('-')
    setTextValue(`${m}/${d}/${y}`)
  }

  function submitDate() {
    setError('')
    const dateStr = selected || parseTextInput(textValue)
    if (!dateStr || !isValidDate(dateStr)) { setError('Please enter a valid date (MM/DD/YYYY).'); return }
    if (dateStr < minDate) { setError('Please enter a date after January 1, 1950.'); return }
    if (dateStr > maxDate) { setError('Please enter a date in the past.'); return }
    const url = country === 'world'
      ? `/rewind/${dateStr}`
      : `/rewind/${dateStr}?country=${country}`
    startTransition(() => router.push(url))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); submitDate() }

  const totalDays = daysInMonth(viewYear, viewMonth)
  const offset = firstDayOfMonth(viewYear, viewMonth)
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

  const nextMonthFirst = viewMonth === 11 ? toDateStr(viewYear + 1, 0, 1) : toDateStr(viewYear, viewMonth + 1, 1)
  const canGoNext = nextMonthFirst <= maxDate
  const prevMonthLast = viewMonth === 0
    ? toDateStr(viewYear - 1, 11, 31)
    : toDateStr(viewYear, viewMonth - 1, daysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1))
  const canGoPrev = prevMonthLast >= minDate

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-2">
      <div ref={containerRef} className="relative w-full">

        {/* Combined card: country + date */}
        <div className="w-full rounded-2xl border border-zinc-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-visible focus-within:border-zinc-300 transition-colors">

          {/* Country row */}
          <button
            type="button"
            onClick={() => { setCountryOpen(o => !o); setIsCalendarOpen(false) }}
            className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-zinc-50/80 transition-colors rounded-t-2xl"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base leading-none">{selectedCountry.flag}</span>
              <span className="text-sm font-medium text-zinc-700">{selectedCountry.name}</span>
            </div>
            <svg
              width="14" height="14" viewBox="0 0 12 12" fill="none"
              className={`text-zinc-400 transition-transform ${countryOpen ? 'rotate-180' : ''}`}
            >
              <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Divider */}
          <div className="mx-5 border-t border-zinc-100" />

          {/* Date row */}
          <div className="flex items-center gap-3 px-5 py-4">
            <input
              ref={textInputRef}
              type="text"
              inputMode="numeric"
              value={textValue}
              onChange={handleTextChange}
              onKeyDown={handleTextKeyDown}
              placeholder="MM / DD / YYYY"
              className="flex-1 text-base text-zinc-900 placeholder:text-zinc-400 bg-transparent focus:outline-none min-w-0"
              autoComplete="off"
              aria-label="Enter a date"
            />
            <button
              type="button"
              onClick={() => { setIsCalendarOpen(o => !o); setCountryOpen(false); setYearPickerOpen(false); setYearInput('') }}
              className="shrink-0 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
              aria-label="Open calendar"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <rect x="1.5" y="3" width="15" height="13.5" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
                <line x1="1.5" y1="7.5" x2="16.5" y2="7.5" stroke="currentColor" strokeWidth="1.4" />
                <line x1="5.5" y1="1.5" x2="5.5" y2="4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="12.5" y1="1.5" x2="12.5" y2="4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Country dropdown */}
        {countryOpen && (
          <div className="absolute z-50 top-full mt-2 w-full rounded-2xl border border-zinc-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.10)] overflow-hidden">
            {COUNTRIES.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => { setCountry(c.code); setCountryOpen(false) }}
                className={[
                  'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                  c.code === country
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-700 hover:bg-zinc-50',
                ].join(' ')}
              >
                <span className="text-base leading-none">{c.flag}</span>
                <span className="font-medium">{c.name}</span>
                {c.code === country && (
                  <svg className="ml-auto" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Calendar dropdown */}
        {isCalendarOpen && (
          <div
            role="dialog"
            aria-label="Date picker"
            className="absolute z-50 top-full mt-2 w-full rounded-2xl border border-zinc-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.10)] overflow-hidden"
          >
            {/* Month/year nav */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
              <button
                type="button"
                onClick={prevMonth}
                disabled={!canGoPrev || yearPickerOpen}
                className="p-1.5 rounded-lg hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous month"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="#71717a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-zinc-900">{MONTHS[viewMonth]}</span>
                <button
                  type="button"
                  onClick={() => yearPickerOpen ? setYearPickerOpen(false) : openYearPicker()}
                  className={[
                    'flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-sm font-semibold transition-colors',
                    yearPickerOpen ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700',
                  ].join(' ')}
                >
                  {viewYear}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${yearPickerOpen ? 'rotate-180' : ''}`}>
                    <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <button
                type="button"
                onClick={nextMonth}
                disabled={!canGoNext || yearPickerOpen}
                className="p-1.5 rounded-lg hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next month"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="#71717a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {yearPickerOpen ? (
              <div className="flex flex-col">
                <div className="px-3 pt-3 pb-2">
                  <input
                    ref={yearInputRef}
                    type="number"
                    value={yearInput}
                    onChange={e => setYearInput(e.target.value)}
                    onKeyDown={handleYearInputKey}
                    placeholder={`${MIN_YEAR} – ${maxYear}`}
                    min={MIN_YEAR}
                    max={maxYear}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15 focus-visible:border-zinc-300 focus-visible:bg-white transition-all [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <div ref={yearListRef} className="overflow-y-auto" style={{ maxHeight: '192px' }}>
                  {filteredYears.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-zinc-400 text-center">No matching year</p>
                  ) : filteredYears.map(yr => (
                    <button
                      key={yr}
                      type="button"
                      data-active={yr === viewYear ? 'true' : undefined}
                      onClick={() => commitYear(yr)}
                      className={[
                        'w-full text-left px-4 py-2 text-sm transition-colors',
                        yr === viewYear ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-700 hover:bg-zinc-100',
                      ].join(' ')}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
                <div className="h-3" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-7 px-3 pt-3 pb-1.5">
                  {DAYS.map(d => (
                    <div key={d} className="text-center text-[11px] font-semibold text-zinc-400 tracking-wide py-0.5">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
                  {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
                  {Array.from({ length: totalDays }).map((_, i) => {
                    const day = i + 1
                    const dateStr = toDateStr(viewYear, viewMonth, day)
                    const isSelected = dateStr === selected
                    const isDisabled = dateStr < minDate || dateStr > maxDate
                    const isToday = dateStr === todayStr
                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => selectDay(day)}
                        className={[
                          'aspect-square w-full flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors',
                          isSelected ? 'bg-zinc-900 text-white'
                            : isDisabled ? 'text-zinc-300 cursor-not-allowed'
                            : 'text-zinc-700 hover:bg-zinc-100 cursor-pointer',
                          isToday && !isSelected ? 'ring-1 ring-zinc-300 ring-inset' : '',
                        ].join(' ')}
                        aria-pressed={isSelected}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error && <p className="px-1 text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isPending || !selected}
        className="w-full rounded-2xl bg-zinc-900 px-6 py-4 text-base font-semibold text-white transition-all hover:bg-zinc-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
      >
        {isPending ? 'Travelling…' : 'Time Travel'}
      </button>
    </form>
  )
}
