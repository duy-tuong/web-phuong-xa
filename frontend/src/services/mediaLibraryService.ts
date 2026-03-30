import { format } from "date-fns";

import { resolveApiAssetUrl } from "@/lib/api-base-url";
import api from "@/services/api";
import type { MediaFile } from "@/types";

type PublicMediaResponse = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: Array<{
    id: number;
    fileName: string;
    filePath: string;
    type: string;
    fileType?: string | null;
    fileSize?: number | null;
    uploadedAt: string;
  }>;
};

type MediaTheme = {
  title: string;
  description: string;
};

export type PaginatedLibraryResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type LibraryPhotoItem = {
  id: string;
  title: string;
  desc: string;
  image: string;
  theme: string;
};

export type LibraryVideoItem = {
  id: string;
  title: string;
  date: string;
  image: string;
  sourceUrl: string;
};

export type LibraryThemeItem = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  count: number;
  href: string;
};

const DEFAULT_THEME: MediaTheme = {
  title: "Khoảnh khắc địa phương",
  description: "Những hình ảnh đời sống, sinh hoạt và nhịp sống thường ngày tại địa phương.",
};

function toMediaFile(row: PublicMediaResponse["data"][number]): MediaFile {
  return {
    id: String(row.id),
    fileName: row.fileName,
    filePath: row.filePath,
    type: row.type,
    uploadedBy: "",
    uploadedAt: row.uploadedAt,
    url: resolveApiAssetUrl(row.filePath) || row.filePath,
    fileType: row.fileType ?? undefined,
    fileSize: row.fileSize ?? undefined,
    createdAt: row.uploadedAt,
  };
}

function normalizeKeyword(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s_-]/g, " ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildTitle(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  return baseName.replace(/[_-]+/g, " ").trim() || "Media";
}

function formatUploadedAt(uploadedAt: string) {
  const parsed = new Date(uploadedAt);
  if (Number.isNaN(parsed.getTime())) {
    return "Cập nhật gần đây";
  }

  return `Cập nhật: ${format(parsed, "dd/MM/yyyy")}`;
}

function inferTheme(fileName: string): MediaTheme {
  const normalized = normalizeKeyword(fileName);

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

function toPhotoItem(file: MediaFile): LibraryPhotoItem {
  const theme = inferTheme(file.fileName);

  return {
    id: file.id,
    title: buildTitle(file.fileName),
    desc: formatUploadedAt(file.uploadedAt),
    image: file.url || file.filePath,
    theme: theme.title,
  };
}

function toVideoItem(file: MediaFile): LibraryVideoItem {
  const sourceUrl = file.url || file.filePath;

  return {
    id: file.id,
    title: buildTitle(file.fileName),
    date: formatUploadedAt(file.uploadedAt),
    image: sourceUrl,
    sourceUrl,
  };
}

export async function fetchPublicMedia(type?: "image" | "video" | "document", pageSize = 50): Promise<MediaFile[]> {
  try {
    const response = await api.get<PublicMediaResponse>("/media/public", {
      params: {
        type,
        page: 1,
        pageSize,
      },
    });

    return Array.isArray(response.data?.data) ? response.data.data.map(toMediaFile) : [];
  } catch (error) {
    console.error("Không thể tải danh sách media công khai:", error);
    return [];
  }
}

async function fetchPublicMediaPage(
  type: "image" | "video",
  page = 1,
  pageSize = 12,
): Promise<PaginatedLibraryResult<MediaFile>> {
  try {
    const response = await api.get<PublicMediaResponse>("/media/public", {
      params: {
        type,
        page,
        pageSize,
      },
    });

    return {
      items: Array.isArray(response.data?.data) ? response.data.data.map(toMediaFile) : [],
      total: response.data?.total ?? 0,
      page: response.data?.page ?? page,
      pageSize: response.data?.pageSize ?? pageSize,
      totalPages: response.data?.totalPages ?? 0,
    };
  } catch (error) {
    console.error(`Không thể tải ${type === "image" ? "thư viện ảnh" : "kho video"} công khai:`, error);
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    };
  }
}

export async function fetchLibraryPhotoPage(page = 1, pageSize = 5): Promise<PaginatedLibraryResult<LibraryPhotoItem>> {
  const response = await fetchPublicMediaPage("image", page, pageSize);
  return {
    ...response,
    items: response.items.map(toPhotoItem),
  };
}

export async function fetchLibraryPhotos(limit = 12): Promise<LibraryPhotoItem[]> {
  const response = await fetchLibraryPhotoPage(1, limit);
  return response.items;
}

export async function fetchLibraryVideoPage(page = 1, pageSize = 5): Promise<PaginatedLibraryResult<LibraryVideoItem>> {
  const response = await fetchPublicMediaPage("video", page, pageSize);
  return {
    ...response,
    items: response.items.map(toVideoItem),
  };
}

export async function fetchLibraryVideos(limit = 9): Promise<LibraryVideoItem[]> {
  const response = await fetchLibraryVideoPage(1, limit);
  return response.items;
}

export async function fetchPhotoThemes(limit = 4): Promise<LibraryThemeItem[]> {
  const photos = await fetchLibraryPhotos(50);
  const themeMap = new Map<string, LibraryThemeItem>();

  for (const photo of photos) {
    const theme = inferTheme(photo.title);

    if (!themeMap.has(theme.title)) {
      themeMap.set(theme.title, {
        id: theme.title,
        title: theme.title,
        description: theme.description,
        coverImage: photo.image,
        count: 1,
        href: "/thu-vien/hinh-anh",
      });
      continue;
    }

    const current = themeMap.get(theme.title);
    if (current) {
      current.count += 1;
    }
  }

  return Array.from(themeMap.values())
    .sort((left, right) => right.count - left.count)
    .slice(0, limit);
}
