/**
 * HTML content utilities.
 * Consolidated from articles/helpers.ts and admin/contentMappers.ts.
 */

/**
 * Strip HTML tags and normalize whitespace.
 */
export function stripHtml(value?: string | null): string {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Build excerpt from HTML content (max 180 chars).
 */
export function buildExcerpt(content: string, maxLength = 180): string {
  return stripHtml(content).slice(0, maxLength);
}
