// theory/scales.js
// Переменные для хранения загруженной конфигурации
let SCALES = {};
let NOTES = [];
let NOTE_NAMES_RU = {};

// Функции остаются теми же, но теперь используют загруженные данные
function getScale(key, mode) {
    const keyIndex = NOTES.indexOf(key);
    const intervals = SCALES[mode];
    if (!intervals) {
        console.error(`Неизвестный лад: ${mode}`);
        return [];
    }
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

// Функция для инициализации данных из конфигурации
function initializeScales(config) {
    SCALES = config.scales;
    NOTES = config.notes;
    NOTE_NAMES_RU = config.noteNamesRu;
}
