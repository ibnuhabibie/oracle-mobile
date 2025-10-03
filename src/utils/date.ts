import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/id';
import 'dayjs/locale/ja';
import 'dayjs/locale/ko';
import 'dayjs/locale/th';
import 'dayjs/locale/zh';

/**
 * Format a date string (yyyy-mm-dd or ISO) or Date object to "EEE, d MMM yyyy" (e.g., "Sat, 2 May 2025")
*/
/**
 * Format a date string (yyyy-mm-dd or ISO) or Date object to "EEE, d MMM yyyy" (e.g., "Sat, 2 May 2025")
 * Accepts locale for localization.
 */
// Get locale from use-storage.ts
import { getLocale } from '../hooks/use-storage';

// Async version: Format a date string (yyyy-mm-dd or ISO) or Date object to "EEE, d MMM yyyy" (e.g., "Sat, 2 May 2025")
// Locale is automatically retrieved from storage if not provided
export const formatDateToHeader = async (
    input: { dateString: string } | Date,
    locale?: string
): Promise<string> => {
    let normalizedLocale = locale;
    if (!normalizedLocale) {
        normalizedLocale = await getLocale();
    }
    normalizedLocale = normalizedLocale === 'kr' ? 'ko' : normalizedLocale;
    const _date =
        input instanceof Date
            ? dayjs(input)
            : dayjs(input.dateString);
    const d = _date.locale(normalizedLocale);
    // "ddd, D MMM YYYY" (e.g., "Sat, 2 May 2025")
    return d.format('ddd, D MMM YYYY');
}

// Format a date string (yyyy-mm-dd or ISO) or Date object to "yyyy-MM-dd"
// Format a date string (yyyy-mm-dd or ISO) or Date object to "yyyy-MM-dd"
// Async version: Format a date string (yyyy-mm-dd or ISO) or Date object to "yyyy-MM-dd"
export const formatDate = async (
    input: { dateString: string } | Date,
    locale?: string
): Promise<string> => {
    let normalizedLocale = locale;
    if (!normalizedLocale) {
        normalizedLocale = await getLocale();
    }
    normalizedLocale = normalizedLocale === 'kr' ? 'ko' : normalizedLocale;
    const _date =
        input instanceof Date
            ? dayjs(input)
            : dayjs(input.dateString);
    return _date.locale(normalizedLocale).format('YYYY-MM-DD');
}

/**
 * Format a date string or Date object to "dd MMM yyyy HH:mm" (e.g., "25 Jan 2025 10:00")
 */
// Format a date string or Date object to "dd MMM yyyy HH:mm" (e.g., "25 Jan 2025 10:00")
// Format a date string or Date object to "dd MMM yyyy HH:mm" (e.g., "25 Jan 2025 10:00")
// Async version: Format a date string or Date object to "dd MMM yyyy HH:mm" (e.g., "25 Jan 2025 10:00")
export const formatDateTime = async (
    input: string | Date,
    locale?: string
): Promise<string> => {
    let normalizedLocale = locale;
    if (!normalizedLocale) {
        normalizedLocale = await getLocale();
    }
    normalizedLocale = normalizedLocale === 'kr' ? 'ko' : normalizedLocale;
    const _date = typeof input === 'string' ? dayjs(input) : dayjs(input);
    return _date.locale(normalizedLocale).format('DD MMM YYYY HH:mm');
};

/**
 * Format a date string (yyyy-mm-dd or ISO) or Date object to "EEE, MMM dd yyyy" (e.g., "Tue, Jul 15 2025")
 */
// Format a date string (yyyy-mm-dd or ISO) or Date object to "EEE, MMM dd yyyy" (e.g., "Tue, Jul 15 2025")
// Format a date string (yyyy-mm-dd or ISO) or Date object to "EEE, MMM dd yyyy" (e.g., "Tue, Jul 15 2025")
// Async version: Format a date string (yyyy-mm-dd or ISO) or Date object to "EEE, MMM dd yyyy" (e.g., "Tue, Jul 15 2025")
export const formatDateToShortHeader = async (
    input: string | Date,
    locale?: string
): Promise<string> => {
    let normalizedLocale = locale;
    if (!normalizedLocale) {
        normalizedLocale = await getLocale();
    }
    normalizedLocale = normalizedLocale === 'kr' ? 'ko' : normalizedLocale;
    const _date = typeof input === 'string' ? dayjs(input) : dayjs(input);
    return _date.locale(normalizedLocale).format('ddd, MMM DD YYYY');
};

/**
 * Format a date of birth to "dd MMM yyyy" (e.g., "29 May 1999")
 */
// Format a date of birth to "dd MMM yyyy" (e.g., "29 May 1999")
// Format a date of birth to "dd MMM yyyy" (e.g., "29 May 1999")
// Async version: Format a date of birth to "dd MMM yyyy" (e.g., "29 May 1999")
export const formatDateOfBirth = async (
    input: string | Date | { dateString: string },
    locale?: string
): Promise<string> => {
    let normalizedLocale = locale;
    if (!normalizedLocale) {
        normalizedLocale = await getLocale();
    }
    normalizedLocale = normalizedLocale === 'kr' ? 'ko' : normalizedLocale;
    let _date: dayjs.Dayjs;
    if (typeof input === 'string') {
        _date = dayjs(input);
    } else if (input instanceof Date) {
        _date = dayjs(input);
    } else if (input && typeof input === 'object' && 'dateString' in input) {
        _date = dayjs(input.dateString);
    } else {
        return '';
    }
    return _date.locale(normalizedLocale).format('DD MMM YYYY');
};

/**
 * Format a time of birth to "hh:mm AM/PM" (e.g., "10:00 AM")
 */
export const formatTimeOfBirth = (input: string | Date | { timeString: string }): string => {
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
