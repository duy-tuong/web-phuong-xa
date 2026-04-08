import { fetchLibraryVideoPage } from "@/services/mediaLibraryService";
//*Hệ thống gọi hàm fetchLibraryVideoPage(1, 1) để kéo về đúng 1 video mới nhất 
export default async function FeaturedVideoSection() {
  const response = await fetchLibraryVideoPage(1, 1);
  const featuredVideo = response.items[0];

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-between gap-8 border-b border-slate-100 p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div>
            <span className="mb-4 inline-flex rounded-full bg-[#db2777]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#db2777]">
              Video nổi bật
            </span>
            <h2 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl">
              {featuredVideo ? featuredVideo.title : "Kho video nổi bật đang được cập nhật"}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
              {featuredVideo
                ? "Kho video lấy dữ liệu trực tiếp từ media công khai. Khi có video mới, khu này sẽ tự cập nhật theo nội dung mới nhất."
                : "Hiện chưa có video nào trong thư viện công khai. Khi admin thêm video, khu vực bên phải sẽ hiển thị ngay video nổi bật đầu tiên."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">
              <span className="material-symbols-outlined text-base">play_circle</span>
              <span>{featuredVideo ? featuredVideo.date : "Chưa có video để phát"}</span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">Nội dung đa phương tiện</span>
            
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-4 sm:p-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-slate-950/40">
          //* •	Nếu có video, nó sẽ gắn vào trình phát (player) để hiển thị trực tiếp 
            {featuredVideo ? (
              <video
                src={featuredVideo.sourceUrl}
                controls
                preload="metadata"
                className="aspect-video h-full w-full bg-black object-cover"
              >
                Trình duyệt của bạn không hỗ trợ phát video.
              </video>
         //* nếu chưa có dữ liệu, hệ thống sẽ hiển thị một giao diện chờ dự phòng  
          ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_top,_rgba(31,122,90,0.35),_transparent_45%),linear-gradient(180deg,#0f172a,#111827)] px-6 text-center">
                <span className="material-symbols-outlined text-6xl text-white/90">movie</span>
                <div>
                  <p className="text-lg font-semibold text-white">Chưa có video nổi bật</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    Khi nào thêm video mới vào thư viện công khai, video đó sẽ tự động xuất hiện tại đây.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
