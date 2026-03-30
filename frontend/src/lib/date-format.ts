/**
 * Date formatting utilities for Vietnamese locale.
 * Consolidated from articles/helpers.ts and media-library/mappers.ts.
 */

const VI_DATE_FORMATTER = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/**
 * Format date to Vietnamese locale (dd/MM/yyyy).
 * Returns fallback message if date is invalid.
 */
export function formatDateVi(
  dateValue?: string | Date | null,
  fallback = "Đang cập nhật"
): string {
  if (!dateValue) {
    return fallback;
  }

  const parsed = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
  if (Number.isNaN(parsed.getTime())) {
    return typeof dateValue === "string" ? dateValue : fallback;
  }

  return VI_DATE_FORMATTER.format(parsed);
}

/**
 * Format upload date with prefix label.
 */
export function formatUploadDate(
  uploadedAt: string,
  prefix = "Cập nhật"
): string {
  const formatted = formatDateVi(uploadedAt, "gần đây");
  return `${prefix}: ${formatted}`;
}
