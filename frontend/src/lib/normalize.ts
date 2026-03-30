/**
 * Vietnamese text normalization utilities.
 * Consolidated from multiple files to ensure consistent behavior.
 */

/**
 * Basic Vietnamese text normalization.
 * Removes diacritics and normalizes "đ" for search matching and comparison.
 */
export function normalizeVietnamese(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d");
}

/**
 * Normalize Vietnamese text for keyword matching.
 * Removes special characters, collapses whitespace, and trims the result.
 */
export function normalizeKeyword(value: string): string {
  return normalizeVietnamese(value)
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Generate a URL-safe slug from Vietnamese text.
 * Converts spaces and special characters to hyphens.
 */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
