import Link from "next/link";
import GalleryItem, { type GalleryItemData } from "@/components/thu-vien/GalleryItem";

const photos: GalleryItemData[] = [
  {
    title: "Lễ hội hoa Sen",
    desc: "Sắc màu rực rỡ trong ngày hội truyền thống",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB2qoqrl7bc1IcB-JmuXJVXDR3_bIuMR1jD-FMbGPjAECH4IDLDRVtWleiIUwN7Din8YRHARKf6y_2ZPFh9bvzx-h3TU0UPWcz3C2__gXuVFOB2j_S3_fqkAMzDnqnfMYq2X_Cn9-QQZrJBWlVycui3nBr4xqdknlsgAQ62NUis99Ota5fDh-1fXB76QAfEacCOCyiSXfj7OObVkqJrjyJ09VDltibkr-TKB2e97OPXU02vUMe-Tf4BA0CbkXej-2zVgYNi_mXiJXHy",
  },
  {
    title: "Chợ đêm Cao Lãnh",
    desc: "Không gian ẩm thực và mua sắm sầm uất",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAExJUPDQqG-SnOabzHShdMm_xKq18RakMA2wfaLP1-zlM4jxOcXQRrfW-12NWPfE3kMAHLN7vBTgo01jk9kDcFwpsrUcuwLHGPvF-yXz-hY1bqe357trVjqsPT66Bhn0Z75rPsnoOx2xu9H8gxBDvwvTiq94bgUheMD3MCLeujFwUNuQvg74tkpVhKi5ZxpA6EI98kfFZ2CFmMrkJYFrG8g_dgsZ30o4s-Y3MvBK3HHDJoqyQKIIaCH1rrLDbmHph5a4qubD3W9eiU",
  },
  {
    title: "Công viên Văn hóa",
    desc: "Không gian xanh giữa lòng thành phố",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPFdRCdDaxHIpEyMMmAl0srv4ECs1LPnYo3wcGZNwTXn45ZwrYLzvaSbQN52Qxbt_PyBqJIm5c2keDlCYkEPgrZ0apaq1vrxrVOT4fN6Q_FzgMfZIyEC4BaeRW_syLRGAFLokmdBotPb52zJ3SwokX_tFEALWBS97OJQASkML0An4PWJ3RZo9UfmIE3r2CS6M8Mr12MHSJKYoERNG1UOizPRnsHNzmhTDvOxnSSxzzYBk85x4RA1ixI2vY8glfqckp9zd6JpVA3vpo",
  },
];

export default function PhotoLibrarySection() {
  return (
    <section>
      <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <span className="material-symbols-outlined text-[#1f7a5a]">photo_library</span>
          Thư Viện Ảnh
        </h2>
        <Link href="/thu-vien/hinh-anh" className="flex items-center gap-1 text-sm font-semibold text-[#1f7a5a] hover:underline">
          Xem tất cả <span className="material-symbols-outlined text-sm">chevron_right</span>
        </Link>
      </div>

      <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3">
        {photos.map((photo) => (
          <GalleryItem key={photo.title} photo={photo} />
        ))}
      </div>
    </section>
  );
}
