import api from "@/services/api";
import { toMedia } from "@/services/admin/contentMappers";
import type {
  ApiMedia,
  PaginatedResponse,
} from "@/services/admin/types";
import type { MediaFile } from "@/types";

export async function fetchMediaAdmin(params?: {
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<MediaFile>> {
  const response = await api.get<PaginatedResponse<ApiMedia>>("/media", { params });
  return {
    ...response.data,
    data: Array.isArray(response.data?.data) ? response.data.data.map(toMedia) : [],
  };
}

export async function uploadMedia(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  await api.post("/media/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function deleteMediaAdmin(id: string): Promise<void> {
  await api.delete(`/media/${id}`);
}
