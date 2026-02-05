import { Platform } from 'react-native';
import { LANGUAGES } from '../constants/app';

export const isIOS = (): boolean => {
  return Platform.OS === 'ios';
};

/**
 * Map of country codes to supported app locales
 */
const LOCALE_MAP: Record<string, string> = {
    // English speaking countries
    US: 'en',
    GB: 'en',
    AU: 'en',
    CA: 'en',
    NZ: 'en',
    IE: 'en',
    ZA: 'en',
    
    // Chinese regions
    CN: 'zh-CN',
    TW: 'zh-TW',
    HK: 'zh-CN',
    MO: 'zh-TW',
    SG: 'en',
    MY: 'en',
    
    // Other supported languages
    ID: 'id',
    JP: 'ja',
  KR: 'ko',
  TH: 'th',
};

export const getLocaleByCountryCode = (countryCode: string): string => {
  // Get locale from country code mapping
  const locale = LOCALE_MAP[countryCode];
  
  // Return valid locale or fallback to 'en'
  return locale || 'en';
};
