// script.js
// Основной класс приложения
class ChordProgressionGenerator {
    constructor() {
        this.keySelect = document.getElementById('key-select');
        this.modeSelect = document.getElementById('mode-select');
        this.generateBtn = document.getElementById('generate-btn');
        this.progressionsDiv = document.getElementById('progressions');
        this.visualizationDiv = document.getElementById('visualization');
        this.bassNotesDiv = document.getElementById('bass-notes');
        this.interactiveCircleContainer = document.getElementById('interactive-circle-container');
        this.circleOfFifths = new CircleOfFifths();
        this.init();
    }

    init() {
        this.generateBtn.addEventListener('click', () => this.generate());

        // Слушаем изменения селекторов
        this.keySelect.addEventListener('change', () => this.updateAll());
        this.modeSelect.addEventListener('change', () => this.updateAll());

        // Инициализируем интерактивный круг
        this.updateInteractiveCircle();
        this.generate();
    }

    // Обработчик изменения тональности через круг
    onTonalityChange(key, mode) {
        // Обновляем селекторы
        this.keySelect.value = key;
        this.modeSelect.value = mode;

        // Обновляем круг и генерируем новые прогрессии
        this.updateAll();
    }

    // Обновить интерактивный круг
    updateInteractiveCircle() {
        const currentKey = this.keySelect.value;
        const currentMode = this.modeSelect.value;

        const interactiveCircle = this.circleOfFifths.renderInteractiveContainer(
            currentKey,
            currentMode,
            (key, mode) => this.onTonalityChange(key, mode)
        );

        this.interactiveCircleContainer.innerHTML = '';
        this.interactiveCircleContainer.appendChild(interactiveCircle);
    }

    // Обновить всё (круг и прогрессии)
    updateAll() {
        this.updateInteractiveCircle();
        this.generate();
    }

    generate() {
        const key = this.keySelect.value;
        const mode = this.modeSelect.value;
        const progressions = generateProgressions(key, mode);
        this.renderProgressions(progressions, key, mode);
    }

    renderProgressions(progressions, key, mode) {
        this.progressionsDiv.innerHTML = '';
        this.visualizationDiv.innerHTML = '';
        this.bassNotesDiv.innerHTML = '';
        // Удаляем очистку и глобальный вывод
        progressions.forEach((progression, index) => {
            // Карточка прогрессии
            const card = document.createElement('div');
            card.className = 'progression-card';
            const title = document.createElement('h3');
            title.className = 'progression-title';
            title.textContent = `${progression.name} в тональности ${key} ${mode === 'major' ? 'мажор' : mode === 'minor' ? 'минор' : mode}`;
            const description = document.createElement('p');
            description.textContent = progression.description;
            description.style.marginBottom = '15px';
            description.style.color = '#6c757d';
            // Новый список аккордов с табами
            const chordsList = document.createElement('div');
            chordsList.className = 'chords-list';
            progression.chords.forEach(chord => {
                const chordBlock = document.createElement('div');
                chordBlock.style.display = 'flex';
                chordBlock.style.flexDirection = 'column';
                chordBlock.style.alignItems = 'center';
                chordBlock.style.margin = '0 10px';
                // Название аккорда
                const chordNameDiv = document.createElement('div');
                chordNameDiv.className = 'chord-item';
                chordNameDiv.textContent = chord.name;
                chordBlock.appendChild(chordNameDiv);
                // Диаграмма аккорда
                const diagram = renderChordDiagram(chord.name);
                if (diagram) {
                    chordBlock.appendChild(diagram);
                }
                chordsList.appendChild(chordBlock);
            });
            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(chordsList);

            // Добавляем кнопку воспроизведения всей последовательности
            const playProgressionBtn = document.createElement('button');
            playProgressionBtn.className = 'play-progression-btn';
            playProgressionBtn.innerHTML = '▶️ Проиграть последовательность';
            playProgressionBtn.addEventListener('click', async () => {
                if (typeof window.chordPlayer !== 'undefined') {
                    await window.chordPlayer.playProgression(progression.chords);
                }
            });
            card.appendChild(playProgressionBtn);

            // Добавляем кнопку полной аранжировки
            const playFullBtn = document.createElement('button');
            playFullBtn.className = 'play-full-btn';
            playFullBtn.innerHTML = '🎵 Проиграть с басом и вокалом';
            playFullBtn.addEventListener('click', async () => {
                if (typeof window.chordPlayer !== 'undefined') {
                    const bassNotes = getBassNotes(progression.chords).map(b => b.bassNote);
                    const scaleNotes = getScale(key, mode);
                    await window.chordPlayer.playFullArrangement(progression.chords, bassNotes, scaleNotes);
                }
            });
            card.appendChild(playFullBtn);

            // Добавляем квинтовый круг
            if (typeof CircleOfFifths !== 'undefined') {
                const circleOfFifths = new CircleOfFifths();
                const circleContainer = circleOfFifths.renderCircleContainer(
                    key,
                    mode,
                    progression.chords,
                    progression.name
                );
                card.appendChild(circleContainer);
            }

            // Басовые ноты и гриф внутри карточки
            const bassNotes = getBassNotes(progression.chords);
            const bassRootNotes = bassNotes.map(b => b.bassNote);
            card.appendChild(renderBassFretboard(bassRootNotes, 'Басовые ноты на грифе (4 струны)'));
            card.appendChild(renderNoteList(bassRootNotes, 'Басовые ноты'));
            // Вокальные ноты и гриф внутри карточки
            const scaleNotes = getScale(key, mode);
            card.appendChild(renderVocalFretboard(scaleNotes, 'Вокальные ноты на грифе (6 струн)'));
            card.appendChild(renderNoteList(scaleNotes, 'Вокальные ноты'));
            this.progressionsDiv.appendChild(card);
        });
    }
}

// Инициализация приложения с загрузкой конфигурации
async function initializeApp() {
    try {
        // Загружаем конфигурацию
        const config = await window.configLoader.loadAll();

        // Инициализируем все модули с загруженной конфигурацией
        initializeScales(config);
        initializeChords(config);
        initializeProgressions(config);
        initializeCircleOfFifths(config);

        // Создаем и запускаем приложение
        const app = new ChordProgressionGenerator();

        console.log('Приложение успешно инициализировано с конфигурацией из JSON файлов');
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
        alert('Ошибка загрузки конфигурации. Проверьте консоль для подробностей.');
    }
}

// Запускаем приложение после загрузки DOM
window.addEventListener('DOMContentLoaded', initializeApp);
