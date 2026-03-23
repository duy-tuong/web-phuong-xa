"use client";

import { useState } from "react";
import Link from "next/link";

type ServiceDetailFormSectionProps = {
  id: string;
};

export default function ServiceDetailFormSection({ id }: ServiceDetailFormSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <div className="w-full space-y-8 lg:w-2/3">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-lg bg-[#1f7a5a]/10 p-3 text-[#1f7a5a]">
            <span className="material-symbols-outlined">description</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Chọn Loại Thủ Tục</h3>
            <p className="mt-1 text-sm text-slate-600">Vui lòng chọn lĩnh vực và loại dịch vụ bạn muốn thực hiện.</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Lĩnh vực hành chính <span className="text-[#db2777]">*</span>
            </label>
            <select className="h-14 w-full rounded-xl border-slate-300 bg-slate-50 px-4 text-slate-900 focus:border-[#1f7a5a] focus:ring-[#1f7a5a]">
              <option value="">-- Chọn lĩnh vực --</option>
              <option value="ho-tich">Hộ tịch (Khai sinh, Khai tử, Kết hôn...)</option>
              <option value="dat-dai">Đất đai, Nhà ở</option>
              <option value="kinh-doanh">Đăng ký kinh doanh</option>
              <option value="xay-dung">Cấp phép xây dựng</option>
              <option value="khac">Khác</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Thủ tục cụ thể <span className="text-[#db2777]">*</span>
            </label>
            <select
              disabled
              className="h-14 w-full cursor-not-allowed rounded-xl border-slate-300 bg-slate-100 px-4 text-slate-500 opacity-70"
            >
              <option value="">-- Vui lòng chọn lĩnh vực trước --</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-lg bg-[#1f7a5a]/10 p-3 text-[#1f7a5a]">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Thông Tin Người Nộp</h3>
            <p className="mt-1 text-sm text-slate-600">Điền đầy đủ và chính xác thông tin để chúng tôi có thể liên hệ.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Họ và tên <span className="text-[#db2777]">*</span>
            </label>
            <input
              type="text"
              placeholder="Vd: Nguyễn Văn A"
              className="h-12 w-full rounded-xl border-slate-300 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-500 focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Số CCCD/ID <span className="text-[#db2777]">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập 12 số CCCD"
              className="h-12 w-full rounded-xl border-slate-300 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-500 focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Số điện thoại <span className="text-[#db2777]">*</span>
            </label>
            <input
              type="tel"
              placeholder="Nhập số điện thoại liên hệ"
              className="h-12 w-full rounded-xl border-slate-300 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-500 focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">Email</label>
            <input
              type="email"
              placeholder="example@email.com (Nhận thông báo tiến độ)"
              className="h-12 w-full rounded-xl border-slate-300 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-500 focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Địa chỉ hiện tại <span className="text-[#db2777]">*</span>
            </label>
            <input
              type="text"
              placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP"
              className="h-12 w-full rounded-xl border-slate-300 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-500 focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-900">Mô tả nội dung hồ sơ</label>
            <textarea
              rows={4}
              placeholder="Ghi chú thêm về hồ sơ của bạn (nếu có)..."
              className="w-full resize-y rounded-xl border-slate-300 bg-slate-50 p-4 text-slate-900 placeholder:text-slate-500 focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-lg bg-[#1f7a5a]/10 p-3 text-[#1f7a5a]">
            <span className="material-symbols-outlined">upload_file</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Thành Phần Hồ Sơ</h3>
            <p className="mt-1 text-sm text-slate-600">Đính kèm các giấy tờ bắt buộc theo yêu cầu thủ tục.</p>
          </div>
        </div>

        <div className="group cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/80 p-8 text-center transition-all hover:border-[#1f7a5a]/50 hover:bg-slate-50">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#1f7a5a]/10 text-[#1f7a5a] transition-transform group-hover:scale-110">
            <span className="material-symbols-outlined text-3xl">cloud_upload</span>
          </div>
          <h4 className="mb-2 text-base font-semibold text-slate-900">
            Kéo thả tệp vào đây hoặc <span className="text-[#1f7a5a] hover:underline">Chọn tệp</span>
          </h4>
          <p className="mx-auto mb-4 max-w-sm text-sm text-slate-600">Hỗ trợ định dạng: PDF, JPG, PNG. Dung lượng tối đa: 10MB/tệp.</p>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden" />
        </div>

        <div className="mt-6">
          <h5 className="mb-3 text-sm font-semibold text-slate-900">Tệp đã tải lên (0)</h5>
          <div className="rounded-lg border border-slate-200 bg-slate-50 py-4 text-center text-sm italic text-slate-500">
            Chưa có tệp nào được đính kèm.
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <label className="mb-8 flex cursor-pointer items-start gap-3">
          <input type="checkbox" className="mt-0.5 size-5 rounded border-slate-300 text-[#1f7a5a] focus:ring-[#1f7a5a]" />
          <span className="text-sm leading-relaxed text-slate-900">
            Tôi cam đoan những thông tin khai báo trên là hoàn toàn chính xác và chịu trách nhiệm trước pháp luật về những thông tin này.
          </span>
        </label>

        <div className="flex flex-col items-center justify-end gap-4 sm:flex-row">
          <button className="w-full rounded-xl border border-slate-300 bg-slate-50 px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-100 sm:w-auto">
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
                Đang xử lý...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">send</span>
                Gửi Hồ Sơ
              </>
            )}
          </button>
        </div>
      </section>

      <section className="rounded-r-xl border-l-4 border-[#1f7a5a] bg-gradient-to-r from-[#1f7a5a]/5 to-transparent p-6">
        <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-900">
          <span className="material-symbols-outlined text-[#1f7a5a]">analytics</span>
          Theo Dõi Trạng Thái
        </h3>
        <p className="mb-4 text-sm text-slate-600">
          Sau khi nộp, bạn có thể theo dõi tiến trình xử lý hồ sơ thông qua Mã hồ sơ được cấp.
        </p>

        <div className="mb-6 flex max-w-md items-center gap-2">
          <input
            type="text"
            placeholder="Nhập mã hồ sơ..."
            className="h-10 flex-1 rounded-lg border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-[#1f7a5a] focus:ring-[#1f7a5a]"
          />
          <button className="h-10 rounded-lg bg-slate-200 px-4 text-sm font-medium text-slate-900 transition-colors hover:bg-[#1f7a5a] hover:text-white">
            Tra cứu
          </button>
        </div>

        <div className="relative flex w-full max-w-lg items-center justify-between before:absolute before:top-1/2 before:h-1 before:w-full before:-translate-y-1/2 before:bg-slate-200 before:content-['']">
          <div className="z-10 flex flex-col items-center gap-2 bg-[#f8fafc] px-2">
            <div className="flex size-6 items-center justify-center rounded-full border-4 border-[#f8fafc] bg-[#1f7a5a] text-white">
              <span className="material-symbols-outlined text-[12px]">check</span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1f7a5a]">Tiếp nhận</span>
          </div>
          <div className="z-10 flex flex-col items-center gap-2 bg-[#f8fafc] px-2">
            <div className="size-6 rounded-full border-4 border-[#f8fafc] bg-slate-300" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Đang xử lý</span>
          </div>
          <div className="z-10 flex flex-col items-center gap-2 bg-[#f8fafc] px-2">
            <div className="size-6 rounded-full border-4 border-[#f8fafc] bg-slate-300" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Hoàn tất</span>
          </div>
        </div>

        <p className="mt-6 text-xs text-slate-500">Mã tham chiếu dịch vụ: {id}</p>
      </section>

      {isSuccess ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-center shadow-2xl">
            <span className="material-symbols-outlined mb-3 text-6xl text-emerald-600">check_circle</span>
            <h3 className="mb-2 text-2xl font-bold text-slate-900">Nộp hồ sơ thành công!</h3>
            <p className="mb-6 text-slate-600">
              Cảm ơn bạn. Hồ sơ của bạn đã được tiếp nhận. Mã hồ sơ của bạn là: <strong>HS-12345</strong> (Hãy lưu lại mã
              này để tra cứu).
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/" className="rounded-lg bg-[#1f7a5a] px-5 py-2.5 font-semibold text-white hover:bg-[#155a42]">
                Quay về trang chủ
              </Link>
              <Link
                href="/dich-vu"
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Tra cứu hồ sơ
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
