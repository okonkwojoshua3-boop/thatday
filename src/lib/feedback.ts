'use client'

import { useSyncExternalStore } from 'react'

// Sound and haptics for the physical moments: the dial's detents, split-flap
// clacks, the Surprise lever, the wax seal, stamps landing. Sounds are
// synthesised with Web Audio (no files to load) and kept quiet and short.
// The audio session is "ambient", so the iPhone silent switch mutes them and
// they never pause the visitor's own music.

export const SOUND_KEY = 'thatday-sound'

export type Sound = 'tick' | 'detent' | 'flap' | 'lever' | 'thud' | 'seal' | 'swish' | 'chime' | 'pop'
type Haptic = 'selection' | 'light' | 'medium' | 'heavy' | 'success'

const VIBRATE: Record<Haptic, number | number[]> = {
  selection: 6,
  light: 10,
  medium: 18,
  heavy: 28,
  success: [10, 60, 18],
}

// ── Preference ───────────────────────────────────────────────────────────────

const listeners = new Set<() => void>()
let enabled: boolean | null = null

export function isEnabled() {
  if (enabled === null) {
    try {
      enabled = localStorage.getItem(SOUND_KEY) !== 'off'
    } catch {
      enabled = true
    }
  }
  return enabled
}

export function setSoundEnabled(on: boolean) {
  enabled = on
  try {
    localStorage.setItem(SOUND_KEY, on ? 'on' : 'off')
  } catch {}
  listeners.forEach(l => l())
  if (on) play('pop')
}

/** Called whenever sound is switched on or off */
export function onSoundChange(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useSoundEnabled() {
  return useSyncExternalStore(
    l => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    isEnabled,
    () => true,
  )
}

// ── Audio ────────────────────────────────────────────────────────────────────

let ctx: AudioContext | null = null
let out: GainNode | null = null
let noise: AudioBuffer | null = null

function audio() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    try {
      const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession
      if (session) session.type = 'ambient'
    } catch {}
    ctx = new AC()
    out = ctx.createGain()
    out.gain.value = 0.55
    out.connect(ctx.destination)
    noise = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate)
    const data = noise.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  }
  return ctx
}

/** The shared audio graph, for the story soundtrack */
export function audioGraph() {
  const c = audio()
  return c && out && noise ? { ctx: c, out, noise } : null
}

// Browsers only start audio inside a gesture. On phones a touch only counts once
// the finger lifts (pointerup / touchend / click), not on pointerdown, so listen
// to all of them. Older iOS also needs a sound started inside that gesture.
if (typeof window !== 'undefined') {
  let primed = false
  const unlock = () => {
    const c = audio()
    if (!c) return
    if (c.state !== 'running') c.resume().catch(() => {})
    if (!primed) {
      primed = true
      const silent = c.createBufferSource()
      silent.buffer = c.createBuffer(1, 1, c.sampleRate)
      silent.connect(c.destination)
      silent.start()
    }
  }
  for (const type of ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']) {
    window.addEventListener(type, unlock, { capture: true, passive: true })
  }
}

/** A filtered noise burst with a fast attack and exponential decay */
function burst(c: AudioContext, at: number, dur: number, gain: number, type: BiquadFilterType, freq: number, q = 1) {
  const src = c.createBufferSource()
  src.buffer = noise
  src.playbackRate.value = 0.9 + Math.random() * 0.2
  const filter = c.createBiquadFilter()
  filter.type = type
  filter.frequency.value = freq
  filter.Q.value = q
  const env = c.createGain()
  env.gain.setValueAtTime(0, at)
  env.gain.linearRampToValueAtTime(gain, at + 0.002)
  env.gain.exponentialRampToValueAtTime(0.0001, at + dur)
  src.connect(filter).connect(env).connect(out!)
  src.start(at, Math.random() * 0.3)
  src.stop(at + dur + 0.02)
  return filter
}

/** A pitched blip that glides from one frequency to another */
function tone(c: AudioContext, at: number, dur: number, gain: number, from: number, to = from, type: OscillatorType = 'sine') {
  const osc = c.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(from, at)
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, at + dur)
  const env = c.createGain()
  env.gain.setValueAtTime(0, at)
  env.gain.linearRampToValueAtTime(gain, at + 0.004)
  env.gain.exponentialRampToValueAtTime(0.0001, at + dur)
  osc.connect(env).connect(out!)
  osc.start(at)
  osc.stop(at + dur + 0.02)
}

const RECIPES: Record<Sound, (c: AudioContext, t: number) => void> = {
  // Dial detent: a tiny dry click
  tick: (c, t) => {
    burst(c, t, 0.012, 0.35, 'bandpass', 3800, 2.5)
    tone(c, t, 0.018, 0.05, 2200)
  },
  // Decade / major detent: lower and a touch heavier
  detent: (c, t) => {
    burst(c, t, 0.02, 0.5, 'bandpass', 2200, 2)
    tone(c, t, 0.03, 0.09, 1100, 700)
  },
  // Split-flap: a papery clack
  flap: (c, t) => {
    burst(c, t, 0.025, 0.4, 'bandpass', 1800 + Math.random() * 600, 1.2)
    burst(c, t + 0.008, 0.018, 0.2, 'highpass', 5000)
  },
  // Surprise lever: a ratchet then a clunk
  lever: (c, t) => {
    for (let i = 0; i < 4; i++) burst(c, t + i * 0.028, 0.012, 0.25, 'bandpass', 3000, 3)
    tone(c, t + 0.12, 0.12, 0.35, 160, 70)
    burst(c, t + 0.12, 0.05, 0.3, 'lowpass', 900)
  },
  // Stamp or postcard landing
  thud: (c, t) => {
    tone(c, t, 0.16, 0.45, 120, 50)
    burst(c, t, 0.05, 0.35, 'lowpass', 700)
  },
  // Wax seal cracking
  seal: (c, t) => {
    burst(c, t, 0.02, 0.45, 'highpass', 1800)
    burst(c, t + 0.025, 0.015, 0.3, 'highpass', 2600)
    burst(c, t + 0.045, 0.03, 0.25, 'bandpass', 1400, 1.5)
  },
  // Paper sliding: the flap and postcard
  swish: (c, t) => {
    const f = burst(c, t, 0.32, 0.18, 'bandpass', 600, 0.8)
    f.frequency.exponentialRampToValueAtTime(2600, t + 0.3)
  },
  // Landing on a moment, crossing into 2000
  chime: (c, t) => {
    tone(c, t, 0.7, 0.07, 1318.5)
    tone(c, t + 0.07, 0.8, 0.06, 1975.5)
    tone(c, t + 0.07, 0.4, 0.015, 3951, 3951, 'triangle')
  },
  // Toggle confirmation
  pop: (c, t) => tone(c, t, 0.07, 0.12, 520, 880),
}

// Fast dial drags fire many changes a frame; don't stack clicks
const MIN_GAP: Partial<Record<Sound, number>> = { tick: 0.028, detent: 0.028, flap: 0.045 }
const lastAt: Partial<Record<Sound, number>> = {}

export function play(sound: Sound, delayMs = 0) {
  if (!isEnabled()) return
  const c = audio()
  if (!c || c.state !== 'running') return
  const t = c.currentTime + delayMs / 1000
  const gap = MIN_GAP[sound]
  if (gap && t - (lastAt[sound] ?? -1) < gap) return
  lastAt[sound] = t
  RECIPES[sound](c, t)
}

// ── Haptics ──────────────────────────────────────────────────────────────────

// iOS Safari has no Vibration API, but toggling a native switch gives a
// system haptic tick (iOS 18+). Only works inside a user gesture.
let iosSwitch: HTMLLabelElement | null = null
function iosTick() {
  if (!iosSwitch) {
    iosSwitch = document.createElement('label')
    iosSwitch.ariaHidden = 'true'
    iosSwitch.style.cssText = 'position:fixed;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;left:-9px'
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.setAttribute('switch', '')
    input.tabIndex = -1
    iosSwitch.appendChild(input)
    document.body.appendChild(iosSwitch)
  }
  iosSwitch.click()
}

const isIOS = () => /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

let lastHaptic = 0
export function haptic(kind: Haptic = 'light') {
  if (typeof window === 'undefined' || !isEnabled()) return
  // Rate-limit the small ticks of a fast drag; bigger moments always come through
  const now = performance.now()
  if ((kind === 'selection' || kind === 'light') && now - lastHaptic < 35) return
  lastHaptic = now
  if (typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(VIBRATE[kind])
    } catch {}
  } else if (isIOS()) {
    iosTick()
    if (kind === 'success') window.setTimeout(iosTick, 90)
  }
}

/** Sound and haptic together, the common case */
export function feel(sound: Sound, kind: Haptic = 'light') {
  play(sound)
  haptic(kind)
}
