import Link from "next/link";

import LibraryPagination from "@/components/thu-vien/LibraryPagination";
import VideoItem from "@/components/thu-vien/VideoItem";
import { fetchLibraryVideoPage } from "@/services/mediaLibraryService";

type VideoLibrarySectionProps = {
  page?: number;
  pageSize?: number;
  showPagination?: boolean;
  showViewAllLink?: boolean;
  heading?: string;
  subheading?: string;
};

export default async function VideoLibrarySection({
  page = 1,
  pageSize = 4,
  showPagination = false,
  showViewAllLink = false,
  heading = "Kho video",
  subheading,
}: VideoLibrarySectionProps) {
  const videos = await fetchLibraryVideoPage(page, pageSize);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <span className="material-symbols-outlined text-[#1f7a5a]">video_library</span>
            {heading}
          </h2>
          {subheading ? <p className="mt-2 text-sm text-slate-600">{subheading}</p> : null}
        </div>
        {showViewAllLink ? (
          <Link
            href="/thu-vien/video"
            className="flex items-center gap-1 text-sm font-semibold text-[#1f7a5a] hover:underline"
          >
            Xem tất cả
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        ) : null}
      </div>

      {videos.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-600">
          Hiện chưa có video nào được đăng trong thư viện media.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {videos.items.map((video) => (
              <VideoItem key={video.id} video={video} />
            ))}
          </div>

          {showPagination ? (
            <LibraryPagination
              basePath="/thu-vien/video"
              currentPage={videos.page}
              totalPages={videos.totalPages}
            />
          ) : null}
        </>
      )}
    </section>
  );
}
