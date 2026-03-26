import Image from "next/image";

import { fetchLibraryVideos } from "@/services/mediaLibraryService";

const FILTERS = ["Tat Ca", "Van hoa", "Du lich", "Cong dong", "Do thi"];

export default async function FeaturedVideoSection() {
  const videos = await fetchLibraryVideos(1);
  const featuredVideo = videos[0];

  if (!featuredVideo) {
    return (
      <section className="overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <span className="mb-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-700">
          Video Noi Bat
        </span>
        <h2 className="text-3xl font-bold text-slate-900">Thu vien video dang duoc cap nhat</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
          Hien backend chua co file video nao trong kho media cong khai. Khi admin them video, muc nay se tu dong hien thi.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col justify-center gap-6 border-b border-slate-100 p-10 lg:w-2/5 lg:border-b-0 lg:border-r">
            <div>
              <span className="mb-4 inline-block rounded-full bg-[#db2777]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#db2777]">
                Video Noi Bat
              </span>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">{featuredVideo.title}</h2>
              <p className="leading-relaxed text-slate-600">
                Thu vien dang lay du lieu truc tiep tu kho media. Ban co the them video trong admin de noi dung nay cap nhat tu dong.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-medium text-white">
              <span className="material-symbols-outlined">play_circle</span>
              <span>{featuredVideo.date}</span>
            </div>
          </div>

          <div className="group relative aspect-video overflow-hidden bg-cover bg-center lg:w-3/5">
            <Image
              src={featuredVideo.image}
              alt={featuredVideo.title}
              fill
              className="object-cover"
              unoptimized
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/50 bg-white/30 shadow-xl backdrop-blur-md">
                <span className="material-symbols-outlined text-5xl text-white">play_arrow</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-3">
          {FILTERS.map((item, index) => (
            <span
              key={item}
              className={
                index === 0
                  ? "rounded-full bg-[#1f7a5a] px-6 py-2.5 font-semibold text-white shadow-md"
                  : "rounded-full border border-slate-200 bg-white px-6 py-2.5 font-medium text-slate-600"
              }
            >
              {item}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
