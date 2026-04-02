"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2, RotateCcw, Trash2, Upload, X } from "lucide-react";

import { getErrorMessage } from "@/services/admin/errors";
import { updateCurrentUser } from "@/services/admin/profile";
import api from "@/services/api";
import type { User } from "@/types";

type ProfileUpdateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSaved: (user: User) => void;
};

type ImageSize = {
  width: number;
  height: number;
};

type FieldErrors = Partial<Record<"avatar" | "fullName" | "email" | "phone" | "currentPassword" | "newPassword", string>>;

const PREVIEW_SIZE = 160;
const OUTPUT_SIZE = 320;

async function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Không thể đọc tệp ảnh."));
    reader.readAsDataURL(file);
  });
}

async function loadImageSize(src: string) {
  return new Promise<ImageSize>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("Không thể tải ảnh để chỉnh sửa."));
    image.src = src;
  });
}

async function renderAvatarDataUrl(input: {
  src: string;
  scale: number;
  offsetX: number;
  offsetY: number;
}) {
  const size = await loadImageSize(input.src);
  const image = new window.Image();

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Không thể xử lý ảnh đại diện."));
    image.src = input.src;
  });

  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Không thể khởi tạo vùng xử lý ảnh.");
  }

  const baseScale = Math.max(OUTPUT_SIZE / size.width, OUTPUT_SIZE / size.height);
  const drawWidth = size.width * baseScale * input.scale;
  const drawHeight = size.height * baseScale * input.scale;
  const drawX = (OUTPUT_SIZE - drawWidth) / 2 + input.offsetX * (OUTPUT_SIZE / PREVIEW_SIZE);
  const drawY = (OUTPUT_SIZE - drawHeight) / 2 + input.offsetY * (OUTPUT_SIZE / PREVIEW_SIZE);

  context.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

  return canvas.toDataURL("image/jpeg", 0.92);
}

function dataUrlToFile(dataUrl: string, fileName: string) {
  const [header, data] = dataUrl.split(",");
  const mimeMatch = header.match(/data:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const binary = atob(data);
  const buffer = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    buffer[i] = binary.charCodeAt(i);
  }

  return new File([buffer], fileName, { type: mimeType });
}

function validateForm(input: {
  fullName: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
}) {
  const errors: FieldErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9+\s()-]{8,20}$/;

  if (!input.fullName.trim()) {
    errors.fullName = "Vui lòng nhập họ và tên.";
  }

  if (!input.email.trim()) {
    errors.email = "Vui lòng nhập email.";
  } else if (!emailPattern.test(input.email.trim())) {
    errors.email = "Email không đúng định dạng.";
  }

  if (input.phone.trim() && !phonePattern.test(input.phone.trim())) {
    errors.phone = "Số điện thoại không hợp lệ.";
  }

  if (input.newPassword.trim() && input.newPassword.trim().length < 6) {
    errors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự.";
  }

  if (input.newPassword.trim() && !input.currentPassword.trim()) {
    errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu.";
  }

  if (input.currentPassword.trim() && !input.newPassword.trim()) {
    errors.newPassword = "Vui lòng nhập mật khẩu mới.";
  }

  return errors;
}

function getInputClassName(hasError: boolean) {
  return hasError
    ? "w-full rounded-xl border border-red-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
    : "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";
}

export default function ProfileUpdateModal({ isOpen, onClose, user, onSaved }: ProfileUpdateModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    email: user.email,
    phone: user.phone || "",
    currentPassword: "",
    newPassword: "",
  });
  const [avatarSource, setAvatarSource] = useState(user.avatarUrl || "");
  const [avatarSize, setAvatarSize] = useState<ImageSize | null>(null);
  const [avatarScale, setAvatarScale] = useState(1);
  const [avatarOffsetX, setAvatarOffsetX] = useState(0);
  const [avatarOffsetY, setAvatarOffsetY] = useState(0);
  const [avatarWasEdited, setAvatarWasEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setFormData({
      fullName: user.fullName || "",
      email: user.email,
      phone: user.phone || "",
      currentPassword: "",
      newPassword: "",
    });
    setAvatarSource(user.avatarUrl || "");
    setAvatarScale(1);
    setAvatarOffsetX(0);
    setAvatarOffsetY(0);
    setAvatarWasEdited(false);
    setFieldErrors({});
    setFormError("");
  }, [user, isOpen]);

  useEffect(() => {
    let isMounted = true;

    if (!avatarSource) {
      setAvatarSize(null);
      return () => {
        isMounted = false;
      };
    }

    void loadImageSize(avatarSource)
      .then((size) => {
        if (isMounted) {
          setAvatarSize(size);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAvatarSize(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [avatarSource]);

  const previewStyle = useMemo(() => {
    if (!avatarSource || !avatarSize) {
      return null;
    }

    const baseScale = Math.max(PREVIEW_SIZE / avatarSize.width, PREVIEW_SIZE / avatarSize.height);
    const drawWidth = avatarSize.width * baseScale * avatarScale;
    const drawHeight = avatarSize.height * baseScale * avatarScale;
    const left = (PREVIEW_SIZE - drawWidth) / 2 + avatarOffsetX;
    const top = (PREVIEW_SIZE - drawHeight) / 2 + avatarOffsetY;

    return {
      width: `${drawWidth}px`,
      height: `${drawHeight}px`,
      left: `${left}px`,
      top: `${top}px`,
    };
  }, [avatarOffsetX, avatarOffsetY, avatarScale, avatarSize, avatarSource]);

  if (!isOpen) return null;

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    setFormError("");
  };

  const handleAvatarFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({ ...prev, avatar: "Vui lòng chọn đúng tệp ảnh." }));
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setAvatarSource(dataUrl);
      setAvatarScale(1);
      setAvatarOffsetX(0);
      setAvatarOffsetY(0);
      setAvatarWasEdited(true);
      setFieldErrors((prev) => ({ ...prev, avatar: "" }));
      setFormError("");
    } catch (error) {
      setFieldErrors((prev) => ({ ...prev, avatar: getErrorMessage(error) }));
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextFieldErrors = validateForm(formData);

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setFormError("");
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError("");

    try {
      let nextAvatarUrl = user.avatarUrl || "";

      if (avatarWasEdited) {
        if (!avatarSource) {
          nextAvatarUrl = "";
        } else {
          const renderedDataUrl = await renderAvatarDataUrl({
            src: avatarSource,
            scale: avatarScale,
            offsetX: avatarOffsetX,
            offsetY: avatarOffsetY,
          });
          if (renderedDataUrl.startsWith("data:")) {
            const avatarFile = dataUrlToFile(renderedDataUrl, `avatar-${user.id}.jpg`);
            const uploadData = new FormData();
            uploadData.append("file", avatarFile);
            const uploadResponse = await api.post("/media/avatar", uploadData);
            nextAvatarUrl = uploadResponse.data?.url || "";
          } else {
            nextAvatarUrl = renderedDataUrl;
          }
        }
      }

      const updatedUser = await updateCurrentUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        avatarUrl: nextAvatarUrl || undefined,
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined,
      });

      onSaved(updatedUser);
      onClose();
    } catch (error) {
      const message = getErrorMessage(error);
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes("email")) {
        setFieldErrors((prev) => ({ ...prev, email: message }));
      } else if (lowerMessage.includes("current password")) {
        setFieldErrors((prev) => ({ ...prev, currentPassword: message }));
      } else if (lowerMessage.includes("password")) {
        setFieldErrors((prev) => ({ ...prev, newPassword: message }));
      } else {
        setFormError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-[221] max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Cập nhật thông tin tài khoản</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Đóng modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-82px)] overflow-y-auto px-5 py-5 sm:px-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {formError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>
            ) : null}

            <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-sm">
                    {avatarSource && previewStyle ? (
                      <img
                        src={avatarSource}
                        alt="Xem trước avatar"
                        className="absolute max-w-none object-cover"
                        style={previewStyle}
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500">
                        <ImagePlus className="h-8 w-8" />
                        <span className="text-xs font-medium">Chưa có avatar</span>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFileChange}
                  />

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Tải ảnh lên
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarSource("");
                        setAvatarScale(1);
                        setAvatarOffsetX(0);
                        setAvatarOffsetY(0);
                        setAvatarWasEdited(true);
                        setFieldErrors((prev) => ({ ...prev, avatar: "" }));
                      }}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa ảnh
                    </button>
                  </div>

                  {fieldErrors.avatar ? <p className="text-center text-sm text-red-600">{fieldErrors.avatar}</p> : null}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Căn chỉnh avatar</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Kéo thanh zoom và canh vị trí đến khi thấy vừa ý rồi bấm lưu thay đổi.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Phóng to</span>
                      <input
                        type="range"
                        min="1"
                        max="2.5"
                        step="0.05"
                        value={avatarScale}
                        onChange={(event) => {
                          setAvatarScale(Number(event.target.value));
                          setAvatarWasEdited(true);
                        }}
                        className="w-full accent-emerald-700"
                        disabled={!avatarSource}
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Dịch ngang</span>
                      <input
                        type="range"
                        min="-80"
                        max="80"
                        step="1"
                        value={avatarOffsetX}
                        onChange={(event) => {
                          setAvatarOffsetX(Number(event.target.value));
                          setAvatarWasEdited(true);
                        }}
                        className="w-full accent-emerald-700"
                        disabled={!avatarSource}
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Dịch dọc</span>
                      <input
                        type="range"
                        min="-80"
                        max="80"
                        step="1"
                        value={avatarOffsetY}
                        onChange={(event) => {
                          setAvatarOffsetY(Number(event.target.value));
                          setAvatarWasEdited(true);
                        }}
                        className="w-full accent-emerald-700"
                        disabled={!avatarSource}
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAvatarScale(1);
                      setAvatarOffsetX(0);
                      setAvatarOffsetY(0);
                      setAvatarWasEdited(true);
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    disabled={!avatarSource}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Đặt lại khung ảnh
                  </button>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Họ và tên</span>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  className={getInputClassName(Boolean(fieldErrors.fullName))}
                />
                {fieldErrors.fullName ? <p className="text-sm text-red-600">{fieldErrors.fullName}</p> : null}
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className={getInputClassName(Boolean(fieldErrors.email))}
                />
                {fieldErrors.email ? <p className="text-sm text-red-600">{fieldErrors.email}</p> : null}
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Số điện thoại</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className={getInputClassName(Boolean(fieldErrors.phone))}
                />
                {fieldErrors.phone ? <p className="text-sm text-red-600">{fieldErrors.phone}</p> : null}
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Địa chỉ cư trú</span>
                <input
                  type="text"
                  value="Backend hiện chưa có field lưu địa chỉ"
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Mật khẩu hiện tại</span>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(event) => updateField("currentPassword", event.target.value)}
                  className={getInputClassName(Boolean(fieldErrors.currentPassword))}
                />
                {fieldErrors.currentPassword ? <p className="text-sm text-red-600">{fieldErrors.currentPassword}</p> : null}
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Mật khẩu mới</span>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(event) => updateField("newPassword", event.target.value)}
                  className={getInputClassName(Boolean(fieldErrors.newPassword))}
                />
                {fieldErrors.newPassword ? <p className="text-sm text-red-600">{fieldErrors.newPassword}</p> : null}
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
