// theory/progressions.js
// Переменная для хранения загруженной конфигурации
let PROGRESSIONS = {};

function generateProgressions(key, mode) {
    const scale = getScale(key, mode);
    const availableProgressions = PROGRESSIONS[mode] || PROGRESSIONS.major || [];

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

// Функция для инициализации данных из конфигурации
function initializeProgressions(config) {
    PROGRESSIONS = config.progressions;
}
