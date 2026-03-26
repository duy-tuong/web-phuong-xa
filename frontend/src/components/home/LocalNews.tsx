import Link from "next/link";
import Image from "next/image";

import type { Article } from "@/types/article";

interface LocalNewsProps {
  articles: Article[];
}

export default function LocalNews({ articles }: LocalNewsProps) {
  const featuredArticle = articles[0];
  const sideArticles = articles.slice(1, 4);

  if (!featuredArticle) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
      <h2 className="mb-6 text-2xl font-black text-slate-900 md:mb-10 md:text-3xl">Tin Tuc Dia Phuong</h2>
      <div className="grid gap-8 lg:grid-cols-12">
        <Link href={`/tin-tuc/${featuredArticle.slug}`} className="group block lg:col-span-7">
          <div className="mb-6 aspect-video overflow-hidden rounded-3xl">
            <Image
              alt={featuredArticle.title}
              src={featuredArticle.heroImage}
              width={1200}
              height={700}
              unoptimized
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
          <div className="mb-3 flex items-center gap-3 text-sm text-slate-500">
            <span className="font-bold text-emerald-700">{featuredArticle.category}</span>
            <span>&bull;</span>
            <span>{featuredArticle.date}</span>
          </div>
          <h3 className="mb-4 text-2xl font-bold leading-tight text-slate-900 transition group-hover:text-emerald-700 md:text-3xl">
            {featuredArticle.title}
          </h3>
          <p className="text-lg leading-relaxed text-slate-600">{featuredArticle.bodyLead}</p>
        </Link>

        <div className="flex flex-col lg:col-span-5">
          {sideArticles.map((item, index) => (
            <Link
              key={item.slug}
              href={`/tin-tuc/${item.slug}`}
              className={`group border-slate-200 py-6 ${index !== sideArticles.length - 1 ? "border-b" : ""}`}
            >
              <div className="mb-2 flex items-center gap-3 text-xs text-slate-500">
                <span className="font-bold text-pink-600">{item.category}</span>
                <span>&bull;</span>
                <span>{item.date}</span>
              </div>
              <h4 className="text-xl font-bold leading-snug text-slate-900 group-hover:text-emerald-700">{item.title}</h4>
            </Link>
          ))}
          <Link href="/tin-tuc" className="pt-4 text-sm font-bold text-emerald-700 hover:underline">
            Xem tat ca tin tuc
          </Link>
        </div>
      </div>
    </section>
  );
}
