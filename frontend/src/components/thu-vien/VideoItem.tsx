//  Đại diện cho một video nhỏ trong danh sách video.
import Image from "next/image";

export type VideoItemData = {
  title: string;
  date: string;
  image: string;
};

type VideoItemProps = {
  video: VideoItemData;
};

export default function VideoItem({ video }: VideoItemProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={video.image}
          alt={video.title}
          fill
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
          sizes="(min-width: 768px) 33vw, 100vw"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-white opacity-80">play_circle</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-2 font-bold text-slate-900">{video.title}</h3>
        <p className="text-xs text-slate-500">{video.date}</p>
      </div>
    </article>
  );
}