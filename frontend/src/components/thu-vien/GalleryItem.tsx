import Image from "next/image";

export type GalleryItemData = {
  title: string;
  desc: string;
  image: string;
  theme?: string;
};

type GalleryItemProps = {
  photo: GalleryItemData;
};

export default function GalleryItem({ photo }: GalleryItemProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={photo.image}
          alt={photo.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      </div>
      <div className="space-y-2 p-5">
        <h3 className="line-clamp-2 text-base font-bold text-slate-900">{photo.title}</h3>
        <p className="text-sm leading-relaxed text-slate-600">{photo.desc}</p>
      </div>
    </article>
  );
}
