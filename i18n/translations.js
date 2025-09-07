// i18n/translations.js
// Система интернационализации
class I18n {
    constructor() {
        this.currentLanguage = 'ru';
        this.translations = {};
        this.init();
    }

    async init() {
        // Загружаем переводы
        await this.loadTranslations();

        // Определяем язык браузера или из localStorage
        const savedLang = localStorage.getItem('language');
        const browserLang = navigator.language.slice(0, 2);

        if (savedLang && this.translations[savedLang]) {
            this.currentLanguage = savedLang;
        } else if (this.translations[browserLang]) {
            this.currentLanguage = browserLang;
        }

        // Применяем переводы
        this.applyTranslations();
        this.updateLanguageSelector();
    }

    async loadTranslations() {
        try {
            const response = await fetch('./i18n/languages.json');
            this.translations = await response.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Fallback переводы
            this.translations = {
                ru: {},
                en: {}
            };
        }
    }

    t(key, params = {}) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];

        for (const k of keys) {
            if (translation && typeof translation === 'object') {
                translation = translation[k];
            } else {
                // Fallback к русскому, затем к ключу
                translation = this.getNestedValue(this.translations.ru, key) || key;
                break;
            }
        }

        // Подстановка параметров
        if (typeof translation === 'string' && Object.keys(params).length > 0) {
            Object.keys(params).forEach(param => {
                translation = translation.replace(`{${param}}`, params[param]);
            });
        }

        return translation || key;
    }

    getNestedValue(obj, key) {
        const keys = key.split('.');
        let value = obj;

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return undefined;
            }
        }

        return value;
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            this.applyTranslations();
            this.updateLanguageSelector();

            // Обновляем приложение
            if (window.chordApp) {
                window.chordApp.updateAll();
                // Также обновляем переводы в уже существующих квинтовых кругах
                window.chordApp.updateCircleTranslations();
            }
        }
    }

    applyTranslations() {
        // Переводим элементы с data-i18n атрибутами
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            if (element.tagName === 'INPUT' && element.type !== 'button') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Переводим элементы с data-i18n-title для title атрибутов
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // Обновляем title страницы
        document.title = this.t('app.title');
    }

    updateLanguageSelector() {
        const selector = document.getElementById('language-select');
        if (selector) {
            selector.value = this.currentLanguage;
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getAvailableLanguages() {
        return Object.keys(this.translations);
    }
}

// Создаем глобальный экземпляр
window.i18n = new I18n();
