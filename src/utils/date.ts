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
