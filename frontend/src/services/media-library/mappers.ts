import { resolveApiAssetUrl } from "@/lib/api-base-url";
import { formatUploadDate } from "@/lib/date-format";
import { inferTheme } from "@/services/media-library/themes";
import type { PublicMediaResponse } from "@/services/media-library/types";
import type { MediaFile } from "@/types";

export function toMediaFile(row: PublicMediaResponse["data"][number]): MediaFile {
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

export function toPhotoItem(file: MediaFile) {
  const theme = inferTheme(file.fileName);

  return {
    id: file.id,
    title: buildTitle(file.fileName),
    desc: formatUploadDate(file.uploadedAt),
    image: file.url || file.filePath,
    theme: theme.title,
  };
}

export function toVideoItem(file: MediaFile) {
  const sourceUrl = file.url || file.filePath;

  return {
    id: file.id,
    title: buildTitle(file.fileName),
    date: formatUploadDate(file.uploadedAt),
    image: sourceUrl,
    sourceUrl,
  };
}
