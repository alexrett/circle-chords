// audio/chordPlayer.js
class ChordPlayer {
    constructor() {
        this.synth = null;
        this.bassSynth = null;
        this.vocalSynth = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            // Создаем полисинт для проигрывания аккордов
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

            // Создаем бас-синт (более низкий и глухой звук)
            this.bassSynth = new Tone.MonoSynth({
                oscillator: {
                    type: "sine"
                },
                envelope: {
                    attack: 0.05,
                    decay: 0.3,
                    sustain: 0.4,
                    release: 0.6
                },
                filter: {
                    frequency: 400,
                    rolloff: -24
                }
            }).toDestination();

            // Создаем вокальный синт (более яркий и мелодичный)
            this.vocalSynth = new Tone.Synth({
                oscillator: {
                    type: "triangle"
                },
                envelope: {
                    attack: 0.08,
                    decay: 0.15,
                    sustain: 0.6,
                    release: 0.4
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

    // Генерация случайного вокального рисунка
    generateVocalPattern(scaleNotes, measures = 4) {
        const pattern = [];
        const rhythms = [
            { note: 'quarter', duration: "4n" },
            { note: 'eighth', duration: "8n" },
            { note: 'half', duration: "2n" }
        ];

        for (let measure = 0; measure < measures; measure++) {
            const measurePattern = [];
            let currentTime = 0;

            while (currentTime < 1) { // 1 = полная мера
                const rhythm = rhythms[Math.floor(Math.random() * rhythms.length)];
                const note = scaleNotes[Math.floor(Math.random() * scaleNotes.length)];
                const octave = 4 + Math.floor(Math.random() * 2); // 4 или 5 октава

                measurePattern.push({
                    note: this.noteToFrequency(note, octave),
                    duration: rhythm.duration,
                    time: currentTime
                });

                currentTime += rhythm.note === 'quarter' ? 0.25 :
                               rhythm.note === 'eighth' ? 0.125 : 0.5;
            }
            pattern.push(measurePattern);
        }
        return pattern;
    }

    // Генерация басового рисунка
    generateBassPattern(bassNotes, measures = 4) {
        const pattern = [];

        for (let measure = 0; measure < measures; measure++) {
            const bassNote = bassNotes[measure % bassNotes.length];
            const measurePattern = [
                { note: this.noteToFrequency(bassNote, 2), duration: "4n", time: 0 },
                { note: this.noteToFrequency(bassNote, 2), duration: "4n", time: 0.25 },
                { note: this.noteToFrequency(bassNote, 2), duration: "4n", time: 0.5 },
                { note: this.noteToFrequency(bassNote, 2), duration: "4n", time: 0.75 }
            ];
            pattern.push(measurePattern);
        }
        return pattern;
    }

    // Проигрывание последовательности с басом и вокалом
    async playFullArrangement(chords, bassNotes, scaleNotes, tempo = 120) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const measureDuration = (60 / tempo) * 4; // 4 доли на меру
            const vocalPattern = this.generateVocalPattern(scaleNotes, chords.length);
            const bassPattern = this.generateBassPattern(bassNotes, chords.length);

            console.log('Начинаю полное исполнение...');

            for (let i = 0; i < chords.length; i++) {
                const startTime = Tone.now();

                // Играем аккорд
                const chordFreqs = [
                    this.noteToFrequency(chords[i].notes[0], 3),
                    this.noteToFrequency(chords[i].notes[1], 4),
                    this.noteToFrequency(chords[i].notes[2], 4),
                    ...(chords[i].notes.length > 3 ? [this.noteToFrequency(chords[i].notes[3], 4)] : [])
                ];
                this.synth.triggerAttackRelease(chordFreqs, "1m", startTime);

                // Играем басовую линию
                bassPattern[i].forEach(bassNote => {
                    this.bassSynth.triggerAttackRelease(
                        bassNote.note,
                        bassNote.duration,
                        startTime + bassNote.time * measureDuration
                    );
                });

                // Играем вокальную мелодию
                vocalPattern[i].forEach(vocalNote => {
                    this.vocalSynth.triggerAttackRelease(
                        vocalNote.note,
                        vocalNote.duration,
                        startTime + vocalNote.time * measureDuration
                    );
                });

                // Ждем завершения меры
                await new Promise(resolve => setTimeout(resolve, measureDuration * 1000));
            }

        } catch (error) {
            console.error('Ошибка проигрывания аранжировки:', error);
        }
    }

    // Остановка воспроизведения
    stop() {
        if (this.synth) {
            this.synth.releaseAll();
        }
        if (this.bassSynth) {
            this.bassSynth.triggerRelease();
        }
        if (this.vocalSynth) {
            this.vocalSynth.triggerRelease();
        }
    }
}

// Глобальный экземпляр плеера
window.chordPlayer = new ChordPlayer();
