//* API service để tương tác với backend liên quan đến Biểu mẫu/tài liệu vs thư viện media, bao gồm các hàm như fetchPublicMedia, fetchLibraryPhotoPage, fetchLibraryVideoPage
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
// 1. LẤY BIỂU MẪU TÀI LIỆU
// Hàm này gọi API lấy thẳng danh sách file (ảnh, video, document). 
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
// 2. HÀM GỌI API DÙNG CHUNG (KHÔNG XUẤT RA NGOÀI)
// Hàm này ẩn bên trong, chuyên đi gọi API lấy ảnh/video và xử lý vụ phân trang (trang 1, trang 2...).
// Nếu API bị lỗi sập, nó tự động trả về mảng rỗng [] để web không bị lỗi trắng màn hình.
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
  //! LƯU Ý 3: BỌC LÓT LỖI HOÀN HẢO (Graceful Degradation)
    // Nếu sập mạng, nó không văng ra màn hình lỗi đỏ chót, mà âm thầm trả về một cục dữ liệu rỗng cấu trúc y hệt (items: [], total: 0). Nhờ vậy, giao diện bên ngoài chỉ cần hiện chữ "Chưa có ảnh" một cách êm ái.
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
// 3. LẤY DANH SÁCH ẢNH (CÓ PHÂN TRANG)
// Nhờ hàm ẩn bên trên đi lấy ảnh về, sau đó dùng hàm `toPhotoItem` gọt tỉa lại dữ liệu cho sạch đẹp rồi giao cho giao diện
export async function fetchLibraryPhotoPage(page = 1, pageSize = 5): Promise<PaginatedLibraryResult<LibraryPhotoItem>> {
  const response = await fetchPublicMediaPage("image", page, pageSize);
  return {
    ...response,
    items: response.items.map(toPhotoItem),
  };
}
//! Hàm fetchLibraryPhotos để lấy hình ảnh thư viện từ backend, hiển thị trên trang chủ
export async function fetchLibraryPhotos(limit = 12): Promise<LibraryPhotoItem[]> {
  const response = await fetchLibraryPhotoPage(1, limit);
  return response.items;
}
// 5. LẤY DANH SÁCH VIDEO (CÓ PHÂN TRANG)
// Giống hệt lấy ảnh: Nhờ hàm ẩn đi lấy video, rồi dùng `toVideoItem` gọt tỉa lại dữ liệu cho chuẩn giao diện video
export async function fetchLibraryVideoPage(page = 1, pageSize = 5): Promise<PaginatedLibraryResult<LibraryVideoItem>> {
  const response = await fetchPublicMediaPage("video", page, pageSize);
  return {
    ...response,
    items: response.items.map(toVideoItem),
  };
}
