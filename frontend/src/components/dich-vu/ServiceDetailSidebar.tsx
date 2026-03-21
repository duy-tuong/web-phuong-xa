import Link from "next/link";

const faqs = [
  "Hồ sơ trực tuyến cần những yêu cầu gì về file đính kèm?",
  "Thời gian xử lý hồ sơ là bao lâu?",
  "Làm sao để biết hồ sơ cần bổ sung giấy tờ?",
];

export default function ServiceDetailSidebar() {
  return (
    <aside className="w-full space-y-6 lg:sticky lg:top-28 lg:w-1/3">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3 text-lg font-bold text-slate-900">
          <span className="material-symbols-outlined text-[#db2777]">support_agent</span>
          Hỗ trợ kỹ thuật
        </h3>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="mt-1 text-[#1f7a5a]">
              <span className="material-symbols-outlined">call</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Hotline hỗ trợ</p>
              <p className="text-lg font-bold text-[#1f7a5a]">1900 123 456</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="mt-1 text-[#1f7a5a]">
              <span className="material-symbols-outlined">mail</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Email liên hệ</p>
              <p className="text-base font-semibold text-slate-900">hotro@caolanh.gov.vn</p>
            </div>
          </div>

          <div className="flex gap-3 border-t border-slate-200 pt-2">
            <div className="mt-1 text-[#1f7a5a]">
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Giờ làm việc</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Sáng: 07:30 - 11:30</p>
              <p className="text-sm font-semibold text-slate-900">Chiều: 13:30 - 17:00</p>
              <p className="mt-1 text-xs italic text-slate-500">(Từ Thứ 2 đến Thứ 6)</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Câu hỏi thường gặp</h3>
        <ul className="space-y-3">
          {faqs.map((item) => (
            <li key={item}>
              <Link href="/dich-vu/tra-cuu" className="flex items-start gap-2 text-sm text-slate-600 transition-colors hover:text-[#1f7a5a]">
                <span className="material-symbols-outlined mt-0.5 text-[18px]">chevron_right</span>
                <span>{item}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
