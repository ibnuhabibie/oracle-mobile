/**
 * Type definitions for utility functions
 */

// Translation item type
export interface TranslationItem {
  key: string;
  locale: string;
  value: string;
}

// Pricing variant type
export interface PricingVariant {
  locale: string;
  price: string | number;
  currency_symbol: string;
}

// User profile type
export interface UserProfile {
  user_id: string | number;
  [key: string]: any;
}

// Translation function type
export type TranslationFunction = (key: string, params?: Record<string, any>) => string;

// API response with metadata
export interface ApiErrorResponse {
  meta?: {
    message: string;
  };
  [key: string]: any;
}

// Time of birth input types
export type TimeOfBirthInput = string | Date | { timeString: string };