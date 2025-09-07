// theory/chords.js
const CHORD_PATTERNS = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    dim: [0, 3, 6],
    maj7: [0, 4, 7, 11],
    min7: [0, 3, 7, 10],
    dom7: [0, 4, 7, 10]
};

const GUITAR_CHORDS = {
    'C': { frets: [null, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
    'C#': { frets: [null, null, 6, 6, 6, 4], fingers: [0, 0, 2, 3, 4, 1] },
    'D': { frets: [null, null, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
    'D#': { frets: [null, null, 1, 3, 4, 3], fingers: [0, 0, 1, 2, 4, 3] },
    'E': { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
    'F': { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
    'F#': { frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1] },
    'G': { frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4] },
    'G#': { frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1] },
    'A': { frets: [null, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
    'A#': { frets: [null, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1] },
    'B': { frets: [null, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1] },
    'Cm': { frets: [null, 3, 1, 0, 1, 3], fingers: [0, 3, 1, 0, 2, 4] },
    'C#m': { frets: [null, null, 6, 6, 5, 4], fingers: [0, 0, 3, 4, 2, 1] },
    'Dm': { frets: [null, null, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
    'D#m': { frets: [null, null, 1, 3, 4, 2], fingers: [0, 0, 1, 3, 4, 2] },
    'Em': { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
    'Fm': { frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1] },
    'F#m': { frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1] },
    'Gm': { frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1] },
    'G#m': { frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1] },
    'Am': { frets: [null, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
    'A#m': { frets: [null, 1, 3, 3, 2, 1], fingers: [0, 1, 3, 4, 2, 1] },
    'Bm': { frets: [null, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1] }
};

function buildChord(root, chordType) {
    const rootIndex = NOTES.indexOf(root);
    const pattern = CHORD_PATTERNS[chordType];
    return pattern.map(interval => {
        const noteIndex = (rootIndex + interval) % 12;
        return NOTES[noteIndex];
    });
}

function getChordName(root, chordType) {
    switch(chordType) {
        case 'major': return root;
        case 'minor': return root + 'm';
        case 'dim': return root + 'dim';
        case 'maj7': return root + 'maj7';
        case 'min7': return root + 'm7';
        case 'dom7': return root + '7';
        default: return root;
    }
}

