// guitar/fretboard.js
function renderChordDiagram(chordName) {
    const chordData = typeof GUITAR_CHORDS !== 'undefined' ? GUITAR_CHORDS[chordName] : null;
    if (!chordData) return null;
    const diagram = document.createElement('div');
    diagram.className = 'chord-diagram';
    for (let fret = 0; fret < 5; fret++) {
        for (let string = 0; string < 6; string++) {
            const cell = document.createElement('div');
            cell.className = 'fret';
            const fretNumber = chordData.frets[string];
            const finger = chordData.fingers[string];
            if (fretNumber === fret && finger > 0) {
                cell.classList.add('finger');
                cell.textContent = finger;
            } else if (fretNumber === null && fret === 0) {
                cell.textContent = 'X';
            } else if (fretNumber === 0 && fret === 0) {
                cell.textContent = 'O';
            }
            diagram.appendChild(cell);
        }
    }
    return diagram;
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
