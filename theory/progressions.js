// theory/progressions.js
function generateProgressions(key, mode) {
    const scale = getScale(key, mode);
    const PROGRESSIONS = {
        major: [
            {
                name: "I-V-vi-IV (Поп-прогрессия)",
                degrees: [1, 5, 6, 4],
                types: ['major', 'major', 'minor', 'major'],
                description: "Самая популярная прогрессия в поп-музыке"
            },
            {
                name: "ii-V-I (Джазовая)",
                degrees: [2, 5, 1],
                types: ['minor', 'major', 'major'],
                description: "Основа джазовой гармонии"
            },
            {
                name: "I-vi-IV-V (50s Progression)",
                degrees: [1, 6, 4, 5],
                types: ['major', 'minor', 'major', 'major'],
                description: "Классическая прогрессия 50-х годов"
            },
            {
                name: "vi-IV-I-V (Pop-punk)",
                degrees: [6, 4, 1, 5],
                types: ['minor', 'major', 'major', 'major'],
                description: "Популярна в поп-панке и альтернативе"
            }
        ],
        minor: [
            {
                name: "i-VII-VI-VII",
                degrees: [1, 7, 6, 7],
                types: ['minor', 'major', 'major', 'major'],
                description: "Эмоциональная минорная прогрессия"
            },
            {
                name: "i-iv-V-i",
                degrees: [1, 4, 5, 1],
                types: ['minor', 'minor', 'major', 'minor'],
                description: "Классическая минорная каденция"
            },
            {
                name: "i-VI-III-VII",
                degrees: [1, 6, 3, 7],
                types: ['minor', 'major', 'major', 'major'],
                description: "Испанская прогрессия"
            }
        ]
    };
    const availableProgressions = PROGRESSIONS[mode] || PROGRESSIONS.major;
    return availableProgressions.map(progression => {
        const chords = progression.degrees.map((degree, index) => {
            const noteIndex = degree - 1;
            const root = scale[noteIndex];
            const chordType = progression.types[index];
            const chordName = getChordName(root, chordType);
            return {
                root: root,
                type: chordType,
                name: chordName,
                degree: degree,
                notes: buildChord(root, chordType)
            };
        });
        return {
            ...progression,
            chords: chords
        };
    });
}

function getBassNotes(chords) {
    return chords.map(chord => ({
        chord: chord.name,
        bassNote: chord.root,
        alternatives: chord.notes
    }));
}

