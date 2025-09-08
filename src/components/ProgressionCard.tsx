import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ChordDiagram from './ChordDiagram'
import CircleWrapper from './CircleWrapper'
import { BassFretboard, VocalFretboard, NoteList } from './Fretboards'
import type { GuitarChordVariation } from '../lib/types'
import { chordPlayer } from '../lib/audio'
import { getBassNotes as getBass } from '../lib/theory'

export default function ProgressionCard({ progression, keySig, mode, majorKeys = [], minorKeys = [], notesList, getScale, guitarChords }: {
  progression: { name: string; description?: string; chords: Array<{ name: string; notes: string[] }> }
  keySig: string
  mode: string
  majorKeys?: string[]
  minorKeys?: string[]
  notesList: string[]
  getScale: (k: string, m: string) => string[]
  guitarChords: Record<string, GuitarChordVariation[]>
}) {
  const { t, i18n } = useTranslation()

  const titleText = useMemo(() => {
    const modeTr = t(`modes.${mode}`) || mode
    const keyTr = t(`notes.${keySig}`) || keySig
    const inKey = t('progressions.inKey', { key: keyTr, mode: modeTr }) || `${keySig} ${mode}`
    const nameKey = `progressions.names.${progression.name}`
    const nameTr = t(nameKey)
    const name = nameTr !== nameKey ? nameTr : progression.name
    return `${name} ${inKey}`
  }, [progression.name, keySig, mode, i18n.language])

  const descriptionText = useMemo(() => {
    const descKey = `progressions.descriptions.${progression.description}`
    const d = t(descKey)
    return d !== descKey ? d : progression.description
  }, [progression.description, i18n.language])

  const bassNotes = useMemo(() => {
    try {
      const b = getBass(progression.chords).map((x) => x.bassNote).filter(Boolean) as string[]
      if (b.length > 0) return b
      // Fallback: use root note of chords
      const roots = progression.chords.map((c) => c.notes?.[0]).filter(Boolean) as string[]
      return roots
    } catch {
      return []
    }
  }, [progression.chords])

  const scaleNotes = useMemo(() => getScale(keySig, mode), [keySig, mode, getScale])

  return (
    <div className="mt-6 p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold m-0">{titleText}</h3>
      {descriptionText && (
        <p className="mb-4 text-gray-600">{descriptionText}</p>
      )}

      <div className="flex gap-4 flex-wrap">
        {progression.chords.map((chord, idx) => (
          <div key={idx} className="flex flex-col items-center mx-2">
            <div className="font-medium">{chord.name}</div>
            <ChordDiagram
              chordName={chord.name}
              variations={guitarChords[chord.name] || []}
              onPlay={async () => {
                await chordPlayer.playChord(chord.notes)
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap mt-2">
        <button className="inline-flex items-center gap-2 rounded bg-indigo-600 text-white px-3 py-1.5 hover:bg-indigo-700" onClick={async () => {
          await chordPlayer.playProgression(progression.chords)
        }}>{t('progressions.playProgression') || 'Play progression'}</button>

        <button className="inline-flex items-center gap-2 rounded bg-emerald-600 text-white px-3 py-1.5 hover:bg-emerald-700" onClick={async () => {
          await chordPlayer.playFullArrangement(
            progression.chords,
            bassNotes,
            scaleNotes
          )
        }}>{t('progressions.playFull') || 'Play full arrangement'}</button>
      </div>

      <div className="mt-3">
        <CircleWrapper keySig={keySig} mode={mode} chords={progression.chords} progressionName={progression.name}
          majorKeys={majorKeys} minorKeys={minorKeys} />
      </div>

      <div className="mt-3">
        <BassFretboard notes={bassNotes} title={t('progressions.bassNotesOnFretboard') || 'Bass notes on fretboard'} notesList={notesList} />
        <NoteList notes={bassNotes} title={t('progressions.bassNotes') || 'Bass notes'} />
      </div>

      <div className="mt-3">
        <VocalFretboard notes={scaleNotes} title={t('progressions.vocalNotesOnFretboard') || 'Vocal notes on fretboard'} notesList={notesList} />
        <NoteList notes={scaleNotes} title={t('progressions.vocalNotes') || 'Vocal notes'} />
      </div>
    </div>
  )
}
