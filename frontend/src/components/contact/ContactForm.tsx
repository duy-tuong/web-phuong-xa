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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
    }
    if (!formData.category.trim()) {
      newErrors.category = "Vui lòng chọn chuyên mục.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Vui lòng nhập nội dung phản hồi.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitSuccess(false);

    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData(initialFormData);
      setErrors({});
    }, 1500);
  };

  const inputClass = (field: keyof FormData) =>
    `w-full rounded-lg border bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all focus:ring-2 focus:ring-[#1f7a5a]/30 ${
      errors[field] ? "border-red-500" : "border-slate-300 focus:border-[#1f7a5a]"
    }`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-2 text-2xl font-bold text-slate-900">Góp ý &amp; Liên hệ</h2>
      <p className="mb-6 text-sm text-slate-600">Vui lòng điền thông tin để gửi phản ánh, kiến nghị hoặc góp ý.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
            className={inputClass("fullName")}
            placeholder="Nhập họ và tên"
          />
          {errors.fullName ? <p className="mt-1 text-xs text-red-500">{errors.fullName}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            className={inputClass("phone")}
            placeholder="Nhập số điện thoại"
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
          <label className="mb-1 block text-sm font-semibold text-slate-700">Chuyên mục <span className="text-red-500">*</span></label>
          <select
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            className={inputClass("category")}
          >
            <option value="">Chọn chuyên mục</option>
            <option value="hanh-chinh">Thủ tục hành chính</option>
            <option value="ha-tang">Hạ tầng - đô thị</option>
            <option value="an-sinh">An sinh xã hội</option>
            <option value="khac">Khác</option>
          </select>
          {errors.category ? <p className="mt-1 text-xs text-red-500">{errors.category}</p> : null}
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Nội dung <span className="text-red-500">*</span></label>
          <textarea
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
            className={inputClass("message")}
            placeholder="Nhập nội dung phản hồi"
          />
          {errors.message ? <p className="mt-1 text-xs text-red-500">{errors.message}</p> : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-5 py-3 font-bold text-white transition-colors hover:bg-[#155a42] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Đang gửi...
            </>
          ) : (
            "Gửi phản hồi"
          )}
        </button>

        {submitSuccess ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            Gửi phản hồi thành công. Cảm ơn bạn đã đóng góp ý kiến.
          </p>
        ) : null}
      </form>
    </div>
  );
}
