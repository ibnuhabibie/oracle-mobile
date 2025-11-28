export const formatDate = (date: Date | null) => {
  if (!date) {
    return '';
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (time: Date | null) => {
  if (!time) {
    return '';
  }
  return time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Helper function to format price based on currency
export const formatPrice = (price: number, currencySymbol: string): string => {
  // For Indonesian Rupiah (Rp), format with dots as thousand separators
  if (currencySymbol === 'Rp') {
    return `${currencySymbol}${price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
  }
  // For USD ($) and other currencies, format with 2 decimal places
  return `${currencySymbol}${price.toFixed(2)}`;
};