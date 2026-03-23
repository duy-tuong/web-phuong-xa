"use client";

import { useEffect } from "react";
import { Upload, X } from "lucide-react";

type ProfileUpdateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const initialProfileForm = {
  fullName: "Nguyễn Văn A",
  phone: "0912 345 678",
  cccd: "087203001234",
  dob: "1994-08-18",
  gender: "Nam",
  contactEmail: "nguyenvana@gmail.com",
  address: "Số 12, đường Nguyễn Huệ, Khóm 2, Phường Cao Lãnh",
};

export default function ProfileUpdateModal({ isOpen, onClose }: ProfileUpdateModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-[221] max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Cập nhật thông tin tài khoản</h3>
            <p className="mt-1 text-sm text-slate-500">Điều chỉnh thông tin cá nhân để hệ thống đồng bộ hồ sơ của bạn chính xác hơn.</p>
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
          <form className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-2xl font-bold text-emerald-700 shadow-md">
                  NA
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">Thay đổi ảnh đại diện</h4>
                    <p className="mt-1 text-sm text-slate-500">Ảnh rõ mặt, nền sáng sẽ giúp hồ sơ dễ nhận diện hơn khi đối chiếu.</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                    <Upload className="mr-2 h-4 w-4" />
                    Thay ảnh
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Họ và tên</span>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Họ và tên"
                  defaultValue={initialProfileForm.fullName}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Số điện thoại</span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại"
                  defaultValue={initialProfileForm.phone}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Số CCCD/CMND</span>
                <input
                  type="text"
                  name="cccd"
                  placeholder="Số CCCD/CMND"
                  defaultValue={initialProfileForm.cccd}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Ngày sinh</span>
                <input
                  type="date"
                  name="dob"
                  defaultValue={initialProfileForm.dob}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Giới tính</span>
                <select
                  name="gender"
                  defaultValue={initialProfileForm.gender}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                >
                  <option>Nam</option>
                  <option>Nữ</option>
                  <option>Khác</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Email liên hệ</span>
                <input
                  type="email"
                  name="contactEmail"
                  placeholder="Email liên hệ (Có thể khác email đăng nhập)"
                  defaultValue={initialProfileForm.contactEmail}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Địa chỉ thường trú chi tiết</span>
                <input
                  type="text"
                  name="address"
                  placeholder="Địa chỉ thường trú chi tiết (Số nhà, đường...)"
                  defaultValue={initialProfileForm.address}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
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
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
