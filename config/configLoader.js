// config/configLoader.js
class ConfigLoader {
    constructor() {
        this.config = {};
        this.loaded = false;
    }

    async loadAll() {
        if (this.loaded) return this.config;

        try {
            const [scales, chords, progressions, circleOfFifths] = await Promise.all([
                fetch('config/scales.json').then(r => r.json()),
                fetch('config/chords.json').then(r => r.json()),
                fetch('config/progressions.json').then(r => r.json()),
                fetch('config/circleOfFifths.json').then(r => r.json())
            ]);

            this.config = {
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

            this.loaded = true;
            return this.config;
        } catch (error) {
            console.error('Ошибка загрузки конфигурации:', error);
            throw error;
        }
    }

    get(key) {
        if (!this.loaded) {
            throw new Error('Конфигурация не загружена. Вызовите loadAll() сначала.');
        }
        return this.config[key];
    }
}

// Глобальный экземпляр загрузчика
window.configLoader = new ConfigLoader();
