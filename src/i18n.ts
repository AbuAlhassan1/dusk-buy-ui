import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import ar from './locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Set document direction and lang attribute based on language
i18n.on('languageChanged', (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

// Set initial direction after i18n is initialized
i18n.on('initialized', () => {
  const currentDir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = currentDir;
  document.documentElement.lang = i18n.language;
});

// Also set immediately in case initialization already happened
if (i18n.isInitialized) {
  const currentDir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = currentDir;
  document.documentElement.lang = i18n.language;
}

export default i18n;
