/**
 * Format a date string (yyyy-mm-dd or ISO) or Date object to "EEE, d MMM yyyy" (e.g., "Sat, 2 May 2025")
*/
export const formatDateToHeader = (input: object): string => {
    let _date = new Date(input.dateString);
    const weekday = _date.toLocaleString('en-US', { weekday: 'short' });
    const day = _date.getDate();
    const month = _date.toLocaleString('en-US', { month: 'short' });
    const year = _date.getFullYear();
    return `${weekday}, ${day} ${month} ${year}`;
}

export const formatDate = (input: object): string => {
    let _date = new Date(input.dateString);
    const y = _date.getFullYear();
    const m = (_date.getMonth() + 1).toString().padStart(2, '0');
    const d = _date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * Format a date string or Date object to "dd MMM yyyy HH:mm" (e.g., "25 Jan 2025 10:00")
 */
export const formatDateTime = (input: string | Date): string => {
    const _date = typeof input === 'string' ? new Date(input) : input;
    const day = _date.getDate().toString().padStart(2, '0');
    const month = _date.toLocaleString('en-US', { month: 'short' });
    const year = _date.getFullYear();
    const hour = _date.getHours().toString().padStart(2, '0');
    const minute = _date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year} ${hour}:${minute}`;
};

/**
 * Format a date of birth to "dd MMM yyyy" (e.g., "29 May 1999")
 */
export const formatDateOfBirth = (input: string | Date | { dateString: string }): string => {
    let _date: Date;
    if (typeof input === 'string') {
        _date = new Date(input);
    } else if (input instanceof Date) {
        _date = input;
    } else if (input && typeof input === 'object' && 'dateString' in input) {
        _date = new Date(input.dateString);
    } else {
        return '';
    }
    const day = _date.getDate().toString().padStart(2, '0');
    const month = _date.toLocaleString('en-US', { month: 'short' });
    const year = _date.getFullYear();
    return `${day} ${month} ${year}`;
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
