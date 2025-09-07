# Guitar Progression Generator

[RU](./README.ru.md) readme.

Working version available here: https://circle-chords.malikov.tech/

## System Overview

This is a web application for generating chord progressions with visualization on the guitar fretboard, the circle of fifths, and audio playback. The architecture follows a modular principle, separating music theory, visualization, and audio.

## Application Architecture

```
/
├── index.html              # Main HTML file
├── script.js               # Main application class
├── styles.css              # UI styles
├── config/                 # Configuration data
│   ├── scales.json         # Scales and notes
│   ├── chords.json         # Chords and fingerings
│   ├── progressions.json   # Chord progressions
│   ├── circleOfFifths.json # Circle of fifths data
│   └── configLoader.js     # Config loader (empty)
├── theory/                 # Music theory modules
│   ├── scales.js           # Scale handling
│   ├── chords.js           # Chord construction
│   ├── progressions.js     # Progression generation
│   └── circleOfFifths.js   # Circle of fifths
├── guitar/                 # Guitar-related modules
│   └── fretboard.js        # Fretboard visualization
└── audio/                  # Audio modules
    ├── chordPlayer.js      # Chord playback
    └── Tone.js             # Audio library
```

---

## Main System Components

### 1. Main Application Class (`script.js`)

**`ChordProgressionGenerator` class** – the central controller:

```javascript
class ChordProgressionGenerator {
    constructor() {
        // Initialize DOM elements
        this.keySelect = document.getElementById('key-select');
        this.modeSelect = document.getElementById('mode-select');
        this.progressionsDiv = document.getElementById('progressions');
        this.visualizationDiv = document.getElementById('visualization');
        this.bassNotesDiv = document.getElementById('bass-notes');
        this.interactiveCircleContainer = document.getElementById('interactive-circle-container');
        this.circleOfFifths = new CircleOfFifths();
    }
}
```

**Core methods:**
- `init()` – initialize events and first generation
- `generate()` – main progression generation method
- `renderProgressions()` – render results
- `updateInteractiveCircle()` – update circle of fifths
- `onTonalityChange()` – handle key change

### 2. Scales Module (`theory/scales.js`)

**Global variables:**
```javascript
let SCALES = {};        // Scale patterns from config
let NOTES = [];         // All notes
let NOTE_NAMES_RU = {}; // Russian note names
```

**Key functions:**
- `getScale(key, mode)` – get scale notes for key and mode
- `getScaleDegrees(key, mode)` – get scale degrees
- `initializeScales(config)` – load data from config

**Algorithm:**
1. Find root index in `NOTES`
2. Take interval pattern from `SCALES[mode]`
3. For each interval: `(keyIndex + interval) % 12`
4. Return notes

### 3. Chords Module (`theory/chords.js`)

**Global variables:**
```javascript
let CHORD_PATTERNS = {}; // Interval patterns for chords
let GUITAR_CHORDS = {};  // Guitar chord fingerings
```

**Key functions:**
- `buildChord(root, chordType)` – build chord notes
- `getChordName(root, chordType)` – get chord name
- `initializeChords(config)` – load config data

**Algorithm:**
1. Find root index
2. Get interval pattern from `CHORD_PATTERNS[chordType]`
3. Compute `(rootIndex + interval) % 12`
4. Return chord notes

### 4. Progressions Module (`theory/progressions.js`)

**Global variables:**
```javascript
let PROGRESSIONS = {}; // Progressions by mode
```

**Key functions:**
- `generateProgressions(key, mode)` – main generator
- `getBassNotes(chords)` – extract bass notes

**Algorithm:**
1. Get scale: `getScale(key, mode)`
2. Get progressions for mode
3. For each progression:
    - Iterate degrees
    - Build chord with `buildChord(root, chordType)`
4. Return chord objects

---

## Detailed Logic

### Example progression

**I-V-vi-IV in C major:**

1. Input:
    - Key: C
    - Mode: major
    - Degrees: [1, 5, 6, 4]

2. Scale:
   ```javascript
   const scale = getScale("C", "major");
   // ["C", "D", "E", "F", "G", "A", "B"]
   ```

3. Chords:
    - I: C-E-G
    - V: G-B-D
    - vi: A-C-E
    - IV: F-A-C

---

## Circle of Fifths (`theory/circleOfFifths.js`)

**`CircleOfFifths` class:**
- Visualizes keys around the circle
- Shows relationships
- Supports interactive key change

**Key methods:**
- `getKeyPosition(key, mode)`
- `renderCircle()`
- `renderInteractiveContainer()`

---

## Fretboard Module (`guitar/fretboard.js`)

**Functions:**
- `renderChordDiagram(chordName)`
- `renderBassFretboard(notes, title)`
- `renderVocalFretboard(notes, title)`

---

## Audio Module (`audio/chordPlayer.js`)

**`ChordPlayer` class** uses Tone.js

- Synths: poly, bass, vocal
- Effects: reverb, compressor, filters
- Methods:
    - `playChord(notes)`
    - `playProgression(chords)`
    - `playFullArrangement(chords, bassNotes, vocalNotes)`

---

## Data Flow

1. Initialization → load configs, create UI
2. Generation → build scale, chords, progressions
3. Visualization → render diagrams, fretboards, circle
4. Playback → Tone.js synth → Web Audio API

---

## Config System

### `scales.json`
```json
{
  "scales": { "major": [0,2,4,5,7,9,11], "minor": [0,2,3,5,7,8,10] },
  "notes": ["C","C#","D",...],
  "noteNamesRu": { "C":"До", ... }
}
```

### `chords.json`
```json
{
  "chordPatterns": { "major":[0,4,7], "minor":[0,3,7] },
  "guitarChords": {
    "C": [{ "name":"Open", "frets":[null,3,2,0,1,0], "fingers":[0,3,2,0,1,0] }]
  }
}
```

### `progressions.json`
```json
{
  "progressions": {
    "major": [{
      "name":"I-V-vi-IV",
      "degrees":[1,5,6,4],
      "types":["major","major","minor","major"],
      "description":"Popular progression"
    }]
  }
}
```

See [CONFIG_GUIDE.md](./CONFIG_GUIDE.md) for details.

---

## Extensibility

- **New scales:** add to `scales.json`, `progressions.json`, update UI
- **New chords:** add to `chords.json`, update chord functions
- **New progressions:** extend `progressions.json`, auto-loaded