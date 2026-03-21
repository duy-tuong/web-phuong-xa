import Image from "next/image";
import Link from "next/link";

const newsCards = [
  {
    slug: "khai-mac-giai-bong-da-thanh-nien-truyen-thong-phuong-cao-lanh-2023",
    category: "Thể Thao",
    categoryClass: "bg-purple-600",
    title: "Khai mạc giải bóng đá thanh niên truyền thống Phường Cao Lãnh năm 2023",
    description:
      "Giải đấu thu hút sự tham gia của 12 đội bóng đến từ các khóm trên địa bàn, nhằm thúc đẩy phong trào thể dục thể thao trong thanh thiếu niên.",
    date: "05/10/2023",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCA1o1DoqGMylMMf0Ngwe-jcAFIkTLboQv1VxF1gCJpJUEF7PMdNsg7UfzSS_ZG1GsR0hkxivL0uS-gQiOo3FacTAizHkGmA30fLlUC3BZcNIiu_983nFz5NRGRPAHpnmVPMEFBQ9SsdPZAn-vkq0IcQxDCmsyXh-P2GtMD9rfHz4Pe-EpnbMHePsBCxJ_kagNA6H-yHJ7XR2oBWBDbK640LYA1YweVDIGvYp2O762NwEr7wg83d1lMSn9V67GhTKyCMhJWgH-mmReB",
  },
  {
    slug: "thong-bao-tam-ngung-cung-cap-dien-mot-so-khu-vuc-de-bao-tri-tram-bien-ap",
    category: "Thông Báo Khẩn",
    categoryClass: "bg-red-500",
    title: "Thông báo tạm ngừng cung cấp điện một số khu vực để bảo trì trạm biến áp",
    description:
      "Điện lực khu vực thông báo lịch cắt điện luân phiên từ ngày 07/10 đến 09/10 tại các Khóm 1, Khóm 2 để phục vụ công tác nâng cấp lưới điện mùa mưa.",
    date: "04/10/2023",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAlmRiEKiavvJdLovK2a3sEHtRGVDZSMET9zrNOglbL4jzJSnQcuk5Omj-u7vThe7FGa_B2rxvPTXr8IdH8-AojKiSwjFMdUnHy00mRTWbJ1_eDbo5k1RbWDCX8829h1mLV4h_GlXBCZY_ChbhMF-0S8knpudO8mVhWPi_Uyva_CPRppnEEJWHWLdSnUm934eJayUwaR16uZE1Gnqfr1iLhHGktLuR5rMlQdmyF2YPjdzewboqe9mpOgJvUjUcGhSwKoxCHOZWbHuwe",
  },
  {
    slug: "soi-noi-hoi-thi-nau-an-chao-mung-ngay-phu-nu-viet-nam-20-10",
    category: "Văn Hóa",
    categoryClass: "bg-pink-600",
    title: "Sôi nổi Hội thi nấu ăn chào mừng Ngày Phụ nữ Việt Nam 20/10",
    description:
      "Hội Liên hiệp Phụ nữ Phường tổ chức hội thi ẩm thực truyền thống với chủ đề 'Bữa cơm gia đình ấm áp yêu thương' với 15 đội tham gia tranh tài.",
    date: "02/10/2023",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCuUEF_j9MBfzvUWlEDsmRO7gZ4rQ1oZJgYKIjkHakv9jEkJGv8JA079xZwNEL3dPB9eZnWYuUhw2HE--6v9uBR78pQ1N9qInd47zN85QWENCVRGFzoiG2FLEIhDh4pY2uHECDhl-aoKF7D3Js5Y6dvE-kdUh1COyKgnzZcc2M2ZiaMHNbKd-ZI3_d7HJ0lMvLeBq-vfiz_OHFIhuZGhEAPKuUZrIiIMDnNq9YqGCZ4ZuquNw9oStnYyKRRww5-vpHQNXQfM7m-Bd-a",
  },
];

export default function NewsArchiveSection() {
  return (
    <section className="flex flex-col gap-6 pt-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {newsCards.map((card) => (
          <Link
            key={card.slug}
            href={`/tin-tuc/${card.slug}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-[#1f7a5a]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                alt={card.title}
                src={card.image}
                fill
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className={`absolute left-3 top-3 rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${card.categoryClass}`}>
                {card.category}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5">
              <h3 className="line-clamp-2 text-lg font-bold leading-tight text-slate-900 transition-colors group-hover:text-[#1f7a5a]">
                {card.title}
              </h3>
              <p className="mb-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{card.description}</p>
              <div className="mt-auto flex items-center justify-between border-t border-[#1f7a5a]/10 pt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  {card.date}
                </span>
                <span className="flex items-center font-semibold text-[#1f7a5a]">
                  Xem thêm <span className="material-symbols-outlined align-middle text-[16px]">chevron_right</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1f7a5a]/20 text-slate-500 transition-colors hover:bg-[#1f7a5a]/10 hover:text-[#1f7a5a] disabled:opacity-50"
          disabled
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1f7a5a] font-medium text-white shadow-sm">1</button>
        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1f7a5a]/20 font-medium text-slate-700 transition-colors hover:bg-[#1f7a5a]/10 hover:text-[#1f7a5a]">
          2
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1f7a5a]/20 font-medium text-slate-700 transition-colors hover:bg-[#1f7a5a]/10 hover:text-[#1f7a5a]">
          3
        </button>
        <span className="px-1 text-slate-500">...</span>
        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1f7a5a]/20 font-medium text-slate-700 transition-colors hover:bg-[#1f7a5a]/10 hover:text-[#1f7a5a]">
          8
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#1f7a5a]/20 text-slate-700 transition-colors hover:bg-[#1f7a5a]/10 hover:text-[#1f7a5a]">
          <span className="material-symbols-outlined align-middle">chevron_right</span>
        </button>
      </div>
    </section>
  );
}
