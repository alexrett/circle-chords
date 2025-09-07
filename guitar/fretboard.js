// guitar/fretboard.js
function renderChordDiagram(chordName) {
    const chordVariations = typeof GUITAR_CHORDS !== 'undefined' ? GUITAR_CHORDS[chordName] : null;
    if (!chordVariations) return null;

    const container = document.createElement('div');
    container.className = 'chord-variations-container';

    chordVariations.forEach((variation, index) => {
        const variationContainer = document.createElement('div');
        variationContainer.className = 'chord-variation';

        // Название варианта
        const variationTitle = document.createElement('div');
        variationTitle.className = 'variation-title';
        variationTitle.textContent = variation.name;
        variationContainer.appendChild(variationTitle);

        // Диаграмма аккорда
        const diagram = document.createElement('div');
        diagram.className = 'chord-diagram';

        // Найдем минимальный и максимальный лады для этого аккорда
        const fretsUsed = variation.frets.filter(f => f !== null && f > 0);
        const minFret = fretsUsed.length > 0 ? Math.min(...fretsUsed) : 0;
        const maxFret = fretsUsed.length > 0 ? Math.max(...fretsUsed) : 4;

        // Если все лады больше 0, показываем от минимального лада
        const startFret = minFret > 0 ? minFret : 0;
        const endFret = Math.max(startFret + 4, maxFret);

        // Добавляем номер лада если это не открытая позиция
        if (startFret > 0) {
            const fretLabel = document.createElement('div');
            fretLabel.className = 'fret-position-label';
            fretLabel.textContent = `${startFret} лад`;
            variationContainer.appendChild(fretLabel);
        }

        // Рисуем диаграмму
        for (let fret = startFret; fret <= endFret; fret++) {
            for (let string = 0; string < 6; string++) {
                const cell = document.createElement('div');
                cell.className = 'fret';
                const fretNumber = variation.frets[string];
                const finger = variation.fingers[string];

                if (fretNumber === fret && finger > 0) {
                    cell.classList.add('finger');
                    cell.textContent = finger;
                } else if (fretNumber === null && fret === startFret) {
                    cell.textContent = 'X';
                } else if (fretNumber === 0 && fret === startFret) {
                    cell.textContent = 'O';
                }
                diagram.appendChild(cell);
            }
        }

        variationContainer.appendChild(diagram);
        container.appendChild(variationContainer);
    });

    return container;
}

// Визуализация грифа с подсветкой выбранных нот
function renderFretboard(notesToShow, title = '') {
    // Открытые струны (стандартный строй)
    const openStrings = ['E', 'A', 'D', 'G', 'B', 'E'];
    const numFrets = 12;
    const fretboard = document.createElement('div');
    fretboard.className = 'fretboard';
    if (title) {
        const t = document.createElement('div');
        t.textContent = title;
        t.style.fontWeight = 'bold';
        t.style.marginBottom = '5px';
        fretboard.appendChild(t);
    }
    // Заголовок ладов
    const header = document.createElement('div');
    header.className = 'fretboard-row';
    header.appendChild(document.createElement('div')); // пустая ячейка
    for (let fret = 0; fret <= numFrets; fret++) {
        const cell = document.createElement('div');
        cell.className = 'fretboard-fret-label';
        cell.textContent = fret;
        header.appendChild(cell);
    }
    fretboard.appendChild(header);
    // Струны
    for (let string = 0; string < 6; string++) {
        const row = document.createElement('div');
        row.className = 'fretboard-row';
        // Название струны
        const stringLabel = document.createElement('div');
        stringLabel.className = 'fretboard-string-label';
        stringLabel.textContent = openStrings[string];
        row.appendChild(stringLabel);
        // Лады
        let noteIndex = NOTES.indexOf(openStrings[string]);
        for (let fret = 0; fret <= numFrets; fret++) {
            const cell = document.createElement('div');
            cell.className = 'fretboard-cell';
            const note = NOTES[(noteIndex + fret) % 12];
            cell.textContent = note;
            if (notesToShow.includes(note)) {
                cell.classList.add('fretboard-highlight');
            }
            row.appendChild(cell);
        }
        fretboard.appendChild(row);
    }
    return fretboard;
}

// Получить ноту на струне и ладу
function getNoteOnString(openNote, fret) {
    const NOTES = typeof window.NOTES !== 'undefined' ? window.NOTES : ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const openIndex = NOTES.indexOf(openNote);
    return NOTES[(openIndex + fret) % 12];
}

// Визуализация грифа бас-гитары (4 струны)
function renderBassFretboard(notesToShow, title = '') {
    const openStrings = ['E', 'A', 'D', 'G'];
    const numFrets = 12;
    const fretboard = document.createElement('div');
    fretboard.className = 'fretboard bass';
    if (title) {
        const t = document.createElement('div');
        t.textContent = title;
        t.style.fontWeight = 'bold';
        t.style.marginBottom = '5px';
        fretboard.appendChild(t);
    }
    const header = document.createElement('div');
    header.className = 'fretboard-row';
    header.appendChild(document.createElement('div'));
    for (let fret = 0; fret <= numFrets; fret++) {
        const cell = document.createElement('div');
        cell.className = 'fretboard-fret-label';
        cell.textContent = fret;
        header.appendChild(cell);
    }
    fretboard.appendChild(header);
    openStrings.forEach(openNote => {
        const row = document.createElement('div');
        row.className = 'fretboard-row';
        const stringLabel = document.createElement('div');
        stringLabel.className = 'fretboard-string-label';
        stringLabel.textContent = openNote;
        row.appendChild(stringLabel);
        for (let fret = 0; fret <= numFrets; fret++) {
            const cell = document.createElement('div');
            cell.className = 'fretboard-cell'; // исправлено с fretboard-fret
            const note = getNoteOnString(openNote, fret);
            if (notesToShow.includes(note)) {
                cell.classList.add('fretboard-highlight'); // исправлено с highlight
            }
            cell.textContent = note;
            row.appendChild(cell);
        }
        fretboard.appendChild(row);
    });
    return fretboard;
}

// Визуализация вокальных нот на 6-струнном грифе
function renderVocalFretboard(notesToShow, title = '') {
    const openStrings = ['E', 'A', 'D', 'G', 'B', 'E'];
    const numFrets = 12;
    const fretboard = document.createElement('div');
    fretboard.className = 'fretboard vocal';
    if (title) {
        const t = document.createElement('div');
        t.textContent = title;
        t.style.fontWeight = 'bold';
        t.style.marginBottom = '5px';
        fretboard.appendChild(t);
    }
    const header = document.createElement('div');
    header.className = 'fretboard-row';
    header.appendChild(document.createElement('div'));
    for (let fret = 0; fret <= numFrets; fret++) {
        const cell = document.createElement('div');
        cell.className = 'fretboard-fret-label';
        cell.textContent = fret;
        header.appendChild(cell);
    }
    fretboard.appendChild(header);
    openStrings.forEach(openNote => {
        const row = document.createElement('div');
        row.className = 'fretboard-row';
        const stringLabel = document.createElement('div');
        stringLabel.className = 'fretboard-string-label';
        stringLabel.textContent = openNote;
        row.appendChild(stringLabel);
        for (let fret = 0; fret <= numFrets; fret++) {
            const cell = document.createElement('div');
            cell.className = 'fretboard-cell'; // исправлено с fretboard-fret
            const note = getNoteOnString(openNote, fret);
            if (notesToShow.includes(note)) {
                cell.classList.add('fretboard-highlight'); // исправлено с highlight
            }
            cell.textContent = note;
            row.appendChild(cell);
        }
        fretboard.appendChild(row);
    });
    return fretboard;
}

// Перечень нот
function renderNoteList(notes, title = '') {
    const div = document.createElement('div');
    div.className = 'note-list';
    if (title) {
        const t = document.createElement('span');
        t.textContent = title + ': ';
        t.style.fontWeight = 'bold';
        div.appendChild(t);
    }
    div.appendChild(document.createTextNode(notes.join(', ')));
    return div;
}
