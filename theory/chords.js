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
    'C': [
        { name: 'Открытый', frets: [null, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
        { name: 'Барре 3 лад', frets: [null, 3, 5, 5, 5, 3], fingers: [0, 1, 2, 3, 4, 1] },
        { name: 'Барре 8 лад', frets: [8, 10, 10, 9, 8, 8], fingers: [1, 3, 4, 2, 1, 1] }
    ],
    'C#': [
        { name: 'Барре 4 лад', frets: [null, 4, 6, 6, 6, 4], fingers: [0, 1, 2, 3, 4, 1] },
        { name: 'Барре 9 лад', frets: [9, 11, 11, 10, 9, 9], fingers: [1, 3, 4, 2, 1, 1] },
        { name: 'Упрощенный', frets: [null, null, 6, 6, 6, 4], fingers: [0, 0, 2, 3, 4, 1] }
    ],
    'D': [
        { name: 'Открытый', frets: [null, null, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
        { name: 'Барре 5 лад', frets: [null, 5, 7, 7, 7, 5], fingers: [0, 1, 2, 3, 4, 1] },
        { name: 'Барре 10 лад', frets: [10, 12, 12, 11, 10, 10], fingers: [1, 3, 4, 2, 1, 1] }
    ],
    'D#': [
        { name: 'Барре 6 лад', frets: [null, 6, 8, 8, 8, 6], fingers: [0, 1, 2, 3, 4, 1] },
        { name: 'Барре 11 лад', frets: [11, 13, 13, 12, 11, 11], fingers: [1, 3, 4, 2, 1, 1] },
        { name: 'Упрощенный', frets: [null, null, 1, 3, 4, 3], fingers: [0, 0, 1, 2, 4, 3] }
    ],
    'E': [
        { name: 'Открытый', frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
        { name: 'Барре 7 лад', frets: [null, 7, 9, 9, 9, 7], fingers: [0, 1, 2, 3, 4, 1] },
        { name: 'Барре 12 лад', frets: [12, 14, 14, 13, 12, 12], fingers: [1, 3, 4, 2, 1, 1] }
    ],
    'F': [
        { name: 'Барре 1 лад', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
        { name: 'Упрощенный', frets: [null, null, 3, 2, 1, 1], fingers: [0, 0, 3, 2, 1, 1] },
        { name: 'Барре 8 лад', frets: [null, 8, 10, 10, 10, 8], fingers: [0, 1, 2, 3, 4, 1] }
    ],
    'F#': [
        { name: 'Барре 2 лад', frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1] },
        { name: 'Барре 9 лад', frets: [null, 9, 11, 11, 11, 9], fingers: [0, 1, 2, 3, 4, 1] },
        { name: 'Упрощенный', frets: [null, null, 4, 3, 2, 2], fingers: [0, 0, 4, 3, 1, 2] }
    ],
    'G': [
        { name: 'Открытый', frets: [3, 2, 0, 0, 0, 3], fingers: [3, 2, 0, 0, 0, 4] },
        { name: 'Альтернативный', frets: [3, 2, 0, 0, 3, 3], fingers: [2, 1, 0, 0, 3, 4] },
        { name: 'Барре 3 лад', frets: [null, null, 5, 4, 3, 3], fingers: [0, 0, 4, 3, 1, 2] }
    ],
    'G#': [
        { name: 'Барре 4 лад', frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1] },
        { name: 'Барре 11 лад', frets: [null, 11, 13, 13, 13, 11], fingers: [0, 1, 2, 3, 4, 1] },
        { name: 'Упрощенный', frets: [null, null, 1, 1, 1, 4], fingers: [0, 0, 1, 2, 3, 4] }
    ],
    'A': [
        { name: 'Открытый', frets: [null, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
        { name: 'Барре 5 лад', frets: [5, 7, 7, 6, 5, 5], fingers: [1, 3, 4, 2, 1, 1] },
        { name: 'Барре 12 лад', frets: [null, 12, 14, 14, 14, 12], fingers: [0, 1, 2, 3, 4, 1] }
    ],
    'A#': [
        { name: 'Барре 1 лад', frets: [null, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1] },
        { name: 'Барре 6 лад', frets: [6, 8, 8, 7, 6, 6], fingers: [1, 3, 4, 2, 1, 1] },
        { name: 'Упрощенный', frets: [null, null, 3, 3, 3, 1], fingers: [0, 0, 2, 3, 4, 1] }
    ],
    'B': [
        { name: 'Барре 2 лад', frets: [null, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1] },
        { name: 'Барре 7 лад', frets: [7, 9, 9, 8, 7, 7], fingers: [1, 3, 4, 2, 1, 1] },
        { name: 'Открытый стиль', frets: [null, null, 4, 4, 4, 2], fingers: [0, 0, 2, 3, 4, 1] }
    ],

    // Минорные аккорды
    'Am': [
        { name: 'Открытый', frets: [null, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
        { name: 'Барре 5 лад', frets: [5, 7, 7, 5, 5, 5], fingers: [1, 3, 4, 1, 1, 1] },
        { name: 'Барре 12 лад', frets: [null, 12, 14, 14, 13, 12], fingers: [0, 1, 3, 4, 2, 1] }
    ],
    'A#m': [
        { name: 'Барре 1 лад', frets: [null, 1, 3, 3, 2, 1], fingers: [0, 1, 3, 4, 2, 1] },
        { name: 'Барре 6 лад', frets: [6, 8, 8, 6, 6, 6], fingers: [1, 3, 4, 1, 1, 1] },
        { name: 'Упрощенный', frets: [null, null, 3, 3, 2, 1], fingers: [0, 0, 3, 4, 2, 1] }
    ],
    'Bm': [
        { name: 'Барре 2 лад', frets: [null, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1] },
        { name: 'Барре 7 лад', frets: [7, 9, 9, 7, 7, 7], fingers: [1, 3, 4, 1, 1, 1] },
        { name: 'Упрощенный', frets: [null, null, 4, 4, 3, 2], fingers: [0, 0, 3, 4, 2, 1] }
    ],
    'Cm': [
        { name: 'Барре 3 лад', frets: [null, 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1] },
        { name: 'Барре 8 лад', frets: [8, 10, 10, 8, 8, 8], fingers: [1, 3, 4, 1, 1, 1] },
        { name: 'Упрощенный', frets: [null, null, 5, 5, 4, 3], fingers: [0, 0, 3, 4, 2, 1] }
    ],
    'C#m': [
        { name: 'Барре 4 лад', frets: [null, 4, 6, 6, 5, 4], fingers: [0, 1, 3, 4, 2, 1] },
        { name: 'Барре 9 лад', frets: [9, 11, 11, 9, 9, 9], fingers: [1, 3, 4, 1, 1, 1] },
        { name: 'Упрощенный', frets: [null, null, 6, 6, 5, 4], fingers: [0, 0, 3, 4, 2, 1] }
    ],
    'Dm': [
        { name: 'Открытый', frets: [null, null, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
        { name: 'Барре 5 лад', frets: [null, 5, 7, 7, 6, 5], fingers: [0, 1, 3, 4, 2, 1] },
        { name: 'Барре 10 лад', frets: [10, 12, 12, 10, 10, 10], fingers: [1, 3, 4, 1, 1, 1] }
    ],
    'D#m': [
        { name: 'Барре 6 лад', frets: [null, 6, 8, 8, 7, 6], fingers: [0, 1, 3, 4, 2, 1] },
        { name: 'Барре 11 лад', frets: [11, 13, 13, 11, 11, 11], fingers: [1, 3, 4, 1, 1, 1] },
        { name: 'Упрощенный', frets: [null, null, 1, 3, 4, 2], fingers: [0, 0, 1, 3, 4, 2] }
    ],
    'Em': [
        { name: 'Открытый', frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
        { name: 'Барре 7 лад', frets: [null, 7, 9, 9, 8, 7], fingers: [0, 1, 3, 4, 2, 1] },
        { name: 'Барре 12 лад', frets: [12, 14, 14, 12, 12, 12], fingers: [1, 3, 4, 1, 1, 1] }
    ],
    'Fm': [
        { name: 'Барре 1 лад', frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1] },
        { name: 'Барре 8 лад', frets: [null, 8, 10, 10, 9, 8], fingers: [0, 1, 3, 4, 2, 1] },
        { name: 'Упрощенный', frets: [null, null, 3, 1, 1, 1], fingers: [0, 0, 4, 1, 2, 3] }
    ],
    'F#m': [
        { name: 'Барре 2 лад', frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1] },
        { name: 'Барре 9 лад', frets: [null, 9, 11, 11, 10, 9], fingers: [0, 1, 3, 4, 2, 1] },
        { name: 'Упрощенный', frets: [null, null, 4, 2, 2, 2], fingers: [0, 0, 4, 1, 2, 3] }
    ],
    'Gm': [
        { name: 'Барре 3 лад', frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1] },
        { name: 'Барре 10 лад', frets: [null, 10, 12, 12, 11, 10], fingers: [0, 1, 3, 4, 2, 1] },
        { name: 'Упрощенный', frets: [null, null, 5, 3, 3, 3], fingers: [0, 0, 4, 1, 2, 3] }
    ],
    'G#m': [
        { name: 'Барре 4 лад', frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1] },
        { name: 'Барре 11 лад', frets: [null, 11, 13, 13, 12, 11], fingers: [0, 1, 3, 4, 2, 1] },
        { name: 'Упрощенный', frets: [null, null, 6, 4, 4, 4], fingers: [0, 0, 4, 1, 2, 3] }
    ]
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
