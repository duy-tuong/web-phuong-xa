import Image from "next/image";
import Link from "next/link";

import type { ArticleCardProps } from "@/types/article";

export default function ArticleCard({
  slug,
  title,
  image,
  date,
  summary,
  category,
  layout = "vertical",
}: ArticleCardProps) {
  const isHorizontal = layout === "horizontal";

  if (isHorizontal) {
    return (
      <Link href={`/tin-tuc/${slug}`} className="group flex gap-3">
        {image ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
            <Image src={image} alt={title} fill className="object-cover" unoptimized sizes="80px" />
          </div>
        ) : null}
        <div className="flex flex-col justify-between py-0.5">
          <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[#1f7a5a]">
            {title}
          </h4>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {date}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/tin-tuc/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-[#1f7a5a]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      {image ? (
        <div className="relative h-48 overflow-hidden">
          <Image
            alt={title}
            src={image}
            fill
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          {category ? (
            <div className="absolute left-3 top-3 rounded bg-[#1f7a5a] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              {category}
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {!image && category ? (
          <div className="w-fit rounded bg-[#1f7a5a]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1f7a5a]">
            {category}
          </div>
        ) : null}
        <h3 className="line-clamp-2 text-lg font-bold leading-tight text-slate-900 transition-colors group-hover:text-[#1f7a5a]">
          {title}
        </h3>
        <p className="mb-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{summary}</p>
        <div className="mt-auto flex items-center justify-between border-t border-[#1f7a5a]/10 pt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            {date}
          </span>
          <span className="flex items-center font-semibold text-[#1f7a5a]">
            Xem thêm <span className="material-symbols-outlined align-middle text-[16px]">chevron_right</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
