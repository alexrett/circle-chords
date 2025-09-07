// theory/scales.js
const SCALES = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    lydian: [0, 2, 4, 6, 7, 9, 11]
};

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const NOTE_NAMES_RU = {
    'C': 'До', 'C#': 'До#', 'D': 'Ре', 'D#': 'Ре#', 'E': 'Ми', 'F': 'Фа',
    'F#': 'Фа#', 'G': 'Соль', 'G#': 'Соль#', 'A': 'Ля', 'A#': 'Ля#', 'B': 'Си'
};

function getScale(key, mode) {
    const keyIndex = NOTES.indexOf(key);
    const intervals = SCALES[mode];
    return intervals.map(interval => {
        const noteIndex = (keyIndex + interval) % 12;
        return NOTES[noteIndex];
    });
}

function getScaleDegrees(key, mode) {
    const scale = getScale(key, mode);
    return scale.map((note, index) => ({
        degree: index + 1,
        note: note,
        interval: SCALES[mode][index]
    }));
}

