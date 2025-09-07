// theory/chords.js
// Переменные для хранения загруженной конфигурации
let CHORD_PATTERNS = {};
let GUITAR_CHORDS = {};

function buildChord(root, chordType) {
    const rootIndex = NOTES.indexOf(root);
    const pattern = CHORD_PATTERNS[chordType];
    if (!pattern) {
        console.error(`Неизвестный тип аккорда: ${chordType}`);
        return [];
    }
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

// Функция для инициализации данных из конфигурации
function initializeChords(config) {
    CHORD_PATTERNS = config.chordPatterns;
    GUITAR_CHORDS = config.guitarChords;
}
