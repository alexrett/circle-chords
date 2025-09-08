import React, { useEffect, useState } from 'react'
import LanguageSelector from './components/LanguageSelector'
import KeyModeSelector from './components/KeyModeSelector'
import ProgressionCard from './components/ProgressionCard'
import InteractiveCircle from './components/InteractiveCircle'
import type { AppConfig, GeneratedProgression } from './lib/types'
import { loadAllConfig } from './lib/config'
import { initTheory, generateProgressions as gen, getScale } from './lib/theory'
import './i18n'
import { useTranslation } from 'react-i18next'
// audio handlers are imported where used

const DEFAULT_NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
]

export default function App() {
  const [ready, setReady] = useState(false)
  const [keySig, setKeySig] = useState<string>('C')
  const [mode, setMode] = useState<string>('major')
  const [progressions, setProgressions] = useState<GeneratedProgression[]>([])
  const [notesList, setNotesList] = useState<string[]>(DEFAULT_NOTES)
  // language state not required; i18n hook drives translations
  const [circleData, setCircleData] = useState<{ majorKeys: string[]; minorKeys: string[] }>({ majorKeys: [], minorKeys: [] })
  const [modes, setModes] = useState<string[]>(['major', 'minor'])
  const [guitarChords, setGuitarChords] = useState<AppConfig['guitarChords']>({})

  // Initialize config + theory
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        // i18n may already start loading itself; wait a tick if present
        // Language comes from i18next init
        const config: AppConfig = await loadAllConfig()
        initTheory(config)
        setCircleData({ majorKeys: config.majorKeys || [], minorKeys: config.minorKeys || [] })
        setGuitarChords(config.guitarChords || {})
        if (Array.isArray(config.notes) && config.notes.length === 12) setNotesList(config.notes)
        if (config.scales) setModes(Object.keys(config.scales))

        if (!cancelled) setReady(true)
      } catch (e) {
        console.error('Initialization error:', e)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Recompute progressions when key/mode changes
  useEffect(() => {
    if (!ready) return
    try {
      const list = gen(keySig, mode)
      setProgressions(list)
    } catch (e) {
      console.error('Failed to generate progressions:', e)
    }
  }, [ready, keySig, mode])

  const onTonalityChange = (key: string, m: string) => {
    setKeySig(key)
    setMode(m)
  }

  const { t, i18n } = useTranslation()

  return (
    <div className="max-w-[1100px] mx-auto p-3 sm:p-4">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
        <h1 className="m-0 text-lg sm:text-xl font-semibold">{t('app.title') || 'Guitar Progression Generator'}</h1>
        <LanguageSelector value={i18n.language} onChange={() => { /* i18n handles language change */ }} />
      </header>

      <section className="mt-4">
        <KeyModeSelector
          notes={notesList}
          keyValue={keySig}
          modeValue={mode}
          onChange={(k, m) => { setKeySig(k); setMode(m) }}
          modes={modes}
        />
      </section>

      <section className="mt-4">
        {ready && (
          <InteractiveCircle keyValue={keySig} modeValue={mode} onTonalityChange={onTonalityChange}
            majorKeys={circleData.majorKeys} minorKeys={circleData.minorKeys} />
        )}
      </section>

      {!ready && (
        <p className="text-gray-500">{t('app.loading') || 'Loading...'}</p>
      )}

      {ready && progressions.map((p, idx) => (
        <ProgressionCard
          key={idx}
          progression={p}
          keySig={keySig}
          mode={mode}
          majorKeys={circleData.majorKeys}
          minorKeys={circleData.minorKeys}
          notesList={notesList}
          getScale={(k, m) => getScale(k, m)}
          guitarChords={guitarChords}
        />
      ))}
    </div>
  )}
