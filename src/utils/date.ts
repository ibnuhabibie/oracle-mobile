import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/id';
import 'dayjs/locale/ja';
import 'dayjs/locale/ko';
import 'dayjs/locale/th';
import 'dayjs/locale/zh';

// Get locale from use-storage.ts
import { getLocale } from '../hooks/use-storage';
import type { TimeOfBirthInput } from './types';

/**
 * Format a time of birth to "hh:mm AM/PM" (e.g., "10:00 AM")
 */
export const formatTimeOfBirth = (input: TimeOfBirthInput): string => {
    let _date: Date;
    if (typeof input === 'string') {
        _date = new Date(`1970-01-01T${input}`);
        if (isNaN(_date.getTime())) {
            // Try parsing as "hh:mm AM/PM"
            const match = input.match(/^(\d{1,2}):(\d{2})\s*([APap][Mm])$/);
            if (match) {
                let hour = parseInt(match[1], 10);
                const minute = match[2];
                const ampm = match[3].toUpperCase();
                if (ampm === 'PM' && hour < 12) hour += 12;
                if (ampm === 'AM' && hour === 12) hour = 0;
                return `${match[1].padStart(2, '0')}:${minute} ${ampm}`;
            }
            return input;
        }
    } else if (input instanceof Date) {
        _date = input;
    } else if (input && typeof input === 'object' && 'timeString' in input) {
        _date = new Date(`1970-01-01T${input.timeString}`);
    } else {
        return '';
    }
    let hour = _date.getHours();
    const minute = _date.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour.toString().padStart(2, '0')}:${minute} ${ampm}`;
};


const _init = async (locale: string, input: string | Date) => {
    let normalizedLocale = locale;
    if (!normalizedLocale) {
        normalizedLocale = await getLocale();
    }
    normalizedLocale = normalizedLocale === 'kr' ? 'ko' : normalizedLocale;
    const _date = typeof input === 'string' ? dayjs(input) : dayjs(input);

    return { normalizedLocale, _date }
}


const _getDateFormatByLocale = (locale: string): string => {
    let dateFormat = 'YYYY-MM-DD';

    if (locale == 'ko') {
        dateFormat = 'YYYY년MM월DD일';
    } else if (locale == 'ja') {
        dateFormat = 'YYYY年MM月DD日';
    } else if (locale == 'zh') {
        dateFormat = 'YYYY年MM月DD日';
    } else if (locale == 'id' || locale == 'th') {
        dateFormat = 'DD/MM/YYYY';
    }
    return dateFormat;
}


export const formatDateWithDayname = async (input: string | Date, locale?: string): Promise<string> => {
    const { normalizedLocale, _date } = await _init(locale || '', input);
    let dateFormat = _getDateFormatByLocale(normalizedLocale);

    return _date.locale(normalizedLocale).format(`dddd, ${dateFormat}`);
}

export const formatDateOnly = async (input: string | Date, locale?: string): Promise<string> => {
    const { normalizedLocale, _date } = await _init(locale || '', input);
    let dateFormat = _getDateFormatByLocale(normalizedLocale);

    return _date.locale(normalizedLocale).format(dateFormat);
}

export const formatDateWithTime = async (input: string | Date, locale?: string): Promise<string> => {
    const { normalizedLocale, _date } = await _init(locale || '', input);
    let dateFormat = _getDateFormatByLocale(normalizedLocale);

    return _date.locale(normalizedLocale).format(`${dateFormat} HH:mm`);
}

export const fortuneYear = (() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    return month >= 7 ? year + 1 : year;
})();