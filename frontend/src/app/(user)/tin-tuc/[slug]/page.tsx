import Image from "next/image";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import CommentBox from "@/components/CommentBox";
import { getArticleBySlug, getArticles, getCategories } from "@/services/articleService";
import { getCommentsByArticleId } from "@/services/commentService";

type TinTucSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TinTucSlugPage({ params }: TinTucSlugPageProps) {
  const { slug } = await params;
  const [article, allArticles, categoryLabels, comments] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(),
    getCategories(),
    getCommentsByArticleId(slug),
  ]);

  const categories = categoryLabels
    .filter((label) => label !== "Tất cả")
    .map((label) => ({
      label,
      count: allArticles.filter((item) => item.category === label).length,
      active: article ? label === article.category : false,
    }));

  const latestNews = allArticles
    .filter((item) => item.slug !== slug)
    .slice(0, 3)
    .map((item, index) => ({
      slug: item.slug,
      title: item.title,
      date: index === 0 ? "2 giờ trước" : index === 1 ? "1 ngày trước" : "2 ngày trước",
      summary: item.bodyLead,
      image: item.heroImage,
    }));

  if (!article) {
    return (
      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <Link href="/" className="transition-colors hover:text-[#1f7a5a]">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <Link href="/tin-tuc" className="transition-colors hover:text-[#1f7a5a]">
            Tin tức
          </Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="font-medium text-slate-900">Đang cập nhật</span>
        </nav>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f7a5a]/10 text-[#1f7a5a]">
            <span className="material-symbols-outlined">construction</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Bài viết đang cập nhật</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Nội dung chi tiết cho bài viết này chưa được đồng bộ dữ liệu thật. Vui lòng quay lại sau.
          </p>
          <Link
            href="/tin-tuc"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1f7a5a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#196448]"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Quay về danh sách tin tức
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <Link href="/" className="transition-colors hover:text-[#1f7a5a]">
          Trang chủ
        </Link>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <Link href="/tin-tuc" className="transition-colors hover:text-[#1f7a5a]">
          Tin tức
        </Link>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <Link href="/tin-tuc" className="transition-colors hover:text-[#1f7a5a]">
          {article.category}
        </Link>
        <span className="material-symbols-outlined text-base">chevron_right</span>
        <span className="max-w-[300px] truncate font-medium text-slate-900">{article.title}</span>
      </nav>

      <div className="grid grid-cols-12 items-start gap-8 lg:gap-12">
        <article className="col-span-12 flex flex-col gap-6 lg:col-span-8">
          <div className="flex flex-col gap-4">
            <div>
              <span className="rounded bg-[#1f7a5a]/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1f7a5a]">
                {article.category}
              </span>
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl lg:text-5xl">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-4 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">calendar_today</span>
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">person</span>
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-1.5 lg:ml-auto">
                <span className="material-symbols-outlined text-base">visibility</span>
                <span>{article.views}</span>
              </div>
            </div>
          </div>

          <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-[16/9] w-full">
              <Image src={article.heroImage} alt={article.title} fill className="object-cover" unoptimized sizes="(min-width: 1024px) 65vw, 100vw" />
            </div>
            <figcaption className="bg-slate-100 p-3 text-center text-sm italic text-slate-600">{article.heroCaption}</figcaption>
          </figure>

          <div className="flex flex-wrap gap-3 py-1">
            <button className="flex items-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1877F2]/90">
              <span className="material-symbols-outlined text-[20px]">share</span>
              Chia sẻ Facebook
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-[#0068FF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0068FF]/90">
              <span className="material-symbols-outlined text-[20px]">chat</span>
              Chia sẻ Zalo
            </button>
            <button className="ml-auto flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-300">
              <span className="material-symbols-outlined text-[20px]">link</span>
              Sao chép liên kết
            </button>
          </div>

          <div className="prose prose-lg max-w-none leading-relaxed text-slate-800">
            <p className="mb-6 text-lg font-medium text-slate-900">{article.bodyLead}</p>
            {article.bodyParagraphs.map((paragraph) => (
              <p key={paragraph} className="mb-4">
                {paragraph}
              </p>
            ))}

            <h3 className="mb-4 mt-8 text-2xl font-bold text-slate-900">{article.sectionTitle}</h3>
            <p className="mb-4">{article.sectionIntro}</p>
            <ul className="mb-6 list-disc space-y-2 pl-6">
              {article.sectionBullets.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}:</strong> {item.text}
                </li>
              ))}
            </ul>

            <figure className="my-8 overflow-hidden rounded-xl border border-slate-200">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={article.subImage}
                  alt={article.subCaption}
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="(min-width: 1024px) 65vw, 100vw"
                />
              </div>
              <figcaption className="bg-slate-100 p-3 text-center text-sm italic text-slate-600">{article.subCaption}</figcaption>
            </figure>
          </div>

          <div className="mt-2 flex items-center gap-2 border-t border-slate-200 pt-6">
            <span className="material-symbols-outlined text-slate-500">sell</span>
            <span className="text-sm font-medium text-slate-700">Từ khóa:</span>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link key={tag} href="/tin-tuc" className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 transition-colors hover:bg-slate-200">
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col items-stretch justify-between gap-4 border-t border-slate-200 py-8 sm:flex-row sm:items-center">
            <Link href="/tin-tuc" className="group flex items-center gap-3 sm:max-w-[45%]">
              <div className="flex size-10 items-center justify-center rounded-full border border-slate-300 transition-all group-hover:border-[#1f7a5a] group-hover:bg-[#1f7a5a] group-hover:text-white">
                <span className="material-symbols-outlined">arrow_back</span>
              </div>
              <div className="flex flex-col">
                <span className="mb-1 text-xs uppercase tracking-wider text-slate-500">Bài trước</span>
                <span className="line-clamp-2 text-sm font-medium text-slate-900 transition-colors group-hover:text-[#1f7a5a]">
                  Thông báo lịch tiếp công dân tháng 11/2024
                </span>
              </div>
            </Link>

            <Link href="/tin-tuc" className="group flex items-center justify-end gap-3 text-right sm:max-w-[45%]">
              <div className="flex flex-col">
                <span className="mb-1 text-xs uppercase tracking-wider text-slate-500">Bài tiếp theo</span>
                <span className="line-clamp-2 text-sm font-medium text-slate-900 transition-colors group-hover:text-[#1f7a5a]">
                  Ra quân dọn dẹp vệ sinh môi trường tuyến đường kiểu mẫu
                </span>
              </div>
              <div className="flex size-10 items-center justify-center rounded-full border border-slate-300 transition-all group-hover:border-[#1f7a5a] group-hover:bg-[#1f7a5a] group-hover:text-white">
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </Link>
          </div>

          <CommentBox comments={comments} />
        </article>

        <aside className="col-span-12 lg:col-span-4 lg:sticky lg:top-24">
          <div className="flex flex-col gap-8">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3 text-lg font-bold text-slate-900">
                <span className="material-symbols-outlined text-[#1f7a5a]">category</span>
                Chuyên mục
              </h3>
              <ul className="flex flex-col gap-1">
                {categories.map((item) => (
                  <li key={item.label}>
                    <Link
                      href="/tin-tuc"
                      className={`group flex items-center justify-between py-2 text-sm ${
                        item.active ? "font-medium text-[#1f7a5a]" : "text-slate-700 transition-colors hover:text-[#1f7a5a]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`material-symbols-outlined text-sm ${
                            item.active ? "opacity-100" : "opacity-0 transition-opacity group-hover:opacity-100"
                          }`}
                        >
                          arrow_right
                        </span>
                        {item.label}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs ${item.active ? "bg-[#1f7a5a]/10 text-[#1f7a5a]" : "bg-slate-100 text-slate-600"}`}>
                        {item.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3 text-lg font-bold text-slate-900">
                <span className="material-symbols-outlined text-[#1f7a5a]">update</span>
                Tin mới nhất
              </h3>
              <div className="flex flex-col gap-4">
                {latestNews.map((item) => (
                  <ArticleCard key={item.slug} {...item} layout="horizontal" />
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-xl">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmV8EonWtCpmmBIe51DW2fzJPbniXb88cCkYDme909CaKEX_YLVAajuo48w9iidPtpFLKbXCN_j6xLo0_z67wy_6eiIZE_H6RDn6H6LyFOkOyReKJt-QXJ3VczrRp_vcnON98wgmKlNnZa1pt4Pw3TZJ1KGv9xhi6x-y2l8vCLIvjIZHEkZmPFOnD22Fh6Jh5oYFIJ4IZuKLkCq77LcmwpIq3Qpb8OdwnPxudP2cr4Djsey-7OfHM9FQkp2VtyBq_7AczEmYIqII39"
                  alt="Banner tuyên truyền"
                  fill
                  className="object-cover"
                  unoptimized
                  sizes="(min-width: 1024px) 35vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
                <div className="absolute bottom-0 z-10 p-5 text-white">
                  <span className="mb-2 inline-block rounded bg-[#db2777] px-2 py-0.5 text-[10px] font-bold uppercase">Thông báo quan trọng</span>
                  <h4 className="mb-2 text-lg font-bold leading-tight">Tải ứng dụng Công dân Đồng Tháp</h4>
                  <button className="rounded-lg border border-white/30 bg-white/20 px-4 py-1.5 text-sm backdrop-blur-sm transition-colors hover:bg-white/30">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}
