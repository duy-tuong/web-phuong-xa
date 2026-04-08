//Hiển thị thông tin tóm tắt của một dịch vụ (tên, mô tả ngắn, icon...), dùng trong danh sách dịch vụ.
import Link from "next/link";

export type ServiceCardData = {
  slug: string;
  profileCode: string;
  level: string;
  levelClass: string;
  field: string;
  title: string;
  description: string;
  duration: string;
  fee: string;
};

export default function ServiceCard({ service }: { service: ServiceCardData }) {
  return (
    <Link
   //* mỗi card là một Link dẫn đến trang chi tiết của thủ tục tương ứng, URL dựa trên slug của thủ tục đó
      href={`/dich-vu/${service.slug}`}
      className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1f7a5a]/30 hover:shadow-md sm:p-6"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
            {service.profileCode}
          </span>
          <span className="text-xs font-bold text-slate-300">•</span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1f7a5a]">
            {service.field}
          </span>
        </div>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${service.levelClass}`}>
          {service.level}
        </span>
      </div>
      
      <h3 className="mb-2.5 text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#1f7a5a] md:text-2xl">
        {service.title}
      </h3>
      <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-slate-600 md:text-base">
        {service.description}
      </p>
      
      <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:gap-8">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <span className="material-symbols-outlined text-[18px] text-[#1f7a5a]">schedule</span>
          {service.duration}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <span className="material-symbols-outlined text-[18px] text-[#1f7a5a]">payments</span>
          {service.fee}
        </div>
      </div>
    </Link>
  );
}
