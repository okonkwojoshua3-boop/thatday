'use client'

import { audioGraph, isEnabled, onSoundChange } from './feedback'

// The postcard story's background beat, Wrapped-style: it starts as the
// envelope opens and builds a layer with each card. Everything is synthesised
// (no audio files): a warm lo-fi groove with vinyl crackle before 2000, a
// brighter pop loop from 2000. It shares the sound toggle and the ambient
// audio session with the UI sounds, so the silent switch and mute both apply.

export type Era = 'print' | 'genz'

type Style = {
  bpm: number
  /** Delay of the off-beat 8th, as a share of an 8th (0 = straight) */
  swing: number
  /** One chord per bar, as MIDI notes */
  chords: number[][]
  bass: number[]
  level: number
}

const STYLES: Record<Era, Style> = {
  // Fmaj7 – Em7 – Dm7 – Cmaj7, slow and swung
  print: {
    bpm: 82,
    swing: 0.16,
    chords: [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]],
    bass: [41, 40, 38, 36],
    level: 0.5,
  },
  // Am – F – C – G, straight and bright
  genz: {
    bpm: 108,
    swing: 0,
    chords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]],
    bass: [45, 41, 36, 43],
    level: 0.42,
  },
}

const hz = (note: number) => 440 * Math.pow(2, (note - 69) / 12)

/** What plays in each story section (0 = envelope / first card … 5 = passport) */
function layers(section: number) {
  return { hats: section >= 1, kick: section >= 1, snare: section >= 2, bass: section >= 3, lead: section >= 4 }
}

let ctx: AudioContext | null = null
let bus: GainNode | null = null
let noise: AudioBuffer | null = null
let crackle: AudioBufferSourceNode | null = null
let era: Era = 'print'
let section = 0
let ducked = false
let active = false
let timer: number | undefined
let step = 0
let nextAt = 0
let unsubscribe: (() => void) | null = null

// ── Instruments ──────────────────────────────────────────────────────────────

function env(t: number, peak: number, attack: number, decay: number) {
  const g = ctx!.createGain()
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(peak, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
  return g
}

function osc(type: OscillatorType, freq: number, t: number, dur: number, into: AudioNode) {
  const o = ctx!.createOscillator()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  o.connect(into)
  o.start(t)
  o.stop(t + dur + 0.05)
  return o
}

function noiseHit(t: number, dur: number, peak: number, type: BiquadFilterType, freq: number, q = 0.7) {
  const src = ctx!.createBufferSource()
  src.buffer = noise
  const f = ctx!.createBiquadFilter()
  f.type = type
  f.frequency.value = freq
  f.Q.value = q
  const g = env(t, peak, 0.002, dur)
  src.connect(f).connect(g).connect(bus!)
  src.start(t, Math.random() * 0.3)
  src.stop(t + dur + 0.05)
}

/** Electric-piano chord (print) or soft pad (Gen Z), held for the bar */
function chord(notes: number[], t: number, dur: number) {
  const lp = ctx!.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = era === 'print' ? 1900 : 1400
  lp.connect(bus!)
  for (const n of notes) {
    if (era === 'print') {
      const g = env(t, 0.06, 0.012, dur * 0.9)
      g.connect(lp)
      osc('sine', hz(n), t, dur, g)
      const bell = env(t, 0.015, 0.004, 0.5)
      bell.connect(lp)
      osc('triangle', hz(n) * 2.003, t, 0.5, bell)
    } else {
      const g = ctx!.createGain()
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.022, t + 0.25)
      g.gain.setValueAtTime(0.022, t + dur - 0.2)
      g.gain.linearRampToValueAtTime(0, t + dur)
      g.connect(lp)
      osc('sawtooth', hz(n) * 0.998, t, dur, g)
      osc('sawtooth', hz(n) * 1.004, t, dur, g)
    }
  }
}

function kick(t: number) {
  const g = env(t, era === 'print' ? 0.38 : 0.5, 0.003, 0.28)
  g.connect(bus!)
  const o = osc('sine', 130, t, 0.3, g)
  o.frequency.exponentialRampToValueAtTime(45, t + 0.25)
}

function snare(t: number) {
  if (era === 'print') {
    noiseHit(t, 0.16, 0.1, 'bandpass', 2200)
  } else {
    for (const dt of [0, 0.012, 0.024]) noiseHit(t + dt, 0.09, 0.14, 'highpass', 1300)
  }
}

function hat(t: number, accent: boolean) {
  noiseHit(t, era === 'print' ? 0.04 : 0.03, accent ? 0.05 : 0.03, 'highpass', 7500)
}

function bass(note: number, t: number, dur: number) {
  const g = env(t, era === 'print' ? 0.2 : 0.24, 0.01, dur)
  const lp = ctx!.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 600
  g.connect(lp).connect(bus!)
  osc(era === 'print' ? 'sine' : 'triangle', hz(note), t, dur, g)
}

/** Plucked arpeggio (Gen Z) or a sparse vibraphone-like line (print) */
function lead(note: number, t: number) {
  const lp = ctx!.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.setValueAtTime(era === 'print' ? 2400 : 3200, t)
  lp.frequency.exponentialRampToValueAtTime(700, t + 0.18)
  const g = env(t, era === 'print' ? 0.035 : 0.03, 0.004, era === 'print' ? 0.5 : 0.2)
  lp.connect(g).connect(bus!)
  osc(era === 'print' ? 'triangle' : 'sawtooth', hz(note), t, 0.5, lp)
}

/** A looping bed of vinyl crackle under the print-era groove */
function startCrackle() {
  const len = ctx!.sampleRate * 2
  const buf = ctx!.createBuffer(1, len, ctx!.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < len; i++) {
    d[i] = (Math.random() * 2 - 1) * 0.02
    if (Math.random() < 0.0004) d[i] += (Math.random() < 0.5 ? -1 : 1) * (0.3 + Math.random() * 0.5)
  }
  const src = ctx!.createBufferSource()
  src.buffer = buf
  src.loop = true
  const hp = ctx!.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 900
  const g = ctx!.createGain()
  g.gain.value = 0.18
  src.connect(hp).connect(g).connect(bus!)
  src.start()
  crackle = src
}

// ── Sequencer: 16 steps a bar, scheduled a little ahead ─────────────────────

function scheduleStep(n: number, t: number) {
  const s = STYLES[era]
  const sixteenth = 60 / s.bpm / 4
  const bar = Math.floor(n / 16) % s.chords.length
  const i = n % 16
  const on = layers(section)
  // Swing the off-beat 8ths
  const at = i % 4 === 2 ? t + s.swing * sixteenth * 2 : t

  if (i === 0) chord(s.chords[bar], at, sixteenth * 16)
  if (on.kick && (era === 'genz' ? i % 4 === 0 : i === 0 || i === 7 || i === 10)) kick(at)
  if (on.snare && (i === 4 || i === 12)) snare(at)
  if (on.hats && (era === 'genz' ? i % 2 === 0 || i >= 14 : i % 2 === 0)) hat(at, i % 4 === 0)
  if (on.bass && (era === 'genz' ? [0, 6, 8, 14].includes(i) : i === 0 || i === 10)) {
    bass(s.bass[bar] - (era === 'genz' ? 12 : 0), at, sixteenth * (era === 'genz' ? 2 : 5))
  }
  if (on.lead) {
    const notes = s.chords[bar]
    if (era === 'genz' && i % 2 === 0) lead(notes[(i / 2) % notes.length] + 12, at)
    if (era === 'print' && (i === 3 || i === 9 || i === 14)) lead(notes[(i * 7) % notes.length] + 12, at)
  }
}

function tick() {
  if (!ctx || !active) return
  const sixteenth = 60 / STYLES[era].bpm / 4
  // While audio is locked (no tap yet on a phone) or hidden, don't pile up notes
  if (ctx.state !== 'running' || document.hidden || !isEnabled()) {
    nextAt = ctx.currentTime + 0.05
    return
  }
  while (nextAt < ctx.currentTime + 0.15) {
    scheduleStep(step, nextAt)
    step++
    nextAt += sixteenth
  }
}

function fadeTo(level: number, seconds: number) {
  if (!ctx || !bus) return
  const now = ctx.currentTime
  bus.gain.cancelScheduledValues(now)
  bus.gain.setValueAtTime(bus.gain.value, now)
  bus.gain.linearRampToValueAtTime(level, now + seconds)
}

function targetLevel() {
  return isEnabled() && !ducked && !document.hidden ? STYLES[era].level : 0
}

const onVisibility = () => fadeTo(targetLevel(), 0.3)

// ── Public ───────────────────────────────────────────────────────────────────

/** Start the beat (fades in). Safe to call before audio is unlocked. */
export function startSoundtrack(which: Era) {
  if (active) return
  const graph = audioGraph()
  if (!graph) return
  ;({ ctx, noise } = graph)
  era = which
  section = 0
  ducked = false
  step = 0
  nextAt = ctx.currentTime + 0.1
  bus = ctx.createGain()
  bus.gain.value = 0
  bus.connect(graph.out)
  if (era === 'print') startCrackle()
  active = true
  fadeTo(targetLevel(), 1.6)
  timer = window.setInterval(tick, 40)
  unsubscribe = onSoundChange(() => fadeTo(targetLevel(), 0.3))
  document.addEventListener('visibilitychange', onVisibility)
}

/** Which story card is showing: each one adds a layer */
export function setSection(n: number) {
  section = n
}

/** Fade the beat out while something else plays (the song preview) */
export function duckSoundtrack(on: boolean) {
  ducked = on
  fadeTo(targetLevel(), on ? 0.4 : 1.2)
}

/** Fade out and stop */
export function stopSoundtrack() {
  if (!active || !ctx || !bus) return
  active = false
  window.clearInterval(timer)
  unsubscribe?.()
  document.removeEventListener('visibilitychange', onVisibility)
  fadeTo(0, 0.6)
  const b = bus
  const c = crackle
  window.setTimeout(() => {
    c?.stop()
    b.disconnect()
  }, 800)
  bus = null
  crackle = null
}
