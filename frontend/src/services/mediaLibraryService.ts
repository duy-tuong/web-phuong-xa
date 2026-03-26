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

export type LibraryPhotoItem = {
  id: string;
  title: string;
  desc: string;
  image: string;
};

export type LibraryVideoItem = {
  id: string;
  title: string;
  date: string;
  image: string;
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

function buildTitle(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "");
  return baseName.replace(/[_-]+/g, " ").trim() || "Media";
}

function formatUploadedAt(uploadedAt: string) {
  const parsed = new Date(uploadedAt);
  if (Number.isNaN(parsed.getTime())) {
    return "Cap nhat gan day";
  }

  return `Cap nhat: ${format(parsed, "dd/MM/yyyy")}`;
}

export async function fetchPublicMedia(type?: "image" | "video" | "document", pageSize = 50): Promise<MediaFile[]> {
  const response = await api.get<PublicMediaResponse>("/media/public", {
    params: {
      type,
      page: 1,
      pageSize,
    },
  });

  return Array.isArray(response.data?.data) ? response.data.data.map(toMediaFile) : [];
}

export async function fetchLibraryPhotos(limit = 12): Promise<LibraryPhotoItem[]> {
  const mediaFiles = await fetchPublicMedia("image", limit);
  return mediaFiles.map((file) => ({
    id: file.id,
    title: buildTitle(file.fileName),
    desc: formatUploadedAt(file.uploadedAt),
    image: file.url || file.filePath,
  }));
}

export async function fetchLibraryVideos(limit = 9): Promise<LibraryVideoItem[]> {
  const mediaFiles = await fetchPublicMedia("video", limit);
  return mediaFiles.map((file) => ({
    id: file.id,
    title: buildTitle(file.fileName),
    date: formatUploadedAt(file.uploadedAt),
    image: file.url || file.filePath,
  }));
}
