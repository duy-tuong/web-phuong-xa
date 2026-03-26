import VideoItem from "@/components/thu-vien/VideoItem";
import { fetchLibraryVideos } from "@/services/mediaLibraryService";

export default async function VideoLibrarySection() {
  const videos = await fetchLibraryVideos();

  return (
    <section>
      <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <span className="material-symbols-outlined text-[#1f7a5a]">video_library</span>
          Kho Video Clip
        </h2>
      </div>

      {videos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-600">
          Hien chua co video nao duoc dang trong thu vien media.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {videos.map((video) => (
            <VideoItem key={video.id} video={video} />
          ))}
        </div>
      )}
    </section>
  );
}
