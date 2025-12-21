import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Импорт переводов
import translationRU from './locales/ru/translation.json';
import translationKZ from './locales/kz/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
  ru: {
    translation: translationRU
  },
  kz: {
    translation: translationKZ
  },
  en: {
    translation: translationEN
  }
};

i18n
  .use(LanguageDetector) // Автоматическое определение языка
  .use(initReactI18next) // Привязка к React
  .init({
    resources,
    fallbackLng: 'ru', // Язык по умолчанию
    lng: localStorage.getItem('language') || 'ru', // Сохраненный язык или по умолчанию
    debug: false,

    interpolation: {
      escapeValue: false // React уже защищает от XSS
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
