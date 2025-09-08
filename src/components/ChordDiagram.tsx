import React from 'react'
import type { GuitarChordVariation } from '../lib/types'

import { useTranslation } from 'react-i18next'

function FretPositionLabel({ startFret }: { startFret: number }) {
  const { t } = useTranslation()
  if (startFret <= 0) return null
  return <div className="text-xs text-gray-500">{t('guitar.fretPosition', { fret: startFret }) || `${startFret}`}</div>
}

function Variation({ variation }: { variation: GuitarChordVariation }) {
  const { t } = useTranslation()
  const fretsUsed = variation.frets.filter((f): f is number => f !== null && f > 0)
  const minFret = fretsUsed.length > 0 ? Math.min(...fretsUsed) : 0
  const maxFret = fretsUsed.length > 0 ? Math.max(...fretsUsed) : 4
  const startFret = minFret > 0 ? minFret : 0
  const endFret = Math.max(startFret + 4, maxFret)

  const translateName = (name: string) => {
    const key = `guitar.chordPositions.${name}`
    const tr = t(key)
    if (tr !== key) return tr as string
    const match = name.match(/^Барре (\d+) лад$/)
    if (match) {
      return (t('guitar.chordPositions.Барре {fret} лад', { fret: match[1] }) as string) || name
    }
    return name
  }

  return (
    <div className="chord-variation">
      <div className="variation-title font-medium text-sm">{translateName(variation.name)}</div>
      <FretPositionLabel startFret={startFret} />
      <div className="grid grid-cols-6 gap-1 mt-1">
        {Array.from({ length: endFret - startFret + 1 }).map((_, k) => {
          const fret = startFret + k
          return Array.from({ length: 6 }).map((__, string) => {
            const fretNumber = variation.frets[string]
            const finger = variation.fingers[string]
            const isFinger = fretNumber === fret && finger > 0
            const isX = fretNumber === null && fret === startFret
            const isO = fretNumber === 0 && fret === startFret
            return (
              <div key={`${string}-${fret}`} className={`w-6 h-6 text-xs flex items-center justify-center border rounded ${isFinger ? 'bg-indigo-600 text-white' : ''}`}>
                {isFinger ? finger : isX ? 'X' : isO ? 'O' : ''}
              </div>
            )
          })
        })}
      </div>
    </div>
  )
}

import { useTranslation } from 'react-i18next'

export default function ChordDiagram({ chordName, variations, onPlay }: { chordName: string; variations: GuitarChordVariation[]; onPlay?: () => void }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-2">
      <button className="inline-flex items-center gap-2 rounded bg-slate-600 text-white px-2 py-1 hover:bg-slate-700 text-sm" title={`${t('progressions.playChord') || 'Play'} ${chordName}`} onClick={onPlay}>
        {(t('progressions.playChord') as string || 'Play') + ' ' + chordName}
      </button>
      {variations.map((v, i) => (
        <Variation key={i} variation={v} />
      ))}
    </div>
  )
}
