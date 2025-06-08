import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your JSON files
import en from '../locales/en.json';
import id from '../locales/id.json';

const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: async (cb) => {
        try {
            const savedLang = await AsyncStorage.getItem('language');
            cb(savedLang || 'en');
        } catch (error) {
            cb('en');
        }
    },
    init: () => { },
    cacheUserLanguage: async (lang) => {
        await AsyncStorage.setItem('language', lang);
    },
};

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        resources: {
            en: { translation: en },
            id: { translation: id },
        },
        compatibilityJSON: 'v3',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
