/**
 * HTML content utilities.
 * Consolidated from articles/helpers.ts and admin/contentMappers.ts.
 */

import { resolveApiAssetUrl } from "@/lib/api-base-url";

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

/**
 * Normalize image src values inside HTML content to absolute URLs.
 */
export function resolveHtmlImageSrc(value?: string | null): string {
  const html = value?.trim();

  if (!html) {
    return "";
  }

  const normalized = html.replace(/&nbsp;/g, " ");

  return normalized.replace(
    /(<img[^>]*\ssrc=)(["'])([^"']*)(\2)/gi,
    (_, prefix, quote, src) => {
      const resolved = resolveApiAssetUrl(src);
      return `${prefix}${quote}${resolved || src}${quote}`;
    },
  );
}
