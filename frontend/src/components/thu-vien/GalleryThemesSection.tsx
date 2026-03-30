import Link from "next/link";
import Image from "next/image";

import { fetchPhotoThemes } from "@/services/mediaLibraryService";

export default async function GalleryThemesSection() {
  const themes = await fetchPhotoThemes(4);

  if (themes.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <span className="material-symbols-outlined text-[#1f7a5a]">palette</span>
          Gallery hình ảnh theo chủ đề
        </h2>
        <Link
          href="/thu-vien/hinh-anh"
          className="flex items-center gap-1 text-sm font-semibold text-[#1f7a5a] hover:underline"
        >
          Xem thư viện ảnh
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {themes.map((theme) => (
          <Link
            key={theme.id}
            href={theme.href}
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={theme.coverImage}
                alt={theme.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">
                {theme.count} hình ảnh
              </span>
            </div>
            <div className="space-y-2 p-5">
              <h3 className="text-lg font-bold text-slate-900">{theme.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{theme.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
