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
        this.init();
    }
    init() {
        this.generateBtn.addEventListener('click', () => this.generate());
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
        // Удаляем отдельную визуализацию аккордов
        this.visualizationDiv.innerHTML = '';
        this.bassNotesDiv.innerHTML = '';
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
            this.progressionsDiv.appendChild(card);
            // Басовые ноты
            const bassSection = document.createElement('div');
            bassSection.className = 'bass-section';
            const bassTitle = document.createElement('h4');
            bassTitle.className = 'bass-title';
            bassTitle.textContent = `Басовые ноты для "${progression.name}":`;
            const bassNotesList = document.createElement('div');
            bassNotesList.className = 'bass-notes-list';
            const bassNotes = getBassNotes(progression.chords);
            bassNotes.forEach(bass => {
                const bassNote = document.createElement('div');
                bassNote.className = 'bass-note';
                bassNote.textContent = `${bass.chord}: ${typeof NOTE_NAMES_RU !== 'undefined' ? NOTE_NAMES_RU[bass.bassNote] : bass.bassNote}`;
                bassNotesList.appendChild(bassNote);
            });
            bassSection.appendChild(bassTitle);
            bassSection.appendChild(bassNotesList);
            this.bassNotesDiv.appendChild(bassSection);
        });
    }
}
// Инициализация приложения
window.addEventListener('DOMContentLoaded', () => {
    new ChordProgressionGenerator();
});
