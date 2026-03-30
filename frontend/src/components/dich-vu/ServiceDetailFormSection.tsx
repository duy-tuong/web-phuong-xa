"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { readUserSession } from "@/lib/user-session";
import { createPublicApplication } from "@/services/applicationService";
import type { ProcedureDetail } from "@/types/service";

type ServiceDetailFormSectionProps = {
  id: string;
  procedure?: ProcedureDetail;
};

type FormState = {
  applicantName: string;
  phone: string;
  email: string;
};

type AttachmentItem = {
  id: string;
  file: File;
};

const INITIAL_FORM: FormState = {
  applicantName: "",
  phone: "",
  email: "",
};

export default function ServiceDetailFormSection({ id, procedure }: ServiceDetailFormSectionProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [attachmentMessage, setAttachmentMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const acceptedFileTypes = useMemo(
    () => [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".gif"],
    [],
  );

  useEffect(() => {
    const session = readUserSession();
    if (!session) {
      return;
    }

    setForm((current) => ({
      applicantName: current.applicantName || session.fullName || session.username || "",
      phone: current.phone || session.phone || "",
      email: current.email || session.email || "",
    }));
  }, []);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setAttachments([]);
    setAccepted(false);
    setErrorMessage("");
    setAttachmentMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const appendAttachments = (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    const invalidFile = files.find((file) => {
      const normalizedName = file.name.toLowerCase();
      return !acceptedFileTypes.some((extension) => normalizedName.endsWith(extension));
    });

    if (invalidFile) {
      setAttachmentMessage("Chỉ hỗ trợ PDF, DOC, DOCX, JPG, JPEG, PNG hoặc GIF.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const mappedFiles = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${file.size}`,
      file,
    }));

    setAttachments((current) => {
      const merged = [...current];

      for (const item of mappedFiles) {
        if (!merged.some((existing) => existing.id === item.id)) {
          merged.push(item);
        }
      }

      return merged;
    });

    setAttachmentMessage(
      "Tệp đã được thêm vào danh sách chuẩn bị hồ sơ. API hiện tại chưa hỗ trợ lưu tài liệu đính kèm lên máy chủ.",
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAttachmentSelect = (event: ChangeEvent<HTMLInputElement>) => {
    appendAttachments(Array.from(event.target.files || []));
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments((current) => current.filter((item) => item.id !== attachmentId));
  };

  const handleSubmit = async () => {
    if (isSubmitting || !procedure?.id) {
      return;
    }

    const payload = {
      serviceId: procedure.id,
      applicantName: form.applicantName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
    };

    if (!payload.applicantName || !payload.phone || !payload.email) {
      setErrorMessage("Vui lòng nhập đầy đủ họ tên, số điện thoại và email.");
      return;
    }

    if (!accepted) {
      setErrorMessage("Bạn cần xác nhận thông tin trước khi gửi hồ sơ.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await createPublicApplication(payload);
      setApplicationId(String(response.applicationId));
      setIsSuccess(true);
      if (attachments.length > 0) {
        setAttachmentMessage(
          "Hồ sơ đã gửi thành công, nhưng tài liệu đính kèm vẫn chưa được lưu vì API hiện tại chưa hỗ trợ upload cho người dùng.",
        );
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể gửi hồ sơ lúc này.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!procedure) {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm lg:w-2/3">
        <h3 className="text-xl font-bold text-slate-900">Không tìm thấy thủ tục</h3>
        <p className="mt-3 text-sm text-slate-600">
          Thủ tục bạn chọn hiện không tồn tại hoặc chưa được đồng bộ từ backend.
        </p>
        <Link
          href="/dich-vu"
          className="mt-5 inline-flex rounded-xl bg-[#1f7a5a] px-5 py-2.5 font-semibold text-white hover:bg-[#155a42]"
        >
          Quay về danh sách thủ tục
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 lg:w-2/3">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-lg bg-[#1f7a5a]/10 p-3 text-[#1f7a5a]">
            <span className="material-symbols-outlined">description</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Thông tin thủ tục</h3>
            <p className="mt-1 text-sm text-slate-600">
              Bạn đang nộp hồ sơ cho thủ tục {procedure.title.toLowerCase()}.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Thời gian xử lý</p>
            <p className="mt-2 font-bold text-slate-900">{procedure.processingTime}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Lệ phí</p>
            <p className="mt-2 font-bold text-slate-900">{procedure.fee}</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-slate-900">Thành phần hồ sơ</p>
            {procedure.wordTemplateHref && procedure.wordTemplateHref !== "#" ? (
              <a
                href={procedure.wordTemplateHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Tải biểu mẫu đính kèm
              </a>
            ) : null}
          </div>

          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {procedure.requirements.length > 0 ? (
              procedure.requirements.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li>Thông tin thành phần hồ sơ đang được cập nhật.</li>
            )}
          </ul>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-lg bg-[#1f7a5a]/10 p-3 text-[#1f7a5a]">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Thông tin người nộp</h3>
            <p className="mt-1 text-sm text-slate-600">
              Hiện backend mới lưu thông tin liên hệ cơ bản, nên mình ưu tiên kết nối đúng phần này để bạn nộp hồ sơ thật.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Họ và tên <span className="text-[#db2777]">*</span>
            </label>
            <input
              type="text"
              value={form.applicantName}
              onChange={(event) => handleChange("applicantName", event.target.value)}
              placeholder="Ví dụ: Nguyễn Văn A"
              className="h-12 w-full rounded-xl border-slate-300 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-500 focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Số điện thoại <span className="text-[#db2777]">*</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              placeholder="Nhập số điện thoại liên hệ"
              className="h-12 w-full rounded-xl border-slate-300 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-500 focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Email <span className="text-[#db2777]">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="example@email.com"
              className="h-12 w-full rounded-xl border-slate-300 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-500 focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
            />
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-lg bg-[#1f7a5a]/10 p-3 text-[#1f7a5a]">
            <span className="material-symbols-outlined">upload_file</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Tài liệu đính kèm</h3>
            <p className="mt-1 text-sm text-slate-600">
              Khu này dùng chung cho mọi biểu mẫu chi tiết hồ sơ để người dùng chuẩn bị giấy tờ cần nộp.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          API nộp hồ sơ hiện tại chỉ lưu thông tin liên hệ cơ bản. Mình đã kiểm tra trực tiếp và gửi file lên
          <code className="mx-1 rounded bg-white/70 px-1.5 py-0.5 text-[12px]">/api/applications</code>
          đang trả về <strong>415 Unsupported Media Type</strong>, nên tài liệu bên dưới mới ở trạng thái chuẩn bị,
          chưa được lưu thật lên máy chủ.
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFileTypes.join(",")}
            onChange={handleAttachmentSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDraggingFiles(true);
            }}
            onDragLeave={() => setIsDraggingFiles(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDraggingFiles(false);
              appendAttachments(Array.from(event.dataTransfer.files || []));
            }}
            className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
              isDraggingFiles
                ? "border-emerald-500 bg-emerald-50"
                : "border-slate-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/40"
            }`}
          >
            <span className="material-symbols-outlined text-5xl text-[#1f7a5a]">upload_file</span>
            <p className="mt-4 text-base font-bold text-slate-900">Kéo thả tài liệu vào đây</p>
            <p className="mt-2 text-sm text-slate-600">
              hoặc bấm để chọn tệp từ máy tính
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Hỗ trợ: {acceptedFileTypes.join(", ")}
            </p>
          </button>

          {attachments.length > 0 ? (
            <div className="mt-5 space-y-3">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{attachment.file.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {(attachment.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttachment(attachment.id)}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Gỡ tệp
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              Chưa có tệp nào được chọn. Bạn có thể thêm bản scan giấy tờ, biểu mẫu hoặc ảnh hồ sơ để kiểm tra giao diện.
            </p>
          )}

          {attachmentMessage ? (
            <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
              {attachmentMessage}
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <label className="mb-8 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-0.5 size-5 rounded border-slate-300 text-[#1f7a5a] focus:ring-[#1f7a5a]"
          />
          <span className="text-sm leading-relaxed text-slate-900">
            Tôi xác nhận thông tin liên hệ trên là chính xác để hệ thống tiếp nhận hồ sơ và gửi kết quả tra cứu.
          </span>
        </label>

        <div className="flex flex-col items-center justify-end gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-100 sm:w-auto"
          >
            Nhập lại
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f7a5a] px-8 py-3 font-bold text-white shadow-lg shadow-[#1f7a5a]/30 transition-colors hover:bg-[#0f5f46] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Đang gửi...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">send</span>
                Gửi hồ sơ
              </>
            )}
          </button>
        </div>
      </section>

      <section className="rounded-r-xl border-l-4 border-[#1f7a5a] bg-gradient-to-r from-[#1f7a5a]/5 to-transparent p-6">
        <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="material-symbols-outlined text-[#1f7a5a]">analytics</span>
          Theo dõi trạng thái
        </h3>
        <p className="mb-4 text-sm text-slate-600">
          Sau khi nộp, bạn có thể tra cứu hồ sơ theo số điện thoại và email. Mã thủ tục hiện tại: {id}.
        </p>
        <Link
          href={`/dich-vu/tra-cuu?phone=${encodeURIComponent(form.phone)}&email=${encodeURIComponent(form.email)}`}
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1f7a5a]"
        >
          Đến trang tra cứu
        </Link>
      </section>

      {isSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-center shadow-2xl">
            <span className="material-symbols-outlined mb-3 text-6xl text-emerald-600">check_circle</span>
            <h3 className="mb-2 text-2xl font-bold text-slate-900">Nộp hồ sơ thành công</h3>
            <p className="mb-6 text-slate-600">
              Hệ thống đã tiếp nhận hồ sơ của bạn. Mã hồ sơ vừa tạo là <strong>HS-{applicationId.padStart(6, "0")}</strong>.
            </p>
            {attachments.length > 0 ? (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-800">
                Các tài liệu bạn đã chọn hiện chưa được lưu lên máy chủ vì API chưa hỗ trợ upload file cho hồ sơ công dân.
              </div>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/dich-vu/tra-cuu?phone=${encodeURIComponent(form.phone)}&email=${encodeURIComponent(form.email)}`}
                className="rounded-lg bg-[#1f7a5a] px-5 py-2.5 font-semibold text-white hover:bg-[#155a42]"
              >
                Tra cứu hồ sơ
              </Link>
              <Link
                href="/trang-ca-nhan"
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Đến trang cá nhân
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
