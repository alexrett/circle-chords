# Guitar Progression Generator

[EN](./README.md) readme.

Рабочая версия для использования тут: https://circle-chords.malikov.tech/

## Обзор системы

Это веб-приложение для генерации аккордовых последовательностей с визуализацией на грифе гитары, квинтовом круге и аудио воспроизведением. Архитектура построена по модульному принципу с разделением на теорию музыки, визуализацию и аудио.

## Архитектура приложения

```
/
├── index.html              # Основной HTML файл
├── src/                    # Исходный код React + TypeScript
│   ├── App.tsx             # Корневой компонент приложения
│   ├── main.tsx            # Точка входа
│   ├── index.css           # Tailwind стили
│   ├── components/         # Компоненты UI
│   └── lib/                # Теория, аудио, конфиг
├── config/                 # Конфигурационные данные
│   ├── scales.json         # Лады и ноты
│   ├── chords.json         # Аккорды и аппликатуры
│   ├── progressions.json   # Прогрессии аккордов
│   ├── circleOfFifths.json # Данные квинтового круга
│   
```

---

## Основные компоненты системы

### 1. Главный класс приложения (`script.js`)

**Класс `ChordProgressionGenerator`** - центральный контроллер приложения:

```javascript
class ChordProgressionGenerator {
    constructor() {
        // Инициализация DOM элементов
        this.keySelect = document.getElementById('key-select');
        this.modeSelect = document.getElementById('mode-select');
        // this.generateBtn = document.getElementById('generate-btn');
        this.progressionsDiv = document.getElementById('progressions');
        this.visualizationDiv = document.getElementById('visualization');
        this.bassNotesDiv = document.getElementById('bass-notes');
        this.interactiveCircleContainer = document.getElementById('interactive-circle-container');
        this.circleOfFifths = new CircleOfFifths();
    }
}
```

**Основные методы:**
- `init()` - инициализация событий и первоначальная генерация
- `generate()` - главный метод генерации прогрессий
- `renderProgressions()` - отрисовка результатов
- `updateInteractiveCircle()` - обновление квинтового круга
- `onTonalityChange()` - обработчик изменения тональности

### 2. Модуль работы с ладами (`theory/scales.js`)

**Глобальные переменные:**
```javascript
let SCALES = {};        // Паттерны ладов из конфигурации
let NOTES = [];         // Массив всех нот
let NOTE_NAMES_RU = {}; // Русские названия нот
```

**Ключевые функции:**
- `getScale(key, mode)` - получение нот лада в заданной тональности
- `getScaleDegrees(key, mode)` - получение ступеней лада
- `initializeScales(config)` - инициализация данных из конфигурации

**Алгоритм вычисления лада:**
1. Находим индекс основной ноты в массиве `NOTES`
2. Берем интервальный паттерн лада из `SCALES[mode]`
3. Для каждого интервала вычисляем: `(keyIndex + interval) % 12`
4. Возвращаем соответствующие ноты

### 3. Модуль работы с аккордами (`theory/chords.js`)

**Глобальные переменные:**
```javascript
let CHORD_PATTERNS = {}; // Интервальные паттерны аккордов
let GUITAR_CHORDS = {};  // Аппликатуры для гитары
```

**Ключевые функции:**
- `buildChord(root, chordType)` - построение аккорда по основному тону и типу
- `getChordName(root, chordType)` - получение названия аккорда
- `initializeChords(config)` - инициализация данных

**Алгоритм построения аккорда:**
1. Находим индекс основного тона в массиве нот
2. Берем интервальный паттерн из `CHORD_PATTERNS[chordType]`
3. Для каждого интервала: `(rootIndex + interval) % 12`
4. Возвращаем ноты аккорда

### 4. Модуль генерации прогрессий (`theory/progressions.js`)

**Глобальные переменные:**
```javascript
let PROGRESSIONS = {}; // Прогрессии по ладам
```

**Ключевые функции:**
- `generateProgressions(key, mode)` - главная функция генерации
- `getBassNotes(chords)` - извлечение басовых нот

**Алгоритм генерации прогрессий:**
1. Получаем лад: `getScale(key, mode)`
2. Берем доступные прогрессии для лада из `PROGRESSIONS[mode]`
3. Для каждой прогрессии:
    - Проходим по ступеням (`degrees`)
    - Для каждой ступени строим аккорд:
        - Берем ноту лада: `scale[degree - 1]`
        - Строим аккорд указанного типа: `buildChord(root, chordType)`
4. Возвращаем объекты с полной информацией об аккордах

---

## Детальная логика вычислений

### Вычисление последовательностей

**Пример для I-V-vi-IV в C major:**

1. **Входные данные:**
    - Тональность: C
    - Лад: major
    - Прогрессия: `{degrees: [1, 5, 6, 4], types: ["major", "major", "minor", "major"]}`

2. **Получение лада:**
   ```javascript
   const scale = getScale("C", "major");
   // Result: ["C", "D", "E", "F", "G", "A", "B"]
   ```

3. **Построение аккордов:**
    - I степень (1): C + major [0,4,7] → C-E-G (C major)
    - V степень (5): G + major [0,4,7] → G-B-D (G major)
    - vi степень (6): A + minor [0,3,7] → A-C-E (A minor)
    - IV степень (4): F + major [0,4,7] → F-A-C (F major)

### Вычисление басовых нот

**Алгоритм:**
1. Для каждого аккорда в прогрессии берется основной тон (`chord.root`)
2. Это становится басовой нотой
3. Дополнительно предоставляются альтернативы - все ноты аккорда

**Пример для C-G-Am-F:**
```javascript
const bassNotes = [
  { chord: "C", bassNote: "C", alternatives: ["C", "E", "G"] },
  { chord: "G", bassNote: "G", alternatives: ["G", "B", "D"] },
  { chord: "Am", bassNote: "A", alternatives: ["A", "C", "E"] },
  { chord: "F", bassNote: "F", alternatives: ["F", "A", "C"] }
];
```

### Вычисление вокальных нот

**Алгоритм:**
1. Вычисляется полный лад в выбранной тональности
2. Все ноты лада становятся доступными для вокала
3. Эти ноты отображаются на грифе и в списке

**Пример для C major:**
```javascript
const vocalNotes = getScale("C", "major");
// Result: ["C", "D", "E", "F", "G", "A", "B"]
```

---

## Модуль квинтового круга (`theory/circleOfFifths.js`)

**Класс `CircleOfFifths`:**
- Визуализирует тональности по квинтовому кругу
- Показывает связи между тональностями
- Позволяет интерактивно менять тональность

**Ключевые методы:**
- `getKeyPosition(key, mode)` - получение позиции тональности в круге
- `renderCircle()` - создание SVG визуализации
- `renderInteractiveContainer()` - создание интерактивного элемента

**Логика позиционирования:**
- 12 позиций по кругу (каждая на 30°)
- Внешнее кольцо - мажорные тональности
- Внутреннее кольцо - минорные тональности
- Подсветка текущей тональности и аккордов из прогрессии

---

## Модуль визуализации грифа (`guitar/fretboard.js`)

**Функции:**
- `renderChordDiagram(chordName)` - диаграммы аккордов
- `renderBassFretboard(notes, title)` - гриф бас-гитары (4 струны)
- `renderVocalFretboard(notes, title)` - гриф гитары (6 струн)

**Алгоритм построения диаграмм:**
1. Получение аппликатур из `GUITAR_CHORDS[chordName]`
2. Определение диапазона ладов для отображения
3. Создание SVG сетки грифа
4. Отметка позиций пальцев и открытых струн
5. Добавление меток заглушенных струн

---

## Аудио модуль (`audio/chordPlayer.js`)

**Класс `ChordPlayer`** использует библиотеку Tone.js:

**Синтезаторы:**
- `synth` - гитарные аккорды (PolySynth с triangle волной)
- `bassSynth` - бас-гитара (более низкие частоты)
- `vocalSynth` - вокальные ноты (sine волна)

**Эффекты:**
- Реверб для пространственности
- Компрессор для естественности
- Фильтры для имитации гитарного звучания

**Методы воспроизведения:**
- `playChord(notes)` - воспроизведение аккорда
- `playProgression(chords)` - последовательность аккордов
- `playFullArrangement(chords, bassNotes, vocalNotes)` - полная аранжировка

---

## Потоки данных в приложении

### 1. Инициализация
```
index.html загружает все модули →
script.js создает ChordProgressionGenerator →
Модули theory/* инициализируются с данными из config/* →
Создается интерфейс с селекторами и кнопками
```

### 2. Генерация прогрессий
```
Пользователь выбирает тональность и лад →
ChordProgressionGenerator.generate() →
generateProgressions(key, mode) →
getScale(key, mode) для получения нот лада →
buildChord(root, type) для каждого аккорда →
getBassNotes() для басовых нот →
Отрисовка результатов в DOM
```

### 3. Визуализация
```
renderProgressions() создает карточки →
renderChordDiagram() для каждого аккорда →
renderBassFretboard() для басовых нот →
renderVocalFretboard() для вокальных нот →
CircleOfFifths.renderCircle() для квинтового круга
```

### 4. Воспроизведение
```
Пользователь нажимает кнопку воспроизведения →
ChordPlayer.playProgression() или playFullArrangement() →
Tone.js синтезирует звуки →
Аудио выводится через Web Audio API
```

---

## Конфигурационная система

Все музыкальные данные вынесены в JSON файлы:

### scales.json
```json
{
  "scales": {
    "major": [0, 2, 4, 5, 7, 9, 11],    // Интервалы в полутонах
    "minor": [0, 2, 3, 5, 7, 8, 10]
  },
  "notes": ["C", "C#", "D", ...],        // Все ноты хроматической гаммы
  "noteNamesRu": { "C": "До", ... }      // Русские названия
}
```

### chords.json
```json
{
  "chordPatterns": {
    "major": [0, 4, 7],                  // Интервалы аккордов
    "minor": [0, 3, 7]
  },
  "guitarChords": {
    "C": [{                              // Аппликатуры
      "name": "Открытый",
      "frets": [null, 3, 2, 0, 1, 0],   // Позиции на ладах
      "fingers": [0, 3, 2, 0, 1, 0]     // Какими пальцами зажимать
    }]
  }
}
```

### progressions.json
```json
{
  "progressions": {
    "major": [{
      "name": "I-V-vi-IV",
      "degrees": [1, 5, 6, 4],           // Ступени лада
      "types": ["major", "major", "minor", "major"], // Типы аккордов
      "description": "Популярная прогрессия"
    }]
  }
}
```

Подробнее [тут](./CONFIG_GUIDE.ru.md).

---

## Расширяемость системы

### Добавление новых ладов:
1. Добавить интервальный паттерн в `scales.json`
2. Добавить прогрессии в `progressions.json`
3. Обновить селектор в `index.html`

### Добавление новых типов аккордов:
1. Добавить паттерн в `chordPatterns` файла `chords.json`
2. Добавить аппликатуры в `guitarChords`
3. Обновить функцию `getChordName()` в `theory/chords.js`

### Добавление новых прогрессий:
1. Добавить объект прогрессии в соответствующий лад в `progressions.json`
2. Система автоматически подхватит новые прогрессии
