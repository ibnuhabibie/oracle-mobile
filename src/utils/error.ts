import type { ApiErrorResponse } from './types';

/**
 * Extracts a message from an error object, supporting Supabase/HTTP error formats.
 * Returns the fallback message if no message is found.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  const isObject = typeof error === 'object' && error !== null && !Array.isArray(error);
  const hasMeta = isObject && 'meta' in error;
  const typedError = error as Partial<ApiErrorResponse>;
  
  if (hasMeta && typedError.meta?.message) {
    return String(typedError.meta.message);
  }
  return fallback;
}
