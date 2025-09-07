// audio/chordPlayer.js
class ChordPlayer {
    constructor() {
        this.synth = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            // Создаем полисинт для проигрывания нескольких нот одновременно
            this.synth = new Tone.PolySynth(Tone.Synth, {
                oscillator: {
                    type: "sawtooth"
                },
                envelope: {
                    attack: 0.1,
                    decay: 0.2,
                    sustain: 0.5,
                    release: 0.8
                }
            }).toDestination();

            // Инициализируем аудио контекст
            await Tone.start();
            this.isInitialized = true;
            console.log('Аудио система инициализирована');
        } catch (error) {
            console.error('Ошибка инициализации аудио:', error);
        }
    }

    // Конвертация названий нот в частоты для Tone.js
    noteToFrequency(note, octave = 4) {
        return `${note}${octave}`;
    }

    // Проигрывание одного аккорда
    async playChord(chordNotes, duration = "2n") {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            // Конвертируем ноты аккорда в частоты разных октав для богатого звучания
            const frequencies = [
                this.noteToFrequency(chordNotes[0], 3), // Басовая нота
                this.noteToFrequency(chordNotes[1], 4), // Средняя
                this.noteToFrequency(chordNotes[2], 4), // Высокая
                ...(chordNotes.length > 3 ? [this.noteToFrequency(chordNotes[3], 4)] : [])
            ];

            // Проигрываем аккорд
            this.synth.triggerAttackRelease(frequencies, duration);

            return new Promise(resolve => {
                setTimeout(resolve, Tone.Time(duration).toMilliseconds());
            });
        } catch (error) {
            console.error('Ошибка проигрывания аккорда:', error);
        }
    }

    // Проигрывание последовательности аккордов
    async playProgression(chords, tempo = 120) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const chordDuration = 60 / tempo * 2; // 2 доли на аккорд

        for (let i = 0; i < chords.length; i++) {
            await this.playChord(chords[i].notes, "2n");
            if (i < chords.length - 1) {
                await new Promise(resolve => setTimeout(resolve, chordDuration * 1000));
            }
        }
    }

    // Остановка воспроизведения
    stop() {
        if (this.synth) {
            this.synth.releaseAll();
        }
    }
}

// Глобальный экземпляр плеера
window.chordPlayer = new ChordPlayer();
