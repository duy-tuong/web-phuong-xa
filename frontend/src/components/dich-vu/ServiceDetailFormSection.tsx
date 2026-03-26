"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { createPublicApplication } from "@/services/applicationService";
import { readUserSession } from "@/lib/user-session";
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

const INITIAL_FORM: FormState = {
  applicantName: "",
  phone: "",
  email: "",
};

export default function ServiceDetailFormSection({ id, procedure }: ServiceDetailFormSectionProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    setAccepted(false);
    setErrorMessage("");
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
      setErrorMessage("Vui long nhap day du ho ten, so dien thoai va email.");
      return;
    }

    if (!accepted) {
      setErrorMessage("Ban can xac nhan thong tin truoc khi gui ho so.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await createPublicApplication(payload);
      setApplicationId(String(response.applicationId));
      setIsSuccess(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Khong the gui ho so luc nay.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!procedure) {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm lg:w-2/3">
        <h3 className="text-xl font-bold text-slate-900">Khong tim thay thu tuc</h3>
        <p className="mt-3 text-sm text-slate-600">
          Thu tuc ban chon hien khong ton tai hoac chua duoc dong bo tu backend.
        </p>
        <Link
          href="/dich-vu/nop-ho-so"
          className="mt-5 inline-flex rounded-xl bg-[#1f7a5a] px-5 py-2.5 font-semibold text-white hover:bg-[#155a42]"
        >
          Quay ve danh sach thu tuc
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
            <h3 className="text-xl font-bold text-slate-900">Thong tin thu tuc</h3>
            <p className="mt-1 text-sm text-slate-600">
              Ban dang nop ho so cho thu tuc {procedure.title.toLowerCase()}.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Thoi gian xu ly</p>
            <p className="mt-2 font-bold text-slate-900">{procedure.processingTime}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Le phi</p>
            <p className="mt-2 font-bold text-slate-900">{procedure.fee}</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-bold text-slate-900">Thanh phan ho so</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {procedure.requirements.length > 0 ? (
              procedure.requirements.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li>Thong tin thanh phan ho so dang duoc cap nhat.</li>
            )}
          </ul>

          {procedure.wordTemplateHref && procedure.wordTemplateHref !== "#" ? (
            <a
              href={procedure.wordTemplateHref}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Tai bieu mau dinh kem
            </a>
          ) : null}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-lg bg-[#1f7a5a]/10 p-3 text-[#1f7a5a]">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Thong tin nguoi nop</h3>
            <p className="mt-1 text-sm text-slate-600">
              Hien backend moi luu thong tin lien he co ban, nen minh uu tien ket noi dung phan nay de ban nop ho so that.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Ho va ten <span className="text-[#db2777]">*</span>
            </label>
            <input
              type="text"
              value={form.applicantName}
              onChange={(event) => handleChange("applicantName", event.target.value)}
              placeholder="Vi du: Nguyen Van A"
              className="h-12 w-full rounded-xl border-slate-300 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-500 focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              So dien thoai <span className="text-[#db2777]">*</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              placeholder="Nhap so dien thoai lien he"
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
        <label className="mb-8 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
            className="mt-0.5 size-5 rounded border-slate-300 text-[#1f7a5a] focus:ring-[#1f7a5a]"
          />
          <span className="text-sm leading-relaxed text-slate-900">
            Toi xac nhan thong tin lien he tren la chinh xac de he thong tiep nhan ho so va gui ket qua tra cuu.
          </span>
        </label>

        <div className="flex flex-col items-center justify-end gap-4 sm:flex-row">
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-100 sm:w-auto"
          >
            Nhap lai
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
                Dang gui...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">send</span>
                Gui ho so
              </>
            )}
          </button>
        </div>
      </section>

      <section className="rounded-r-xl border-l-4 border-[#1f7a5a] bg-gradient-to-r from-[#1f7a5a]/5 to-transparent p-6">
        <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="material-symbols-outlined text-[#1f7a5a]">analytics</span>
          Theo doi trang thai
        </h3>
        <p className="mb-4 text-sm text-slate-600">
          Sau khi nop, ban co the tra cuu ho so theo so dien thoai va email. Ma thu tuc hien tai: {id}.
        </p>
        <Link
          href={`/dich-vu/tra-cuu?phone=${encodeURIComponent(form.phone)}&email=${encodeURIComponent(form.email)}`}
          className="inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1f7a5a]"
        >
          Den trang tra cuu
        </Link>
      </section>

      {isSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-center shadow-2xl">
            <span className="material-symbols-outlined mb-3 text-6xl text-emerald-600">check_circle</span>
            <h3 className="mb-2 text-2xl font-bold text-slate-900">Nop ho so thanh cong</h3>
            <p className="mb-6 text-slate-600">
              He thong da tiep nhan ho so cua ban. Ma ho so vua tao la <strong>HS-{applicationId.padStart(6, "0")}</strong>.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/dich-vu/tra-cuu?phone=${encodeURIComponent(form.phone)}&email=${encodeURIComponent(form.email)}`}
                className="rounded-lg bg-[#1f7a5a] px-5 py-2.5 font-semibold text-white hover:bg-[#155a42]"
              >
                Tra cuu ho so
              </Link>
              <Link
                href="/trang-ca-nhan"
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Den trang ca nhan
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
