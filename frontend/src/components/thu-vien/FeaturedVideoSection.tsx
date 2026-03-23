import Image from "next/image";

const FEATURED_VIDEO_THUMB =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCkKUzJsnQd67xil0_H4-AaKubsR_-y31s_le2fFm3d_YBXpa3i7maf5Jww0nHd6SujVO5OQtn0w9PQui67qoNps3J08TteHl9PzwnRMrxhQ-Y8CzbC3BCc7HasR1VFwrXEV9YvhmbumF2lqowAyk8xrSc2Ggbh2rh3MrE_QS8A6A1qMwQkdjPZ_TOm0-7ItcGbJJtSjlcEhZav-sErAESwikjkDiYuhLnYiTPmVHS9wGXnPPUlB5nII8DNAnI9-8wk9UmBlIQ_OLPl";

const FILTERS = [
  "Tất Cả",
  "Văn hóa & Lễ hội",
  "Du lịch & Địa danh",
  "Ẩm thực địa phương",
  "Hoạt động cộng đồng",
  "Phát triển đô thị",
];

export default function FeaturedVideoSection() {
  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col justify-center gap-6 border-b border-slate-100 p-10 lg:w-2/5 lg:border-b-0 lg:border-r">
            <div>
              <span className="mb-4 inline-block rounded-full bg-[#db2777]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#db2777]">
                Video Nổi Bật
              </span>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">Giới thiệu Phường Cao Lãnh</h2>
              <p className="leading-relaxed text-slate-600">
                Hành trình nhìn lại quá trình hình thành, phát triển và những nét văn hóa đặc sắc của vùng đất Sen hồng.
                Khám phá những nỗ lực xây dựng đô thị văn minh, hiện đại nhưng vẫn giữ gìn bản sắc truyền thống.
              </p>
            </div>
            <button className="flex w-fit items-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-medium text-white transition-colors hover:bg-[#1f7a5a]">
              <span className="material-symbols-outlined">play_circle</span>
              <span>Xem Video Nhúng</span>
            </button>
          </div>

          <div className="group relative aspect-video cursor-pointer overflow-hidden bg-cover bg-center lg:w-3/5">
            <Image
              src={FEATURED_VIDEO_THUMB}
              alt="Video giới thiệu Phường Cao Lãnh"
              fill
              className="object-cover"
              unoptimized
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/10">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/50 bg-white/30 shadow-xl backdrop-blur-md transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-5xl text-white">play_arrow</span>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">15:42</div>
          </div>
        </div>
      </section>

      <section className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-3">
          {FILTERS.map((item, index) => (
            <button
              key={item}
              className={
                index === 0
                  ? "rounded-full bg-[#1f7a5a] px-6 py-2.5 font-semibold text-white shadow-md"
                  : "rounded-full border border-slate-200 bg-white px-6 py-2.5 font-medium text-slate-600 transition-all hover:bg-white/50 hover:shadow-sm"
              }
            >
              {item}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
