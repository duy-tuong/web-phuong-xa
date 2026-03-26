// Đại diện cho một ảnh hoặc album nhỏ trong thư viện ảnh
import Image from "next/image";

export type GalleryItemData = {
  title: string;
  desc: string;
  image: string;
};

type GalleryItemProps = {
  photo: GalleryItemData;
};

export default function GalleryItem({ photo }: GalleryItemProps) {
  return (
    <article className="group relative break-inside-avoid overflow-hidden rounded-2xl shadow-sm transition-shadow duration-500 hover:shadow-xl">
      <Image
        src={photo.image}
        alt={photo.title}
        width={900}
        height={1200}
        className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
        unoptimized
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/30 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="mb-1 translate-y-4 text-xl font-bold text-white transition-transform duration-300 group-hover:translate-y-0">
          {photo.title}
        </h3>
        <p className="translate-y-4 text-sm text-slate-200 transition-transform delay-75 duration-300 group-hover:translate-y-0">
          {photo.desc}
        </p>
      </div>
    </article>
  );
}