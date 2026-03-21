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

type ServiceCardProps = {
  service: ServiceCardData;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className={`rounded border px-2.5 py-0.5 text-xs font-bold ${service.levelClass}`}>{service.level}</span>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-500">{service.field}</span>
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">Mã hồ sơ: {service.profileCode}</span>
          </div>
          <h3 className="mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-[#1f7a5a]">{service.title}</h3>
          <p className="line-clamp-2 text-sm text-slate-600">{service.description}</p>
          <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined align-middle text-[16px]">schedule</span>
              {service.duration}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined align-middle text-[16px]">payments</span>
              {service.fee}
            </span>
          </div>
        </div>

        <div className="mt-4 flex w-full flex-col gap-2 md:mt-0 md:w-auto">
          <Link
            href={`/dich-vu/chi-tiet-ho-so/${service.slug}`}
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#1f7a5a] px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-[#1f7a5a]/90"
          >
            <span className="material-symbols-outlined align-middle text-[20px]">send</span>
            Nộp hồ sơ
          </Link>
          <Link
            href={`/dich-vu/${service.slug}`}
            className="whitespace-nowrap rounded-lg border border-slate-300 bg-white px-4 py-2 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}