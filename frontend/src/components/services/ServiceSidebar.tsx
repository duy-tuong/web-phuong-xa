import Link from "next/link";

type ServiceSidebarProps = {
  onOpenTracking: () => void;
  onOpenForms: () => void;
};

export default function ServiceSidebar({ onOpenTracking, onOpenForms }: ServiceSidebarProps) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      
      {/* Khối Tra cứu trạng thái hồ sơ */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-2 border-b border-emerald-700/10 bg-emerald-50/50 px-5 py-3.5">
          <span className="material-symbols-outlined text-emerald-700">search</span>
          <h3 className="font-bold tracking-tight text-slate-900">Tra cứu hồ sơ</h3>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700" htmlFor="ma-ho-so-sidebar">
              Mã hồ sơ <span className="text-red-500">*</span>
            </label>
            <input
              id="ma-ho-so-sidebar"
              type="text"
              placeholder="VD: H01.23.456"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/20"
            />
          </div>
          <button
            type="button"
            onClick={onOpenTracking}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-slate-900"
          >
            <span className="material-symbols-outlined text-[18px]">travel_explore</span>
            Kiểm tra
          </button>
          
          <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50/80 p-3.5 shadow-sm">
            <div className="mb-2 flex items-start justify-between">
              <div className="text-xs font-black tracking-wider text-slate-900">H01.23.456</div>
              <div className="text-[11px] font-bold text-slate-500">23/10/2026</div>
            </div>
            <div className="mb-2.5 line-clamp-1 text-sm font-bold text-slate-800">Đăng ký kết hôn</div>
            <div className="flex w-fit items-center gap-2 rounded-lg bg-yellow-100/80 px-2 py-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
              <span className="text-xs font-extrabold uppercase tracking-wide text-yellow-700">Đang xử lý</span>
            </div>
          </div>
        </div>
      </div>

      {/* Khối Tải biểu mẫu */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-2 border-b border-blue-700/10 bg-blue-50/50 px-5 py-3.5">
          <span className="material-symbols-outlined text-blue-700">file_download</span>
          <h3 className="font-bold tracking-tight text-slate-900">Biểu mẫu tải nhiều</h3>
        </div>
        <div className="space-y-1 p-3">
          {[
            { tag: 'pdf', title: 'Đơn đăng ký khai sinh', color: 'red' },
            { tag: 'doc', title: 'Đơn xác nhận cư trú', color: 'blue' },
            { tag: 'pdf', title: 'Khởi kiện hành chính', color: 'red' },
          ].map((item, idx) => (
            <button key={idx} type="button" onClick={onOpenForms} className="group flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-slate-50">
               <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-${item.color}-50 text-${item.color}-600 transition-colors group-hover:bg-${item.color}-100`}>
                 <span className="material-symbols-outlined text-[20px]">{item.tag === 'pdf' ? 'picture_as_pdf' : 'description'}</span>
               </div>
               <div className="flex-1">
                 <div className="text-sm font-bold text-slate-800 transition-colors group-hover:text-[#1f7a5a]">
                   {item.title}
                 </div>
               </div>
            </button>
          ))}

          <button
            type="button"
            onClick={onOpenForms}
            className="mt-2 block w-full rounded-xl bg-slate-50 py-2.5 text-center text-xs font-black uppercase tracking-wider text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#1f7a5a]"
          >
            Xem tất cả
          </button>
        </div>
      </div>

      {/* Khối Hỗ trợ trực tuyến */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1f7a5a] to-[#14523b] p-6 text-white shadow-md">
        <div className="absolute -right-6 -top-6 text-white/10">
           <span className="material-symbols-outlined select-none text-9xl">support_agent</span>
        </div>
        <div className="relative z-10">
          <h3 className="mb-2 text-lg font-bold tracking-wide">Cần hỗ trợ?</h3>
          <p className="mb-5 text-sm leading-relaxed text-emerald-50/90">
            Liên hệ tổng đài trực tuyến nếu bạn gặp khó khăn khi làm thủ tục.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                <span className="material-symbols-outlined text-[20px]">call</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Hotline 24/7</span>
                <span className="text-xl font-black tracking-wide text-white">1900 1234</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </aside>
  );
}
