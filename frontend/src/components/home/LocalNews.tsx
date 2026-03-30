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
      <h2 className="mb-5 text-xl font-black text-slate-900 sm:text-2xl md:mb-10 md:text-3xl">Tin tức địa phương</h2>
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <Link href={`/tin-tuc/${featuredArticle.slug}`} className="group block lg:col-span-7">
          {featuredArticle.heroImage || featuredArticle.subImage ? (
            <div className="mb-6 aspect-video overflow-hidden rounded-3xl">
              <Image
                alt={featuredArticle.title}
                src={featuredArticle.heroImage || featuredArticle.subImage || ""}
                width={1200}
                height={700}
                unoptimized
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
          ) : null}
          <div className="mb-3 flex items-center gap-3 text-sm text-slate-500">
            <span className="font-bold text-emerald-700">{featuredArticle.category}</span>
            <span>&bull;</span>
            <span>{featuredArticle.date}</span>
          </div>
          <h3 className="mb-4 text-xl font-bold leading-tight text-slate-900 transition group-hover:text-emerald-700 sm:text-2xl md:text-3xl">
            {featuredArticle.title}
          </h3>
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg">{featuredArticle.bodyLead}</p>
        </Link>

        <div className="flex flex-col lg:col-span-5">
          {sideArticles.map((item, index) => (
            <Link
              key={item.slug}
              href={`/tin-tuc/${item.slug}`}
              className={`group border-slate-200 py-6 ${index !== sideArticles.length - 1 ? "border-b" : ""}`}
            >
              <div className="flex items-start gap-4">
                {item.heroImage || item.subImage ? (
                  <div className="relative hidden h-24 w-32 overflow-hidden rounded-2xl sm:block">
                    <Image
                      alt={item.title}
                      src={item.heroImage || item.subImage || ""}
                      fill
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="128px"
                    />
                  </div>
                ) : null}

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-bold text-pink-600">{item.category}</span>
                    <span>&bull;</span>
                    <span>{item.date}</span>
                  </div>
                  <h4 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-emerald-700 sm:text-xl">
                    {item.title}
                  </h4>
                </div>
              </div>
            </Link>
          ))}
          <Link href="/tin-tuc" className="pt-4 text-sm font-bold text-emerald-700 hover:underline">
            Xem tất cả tin tức
          </Link>
        </div>
      </div>
    </section>
  );
}
