// Hiển thị sidebar bên phải của trang chi tiết bài viết/tin tức, bao gồm các chuyên mục liên quan, tin mới nhất, và banner quảng cáo.
import Image from "next/image";
import Link from "next/link";

const categories = [
  { label: "Tin tức xã hội", count: 45 },
  { label: "Thông báo", count: 128 },
  { label: "Cải cách hành chính", count: 32, active: true },
  { label: "Văn hóa - Thể thao", count: 67 },
];

const latestNews = [
  {
    title: "Hướng dẫn đăng ký tài khoản định danh điện tử mức 2",
    timeAgo: "2 giờ trước",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDqKaKp60rtRluFTNDr5UZnW3eY3x9-CaYolNhLZCrjNN8v4vKXl7O8T2VlTqMNRGwePzaJgrJJ59y2joleZ5LljIKFG9ULFzzBs99R1b0yTG5vdJ_Jh3O4KSr24jGqthbJsNnUqV2e9l_IphS7vo9GvMnHEi8_9FpVqDfPaXaF6t0wmu5ZD40CP1LkKG_wSNSp6uB9ye79ToDCr1dB6_uy0VBHYN6_IewLbFwOHMFDVPpiExCBTRPQU2lPY2vj2673xhzjOtqkU5XR",
  },
  {
    title: "Lịch cắt điện luân phiên trên địa bàn phường tuần tới",
    timeAgo: "1 ngày trước",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD50a17i01b0npsVJYg3lPx7WZaWQHp_-r9rBnCYLzt5KO9PEF9s7cWbnk9jTyNI8j2eYNtxzbFtXx28JwxjE0sWDvNMQjiSkcXK0B2LEXuCFaIP2UFNe1HN7B3nIdxm1rn1WJw00c8LnmVfWtMJUlTHsasVP1rLMTaKA1pftczDcZKzCd448vHQH0JEnk-On7MKG-3vB1612ckfNEdDtJV6NoWmjdCRc_1SBPpWy4DuW3MdJfQJU-QtCupIYWjIz3H5LHT28PcMZgF",
  },
  {
    title: "Trao tặng quà cho hộ nghèo nhân dịp lễ hội",
    timeAgo: "2 ngày trước",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpEhKO0x2MpN1gpITIILwhAH_AjhZrG9O-4Zj9J9SwqE4gMj57JJB5mh9m20VvLuEfhUGFTS5kcgYphqG374xdzsB8bsAZXi5kVMwwn2fTYOqMxZaE2yryTR_H-lqxGSErOI42RowuRCJ-Am8w5KdXhnSI9xcGbz7N5lCE3AdCOSl6VJNopefMR-CfRVE26EPlaZvpZjc8hPW2Pq0gHcJyPlSHtwqnd09bN_dm9vXSm23Scz7LPP6lVNGmq9tCAkXb2WWxF5XRrO_G",
  },
];

export default function ArticleDetailSidebar() {
  return (
    <aside className="w-full lg:sticky lg:top-24 lg:w-[35%]">
      <div className="flex flex-col gap-8">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3 text-lg font-bold text-slate-900">
            <span className="material-symbols-outlined text-[#1f7a5a]">category</span>
            Chuyên mục
          </h3>
          <ul className="flex flex-col gap-1">
            {categories.map((item) => {
              const baseClass = item.active
                ? "text-[#1f7a5a] font-medium"
                : "text-slate-700 transition-colors hover:text-[#1f7a5a]";

              const badgeClass = item.active
                ? "bg-[#1f7a5a]/10 text-[#1f7a5a]"
                : "bg-slate-100 text-slate-600";

              return (
                <li key={item.label}>
                  <Link href="/tin-tuc" className={`group flex items-center justify-between py-2 text-sm ${baseClass}`}>
                    <span className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-sm ${item.active ? "opacity-100" : "opacity-0 transition-opacity group-hover:opacity-100"}`}>
                        arrow_right
                      </span>
                      {item.label}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${badgeClass}`}>{item.count}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3 text-lg font-bold text-slate-900">
            <span className="material-symbols-outlined text-[#1f7a5a]">update</span>
            Tin mới nhất
          </h3>
          <div className="flex flex-col gap-4">
            {latestNews.map((item) => (
              <Link key={item.title} href="/tin-tuc" className="group flex gap-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="80px"
                  />
                </div>
                <div className="flex flex-col justify-between py-0.5">
                  <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[#1f7a5a]">
                    {item.title}
                  </h4>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {item.timeAgo}
                  </span>
                </div>
              </Link>
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
  );
}
