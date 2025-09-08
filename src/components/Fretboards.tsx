import React from 'react'

const DEFAULT_NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'] as const

function getNoteOnString(openNote: string, fret: number, NOTES: readonly string[] = DEFAULT_NOTES) {
  const openIndex = (NOTES as readonly string[]).indexOf(openNote)
  if (openIndex < 0) return ''
  return NOTES[(openIndex + fret) % 12]
}

function FretHeader({ numFrets }: { numFrets: number }) {
  return (
    <div className="flex items-center mb-1">
      <div className="w-10" />
      {Array.from({ length: numFrets + 1 }, (_, f) => (
        <div key={f} className="w-10 text-center text-xs text-gray-500">{f}</div>
      ))}
    </div>
  )
}

export function BassFretboard({ notes, title, notesList = DEFAULT_NOTES }: { notes: string[]; title?: string; notesList?: readonly string[] }) {
  const openStrings = ['E', 'A', 'D', 'G']
  const numFrets = 12
  return (
    <div className="inline-block border rounded p-2 mb-2 overflow-x-auto bg-white">
      {title && (
        <div className="font-bold mb-1">{title}</div>
      )}
      <FretHeader numFrets={numFrets} />
      {openStrings.map((open) => (
        <div key={open} className="flex items-center">
          <div className="w-10 font-semibold text-xs">{open}</div>
          {Array.from({ length: numFrets + 1 }, (_, f) => {
            const note = getNoteOnString(open, f, notesList)
            const highlight = notes.includes(note)
            return (
              <div key={f} className={`w-10 text-center text-xs border rounded ${highlight ? 'bg-yellow-200 font-semibold' : ''}`}>{note}</div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export function VocalFretboard({ notes, title, notesList = DEFAULT_NOTES }: { notes: string[]; title?: string; notesList?: readonly string[] }) {
  const openStrings = ['E', 'A', 'D', 'G', 'B', 'E']
  const numFrets = 12
  return (
    <div className="inline-block border rounded p-2 mb-2 overflow-x-auto bg-white">
      {title && (
        <div className="font-bold mb-1">{title}</div>
      )}
      <FretHeader numFrets={numFrets} />
      {openStrings.map((open, idx) => (
        <div key={`${open}-${idx}`} className="flex items-center">
          <div className="w-10 font-semibold text-xs">{open}</div>
          {Array.from({ length: numFrets + 1 }, (_, f) => {
            const note = getNoteOnString(open, f, notesList)
            const highlight = notes.includes(note)
            return (
              <div key={f} className={`w-10 text-center text-xs border rounded ${highlight ? 'bg-yellow-200 font-semibold' : ''}`}>{note}</div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export function NoteList({ notes, title }: { notes: string[]; title?: string }) {
  return (
    <div className="note-list mt-2 text-sm">
      {title && <span className="font-bold">{title}: </span>}
      {notes.join(', ')}
    </div>
  )
}
