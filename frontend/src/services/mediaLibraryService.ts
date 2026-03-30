import api from "@/services/api";
import { toMediaFile, toPhotoItem, toVideoItem } from "@/services/media-library/mappers";
import type {
  LibraryPhotoItem,
  LibraryVideoItem,
  PaginatedLibraryResult,
  PublicMediaResponse,
} from "@/services/media-library/types";
import type { MediaFile } from "@/types";

export type {
  LibraryPhotoItem,
  LibraryVideoItem,
  PaginatedLibraryResult,
} from "@/services/media-library/types";

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
