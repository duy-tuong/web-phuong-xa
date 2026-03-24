"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import PageHeader from "@/components/admin/PageHeader";
import { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { MediaFile } from "@/types";
import { Image as ImageIcon, Upload, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import api from "@/services/api";

type MediaApiItem = {
  id?: number | string;
  Id?: number | string;
  fileName?: string;
  FileName?: string;
  filePath?: string;
  FilePath?: string;
  type?: string;
  Type?: string;
  uploadedBy?: string;
  UploadedBy?: string;
  uploadedAt?: string;
  UploadedAt?: string;
  url?: string;
  Url?: string;
  fileType?: string;
  FileType?: string;
  fileSize?: number;
  FileSize?: number;
  createdAt?: string;
  CreatedAt?: string;
};

function formatFileSize(size: number): string {
  if (size >= 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(1) + " MB";
  }
  return (size / 1024).toFixed(0) + " KB";
}

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolvePublicUrl = (value: string) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    const base = api.defaults.baseURL ?? "";
    const origin = base.replace(/\/api\/?$/, "");
    return origin ? `${origin}${value}` : value;
  };

  const isImageFile = (file: MediaFile) => {
    const type = (file.fileType || file.type || "").toLowerCase();
    if (type.startsWith("image/")) return true;
    const name = (file.fileName || "").toLowerCase();
    return name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".gif") || name.endsWith(".webp");
  };

  const fetchMedia = useCallback(
    async (nextPage = page, nextPageSize = pageSize) => {
      const res = await api.get("/media", {
        params: { page: nextPage, pageSize: nextPageSize },
      });
      const payload = res.data ?? {};
      const data = Array.isArray(payload.data) ? (payload.data as MediaApiItem[]) : [];
      const mapped = data.map((file: MediaApiItem) => ({
        id: String(file.id ?? file.Id ?? ""),
        fileName: file.fileName ?? file.FileName ?? "",
        filePath: file.filePath ?? file.FilePath ?? "",
        type: file.type ?? file.Type ?? "",
        uploadedBy: file.uploadedBy ?? file.UploadedBy ?? "",
        uploadedAt: file.uploadedAt ?? file.UploadedAt ?? new Date().toISOString(),
        url: file.url ?? file.Url ?? undefined,
        fileType: file.fileType ?? file.FileType ?? "",
        fileSize: file.fileSize ?? file.FileSize ?? undefined,
        createdAt: file.createdAt ?? file.CreatedAt ?? undefined,
      })) as MediaFile[];

      setMediaFiles(mapped);
      setTotalPages(Number(payload.totalPages ?? 1) || 1);
    },
    [page, pageSize],
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        await fetchMedia(1, pageSize);
        if (mounted) {
          setPage(1);
        }
      } catch {
        if (!mounted) return;
        setErrorMessage("Không thể tải thư viện media.");
      } finally {
        if (!mounted) return;
        setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [fetchMedia, pageSize]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        await fetchMedia(page, pageSize);
      } catch {
        setErrorMessage("Không thể tải thư viện media.");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [fetchMedia, page, pageSize]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setErrorMessage("");
    try {
      await api.delete(`/media/${deleteTarget.id}`);
      await fetchMedia(page, pageSize);
      setDeleteTarget(null);
    } catch {
      setErrorMessage("Xóa tập tin thất bại.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    setErrorMessage("");
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post("/media/upload", formData);
      await fetchMedia(page, pageSize);
    } catch {
      setErrorMessage("Tải tệp thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    await uploadFile(file);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    await uploadFile(file);
  };

  return (
    <div>
      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}
      <PageHeader
        icon={ImageIcon}
        title="Thư viện Media"
        description="Quản lý hình ảnh và tập tin"
      />

      {/* Upload Zone */}
      <div
        onClick={handleUploadClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 mb-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
          isDragOver
            ? "border-emerald-400 bg-emerald-50"
            : "border-stone-300 hover:border-emerald-400 bg-white"
        }`}
      >
        <Upload className="w-10 h-10 text-stone-400" />
        <p className="text-sm text-stone-500 text-center">
          {isUploading ? "Đang tải tệp..." : "Kéo và thả file vào đây hoặc nhấn để chọn file"}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {mediaFiles.map((file) => (
          <div
            key={file.id}
            className="rounded-xl border border-stone-200 bg-white overflow-hidden relative group"
          >
            {/* Image Preview Placeholder */}
            <div className="h-40 bg-stone-100 flex items-center justify-center overflow-hidden">
              {isImageFile(file) ? (
                <Image
                  src={resolvePublicUrl(file.filePath || file.url || "")}
                  alt={file.fileName}
                  width={600}
                  height={400}
                  sizes="(max-width: 640px) 100vw, 240px"
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="w-10 h-10 text-stone-300" />
              )}
            </div>

            {/* Delete Button Overlay */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteTarget(file)}
              className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-lg w-8 h-8"
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            {/* File Info */}
            <div className="p-3">
              <p className="text-sm font-medium text-stone-800 truncate">
                {file.fileName}
              </p>
              <p className="text-[11px] text-stone-500 mt-1 truncate">
                Người tải: {file.uploadedBy || "--"}
              </p>
              <div className="flex items-center justify-between mt-1 gap-2">
                <span className="text-xs text-stone-500">
                  {formatFileSize(file.fileSize || 0)}
                </span>
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(
                    new Date(file.uploadedAt || file.createdAt || new Date().toISOString()),
                    "dd/MM/yyyy"
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-stone-500">
          Trang {page} / {totalPages}
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
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size} / trang
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1 || isLoading}
          >
            Trước
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages || isLoading}
          >
            Sau
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {!isLoading && mediaFiles.length === 0 && (
        <div className="text-center py-12 text-stone-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-stone-300" />
          <p className="text-sm">Chưa có tập tin nào</p>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.fileName}
      />
    </div>
  );
}
