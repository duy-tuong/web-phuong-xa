import api from "@/services/api";
import { REMOTE_API_BASE_URL } from "@/lib/api-base-url";
import { toMedia } from "@/services/admin/contentMappers";
import type { ApiMedia, PaginatedResponse } from "@/services/admin/types";
import type { MediaFile } from "@/types";

export async function fetchMediaAdmin(params?: {
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<MediaFile>> {
  const response = await api.get<PaginatedResponse<ApiMedia>>("/media", {
    params,
  });
  return {
    ...response.data,
    data: Array.isArray(response.data?.data)
      ? response.data.data.map(toMedia)
      : [],
  };
}

export async function uploadMedia(
  file: File,
  description?: string,
): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  if (description && description.trim()) {
    formData.append("description", description.trim());
  }

  const headers: HeadersInit = {};
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("admin_token") || localStorage.getItem("user_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${REMOTE_API_BASE_URL}/media/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }
}

export async function deleteMediaAdmin(id: string): Promise<void> {
  await api.delete(`/media/${id}`);
}

export async function updateMediaVisibility(
  id: string,
  isPublic: boolean,
): Promise<void> {
  await api.put(`/media/${id}/visibility`, isPublic);
}

export async function updateMediaDescription(
  id: string,
  description: string,
): Promise<void> {
  await api.put(`/media/${id}/description`, { description });
}
