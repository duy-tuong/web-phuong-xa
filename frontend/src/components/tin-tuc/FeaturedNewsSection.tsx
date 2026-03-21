import Image from "next/image";
import Link from "next/link";

const spotlightItems = [
  {
    slug: "phat-dong-phong-trao-ngay-chu-nhat-xanh-lam-sach-duong-pho",
    tag: "Môi Trường",
    tagClass: "text-primary",
    title: "Phát động phong trào 'Ngày Chủ nhật xanh' làm sạch đường phố",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDZIbRDx40vlTqVCTAPgQr11ikTD7JspJtc8CqjwkB0HxleLoitn6224b8--bg9W-pUwsKpOifDJxqhJbdIEmlEaytklGFirIbbE05QrggWMQ0hTSxao1wDEzv8J93fPiwwDEc0Pp_corC8jV4iKoac2491BGeHKeR25piRa8JCz9fCxuieP4PaBrPVzoihecQYMR7TL_7-3afnQXeXkhAQL062GNBI2vOE6WyRMMZ3Pb2JqWLFN1BpXuMPdHCoYut8VYoM3VXt2JIM",
  },
  {
    slug: "trao-tang-100-suat-qua-cho-cac-ho-gia-dinh-co-hoan-canh-kho-khan",
    tag: "Xã Hội",
    tagClass: "text-blue-600",
    title: "Trao tặng 100 suất quà cho các hộ gia đình có hoàn cảnh khó khăn",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBC5vEnXdVTgK7V6fG3D_8wot7mvmJRIEPYe3huprgnHAMvhqeGKw6JaW0V6mZzMnk1ztUKXVgPBcL_dpJjVwLI1J8uUjcEWk2lE_I6Vy9rna24a78QHp-ouerrX7Z2M9T0HvqrW0mmkzT1Fg3Ci8nuCpF14HeHPOoRtFEPAPkMVDjPO0-QNOIpQpzB4hcGFku4BAbQKWjSu-tnZKMjgfVToDSgyg6fCVHLpNTu8dOrtMp2KnQrQPdSLQR9RzNjHcoPy3luNEUAxeDf",
  },
  {
    slug: "cong-bo-ke-hoach-phat-trien-ha-tang-giao-thong-khu-vuc-trung-tam",
    tag: "Kinh Tế",
    tagClass: "text-orange-600",
    title: "Công bố kế hoạch phát triển hạ tầng giao thông khu vực trung tâm",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBoZ-nHOhvIG7mEAvqb4v-itWDDqJ9z-Q3hdlNZMTYfGP5jY6gIW8lL-Gbpvkz2BknnOWClT3JxrCTN_UazkdEH-zPXtoZWQI3b1Sw7MNhnBRbLpjAjfBbZGEnilefIumiYRk7htgiXvWarsd_fJGCsJql98ToZ2TMhiqCoIFfi9OvDO8xErzearwZe_XuTUBuaTxmDPtCAWacAJqQIItRdwrPFzLej33lHCYDv8Mg5bE3LXuFIyetAl1hFqR5dwskncnQng7yp9eUC",
  },
];

const popularNews = [
  {
    slug: "huong-dan-thu-tuc-cap-doi-can-cuoc-cong-dan-gan-chip-dien-tu",
    title: "Hướng dẫn thủ tục cấp đổi Căn cước công dân gắn chip điện tử tại phường",
  },
  {
    slug: "lich-tiep-cong-dan-cua-chu-tich-ubnd-phuong-thang-10-2023",
    title: "Lịch tiếp công dân của Chủ tịch UBND Phường tháng 10/2023",
  },
  {
    slug: "thong-bao-lich-thu-gom-rac-thai-sinh-hoat-tren-dia-ban-cac-khom",
    title: "Thông báo lịch thu gom rác thải sinh hoạt trên địa bàn các khóm",
  },
];

const weeklyHighlights = [
  {
    slug: "soi-noi-giai-bong-da-thanh-nien-truyen-thong-nam-2023",
    title: "Sôi nổi giải bóng đá thanh niên truyền thống năm 2023",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCA1o1DoqGMylMMf0Ngwe-jcAFIkTLboQv1VxF1gCJpJUEF7PMdNsg7UfzSS_ZG1GsR0hkxivL0uS-gQiOo3FacTAizHkGmA30fLlUC3BZcNIiu_983nFz5NRGRPAHpnmVPMEFBQ9SsdPZAn-vkq0IcQxDCmsyXh-P2GtMD9rfHz4Pe-EpnbMHePsBCxJ_kagNA6H-yHJ7XR2oBWBDbK640LYA1YweVDIGvYp2O762NwEr7wg83d1lMSn9V67GhTKyCMhJWgH-mmReB",
  },
  {
    slug: "hoi-thi-nau-an-chao-mung-ngay-phu-nu-viet-nam-20-10",
    title: "Hội thi nấu ăn chào mừng Ngày Phụ nữ Việt Nam 20/10",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCuUEF_j9MBfzvUWlEDsmRO7gZ4rQ1oZJgYKIjkHakv9jEkJGv8JA079xZwNEL3dPB9eZnWYuUhw2HE--6v9uBR78pQ1N9qInd47zN85QWENCVRGFzoiG2FLEIhDh4pY2uHECDhl-aoKF7D3Js5Y6dvE-kdUh1COyKgnzZcc2M2ZiaMHNbKd-ZI3_d7HJ0lMvLeBq-vfiz_OHFIhuZGhEAPKuUZrIiIMDnNq9YqGCZ4ZuquNw9oStnYyKRRww5-vpHQNXQfM7m-Bd-a",
  },
];

export default function FeaturedNewsSection() {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div className="flex items-center justify-between border-b border-[#1f7a5a]/10 pb-4">
          <h2 className="text-2xl font-bold text-slate-900">Tin Tức Nổi Bật</h2>
          <div className="relative flex h-10 w-48 items-center rounded-lg border border-slate-200 bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#1f7a5a]/50">
            <span className="material-symbols-outlined ml-3 mr-2 text-slate-400">sort</span>
            <select className="h-full w-full cursor-pointer appearance-none border-none bg-transparent pr-8 text-sm text-slate-700 outline-none">
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="popular">Xem nhiều nhất</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-3 text-slate-400">expand_more</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="sticky top-24 hidden h-fit shrink-0 flex-col gap-3 pt-2 sm:flex">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm transition-colors hover:bg-[#166FE5]" title="Chia sẻ Facebook">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0068FF] text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#005AE6]" title="Chia sẻ Zalo">
              Zalo
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-sm transition-colors hover:bg-slate-200" title="Copy Link">
              <span className="material-symbols-outlined text-[20px]">link</span>
            </button>
          </div>

          <Link
            href="/tin-tuc/ubnd-phuong-cao-lanh-to-chuc-hoi-nghi"
            className="group flex flex-1 flex-col overflow-hidden rounded-xl border border-[#1f7a5a]/10 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <div className="relative aspect-video w-full overflow-hidden sm:aspect-[16/9]">
              <Image
                alt="Hội nghị đại biểu nhân dân phường Cao Lãnh"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoyZZ2-yE7j5NNCVoKSkaJleVOnkOdogPPF-6rObjgj3suUNcEdKgAatq0-AjUgNis2Ny-XN2tszN8sNoff2GHCh2vm6DUUeNrtKv_32kuYHgw7WjaZmzizcgAtCT-SeDAqEsnBU3TJLu0Ee6Fy2pxvdRQHISQu2-khbVUGq_JZ_bUTUCL0ej0op7klIT3bqFvOJ8zhRdyKDZeW2f5Q-x8GZ83z-mWR7GQc_jipqXj-cVTcaZjVmwXwvfhEwX-CeVzUB_FgO2Hp32V"
                fill
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
                sizes="(min-width: 640px) 66vw, 100vw"
              />
              <div className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                Tin Nổi Bật
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between gap-4 p-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    12 Tháng 10, 2023
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    1.2k lượt xem
                  </span>
                </div>
                <h2 className="text-2xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-[#1f7a5a] sm:text-3xl">
                  Đại hội đại biểu Mặt trận Tổ quốc Việt Nam Phường Cao Lãnh nhiệm kỳ 2024-2029 thành công tốt đẹp
                </h2>
                <p className="line-clamp-3 text-base leading-relaxed text-slate-600">
                  Sáng ngày 12/10, Ủy ban Mặt trận Tổ quốc Việt Nam Phường Cao Lãnh đã tổ chức trọng thể Đại hội đại biểu lần thứ X,
                  nhiệm kỳ 2024-2029. Đại hội đã đánh giá kết quả thực hiện Nghị quyết nhiệm kỳ qua và đề ra phương hướng, nhiệm vụ
                  trong thời gian tới.
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-[#1f7a5a]/10 pt-4">
                <Image
                  alt="Tác giả"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF3UFMfn4Z7WLShqjs4KEakEH_qXA3ppbmq4b7KOritX8Q1GocC9fXgPsA21kDeWpNeMOSsUFG5qNFCYm_wq28yHBaXkjGM4R1LoRquHmimnJdicF2xGUNN7jsZcpFtBGkwKtp7LRN5tiSdhjj8x_02ZEoHdAD7EnSkNtNyx30GwePwqruSmpTLw3EO7iPPQB8ubOgEtPxmdsGRqOJFApT2moOLZpb74Y9tMmviAmK7BcKgAkHrgSnLXMqpMd3S3Nx3m17VIIGOlm0"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full border border-[#1f7a5a]/20 object-cover"
                  unoptimized
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">Ban Biên Tập</span>
                  <span className="text-xs text-slate-500">Phường Cao Lãnh</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h3 className="flex items-center border-l-4 border-[#1f7a5a] pl-3 text-xl font-bold text-slate-900">Tiêu Điểm Trong Tuần</h3>
          <div className="flex flex-col gap-4">
            {spotlightItems.map((item) => (
              <Link
                key={item.slug}
                href={`/tin-tuc/${item.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-[#1f7a5a]/10 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:w-28">
                  <Image
                    alt={item.title}
                    src={item.image}
                    fill
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                    sizes="112px"
                  />
                </div>
                <div className="flex h-full flex-col justify-between gap-1 py-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${item.tagClass}`}>{item.tag}</span>
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
              Tin Đọc Nhiều
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
              Tin Nổi Bật Tuần
            </h3>
            <div className="flex flex-col gap-3">
              {weeklyHighlights.map((item) => (
                <Link key={item.slug} href={`/tin-tuc/${item.slug}`} className="group flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-slate-200">
                    <Image
                      alt={item.title}
                      src={item.image}
                      width={56}
                      height={56}
                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      unoptimized
                    />
                  </div>
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
