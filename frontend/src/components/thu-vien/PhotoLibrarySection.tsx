import Link from "next/link";

import GalleryItem from "@/components/thu-vien/GalleryItem";
import LibraryPagination from "@/components/thu-vien/LibraryPagination";
import { fetchLibraryPhotoPage } from "@/services/mediaLibraryService";

type PhotoLibrarySectionProps = {
  page?: number;
  pageSize?: number;
  showPagination?: boolean;
  showViewAllLink?: boolean;
  heading?: string;
  subheading?: string;
};

export default async function PhotoLibrarySection({
  page = 1,
  pageSize = 4,
  showPagination = false,
  showViewAllLink = true,
  heading = "Thư viện ảnh",
  subheading,
}: PhotoLibrarySectionProps) {
  const photos = await fetchLibraryPhotoPage(page, pageSize);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <span className="material-symbols-outlined text-[#1f7a5a]">photo_library</span>
            {heading}
          </h2>
          {subheading ? <p className="mt-2 text-sm text-slate-600">{subheading}</p> : null}
        </div>
        {showViewAllLink ? (
          <Link
            href="/thu-vien/hinh-anh"
            className="flex items-center gap-1 text-sm font-semibold text-[#1f7a5a] hover:underline"
          >
            Xem tất cả
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        ) : null}
      </div>

      {photos.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-600">
          Chưa có hình ảnh nào trong thư viện media.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {photos.items.map((photo) => (
              <GalleryItem key={photo.id} photo={photo} />
            ))}
          </div>

          {showPagination ? (
            <LibraryPagination
              basePath="/thu-vien/hinh-anh"
              currentPage={photos.page}
              totalPages={photos.totalPages}
            />
          ) : null}
        </>
      )}
    </section>
  );
}
