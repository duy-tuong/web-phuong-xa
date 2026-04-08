//! công dụng của component này là hiển thị phần tin tức địa phương trên trang chủ, bao gồm một bài viết nổi bật và ba bài viết phụ, mỗi bài viết sẽ có hình ảnh, tiêu đề, thể loại và ngày đăng. Người
import Link from "next/link";
import Image from "next/image";

import type { Article } from "@/types/article";

interface LocalNewsProps {
  articles: Article[];
}

export default function LocalNews({ articles }: LocalNewsProps) {
  // LƯU Ý 1
  const featuredArticle = articles[0]; // tách bài đầu tiên (index 0) làm bài Hero to bự.
  const sideArticles = articles.slice(1, 4);  // Dùng slice(1, 4) để cắt đúng 3 bài tiếp theo làm danh sách vệ tinh bên phải.
// LƯU Ý 2: LẬP TRÌNH PHÒNG THỦ (Graceful Fallback)
  // Nếu mảng truyền vào bị rỗng (do lỗi API hoặc DB chưa có bài), nó sẽ return null để ẩn luôn khu vực này.
  if (!featuredArticle) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
      <h2 className="mb-5 text-xl font-black text-slate-900 sm:text-2xl md:mb-10 md:text-3xl">Tin tức địa phương</h2>
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        {/* === KHỐI BÀI VIẾT NỔI BẬT (FEATURED) === */}
        <Link href={`/tin-tuc/${featuredArticle.slug}`} className="group block lg:col-span-7">
         {/* LƯU Ý 3: XỬ LÝ HÌNH ẢNH */}
          {/* Dùng toán tử logic (||) để nói rằng: "Nếu không có hình chính, lấy hình phụ đắp vào. Nếu cả 2 đều không có thì giấu luôn cái khung hình đi". */}
          {featuredArticle.heroImage || featuredArticle.subImage ? (
            <div className="mb-6 aspect-video overflow-hidden rounded-3xl">
           {/* LƯU Ý 4 */}
              {/*dùng <Image> để Next.js hỗ trợ lazy load (cuộn tới đâu tải tới đó), tránh nặng web và tối ưu SEO ạ" */}
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
{/* === KHỐI 3 BÀI VIẾT VỆ TINH BÊN PHẢI (SIDE ARTICLES) === */}
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
                {/* LƯU Ý 5: TIẾT KIỆM BĂNG THÔNG VỚI sizes */}
                    {/* Chỗ này rất xịn! Cái sizes="128px" báo cho trình duyệt biết: "Hình này nhỏ xíu, chỉ cần tải bản thu nhỏ (thumbnail) tầm 128px thôi, đừng tải cái ảnh gốc độ phân giải cao gây tốn 3G". */}  
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
