export function openShareUrl(url: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer,width=720,height=640");
}

export async function copyLink(url: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }

  if (typeof window !== "undefined") {
    window.prompt("Sao chép liên kết này:", url);
  }
}
