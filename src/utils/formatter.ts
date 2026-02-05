// Supported currency symbols
export type CurrencySymbol = 'Rp' | '$' | '€' | '£' | '¥' | string;

export const formatDate = (date: Date | null): string => {
  if (!date) {
    return '';
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time: Date | null): string => {
  if (!time) {
    return '';
  }
  return time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Helper function to format price based on currency
 * @param price - The price value (number or string that can be parsed to number)
 * @param currencySymbol - The currency symbol (e.g., 'Rp', '$', '€')
 * @returns Formatted price string
 */
export const formatPrice = (price: number | string, currencySymbol: CurrencySymbol): string => {
  // For Indonesian Rupiah (Rp), format with dots as thousand separators
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (currencySymbol === 'Rp') {
    return `${currencySymbol}${numericPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  }
  // For USD ($) and other currencies, format with 2 decimal places
  return `${currencySymbol}${numericPrice.toFixed(2)}`;
};
