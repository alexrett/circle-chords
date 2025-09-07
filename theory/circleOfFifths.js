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

        // Рисуем сектора для каждой тональности
        for (let i = 0; i < 12; i++) {
            const angle1 = this.angles[i] - Math.PI / 12; // -15 градусов
            const angle2 = this.angles[i] + Math.PI / 12; // +15 градусов

            const majorKey = this.majorKeys[i];
            const minorKey = this.minorKeys[i].replace('m', '');

            // Подсвечиваем аккорды из прогрессии
            const chordsInProgression = chordProgression.map(chord => {
                return chord.name.replace('m', '');
            });

            // ВНЕШНЕЕ КОЛЬЦО (мажорные тональности)
            // Координаты для внешнего кольца
            const majorX1 = centerX + outerRadius * Math.cos(angle1);
            const majorY1 = centerY + outerRadius * Math.sin(angle1);
            const majorX2 = centerX + outerRadius * Math.cos(angle2);
            const majorY2 = centerY + outerRadius * Math.sin(angle2);
            const majorX3 = centerX + middleRadius * Math.cos(angle2);
            const majorY3 = centerY + middleRadius * Math.sin(angle2);
            const majorX4 = centerX + middleRadius * Math.cos(angle1);
            const majorY4 = centerY + middleRadius * Math.sin(angle1);

            // Цвет для мажорного сектора
            let majorFillColor = '#ffffff';
            if (currentMode === 'major' && majorKey === currentKey) {
                majorFillColor = '#667eea';
            } else if (chordsInProgression.includes(majorKey)) {
                majorFillColor = '#e3f2fd';
            }

            // Рисуем внешний сектор (мажор)
            svg += `<path d="M ${majorX1} ${majorY1} A ${outerRadius} ${outerRadius} 0 0 1 ${majorX2} ${majorY2} L ${majorX3} ${majorY3} A ${middleRadius} ${middleRadius} 0 0 0 ${majorX4} ${majorY4} Z" 
                    fill="${majorFillColor}" stroke="#dee2e6" stroke-width="1"/>`;

            // ВНУТРЕННЕЕ КОЛЬЦО (минорные тональности)
            // Координаты для внутреннего кольца
            const minorX1 = centerX + middleRadius * Math.cos(angle1);
            const minorY1 = centerY + middleRadius * Math.sin(angle1);
            const minorX2 = centerX + middleRadius * Math.cos(angle2);
            const minorY2 = centerY + middleRadius * Math.sin(angle2);
            const minorX3 = centerX + innerRadius * Math.cos(angle2);
            const minorY3 = centerY + innerRadius * Math.sin(angle2);
            const minorX4 = centerX + innerRadius * Math.cos(angle1);
            const minorY4 = centerY + innerRadius * Math.sin(angle1);

            // Цвет для минорного сектора
            let minorFillColor = '#f0f0f0';
            if (currentMode === 'minor' && minorKey === currentKey) {
                minorFillColor = '#667eea';
            } else if (chordsInProgression.includes(minorKey)) {
                minorFillColor = '#e3f2fd';
            }

            // Рисуем внутренний сектор (минор)
            svg += `<path d="M ${minorX1} ${minorY1} A ${middleRadius} ${middleRadius} 0 0 1 ${minorX2} ${minorY2} L ${minorX3} ${minorY3} A ${innerRadius} ${innerRadius} 0 0 0 ${minorX4} ${minorY4} Z" 
                    fill="${minorFillColor}" stroke="#dee2e6" stroke-width="1"/>`;

            // Добавляем мажорную тональность (внешний круг)
            const majorAngle = this.angles[i];
            const majorX = centerX + ((outerRadius + middleRadius) / 2) * Math.cos(majorAngle);
            const majorY = centerY + ((outerRadius + middleRadius) / 2) * Math.sin(majorAngle);

            const majorTextColor = (currentMode === 'major' && majorKey === currentKey) ? 'white' : '#495057';
            svg += `<text x="${majorX}" y="${majorY}" text-anchor="middle" dominant-baseline="middle" 
                    font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="${majorTextColor}">
                    ${majorKey}</text>`;

            // Добавляем минорную тональность (внутренний круг)
            const minorX = centerX + ((middleRadius + innerRadius) / 2) * Math.cos(majorAngle);
            const minorY = centerY + ((middleRadius + innerRadius) / 2) * Math.sin(majorAngle);

            const minorTextColor = (currentMode === 'minor' && minorKey === currentKey) ? 'white' : '#6c757d';
            svg += `<text x="${minorX}" y="${minorY}" text-anchor="middle" dominant-baseline="middle" 
                    font-family="Arial, sans-serif" font-size="10" fill="${minorTextColor}">
                    ${this.minorKeys[i]}</text>`;
        }

        // Центральная надпись
        svg += `<text x="${centerX}" y="${centerY - 10}" text-anchor="middle" dominant-baseline="middle" 
                font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#495057">
                ${currentKey} ${currentMode === 'major' ? 'мажор' : 'минор'}</text>`;

        // Легенда
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
            <strong>Голубой</strong> - аккорды из прогрессии<br>
            <strong>Внешний круг</strong> - мажорные тональности<br>
            <strong>Внутренний круг</strong> - минорные тональности
        `;
        description.className = 'circle-description';
        container.appendChild(description);

        const svgContainer = document.createElement('div');
        svgContainer.innerHTML = this.renderCircle(currentKey, currentMode, chordProgression);
        svgContainer.className = 'circle-svg-container';
        container.appendChild(svgContainer);

        return container;
    }
}

// Экспортируем для использования
window.CircleOfFifths = CircleOfFifths;
