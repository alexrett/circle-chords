import * as Tone from 'tone'

export class ChordPlayer {
  private synth: Tone.PolySynth | null = null
  private bassSynth: Tone.MonoSynth | null = null
  private vocalSynth: Tone.Synth | null = null
  private initialized = false

  async initialize() {
    if (this.initialized) return

    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle', modulationType: 'square', harmonicity: 2 },
      envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 2.5 },
    })
    const reverb = new Tone.Reverb({ decay: 2, wet: 0.3 })
    const compressor = new Tone.Compressor({ threshold: -24, ratio: 8, attack: 0.003, release: 0.1 })
    this.synth.chain(compressor, reverb, Tone.Destination)

    this.bassSynth = new Tone.MonoSynth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.4, sustain: 0.3, release: 1.2 },
      filter: { frequency: 200 }
    })
    const bassDistortion = new Tone.Distortion(0.4)
    const bassCompressor = new Tone.Compressor(-18, 4)
    this.bassSynth.chain(bassDistortion, bassCompressor, Tone.Destination)

    this.vocalSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.05, decay: 0.2, sustain: 0.7, release: 0.8 }
    })
    const chorus = new Tone.Chorus(4, 2.5, 0.5)
    this.vocalSynth.chain(chorus, Tone.Destination)

    await Tone.start()
    this.initialized = true
  }

  private noteToFreq(note: string, octave = 4) {
    return `${note}${octave}`
  }

  async playChord(chordNotes: string[], duration: string = '2n') {
    if (!this.initialized) await this.initialize()
    const freqs = [
      this.noteToFreq(chordNotes[0], 3),
      this.noteToFreq(chordNotes[1], 4),
      this.noteToFreq(chordNotes[2], 4),
      ...(chordNotes[3] ? [this.noteToFreq(chordNotes[3], 4)] : []),
    ]
    this.synth!.triggerAttackRelease(freqs, duration)
    return new Promise((r) => setTimeout(r, Tone.Time(duration).toMilliseconds()))
  }

  async playProgression(chords: Array<{ notes: string[] }>, tempo = 120) {
    if (!this.initialized) await this.initialize()
    const chordDurationMs = (60 / tempo) * 2 * 1000
    for (let i = 0; i < chords.length; i++) {
      await this.playChord(chords[i].notes, '2n')
      if (i < chords.length - 1) await new Promise((r) => setTimeout(r, chordDurationMs))
    }
  }

  generateVocalPattern(scaleNotes: string[], measures = 4) {
    const pattern: Array<Array<{ note: string; duration: string; time: number }>> = []
    const rhythms = [
      { note: 'quarter', duration: '4n', time: 0.25 },
      { note: 'eighth', duration: '8n', time: 0.125 },
      { note: 'half', duration: '2n', time: 0.5 },
    ]
    for (let m = 0; m < measures; m++) {
      const bar: Array<{ note: string; duration: string; time: number }> = []
      let current = 0
      while (current < 1) {
        const r = rhythms[Math.floor(Math.random() * rhythms.length)]
        const n = scaleNotes[Math.floor(Math.random() * scaleNotes.length)]
        const octave = 4 + Math.floor(Math.random() * 2)
        bar.push({ note: this.noteToFreq(n, octave), duration: r.duration, time: current })
        current += r.time
      }
      pattern.push(bar)
    }
    return pattern
  }

  generateBassPattern(bassNotes: string[], measures = 4) {
    const pattern: Array<Array<{ note: string; duration: string; time: number }>> = []
    for (let m = 0; m < measures; m++) {
      const bn = bassNotes[m % bassNotes.length]
      pattern.push([
        { note: this.noteToFreq(bn, 2), duration: '4n', time: 0 },
        { note: this.noteToFreq(bn, 2), duration: '4n', time: 0.25 },
        { note: this.noteToFreq(bn, 2), duration: '4n', time: 0.5 },
        { note: this.noteToFreq(bn, 2), duration: '4n', time: 0.75 },
      ])
    }
    return pattern
  }

  async playFullArrangement(chords: Array<{ notes: string[] }>, bassNotes: string[], scaleNotes: string[], tempo = 120) {
    if (!this.initialized) await this.initialize()
    const measureDuration = (60 / tempo) * 4
    const vocal = (scaleNotes && scaleNotes.length > 0)
      ? this.generateVocalPattern(scaleNotes, chords.length)
      : Array.from({ length: chords.length }, () => [] as Array<{ note: string; duration: string; time: number }>)
    const bassSource = (bassNotes && bassNotes.length > 0)
      ? bassNotes
      : (chords.map(c => c.notes?.[0]).filter(Boolean) as string[])
    const bass = this.generateBassPattern(bassSource, chords.length)

    for (let i = 0; i < chords.length; i++) {
      const start = Tone.now()
      const chordFreqs = [
        this.noteToFreq(chords[i].notes[0], 3),
        this.noteToFreq(chords[i].notes[1], 4),
        this.noteToFreq(chords[i].notes[2], 4),
        ...(chords[i].notes[3] ? [this.noteToFreq(chords[i].notes[3], 4)] : []),
      ]
      this.synth!.triggerAttackRelease(chordFreqs, '1m', start)
      bass[i]?.forEach(bn => {
        if (!bn?.note) return
        this.bassSynth!.triggerAttackRelease(bn.note, bn.duration, start + bn.time * measureDuration)
      })
      vocal[i]?.forEach(vn => {
        if (!vn?.note) return
        this.vocalSynth!.triggerAttackRelease(vn.note, vn.duration, start + vn.time * measureDuration)
      })
      await new Promise(r => setTimeout(r, measureDuration * 1000))
    }
  }

  stop() {
    this.synth?.releaseAll()
    this.bassSynth?.triggerRelease()
    this.vocalSynth?.triggerRelease()
  }
}

export const chordPlayer = new ChordPlayer()
