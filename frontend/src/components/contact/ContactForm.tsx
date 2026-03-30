"use client";

import { FormEvent, useEffect, useState } from "react";

import { createPublicApplication } from "@/services/applicationService";
import { getProcedures } from "@/services/serviceService";

type ServiceOption = {
  id: number;
  title: string;
};

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  serviceId: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialFormData: FormData = {
  fullName: "",
  phone: "",
  email: "",
  serviceId: "",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      setIsLoadingServices(true);

      try {
        const procedures = await getProcedures();
        const options = procedures
          .map((procedure) => ({
            id: Number(procedure.id),
            title: procedure.title,
          }))
          .filter((procedure) => Number.isFinite(procedure.id));

        if (isMounted) {
          setServiceOptions(options);
        }
      } catch {
        if (isMounted) {
          setServiceOptions([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingServices(false);
        }
      }
    };

    void loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
    }
    if (!formData.serviceId.trim()) {
      newErrors.serviceId = "Vui lòng chọn dịch vụ.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Vui lòng nhập nội dung phản hồi.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitSuccess(false);
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      await createPublicApplication({
        serviceId: Number(formData.serviceId),
        applicantName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
      });

      setSubmitSuccess(true);
      setFormData(initialFormData);
      setErrors({});
    } catch {
      setSubmitError("Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: keyof FormData) =>
    `w-full rounded-lg border bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all focus:ring-2 focus:ring-[#1f7a5a]/30 ${
      errors[field] ? "border-red-500" : "border-slate-300 focus:border-[#1f7a5a]"
    }`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-2 text-2xl font-bold text-slate-900">Góp ý &amp; Liên hệ</h2>
      <p className="mb-6 text-sm text-slate-600">Vui lòng điền thông tin để gửi yêu cầu trực tiếp đến hệ thống tiếp nhận hồ sơ.</p>

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
          <label className="mb-1 block text-sm font-semibold text-slate-700">Dịch vụ cần liên hệ <span className="text-red-500">*</span></label>
          <select
            value={formData.serviceId}
            onChange={(e) => setFormData((prev) => ({ ...prev, serviceId: e.target.value }))}
            className={inputClass("serviceId")}
            disabled={isLoadingServices || serviceOptions.length === 0}
          >
            <option value="">
              {isLoadingServices ? "Đang tải danh sách dịch vụ..." : "Chọn dịch vụ"}
            </option>
            {serviceOptions.map((service) => (
              <option key={service.id} value={String(service.id)}>
                {service.title}
              </option>
            ))}
          </select>
          {errors.serviceId ? <p className="mt-1 text-xs text-red-500">{errors.serviceId}</p> : null}
          {!isLoadingServices && serviceOptions.length === 0 ? (
            <p className="mt-1 text-xs text-amber-600">Không tải được danh sách dịch vụ. Vui lòng thử tải lại trang.</p>
          ) : null}
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
          disabled={isSubmitting || isLoadingServices || serviceOptions.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-5 py-3 font-bold text-white transition-colors hover:bg-[#155a42]"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>

        {submitError ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {submitError}
          </p>
        ) : null}

        {submitSuccess ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            Đã gửi yêu cầu thành công. Chúng tôi sẽ tiếp nhận và phản hồi sớm nhất.
          </p>
        ) : null}
      </form>
    </div>
  );
}
