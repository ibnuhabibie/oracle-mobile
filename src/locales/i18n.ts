import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en.json';
import id from './id.json';
import zhCN from './zh-CN.json';
import zhTW from './zh-TW.json';
import ja from './ja.json';
import ko from './ko.json';
import th from './th.json';

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
    init: () => {},
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
            'zh-CN': { translation: zhCN },
            'zh-TW': { translation: zhTW },
            ja: { translation: ja },
            ko: { translation: ko },
            th: { translation: th },
        },
        compatibilityJSON: 'v3',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
