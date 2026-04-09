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
  updateMediaDescription,
  updateMediaVisibility,
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [filterType, setFilterType] = useState<
    "all" | "image" | "video" | "file"
  >("all");
  const [uploadDescription, setUploadDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await fetchMediaAdmin({ page, pageSize });
      setMediaFiles(response.data);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.total || 0);
    } catch (loadError) {
      setErrorMessage(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleUpload = async (file?: File | null) => {
    if (!file) {
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage("");
      await uploadMedia(file, uploadDescription);
      await loadMedia();
    } catch (uploadError) {
      setErrorMessage(getErrorMessage(uploadError));
    } finally {
      setIsUploading(false);
      setUploadDescription("");
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

  const handleVisibilityToggle = async (file: MediaFile) => {
    try {
      setErrorMessage("");
      await updateMediaVisibility(file.id, !file.isPublic);
      await loadMedia();
    } catch (toggleError) {
      setErrorMessage(getErrorMessage(toggleError));
    }
  };

  const startEditDescription = (file: MediaFile) => {
    setEditingId(file.id);
    setEditingDescription(file.description || "");
  };

  const cancelEditDescription = () => {
    setEditingId(null);
    setEditingDescription("");
  };

  const saveDescription = async (file: MediaFile) => {
    try {
      setErrorMessage("");
      await updateMediaDescription(file.id, editingDescription);
      await loadMedia();
      cancelEditDescription();
    } catch (editError) {
      setErrorMessage(getErrorMessage(editError));
    }
  };

  const filteredMediaFiles = mediaFiles.filter((file) => {
    if (filterType === "all") return true;
    if (filterType === "image") return isImageFile(file);
    if (filterType === "video") return isVideoFile(file);
    return !isImageFile(file) && !isVideoFile(file);
  });

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ImageIcon}
        title="Thư viện media"
        description={
          isLoading
            ? "Đang tải tệp media..."
            : `${totalItems} tệp đã đồng bộ với backend`
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
              Ho tro JPG, PNG, GIF, MP4, MOV, AVI, MKV, WEBM, PDF, DOC, DOCX.
              Gioi han 100MB.
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

      <div className="rounded-xl border border-stone-200 bg-white p-4">
        <label className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Mô tả media (hiện trên trang chủ)
        </label>
        <textarea
          value={uploadDescription}
          onChange={(event) => setUploadDescription(event.target.value)}
          rows={2}
          placeholder="Nhập mô tả ngắn cho hình ảnh/video"
          className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        <p className="mt-2 text-xs text-stone-500">
          Mô tả sẽ gắn vào tệp media được tải lên tiếp theo.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { key: "all", label: "Tất cả" },
            { key: "image", label: "Hình ảnh" },
            { key: "video", label: "Video" },
            { key: "file", label: "File" },
          ] as const
        ).map((option) => (
          <Button
            key={option.key}
            type="button"
            variant={filterType === option.key ? "default" : "outline"}
            className={
              filterType === option.key
                ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                : "border-stone-200 text-stone-600"
            }
            onClick={() => setFilterType(option.key)}
          >
            {option.label}
          </Button>
        ))}
        <span className="text-xs text-stone-500">
          {filteredMediaFiles.length} / {mediaFiles.length} tệp
        </span>
      </div>

      {filteredMediaFiles.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white py-12 text-center text-stone-400">
          {isLoading ? "Đang tải dữ liệu..." : "Chưa có tệp nào"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMediaFiles.map((file) => (
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
                {editingId === file.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingDescription}
                      onChange={(event) =>
                        setEditingDescription(event.target.value)
                      }
                      rows={2}
                      className="w-full rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      placeholder="Nhap mo ta"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        className="h-7 bg-emerald-700 px-2 text-xs text-white hover:bg-emerald-800"
                        onClick={() => saveDescription(file)}
                      >
                        Lưu
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={cancelEditDescription}
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {file.description ? (
                      <p className="line-clamp-2 text-xs text-stone-500">
                        {file.description}
                      </p>
                    ) : (
                      <p className="text-xs text-stone-400">Chưa có mô tả</p>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs"
                      onClick={() => startEditDescription(file)}
                    >
                      Sửa mô tả
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={
                      file.isPublic
                        ? "rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700"
                        : "rounded-full bg-stone-100 px-2 py-0.5 text-stone-600"
                    }
                  >
                    {file.isPublic ? "Đã duyệt" : "Chờ duyệt"}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => handleVisibilityToggle(file)}
                  >
                    {file.isPublic
                      ? "Ẩn khỏi trang chủ"
                      : "Duyệt lên trang chủ"}
                  </Button>
                </div>
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-stone-500">
          Trang {page} / {totalPages} • {totalItems} tệp
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border border-stone-200 bg-white px-2 text-sm"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            {[12, 24, 36, 48].map((size) => (
              <option key={size} value={size}>
                {size} / trang
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages}
          >
            Sau
          </Button>
        </div>
      </div>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.fileName}
      />
    </div>
  );
}
