"use client";

import { useMemo, useRef, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import { ConfirmDeleteModal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { mockMedia, mockUsers } from "@/lib/mock-data";
import { MediaFile } from "@/types";
import { Image as ImageIcon, Upload, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

function formatFileSize(size: number): string {
  if (size >= 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(1) + " MB";
  }
  return (size / 1024).toFixed(0) + " KB";
}

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(mockMedia);
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userNameById = useMemo(() => {
    return Object.fromEntries(mockUsers.map((u) => [u.id, u.username])) as Record<
      string,
      string
    >;
  }, []);

  const handleDelete = () => {
    if (deleteTarget) {
      setMediaFiles((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const objectUrl = URL.createObjectURL(file);
    const newMedia: MediaFile = {
      id: Date.now().toString(),
      fileName: file.name,
      filePath: objectUrl,
      type: file.type,
      uploadedBy: "1",
      uploadedAt: new Date().toISOString(),
      url: objectUrl,
      fileType: file.type,
      fileSize: file.size,
      createdAt: new Date().toISOString(),
    };
    setMediaFiles((prev) => [newMedia, ...prev]);
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const objectUrl = URL.createObjectURL(file);
    const newMedia: MediaFile = {
      id: Date.now().toString(),
      fileName: file.name,
      filePath: objectUrl,
      type: file.type,
      uploadedBy: "1",
      uploadedAt: new Date().toISOString(),
      url: objectUrl,
      fileType: file.type,
      fileSize: file.size,
      createdAt: new Date().toISOString(),
    };
    setMediaFiles((prev) => [newMedia, ...prev]);
  };

  return (
    <div>
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
          Kéo và thả file vào đây hoặc nhấn để chọn file
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
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
            <div className="h-40 bg-stone-100 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-stone-300" />
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
                Người tải: {userNameById[file.uploadedBy] || file.uploadedBy}
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

      {/* Empty State */}
      {mediaFiles.length === 0 && (
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
