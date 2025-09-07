// config/configLoader.js
// Загрузчик конфигурационных данных
window.configLoader = {
    async loadAll() {
        try {
            const [scales, chords, progressions, circleOfFifths] = await Promise.all([
                fetch('./config/scales.json').then(r => r.json()),
                fetch('./config/chords.json').then(r => r.json()),
                fetch('./config/progressions.json').then(r => r.json()),
                fetch('./config/circleOfFifths.json').then(r => r.json())
            ]);

            return {
                scales: scales.scales,
                notes: scales.notes,
                noteNamesRu: scales.noteNamesRu,
                chordPatterns: chords.chordPatterns,
                guitarChords: chords.guitarChords,
                progressions: progressions.progressions,
                majorKeys: circleOfFifths.majorKeys,
                minorKeys: circleOfFifths.minorKeys,
                relativeMinor: circleOfFifths.relativeMinor
            };
        } catch (error) {
            console.error('Ошибка загрузки конфигурации:', error);
            throw error;
        }
    }
};
