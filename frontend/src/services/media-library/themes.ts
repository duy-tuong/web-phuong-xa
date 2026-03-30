import { normalizeKeyword as baseNormalizeKeyword } from "@/lib/normalize";
import type { MediaTheme } from "@/services/media-library/types";

const DEFAULT_THEME: MediaTheme = {
  title: "Khoảnh khắc địa phương",
  description: "Những hình ảnh đời sống, sinh hoạt và nhịp sống thường ngày tại địa phương.",
};

function normalizeThemeKeyword(value: string): string {
  return baseNormalizeKeyword(value.replace(/[_-]+/g, " "));
}

export function inferTheme(fileName: string): MediaTheme {
  const normalized = normalizeThemeKeyword(fileName);

  if (
    normalized.includes("di tich") ||
    normalized.includes("nguyen sinh sac") ||
    normalized.includes("tap ket") ||
    normalized.includes("lich su")
  ) {
    return {
      title: "Di tích lịch sử",
      description: "Tư liệu hình ảnh về di tích, dấu ấn lịch sử và những địa danh gắn với ký ức địa phương.",
    };
  }

  if (
    normalized.includes("cho") ||
    normalized.includes("thanh pho") ||
    normalized.includes("do thi") ||
    normalized.includes("pho")
  ) {
    return {
      title: "Đô thị và đời sống",
      description: "Không gian phố phường, chợ, cảnh quan đô thị và nhịp sống hằng ngày của người dân.",
    };
  }

  if (
    normalized.includes("le hoi") ||
    normalized.includes("van hoa") ||
    normalized.includes("su kien") ||
    normalized.includes("cong dong")
  ) {
    return {
      title: "Văn hóa cộng đồng",
      description: "Hoạt động văn hóa, sự kiện cộng đồng và những khoảnh khắc gắn kết tại địa phương.",
    };
  }

  return DEFAULT_THEME;
}
