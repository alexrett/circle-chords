// script.js
// Основной класс приложения
class ChordProgressionGenerator {
    constructor() {
        this.keySelect = document.getElementById('key-select');
        this.modeSelect = document.getElementById('mode-select');
        // this.generateBtn = document.getElementById('generate-btn');
        this.progressionsDiv = document.getElementById('progressions');
        this.visualizationDiv = document.getElementById('visualization');
        this.bassNotesDiv = document.getElementById('bass-notes');
        this.interactiveCircleContainer = document.getElementById('interactive-circle-container');
        this.languageSelect = document.getElementById('language-select');
        this.circleOfFifths = new CircleOfFifths();
        this.init();
    }

    async init() {
        // Ждем инициализацию i18n
        if (window.i18n) {
            await window.i18n.init();
        }

        // this.generateBtn.addEventListener('click', () => this.generate());

        // Слушаем изменения селекторов
        this.keySelect.addEventListener('change', () => this.updateAll());
        this.modeSelect.addEventListener('change', () => this.updateAll());

        // Слушаем изменение языка
        this.languageSelect.addEventListener('change', (e) => {
            if (window.i18n) {
                window.i18n.setLanguage(e.target.value);
            }
        });

        // Сохраняем ссылку для доступа из i18n
        window.chordApp = this;

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

        progressions.forEach((progression, index) => {
            // Карточка прогрессии
            const card = document.createElement('div');
            card.className = 'progression-card';
            const title = document.createElement('h3');
            title.className = 'progression-title';

            // Используем интернационализацию для заголовка
            const modeTranslation = window.i18n ? window.i18n.t(`modes.${mode}`) : mode;
            const keyTranslation = window.i18n ? window.i18n.t(`notes.${key}`) : key;
            const inKeyText = window.i18n ? window.i18n.t('progressions.inKey', { key: keyTranslation, mode: modeTranslation }) : `в тональности ${key} ${mode}`;

            // Переводим название прогрессии
            const progressionName = window.i18n ?
                (window.i18n.t(`progressions.names.${progression.name}`) !== `progressions.names.${progression.name}` ?
                    window.i18n.t(`progressions.names.${progression.name}`) : progression.name) :
                progression.name;

            title.textContent = `${progressionName} ${inKeyText}`;

            const description = document.createElement('p');
            // Переводим описание прогрессии
            const progressionDescription = window.i18n ?
                (window.i18n.t(`progressions.descriptions.${progression.description}`) !== `progressions.descriptions.${progression.description}` ?
                    window.i18n.t(`progressions.descriptions.${progression.description}`) : progression.description) :
                progression.description;
            description.textContent = progressionDescription;
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
            playProgressionBtn.innerHTML = window.i18n ? window.i18n.t('progressions.playProgression') : '▶️ Проиграть последовательность';
            playProgressionBtn.addEventListener('click', async () => {
                if (typeof window.chordPlayer !== 'undefined') {
                    await window.chordPlayer.playProgression(progression.chords);
                }
            });
            card.appendChild(playProgressionBtn);

            // Добавляем кнопку полной аранжировки
            const playFullBtn = document.createElement('button');
            playFullBtn.className = 'play-full-btn';
            playFullBtn.innerHTML = window.i18n ? window.i18n.t('progressions.playFull') : '🎵 Проиграть с басом и вокалом';
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

                // Сохраняем информацию для обновления переводов
                circleContainer._chords = progression.chords;
                circleContainer._key = key;
                circleContainer._mode = mode;
                circleContainer._circleOfFifths = circleOfFifths;

                card.appendChild(circleContainer);
            }

            // Басовые ноты и гриф внутри карточки
            const bassNotes = getBassNotes(progression.chords);
            const bassRootNotes = bassNotes.map(b => b.bassNote);
            const bassTitle = window.i18n ? window.i18n.t('progressions.bassNotesOnFretboard') : 'Басовые ноты на грифе (4 струны)';
            const bassListTitle = window.i18n ? window.i18n.t('progressions.bassNotes') : 'Басовые ноты';

            card.appendChild(renderBassFretboard(bassRootNotes, bassTitle));
            card.appendChild(renderNoteList(bassRootNotes, bassListTitle));

            // Вокальные ноты и гриф внутри карточки
            const scaleNotes = getScale(key, mode);
            const vocalTitle = window.i18n ? window.i18n.t('progressions.vocalNotesOnFretboard') : 'Вокальные ноты на грифе (6 струн)';
            const vocalListTitle = window.i18n ? window.i18n.t('progressions.vocalNotes') : 'Вокальные ноты';

            card.appendChild(renderVocalFretboard(scaleNotes, vocalTitle));
            card.appendChild(renderNoteList(scaleNotes, vocalListTitle));

            this.progressionsDiv.appendChild(card);
        });
    }

    // Обновить переводы во всех квинтовых кругах
    updateCircleTranslations() {
        const circleContainers = document.querySelectorAll('.circle-container');
        circleContainers.forEach(container => {
            if (container._circleOfFifths && container._key && container._mode && container._chords) {
                container._circleOfFifths.updateCircleTranslations(
                    container,
                    container._key,
                    container._mode
                );
            }
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
