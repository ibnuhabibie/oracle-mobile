/**
 * Extracts a message from an error object, supporting Supabase/HTTP error formats.
 * Returns the fallback message if no message is found.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  const isObject = typeof error === 'object' && error !== null && !Array.isArray(error);
  const hasMeta = isObject && 'meta' in (error as object) && (error as any).meta;
  const hasMessage = hasMeta && 'message' in (error as any).meta;
  if (hasMessage) {
    return String((error as any).meta.message);
  }
  return fallback;
}
