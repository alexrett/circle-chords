import type { AppConfig, GeneratedChord, GeneratedProgression, Note, ProgressionDef } from './types'

let SCALES: Record<string, number[]> = {}
let NOTES: Note[] = []
let CHORD_PATTERNS: Record<string, number[]> = {}
let PROGRESSIONS: Record<string, ProgressionDef[]> = {}

export function initTheory(config: AppConfig) {
  SCALES = config.scales
  NOTES = config.notes
  CHORD_PATTERNS = config.chordPatterns
  PROGRESSIONS = config.progressions
}

export function getScale(key: Note, mode: string): Note[] {
  const keyIndex = NOTES.indexOf(key)
  const intervals = SCALES[mode]
  if (keyIndex < 0 || !intervals) return []
  return intervals.map(interval => NOTES[(keyIndex + interval) % 12])
}

export function buildChord(root: Note, chordType: string): Note[] {
  const rootIndex = NOTES.indexOf(root)
  const pattern = CHORD_PATTERNS[chordType]
  if (rootIndex < 0 || !pattern) return []
  return pattern.map(interval => NOTES[(rootIndex + interval) % 12])
}

export function getChordName(root: Note, chordType: string): string {
  switch (chordType) {
    case 'major': return root
    case 'minor': return `${root}m`
    case 'dim': return `${root}dim`
    case 'maj7': return `${root}maj7`
    case 'min7': return `${root}m7`
    case 'dom7': return `${root}7`
    default: return `${root}${chordType}`
  }
}

export function generateProgressions(key: Note, mode: string): GeneratedProgression[] {
  const scale = getScale(key, mode)
  const list = PROGRESSIONS[mode] || PROGRESSIONS['major'] || []
  return list.map((p) => {
    const chords: GeneratedChord[] = p.degrees.map((degree, idx) => {
      const root = scale[degree - 1]
      const chordType = p.types[idx]
      const notes = buildChord(root, chordType)
      return {
        root,
        type: chordType,
        name: getChordName(root, chordType),
        degree,
        notes,
      }
    })
    return { ...p, chords }
  })
}

export function getBassNotes(chords: GeneratedChord[]) {
  return chords.map(c => ({ chord: c.name, bassNote: c.root, alternatives: c.notes }))
}

