"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  FileText,
  Image as ImageIcon,
  Trash2,
  Upload,
} from "lucide-react";

import PageHeader from "@/components/admin/PageHeader";
import { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/services/admin/errors";
import {
  deleteMediaAdmin,
  fetchMediaAdmin,
  uploadMedia,
} from "@/services/admin/media";
import { MediaFile } from "@/types";

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function isImageFile(file: MediaFile) {
  return (
    file.type.toLowerCase().includes("image") ||
    (file.fileType || "").toLowerCase().startsWith("image/")
  );
}

function isVideoFile(file: MediaFile) {
  return (
    file.type.toLowerCase().includes("video") ||
    (file.fileType || "").toLowerCase().startsWith("video/")
  );
}

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await fetchMediaAdmin({ page: 1, pageSize: 200 });
      setMediaFiles(response.data);
    } catch (loadError) {
      setErrorMessage(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  const handleUpload = async (file?: File | null) => {
    if (!file) {
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage("");
      await uploadMedia(file);
      await loadMedia();
    } catch (uploadError) {
      setErrorMessage(getErrorMessage(uploadError));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setErrorMessage("");
      await deleteMediaAdmin(deleteTarget.id);
      await loadMedia();
    } catch (deleteError) {
      setErrorMessage(getErrorMessage(deleteError));
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ImageIcon}
        title="Thư viện media"
        description={
          isLoading
            ? "Đang tải tệp media..."
            : `${mediaFiles.length} tệp đã đồng bộ với backend`
        }
      />

      {errorMessage ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragOver(false);
          void handleUpload(event.dataTransfer.files?.[0]);
        }}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 transition-colors ${
          isDragOver
            ? "border-emerald-400 bg-emerald-50"
            : "border-stone-300 bg-white hover:border-emerald-400"
        }`}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <Upload className="h-10 w-10 text-stone-400" />
          <div>
            <p className="text-sm font-medium text-stone-700">
              {isUploading
                ? "Đang tải tệp lên..."
                : "Kéo thả tệp vào đây hoặc bấm để chọn tệp"}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Ho tro JPG, PNG, GIF, MP4, MOV, AVI, MKV, WEBM, PDF, DOC, DOCX. Gioi han 100MB.
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.mp4,.mov,.avi,.mkv,.webm,.pdf,.doc,.docx"
            className="hidden"
            onChange={(event) => void handleUpload(event.target.files?.[0])}
          />
        </div>
      </div>

      {mediaFiles.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white py-12 text-center text-stone-400">
          {isLoading ? "Đang tải dữ liệu..." : "Chưa có tệp nào"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mediaFiles.map((file) => (
            <div
              key={file.id}
              className="group relative overflow-hidden rounded-xl border border-stone-200 bg-white"
            >
              <div className="flex h-40 items-center justify-center bg-stone-100">
                {isImageFile(file) && file.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={file.url}
                    alt={file.fileName}
                    className="h-full w-full object-cover"
                  />
                ) : isVideoFile(file) && file.url ? (
                  <video
                    src={file.url}
                    className="h-full w-full object-cover"
                    preload="metadata"
                    muted
                  />
                ) : (
                  <FileText className="h-10 w-10 text-stone-300" />
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteTarget(file)}
                className="absolute right-2 top-2 h-8 w-8 rounded-lg bg-red-500 text-white opacity-100 transition-opacity hover:bg-red-600 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <div className="space-y-1.5 p-3">
                <p className="truncate text-sm font-medium text-stone-800">
                  {file.fileName}
                </p>
                <p className="truncate text-[11px] text-stone-500">
                  Nguoi tai: {file.uploadedBy}
                </p>
                <div className="flex items-center justify-between gap-2 text-xs text-stone-500">
                  <span>{formatFileSize(file.fileSize || 0)}</span>
                  <span className="inline-flex items-center gap-1 text-stone-400">
                    <Calendar className="h-3 w-3" />
                    {format(
                      new Date(
                        file.uploadedAt ||
                          file.createdAt ||
                          new Date().toISOString(),
                      ),
                      "dd/MM/yyyy",
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.fileName}
      />
    </div>
  );
}
