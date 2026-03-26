"use client";

import { FormEvent, useState } from "react";

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  category: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialFormData: FormData = {
  fullName: "",
  phone: "",
  email: "",
  category: "",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui long nhap ho va ten.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui long nhap so dien thoai.";
    }
    if (!formData.category.trim()) {
      newErrors.category = "Vui long chon chuyen muc.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Vui long nhap noi dung phan hoi.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitSuccess(false);

    if (!validateForm()) {
      return;
    }

    const subject = `[${formData.category}] Phan anh tu ${formData.fullName.trim()}`;
    const body = [
      `Ho va ten: ${formData.fullName.trim()}`,
      `So dien thoai: ${formData.phone.trim()}`,
      `Email: ${formData.email.trim() || "Khong cung cap"}`,
      "",
      "Noi dung:",
      formData.message.trim(),
    ].join("\n");

    window.location.href = `mailto:contact@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitSuccess(true);
    setFormData(initialFormData);
    setErrors({});
  };

  const inputClass = (field: keyof FormData) =>
    `w-full rounded-lg border bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all focus:ring-2 focus:ring-[#1f7a5a]/30 ${
      errors[field] ? "border-red-500" : "border-slate-300 focus:border-[#1f7a5a]"
    }`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-2 text-2xl font-bold text-slate-900">Gop y &amp; Lien he</h2>
      <p className="mb-6 text-sm text-slate-600">Vui long dien thong tin de gui phan anh, kien nghi hoac gop y.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Ho va ten <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
            className={inputClass("fullName")}
            placeholder="Nhap ho va ten"
          />
          {errors.fullName ? <p className="mt-1 text-xs text-red-500">{errors.fullName}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">So dien thoai <span className="text-red-500">*</span></label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            className={inputClass("phone")}
            placeholder="Nhap so dien thoai"
          />
          {errors.phone ? <p className="mt-1 text-xs text-red-500">{errors.phone}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className={inputClass("email")}
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Chuyen muc <span className="text-red-500">*</span></label>
          <select
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            className={inputClass("category")}
          >
            <option value="">Chon chuyen muc</option>
            <option value="hanh-chinh">Thu tuc hanh chinh</option>
            <option value="ha-tang">Ha tang - do thi</option>
            <option value="an-sinh">An sinh xa hoi</option>
            <option value="khac">Khac</option>
          </select>
          {errors.category ? <p className="mt-1 text-xs text-red-500">{errors.category}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Noi dung <span className="text-red-500">*</span></label>
          <textarea
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
            className={inputClass("message")}
            placeholder="Nhap noi dung phan hoi"
          />
          {errors.message ? <p className="mt-1 text-xs text-red-500">{errors.message}</p> : null}
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-5 py-3 font-bold text-white transition-colors hover:bg-[#155a42]"
        >
          Gui phan hoi
        </button>

        {submitSuccess ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            Da mo ung dung email de gui phan hoi. Neu may khong co ung dung mail, ban co the lien he truc tiep qua thong tin tren trang lien he.
          </p>
        ) : null}
      </form>
    </div>
  );
}
