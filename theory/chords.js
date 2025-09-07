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
    // Получаем суффикс для аккорда с проверкой на существование перевода
    let suffix = '';
    if (window.i18n) {
        const translatedSuffix = window.i18n.t(`chordTypes.${chordType}`);
        // Проверяем, что перевод найден (не равен исходному ключу)
        suffix = translatedSuffix !== `chordTypes.${chordType}` ? translatedSuffix : '';
    }

    switch(chordType) {
        case 'major': return root + suffix;
        case 'minor': return root + (suffix || 'm');
        case 'dim': return root + (suffix || 'dim');
        case 'maj7': return root + (suffix || 'maj7');
        case 'min7': return root + (suffix || 'm7');
        case 'dom7': return root + (suffix || '7');
        default: return root + suffix;
    }
}

// Функция для инициализации данных из конфигурации
function initializeChords(config) {
    CHORD_PATTERNS = config.chordPatterns;
    GUITAR_CHORDS = config.guitarChords;
}
