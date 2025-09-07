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

