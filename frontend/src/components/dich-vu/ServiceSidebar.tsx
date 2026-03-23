import Link from "next/link";

type ServiceSidebarProps = {
  onOpenTracking: () => void;
  onOpenForms: () => void;
};

export default function ServiceSidebar({ onOpenTracking, onOpenForms }: ServiceSidebarProps) {
  return (
    <div className="space-y-6 lg:col-span-1">
      <div className="overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="material-symbols-outlined text-[#1f7a5a]">search</span>
          <h3 className="font-bold text-slate-900">Tra cứu trạng thái hồ sơ</h3>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="ma-ho-so-sidebar">
              Mã hồ sơ
            </label>
            <input
              id="ma-ho-so-sidebar"
              type="text"
              placeholder="VD: H01.23.456"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-shadow focus:border-[#1f7a5a] focus:ring-2 focus:ring-[#1f7a5a]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="sdt-cccd-sidebar">
              Số điện thoại / CCCD
            </label>
            <input
              id="sdt-cccd-sidebar"
              type="text"
              placeholder="Nhập số ĐT hoặc CCCD"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition-shadow focus:border-[#1f7a5a] focus:ring-2 focus:ring-[#1f7a5a]"
            />
          </div>
          <button
            type="button"
            onClick={onOpenTracking}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1f7a5a] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#1f7a5a]/90"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            Tra cứu
          </button>
          <div className="mt-4 rounded-lg border bg-slate-50 p-3 pt-4">
            <div className="mb-2 flex items-start justify-between">
              <div className="text-xs font-bold text-slate-900">H01.23.456</div>
              <div className="text-[10px] text-slate-500">23/10/2023</div>
            </div>
            <div className="mb-2 line-clamp-1 text-xs text-slate-700">Đăng ký kết hôn</div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="text-xs font-medium text-yellow-600">Đang xử lý</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <span className="material-symbols-outlined text-[#1f7a5a]">file_download</span>
          <h3 className="font-bold text-slate-900">Tải biểu mẫu hành chính</h3>
        </div>
        <div className="space-y-3 p-4">
          <button type="button" onClick={onOpenForms} className="group flex items-start gap-3 text-left">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-red-100 text-red-600 transition-colors group-hover:bg-red-200">
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900 transition-colors group-hover:text-[#1f7a5a]">
                Đơn đăng ký khai sinh
              </div>
              <div className="line-clamp-1 text-xs text-slate-500">Dùng cho đăng ký khai sinh mới, cấp lại</div>
            </div>
          </button>

          <button type="button" onClick={onOpenForms} className="group flex items-start gap-3 text-left">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-200">
              <span className="material-symbols-outlined text-[18px]">description</span>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900 transition-colors group-hover:text-[#1f7a5a]">
                Đơn xác nhận cư trú
              </div>
              <div className="line-clamp-1 text-xs text-slate-500">Xác nhận thông tin cư trú của công dân</div>
            </div>
          </button>

          <button type="button" onClick={onOpenForms} className="group flex items-start gap-3 text-left">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-red-100 text-red-600 transition-colors group-hover:bg-red-200">
              <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900 transition-colors group-hover:text-[#1f7a5a]">
                Đơn đăng ký kết hôn
              </div>
              <div className="line-clamp-1 text-xs text-slate-500">Thủ tục đăng ký kết hôn trong nước</div>
            </div>
          </button>

          <button type="button" onClick={onOpenForms} className="group flex items-start gap-3 text-left">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-200">
              <span className="material-symbols-outlined text-[18px]">description</span>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900 transition-colors group-hover:text-[#1f7a5a]">
                Đơn xin cấp phép xây dựng
              </div>
              <div className="line-clamp-1 text-xs text-slate-500">Cho nhà ở riêng lẻ và công trình</div>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenForms}
            className="mt-2 block w-full border-t border-slate-100 pt-2 text-center text-xs font-medium text-[#1f7a5a] hover:underline"
          >
            Xem tất cả biểu mẫu
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-[#1f7a5a] text-white shadow-sm">
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
        <div className="relative p-6">
          <h3 className="mb-2 text-lg font-bold">Hỗ trợ kỹ thuật</h3>
          <p className="mb-4 text-sm text-white/80">
            Gặp khó khăn trong quá trình nộp hồ sơ? Liên hệ với chúng tôi để được trợ giúp.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined rounded-full bg-white/20 p-2">call</span>
              <div>
                <div className="text-xs text-white/70">Tổng đài hỗ trợ</div>
                <div className="font-bold">1900 xxxx (Phím 1)</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined rounded-full bg-white/20 p-2">mail</span>
              <div>
                <div className="text-xs text-white/70">Email hỗ trợ</div>
                <div className="text-sm font-bold">hotro@dongthap.gov.vn</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden">
        <Link href="/dich-vu/tra-cuu">Tra cứu hồ sơ</Link>
      </div>
    </div>
  );
}
