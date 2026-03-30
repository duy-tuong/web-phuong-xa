export function parseViews(views: string) {
  const digits = views.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}
