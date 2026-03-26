"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

import { getErrorMessage, updateCurrentUser } from "@/services/adminService";
import type { User } from "@/types";

type ProfileUpdateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSaved: (user: User) => void;
};

export default function ProfileUpdateModal({ isOpen, onClose, user, onSaved }: ProfileUpdateModalProps) {
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    email: user.email,
    phone: user.phone || "",
    currentPassword: "",
    newPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    setErrorMessage("");
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const updatedUser = await updateCurrentUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        currentPassword: formData.currentPassword || undefined,
        newPassword: formData.newPassword || undefined,
      });

      onSaved(updatedUser);
      onClose();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-[221] max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Cap nhat thong tin tai khoan</h3>
            <p className="mt-1 text-sm text-slate-500">Chinh sua ho ten, email, so dien thoai va mat khau neu can.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="Dong modal">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-82px)] overflow-y-auto px-5 py-5 sm:px-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errorMessage ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div> : null}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Ho va ten</span>
                <input type="text" value={formData.fullName} onChange={(event) => setFormData((prev) => ({ ...prev, fullName: event.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" required />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input type="email" value={formData.email} onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" required />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">So dien thoai</span>
                <input type="tel" value={formData.phone} onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Mat khau hien tai</span>
                <input type="password" value={formData.currentPassword} onChange={(event) => setFormData((prev) => ({ ...prev, currentPassword: event.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Mat khau moi</span>
                <input type="password" value={formData.newPassword} onChange={(event) => setFormData((prev) => ({ ...prev, newPassword: event.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Huy</button>
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Dang luu...</> : "Luu thay doi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
