import Link from "next/link";

import GalleryItem from "@/components/thu-vien/GalleryItem";
import { fetchLibraryPhotos } from "@/services/mediaLibraryService";

export default async function PhotoLibrarySection() {
  const photos = await fetchLibraryPhotos();

  return (
    <section>
      <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <span className="material-symbols-outlined text-[#1f7a5a]">photo_library</span>
          Thu Vien Anh
        </h2>
        <Link href="/thu-vien/hinh-anh" className="flex items-center gap-1 text-sm font-semibold text-[#1f7a5a] hover:underline">
          Xem tat ca <span className="material-symbols-outlined text-sm">chevron_right</span>
        </Link>
      </div>

      {photos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-600">
          Chua co hinh anh nao trong thu vien media.
        </div>
      ) : (
        <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
          {photos.map((photo) => (
            <GalleryItem key={photo.id} photo={photo} />
          ))}
        </div>
      )}
    </section>
  );
}
