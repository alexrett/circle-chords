import { describe, it, expect, beforeAll } from 'vitest'
import cfgScales from '../../public/config/scales.json'
import cfgChords from '../../public/config/chords.json'
import { initTheory } from './theory'

type Tunings = ['E','A','D','G','B','E']
const TUNING: Tunings = ['E','A','D','G','B','E']
const NOTES: string[] = (cfgScales as any).notes
const CHORD_PATTERNS: Record<string, number[]> = (cfgChords as any).chordPatterns
const GUITAR_CHORDS: Record<string, Array<{ frets: Array<number|null> }>> = (cfgChords as any).guitarChords

function noteAt(open: string, fret: number) {
  const i = NOTES.indexOf(open)
  return NOTES[(i + fret) % 12]
}

function parseChordName(name: string): { root: string; type: string } {
  // order matters: maj7, m7b5, dim7, m7, dim, m, 7
  const patterns: Array<[RegExp, (m: RegExpMatchArray)=>{root:string;type:string}]> = [
    [/^([A-G](?:#|b)?)maj7$/, m => ({ root: m[1], type: 'maj7' })],
    [/^([A-G](?:#|b)?)m7b5$/, m => ({ root: m[1], type: 'm7b5' })],
    [/^([A-G](?:#|b)?)dim7$/, m => ({ root: m[1], type: 'dim7' })],
    [/^([A-G](?:#|b)?)m7$/, m => ({ root: m[1], type: 'min7' })],
    [/^([A-G](?:#|b)?)dim$/, m => ({ root: m[1], type: 'dim' })],
    [/^([A-G](?:#|b)?)m$/, m => ({ root: m[1], type: 'minor' })],
    [/^([A-G](?:#|b)?)7$/, m => ({ root: m[1], type: 'dom7' })],
    [/^([A-G](?:#|b)?)$/, m => ({ root: m[1], type: 'major' })],
  ]
  for (const [re, fn] of patterns) {
    const m = name.match(re)
    if (m) return fn(m)
  }
  return { root: name, type: 'major' }
}

function chordPitchClasses(root: string, type: string) {
  const rootIdx = NOTES.indexOf(root.replace('b', '#')) // crude enharmonic handling
  const pattern = CHORD_PATTERNS[type]
  if (!pattern || rootIdx < 0) return new Set<string>()
  const pcs = new Set<string>()
  pattern.forEach(iv => pcs.add(NOTES[(rootIdx + iv) % 12]))
  return pcs
}

beforeAll(() => {
  initTheory({
    scales: (cfgScales as any).scales,
    notes: (cfgScales as any).notes,
    noteNamesRu: (cfgScales as any).noteNamesRu,
    chordPatterns: (cfgChords as any).chordPatterns,
    guitarChords: (cfgChords as any).guitarChords,
    progressions: {},
    majorKeys: [],
    minorKeys: [],
  })
})

describe('guitar chord diagrams validity', () => {
  it('every fretted or open note in diagram is part of the chord', () => {
    const entries = Object.entries(GUITAR_CHORDS)
    for (const [name, variations] of entries) {
      const { root, type } = parseChordName(name)
      const pcs = chordPitchClasses(root, type)
      if (pcs.size === 0) continue // skip unknown types
      for (const v of variations) {
        const frets = v.frets
        for (let s = 0; s < 6; s++) {
          const f = frets[s]
          if (f === null) continue // muted
          const open = TUNING[s]
          const note = noteAt(open, f)
          expect(pcs.has(note)).toBe(true)
        }
      }
    }
  })
})

