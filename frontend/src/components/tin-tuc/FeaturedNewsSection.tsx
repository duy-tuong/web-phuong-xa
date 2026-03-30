"use client";

import Image from "next/image";
import Link from "next/link";

import { parseViews } from "@/lib/news";
import { copyLink, openShareUrl } from "@/lib/share";
import type { Article } from "@/types/article";

type FeaturedNewsSectionProps = {
  articles: Article[];
};

export default function FeaturedNewsSection({ articles }: FeaturedNewsSectionProps) {
  const featuredArticle = articles[0];
  const spotlightItems = articles.slice(1, 4);
  const popularNews = [...articles].sort((left, right) => parseViews(right.views) - parseViews(left.views)).slice(0, 3);
  const weeklyHighlights = articles.slice(3, 5);

  if (!featuredArticle) {
    return null;
  }

  const articleUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/tin-tuc/${featuredArticle.slug}`
      : `/tin-tuc/${featuredArticle.slug}`;

  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-8">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div className="border-b border-[#1f7a5a]/10 pb-4">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Tin tuc noi bat</h2>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="sticky top-24 hidden h-fit shrink-0 flex-col gap-3 pt-2 sm:flex">
            <button
              type="button"
              onClick={() => openShareUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm transition-colors hover:bg-[#166FE5]"
              title="Chia se Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 666.667 666.667" className="h-4 w-4" aria-hidden="true">
                <g transform="matrix(1.33333 0 0 -1.33333 -133.333 800)">
                  <path
                    d="M0 0c0 138.071-111.929 250-250 250S-500 138.071-500 0c0-117.245 80.715-215.622 189.606-242.638v166.242h-51.552V0h51.552v32.919c0 85.092 38.508 124.532 122.048 124.532 15.838 0 43.167-3.105 54.347-6.211V81.986c-5.901.621-16.149.932-28.882.932-40.993 0-56.832-15.528-56.832-55.9V0h81.659l-14.028-76.396h-67.631v-171.773C-95.927-233.218 0-127.818 0 0"
                    fill="#0866ff"
                    transform="translate(600 350)"
                  />
                  <path
                    d="m0 0 14.029 76.396H-67.63v27.019c0 40.372 15.838 55.899 56.831 55.899 12.733 0 22.981-.31 28.882-.931v69.253c-11.18 3.106-38.509 6.212-54.347 6.212-83.539 0-122.048-39.441-122.048-124.533V76.396h-51.552V0h51.552v-166.242a250.559 250.559 0 0 1 60.394-7.362c10.254 0 20.358.632 30.288 1.831V0Z"
                    fill="#fff"
                    transform="translate(447.918 273.604)"
                  />
                </g>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => openShareUrl(`https://zalo.me/share?url=${encodeURIComponent(articleUrl)}`)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0068FF] text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#005AE6]"
              title="Chia se Zalo"
            >
              Zalo
            </button>
            <button
              type="button"
              onClick={() => void copyLink(articleUrl)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition-colors hover:bg-slate-200"
              title="Sao chep lien ket"
            >
              <span className="material-symbols-outlined text-[20px]">link</span>
            </button>
          </div>

          <Link
            href={`/tin-tuc/${featuredArticle.slug}`}
            className="group flex flex-1 flex-col overflow-hidden rounded-xl border border-[#1f7a5a]/10 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
          >
            {featuredArticle.heroImage ? (
              <div className="relative aspect-video w-full overflow-hidden sm:aspect-[16/9]">
                <Image
                  alt={featuredArticle.title}
                  src={featuredArticle.heroImage}
                  fill
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                  sizes="(min-width: 640px) 66vw, 100vw"
                />
                <div className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                  Tin noi bat
                </div>
              </div>
            ) : (
              <div className="border-b border-[#1f7a5a]/10 px-6 pt-6">
                <div className="inline-flex rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                  Tin noi bat
                </div>
              </div>
            )}

            <div className="flex flex-1 flex-col justify-between gap-4 p-4 sm:p-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    {featuredArticle.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    {featuredArticle.views}
                  </span>
                </div>
                <h2 className="text-xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-[#1f7a5a] sm:text-3xl">
                  {featuredArticle.title}
                </h2>
                <p className="line-clamp-3 text-base leading-relaxed text-slate-600">{featuredArticle.bodyLead}</p>
              </div>

              <div className="flex items-center gap-3 border-t border-[#1f7a5a]/10 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1f7a5a]/20 bg-[#1f7a5a]/10 text-sm font-bold text-[#1f7a5a]">
                  {featuredArticle.author.slice(0, 1).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">{featuredArticle.author}</span>
                  <span className="text-xs text-slate-500">{featuredArticle.category}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h3 className="flex items-center border-l-4 border-[#1f7a5a] pl-3 text-xl font-bold text-slate-900">
            Tieu diem trong tuan
          </h3>
          <div className="flex flex-col gap-4">
            {spotlightItems.map((item) => (
              <Link
                key={item.slug}
                href={`/tin-tuc/${item.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-[#1f7a5a]/10 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                {item.heroImage ? (
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:w-28">
                    <Image
                      alt={item.title}
                      src={item.heroImage}
                      fill
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                      sizes="112px"
                    />
                  </div>
                ) : null}
                <div className="flex h-full flex-col justify-between gap-1 py-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1f7a5a]">{item.category}</span>
                  <h4 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#1f7a5a]">
                    {item.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 rounded-xl border border-[#1f7a5a]/10 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="material-symbols-outlined text-[20px] text-[#1f7a5a]">trending_up</span>
              Tin doc nhieu
            </h3>
            <ul className="flex flex-col gap-4">
              {popularNews.map((item, index) => (
                <li key={item.slug}>
                  <Link href={`/tin-tuc/${item.slug}`} className="group flex items-start gap-3">
                    <span className="mt-1 text-3xl font-black leading-none text-slate-200 transition-colors group-hover:text-[#1f7a5a]">
                      {index + 1}
                    </span>
                    <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-[#1f7a5a]">
                      {item.title}
                    </h4>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="h-px w-full bg-slate-100" />

          <div className="flex flex-col gap-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="material-symbols-outlined text-[20px] text-[#1f7a5a]">star</span>
              Tin noi bat tuan
            </h3>
            <div className="flex flex-col gap-3">
              {weeklyHighlights.map((item) => (
                <Link key={item.slug} href={`/tin-tuc/${item.slug}`} className="group flex items-center gap-3">
                  {item.heroImage ? (
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-slate-200">
                      <Image
                        alt={item.title}
                        src={item.heroImage}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        unoptimized
                      />
                    </div>
                  ) : null}
                  <h4 className="line-clamp-2 text-sm font-medium text-slate-700 transition-colors group-hover:text-[#1f7a5a]">
                    {item.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
