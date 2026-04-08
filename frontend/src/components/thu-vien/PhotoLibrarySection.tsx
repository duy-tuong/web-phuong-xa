//* API trang thư viên ảnh 
import Link from "next/link";

import GalleryItem from "@/components/thu-vien/GalleryItem";
import LibraryPagination from "@/components/thu-vien/LibraryPagination";
import { fetchLibraryPhotoPage } from "@/services/mediaLibraryService";
//! LƯU Ý 1: ĐỊNH NGHĨA "CÔNG TẮC" (Props & Default Values)
// Chỗ này cực kỳ thông minh. Em định nghĩa sẵn các tham số đầu vào và gán giá trị mặc định cho nó (ví dụ mặc định lấy trang 1, lấy 4 tấm ảnh). 
// Nhờ những cái "công tắc" (showPagination, showViewAllLink) này mà file này có thể biến hình: Lúc thì làm bảng xem trước ở Sảnh chính, lúc thì làm danh sách phân trang ở Phòng trưng bày.
type PhotoLibrarySectionProps = {
  page?: number;
  pageSize?: number;
  showPagination?: boolean;
  showViewAllLink?: boolean;
  heading?: string;
  subheading?: string;
};

export default async function PhotoLibrarySection({
  page = 1,
  pageSize = 4,
  showPagination = false,
  showViewAllLink = true,
  heading = "Thư viện ảnh",
  subheading,
}: PhotoLibrarySectionProps) {
 //! LƯU Ý 2: REACT SERVER COMPONENT (Đỉnh cao của Next.js)
  // Em có để ý là file này KHÔNG HỀ xài `useEffect` hay `useState` không? Vì nó là Server Component (có chữ `async` trên tên hàm). Nó gọi API `fetchLibraryPhotoPage` trực tiếp ngay trên Server. Tốc độ lấy dữ liệu sẽ cực kỳ nhanh và SEO thì tuyệt đối 100 điểm.
  const photos = await fetchLibraryPhotoPage(page, pageSize);

  return (
    <section>
      {/* ... Phần Header chứa Tiêu đề và Nút "Xem tất cả" (sẽ ẩn hiện dựa vào công tắc showViewAllLink) ... */}
      <div className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <span className="material-symbols-outlined text-[#1f7a5a]">photo_library</span>
            {heading}
          </h2>
          {subheading ? <p className="mt-2 text-sm text-slate-600">{subheading}</p> : null}
        </div>
        {showViewAllLink ? (
          <Link
            href="/thu-vien/hinh-anh"
            className="flex items-center gap-1 text-sm font-semibold text-[#1f7a5a] hover:underline"
          >
            Xem tất cả
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        ) : null}
      </div>
{/* LƯU Ý 3: XỬ LÝ TRẠNG THÁI RỖNG (Empty State) & MAP DỮ LIỆU */}
      {/* Luôn phải bọc lót trường hợp Backend chưa có ảnh nào (length === 0) để không bị vỡ giao diện. */}
      {photos.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-600">
          Chưa có hình ảnh nào trong thư viện media.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {photos.items.map((photo) => (
              <GalleryItem key={photo.id} photo={photo} />
            ))}
          </div>
{/* Hiện thanh phân trang dựa vào công tắc showPagination */}
          {showPagination ? (
            <LibraryPagination
              basePath="/thu-vien/hinh-anh"
              currentPage={photos.page}
              totalPages={photos.totalPages}
            />
          ) : null}
        </>
      )}
    </section>
  );
}
