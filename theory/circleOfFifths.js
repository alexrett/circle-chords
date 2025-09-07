// theory/circleOfFifths.js

class CircleOfFifths {
    constructor() {
        // Порядок тональностей в квинтовом круге (по часовой стрелке)
        this.majorKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
        this.minorKeys = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m', 'Fm', 'Cm', 'Gm', 'Dm'];

        // Соответствие мажорных и минорных тональностей
        this.relativeMinor = {
            'C': 'Am', 'G': 'Em', 'D': 'Bm', 'A': 'F#m', 'E': 'C#m', 'B': 'G#m',
            'F#': 'D#m', 'C#': 'A#m', 'G#': 'Fm', 'D#': 'Cm', 'A#': 'Gm', 'F': 'Dm'
        };

        // Углы для каждой позиции (12 позиций по 30 градусов)
        this.angles = [];
        for (let i = 0; i < 12; i++) {
            this.angles.push((i * 30 - 90) * Math.PI / 180); // -90 чтобы C был сверху
        }
    }

    // Получить позицию тональности в круге (0-11)
    getKeyPosition(key, mode) {
        if (mode === 'major') {
            return this.majorKeys.indexOf(key);
        } else {
            const minorKey = key + 'm';
            return this.minorKeys.indexOf(minorKey);
        }
    }

    // Создать SVG визуализацию квинтового круга
    renderCircle(currentKey, currentMode, chordProgression) {
        const size = 300;
        const centerX = size / 2;
        const centerY = size / 2;
        const outerRadius = 120;
        const innerRadius = 80;
        const middleRadius = 100;

        let svg = `<svg width="${size}" height="${size}" class="circle-of-fifths">`;

        // Фон
        svg += `<circle cx="${centerX}" cy="${centerY}" r="${outerRadius + 10}" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>`;

        // Подготавливаем списки аккордов из прогрессии
        const majorChordsInProgression = [];
        const minorChordsInProgression = [];

        chordProgression.forEach(chord => {
            if (chord.name.includes('m')) {
                minorChordsInProgression.push(chord.name.replace('m', ''));
            } else {
                majorChordsInProgression.push(chord.name);
            }
        });

        // Рисуем сектора для каждой тональности
        for (let i = 0; i < 12; i++) {
            const angle1 = this.angles[i] - Math.PI / 12; // -15 градусов
            const angle2 = this.angles[i] + Math.PI / 12; // +15 градусов

            const majorKey = this.majorKeys[i];
            const minorKey = this.minorKeys[i].replace('m', '');

            // ВНЕШНЕЕ КОЛЬЦО (мажорные ��о��альности)
            const majorX1 = centerX + outerRadius * Math.cos(angle1);
            const majorY1 = centerY + outerRadius * Math.sin(angle1);
            const majorX2 = centerX + outerRadius * Math.cos(angle2);
            const majorY2 = centerY + outerRadius * Math.sin(angle2);
            const majorX3 = centerX + middleRadius * Math.cos(angle2);
            const majorY3 = centerY + middleRadius * Math.sin(angle2);
            const majorX4 = centerX + middleRadius * Math.cos(angle1);
            const majorY4 = centerY + middleRadius * Math.sin(angle1);

            // Определяем, является ли мажорный аккорд частью прогрессии
            const isMajorInProgression = majorChordsInProgression.includes(majorKey);
            const isMajorCurrentKey = (currentMode === 'major' && majorKey === currentKey);

            // Цвет для мажорного сектора
            let majorFillColor = '#ffffff';
            let majorCursor = 'default';
            let majorOpacity = isMajorInProgression || isMajorCurrentKey ? '1' : '0.3';

            if (isMajorCurrentKey) {
                majorFillColor = '#667eea';
            } else if (isMajorInProgression) {
                majorFillColor = '#e3f2fd';
                majorCursor = 'pointer';
            }

            // Рисуем внешний сектор (мажор)
            const majorSectorId = `major-sector-${i}`;
            svg += `<path id="${majorSectorId}" class="circle-sector ${isMajorInProgression ? 'interactive' : 'inactive'}" 
                    d="M ${majorX1} ${majorY1} A ${outerRadius} ${outerRadius} 0 0 1 ${majorX2} ${majorY2} L ${majorX3} ${majorY3} A ${middleRadius} ${middleRadius} 0 0 0 ${majorX4} ${majorY4} Z" 
                    fill="${majorFillColor}" stroke="#dee2e6" stroke-width="1" 
                    opacity="${majorOpacity}" style="cursor: ${majorCursor}" 
                    data-chord="${majorKey}" data-type="major"/>`;

            // ВНУТРЕННЕЕ КОЛЬЦО (минорные тональности)
            const minorX1 = centerX + middleRadius * Math.cos(angle1);
            const minorY1 = centerY + middleRadius * Math.sin(angle1);
            const minorX2 = centerX + middleRadius * Math.cos(angle2);
            const minorY2 = centerY + middleRadius * Math.sin(angle2);
            const minorX3 = centerX + innerRadius * Math.cos(angle2);
            const minorY3 = centerY + innerRadius * Math.sin(angle2);
            const minorX4 = centerX + innerRadius * Math.cos(angle1);
            const minorY4 = centerY + innerRadius * Math.sin(angle1);

            // Определяем, является ли минорный аккорд частью прогрессии
            const isMinorInProgression = minorChordsInProgression.includes(minorKey);
            const isMinorCurrentKey = (currentMode === 'minor' && minorKey === currentKey);

            // Цвет для минорного сектора
            let minorFillColor = '#f0f0f0';
            let minorCursor = 'default';
            let minorOpacity = isMinorInProgression || isMinorCurrentKey ? '1' : '0.3';

            if (isMinorCurrentKey) {
                minorFillColor = '#667eea';
            } else if (isMinorInProgression) {
                minorFillColor = '#e3f2fd';
                minorCursor = 'pointer';
            }

            // Рисуем внутренний сектор (минор)
            const minorSectorId = `minor-sector-${i}`;
            svg += `<path id="${minorSectorId}" class="circle-sector ${isMinorInProgression ? 'interactive' : 'inactive'}" 
                    d="M ${minorX1} ${minorY1} A ${middleRadius} ${middleRadius} 0 0 1 ${minorX2} ${minorY2} L ${minorX3} ${minorY3} A ${innerRadius} ${innerRadius} 0 0 0 ${minorX4} ${minorY4} Z" 
                    fill="${minorFillColor}" stroke="#dee2e6" stroke-width="1" 
                    opacity="${minorOpacity}" style="cursor: ${minorCursor}" 
                    data-chord="${minorKey}m" data-type="minor"/>`;

            // Добавляем мажорную тональность (внешний круг)
            const majorAngle = this.angles[i];
            const majorX = centerX + ((outerRadius + middleRadius) / 2) * Math.cos(majorAngle);
            const majorY = centerY + ((outerRadius + middleRadius) / 2) * Math.sin(majorAngle);

            const majorTextColor = isMajorCurrentKey ? 'white' : '#495057';
            const majorTextOpacity = isMajorInProgression || isMajorCurrentKey ? '1' : '0.5';
            svg += `<text x="${majorX}" y="${majorY}" text-anchor="middle" dominant-baseline="middle" 
                    font-family="Arial, sans-serif" font-size="12" font-weight="bold" 
                    fill="${majorTextColor}" opacity="${majorTextOpacity}" style="pointer-events: none;">
                    ${majorKey}</text>`;

            // Добавляем минорную тональность (внутренний круг)
            const minorX = centerX + ((middleRadius + innerRadius) / 2) * Math.cos(majorAngle);
            const minorY = centerY + ((middleRadius + innerRadius) / 2) * Math.sin(majorAngle);

            const minorTextColor = isMinorCurrentKey ? 'white' : '#6c757d';
            const minorTextOpacity = isMinorInProgression || isMinorCurrentKey ? '1' : '0.5';
            svg += `<text x="${minorX}" y="${minorY}" text-anchor="middle" dominant-baseline="middle" 
                    font-family="Arial, sans-serif" font-size="10" 
                    fill="${minorTextColor}" opacity="${minorTextOpacity}" style="pointer-events: none;">
                    ${this.minorKeys[i]}</text>`;
        }

        // Центральная надпись
        svg += `<text x="${centerX}" y="${centerY - 10}" text-anchor="middle" dominant-baseline="middle" 
                font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#495057">
                ${currentKey} ${currentMode === 'major' ? 'мажор' : 'минор'}</text>`;

        svg += `<text x="${centerX}" y="${centerY + 10}" text-anchor="middle" dominant-baseline="middle" 
                font-family="Arial, sans-serif" font-size="10" fill="#6c757d">
                Квинтовый круг</text>`;

        svg += '</svg>';
        return svg;
    }

    // Создать контейнер с квинтовым кругом
    renderCircleContainer(currentKey, currentMode, chordProgression, progressionName) {
        const container = document.createElement('div');
        container.className = 'circle-of-fifths-container';

        const title = document.createElement('h4');
        title.textContent = `Квинтовый круг для "${progressionName}"`;
        title.className = 'circle-title';
        container.appendChild(title);

        const description = document.createElement('p');
        description.innerHTML = `
            <strong>Синий</strong> - текущая тональность<br>
            <strong>Голубой</strong> - аккорды из прогрессии (кликабельные)<br>
            <strong>Внешний круг</strong> - мажорные тональности<br>
            <strong>Внутренний круг</strong> - минорные тональности
        `;
        description.className = 'circle-description';
        container.appendChild(description);

        const svgContainer = document.createElement('div');
        svgContainer.innerHTML = this.renderCircle(currentKey, currentMode, chordProgression);
        svgContainer.className = 'circle-svg-container';
        container.appendChild(svgContainer);

        // Добавляем обработчики событий для интерактивных секторов
        setTimeout(() => {
            const interactiveSectors = container.querySelectorAll('.circle-sector.interactive');
            interactiveSectors.forEach(sector => {
                sector.addEventListener('click', async (e) => {
                    const chordName = e.target.getAttribute('data-chord');
                    if (chordName && typeof window.chordPlayer !== 'undefined') {
                        // Получаем ноты аккорда и пр��игрываем его
                        const chordNotes = this.getChordNotes(chordName);
                        await window.chordPlayer.playChord(chordNotes);

                        // Визуальная обратная связь
                        const originalFill = e.target.getAttribute('fill');
                        e.target.setAttribute('fill', '#28a745');
                        setTimeout(() => {
                            e.target.setAttribute('fill', originalFill);
                        }, 200);
                    }
                });

                // Добавляем эффект наведения
                sector.addEventListener('mouseenter', (e) => {
                    const originalOpacity = e.target.getAttribute('opacity');
                    e.target.setAttribute('data-original-opacity', originalOpacity);
                    e.target.setAttribute('opacity', '0.8');
                });

                sector.addEventListener('mouseleave', (e) => {
                    const originalOpacity = e.target.getAttribute('data-original-opacity');
                    e.target.setAttribute('opacity', originalOpacity);
                });
            });
        }, 100);

        return container;
    }

    // Создать интерактивный круг для выбора тональности
    renderInteractiveCircle(currentKey, currentMode, onTonalityChange) {
        const size = 200; // Меньший размер для панели управления
        const centerX = size / 2;
        const centerY = size / 2;
        const outerRadius = 80;
        const innerRadius = 55;
        const middleRadius = 67.5;

        let svg = `<svg width="${size}" height="${size}" class="circle-of-fifths interactive-circle">`;

        // Фон
        svg += `<circle cx="${centerX}" cy="${centerY}" r="${outerRadius + 5}" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>`;

        // Получаем аккорды для текущей тональности и лада
        const scaleChords = this.getScaleChords(currentKey, currentMode);

        // Рисуем сектора для каждой тональности
        for (let i = 0; i < 12; i++) {
            const angle1 = this.angles[i] - Math.PI / 12;
            const angle2 = this.angles[i] + Math.PI / 12;

            const majorKey = this.majorKeys[i];
            const minorKey = this.minorKeys[i].replace('m', '');

            // ВНЕШНЕЕ КОЛЬЦО (мажорные тональности)
            const majorX1 = centerX + outerRadius * Math.cos(angle1);
            const majorY1 = centerY + outerRadius * Math.sin(angle1);
            const majorX2 = centerX + outerRadius * Math.cos(angle2);
            const majorY2 = centerY + outerRadius * Math.sin(angle2);
            const majorX3 = centerX + middleRadius * Math.cos(angle2);
            const majorY3 = centerY + middleRadius * Math.sin(angle2);
            const majorX4 = centerX + middleRadius * Math.cos(angle1);
            const majorY4 = centerY + middleRadius * Math.sin(angle1);

            const isMajorCurrent = (currentMode === 'major' && majorKey === currentKey);
            const isMajorInScale = scaleChords.includes(majorKey);

            let majorFillColor = '#ffffff';
            if (isMajorCurrent) {
                majorFillColor = '#667eea';
            } else if (isMajorInScale) {
                majorFillColor = '#e3f2fd';
            }

            svg += `<path class="tonality-selector major-selector" 
                    d="M ${majorX1} ${majorY1} A ${outerRadius} ${outerRadius} 0 0 1 ${majorX2} ${majorY2} L ${majorX3} ${majorY3} A ${middleRadius} ${middleRadius} 0 0 0 ${majorX4} ${majorY4} Z" 
                    fill="${majorFillColor}" stroke="#dee2e6" stroke-width="1" 
                    style="cursor: pointer" 
                    data-key="${majorKey}" data-mode="major"/>`;

            // ВНУТРЕННЕЕ КОЛЬЦО (минорные тональности)
            const minorX1 = centerX + middleRadius * Math.cos(angle1);
            const minorY1 = centerY + middleRadius * Math.sin(angle1);
            const minorX2 = centerX + middleRadius * Math.cos(angle2);
            const minorY2 = centerY + middleRadius * Math.sin(angle2);
            const minorX3 = centerX + innerRadius * Math.cos(angle2);
            const minorY3 = centerY + innerRadius * Math.sin(angle2);
            const minorX4 = centerX + innerRadius * Math.cos(angle1);
            const minorY4 = centerY + innerRadius * Math.sin(angle1);

            const isMinorCurrent = (currentMode === 'minor' && minorKey === currentKey);
            const isMinorInScale = scaleChords.includes(minorKey + 'm');

            let minorFillColor = '#f0f0f0';
            if (isMinorCurrent) {
                minorFillColor = '#667eea';
            } else if (isMinorInScale) {
                minorFillColor = '#e3f2fd';
            }

            svg += `<path class="tonality-selector minor-selector" 
                    d="M ${minorX1} ${minorY1} A ${middleRadius} ${middleRadius} 0 0 1 ${minorX2} ${minorY2} L ${minorX3} ${minorY3} A ${innerRadius} ${innerRadius} 0 0 0 ${minorX4} ${minorY4} Z" 
                    fill="${minorFillColor}" stroke="#dee2e6" stroke-width="1" 
                    style="cursor: pointer" 
                    data-key="${minorKey}" data-mode="minor"/>`;

            // Добавляем мажорную тональность (внешний круг)
            const majorAngle = this.angles[i];
            const majorX = centerX + ((outerRadius + middleRadius) / 2) * Math.cos(majorAngle);
            const majorY = centerY + ((outerRadius + middleRadius) / 2) * Math.sin(majorAngle);

            const majorTextColor = isMajorCurrent ? 'white' : '#495057';
            svg += `<text x="${majorX}" y="${majorY}" text-anchor="middle" dominant-baseline="middle" 
                    font-family="Arial, sans-serif" font-size="10" font-weight="bold" 
                    fill="${majorTextColor}" style="pointer-events: none;">
                    ${majorKey}</text>`;

            // Добавляем минорную тональность (внутренний круг)
            const minorX = centerX + ((middleRadius + innerRadius) / 2) * Math.cos(majorAngle);
            const minorY = centerY + ((middleRadius + innerRadius) / 2) * Math.sin(majorAngle);

            const minorTextColor = isMinorCurrent ? 'white' : '#6c757d';
            svg += `<text x="${minorX}" y="${minorY}" text-anchor="middle" dominant-baseline="middle" 
                    font-family="Arial, sans-serif" font-size="8" 
                    fill="${minorTextColor}" style="pointer-events: none;">
                    ${this.minorKeys[i]}</text>`;
        }

        // Центральная надпись
        svg += `<text x="${centerX}" y="${centerY - 5}" text-anchor="middle" dominant-baseline="middle" 
                font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#495057">
                ${currentKey}</text>`;

        svg += `<text x="${centerX}" y="${centerY + 8}" text-anchor="middle" dominant-baseline="middle" 
                font-family="Arial, sans-serif" font-size="8" fill="#6c757d">
                ${currentMode === 'major' ? 'мажор' : 'минор'}</text>`;

        svg += '</svg>';
        return svg;
    }

    // Получить аккорды для тональности и лада
    getScaleChords(key, mode) {
        // Используем существующую функцию generateProgressions для получения всех возможных аккордов
        if (typeof generateProgressions === 'undefined') return [];

        try {
            const progressions = generateProgressions(key, mode);
            const allChords = new Set();

            progressions.forEach(progression => {
                progression.chords.forEach(chord => {
                    allChords.add(chord.name);
                });
            });

            return Array.from(allChords);
        } catch (e) {
            return [];
        }
    }

    // Создать интерактивный контейнер для выбора тональности
    renderInteractiveContainer(currentKey, currentMode, onTonalityChange) {
        const container = document.createElement('div');
        container.className = 'interactive-circle-container';

        const title = document.createElement('div');
        title.textContent = 'Выбор тональности';
        title.className = 'interactive-circle-title';
        container.appendChild(title);

        const svgContainer = document.createElement('div');
        svgContainer.innerHTML = this.renderInteractiveCircle(currentKey, currentMode, onTonalityChange);
        svgContainer.className = 'interactive-circle-svg';
        container.appendChild(svgContainer);

        // Добавляем обработчики событий
        setTimeout(() => {
            const selectors = container.querySelectorAll('.tonality-selector');
            selectors.forEach(selector => {
                selector.addEventListener('click', (e) => {
                    const key = e.target.getAttribute('data-key');
                    const mode = e.target.getAttribute('data-mode');
                    if (key && mode && onTonalityChange) {
                        onTonalityChange(key, mode);
                    }
                });

                // Эффекты наведения
                selector.addEventListener('mouseenter', (e) => {
                    const currentFill = e.target.getAttribute('fill');
                    e.target.setAttribute('data-original-fill', currentFill);
                    if (currentFill !== '#667eea') { // Не меняем цвет текущей тональности
                        e.target.setAttribute('fill', '#d4edda');
                    }
                });

                selector.addEventListener('mouseleave', (e) => {
                    const originalFill = e.target.getAttribute('data-original-fill');
                    e.target.setAttribute('fill', originalFill);
                });
            });
        }, 100);

        return container;
    }

    // Получить ноты аккорда (используем существующую функцию из fretboard.js)
    getChordNotes(chordName) {
        const isMinor = chordName.includes('m') && !chordName.includes('maj');
        const root = chordName.replace('m', '');

        if (isMinor) {
            return buildChord(root, 'minor');
        } else {
            return buildChord(root, 'major');
        }
    }
}

// Экспортируем для использования
window.CircleOfFifths = CircleOfFifths;
