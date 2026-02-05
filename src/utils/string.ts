import { formatPrice } from './formatter';
import type { TranslationItem, PricingVariant } from './types';

/**
 * Get translated value by key and locale
 * @param translations - Array of translation items
 * @param key - The translation key to find
 * @param locale - The locale to match
 * @returns The translated value or empty string if not found
 */
export const getTranslateByKey = (
  translations: TranslationItem[] | unknown,
  key: string,
  locale: string,
): string => {
  console.log(translations);
  if (Array.isArray(translations)) {
    const transItem = translations.find(
      (tr) => tr.key === key && tr.locale === locale,
    );
    return transItem?.value || '';
  }
  return '';
};

/**
 * Get formatted price for a specific locale
 * @param variants - Array of pricing variants
 * @param locale - The locale to match
 * @returns Formatted price string or empty string if not found
 */
export const getPricingVariant = (
  variants: PricingVariant[] | unknown,
  locale: string,
): string => {
  if (Array.isArray(variants)) {
    const pricingVariant = variants.find((pv) => pv.locale === locale);
    if (pricingVariant) {
      return formatPrice(pricingVariant.price, pricingVariant.currency_symbol);
    }
  }

  return '';
};