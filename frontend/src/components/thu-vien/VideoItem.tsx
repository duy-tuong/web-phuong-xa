export type VideoItemData = {
  title: string;
  date: string;
  image: string;
  sourceUrl: string;
};

type VideoItemProps = {
  video: VideoItemData;
};

export default function VideoItem({ video }: VideoItemProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
        <video
          src={video.sourceUrl}
          controls
          preload="metadata"
          className="h-full w-full object-cover"
        >
          Trình duyệt của bạn không hỗ trợ phát video.
        </video>
      </div>
      <div className="space-y-2 p-5">
        <h3 className="line-clamp-2 text-base font-bold text-slate-900">{video.title}</h3>
        <p className="text-sm text-slate-500">{video.date}</p>
      </div>
    </article>
  );
}
