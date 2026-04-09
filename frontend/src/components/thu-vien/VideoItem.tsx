export type VideoItemData = {
  title: string;
  date: string;
  image: string;
  sourceUrl: string;
  description: string;
  downloadUrl: string;
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
        {video.description ? (
          <p className="text-sm text-slate-600">{video.description}</p>
        ) : null}
        <a
          href={video.downloadUrl}
          download
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Tải video
        </a>
      </div>
    </article>
  );
}
