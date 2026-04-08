import Link from "next/link";

import LibraryPagination from "@/components/thu-vien/LibraryPagination";
import VideoItem from "@/components/thu-vien/VideoItem";
import { fetchLibraryVideoPage } from "@/services/mediaLibraryService";

//! LƯU Ý 1: KHAI BÁO PROPS LÀM COMPONENT ĐA HÌNH
// Khai báo các "công tắc" để tái sử dụng code. Tuỳ vào trang gọi nó mà ta truyền true/false để ẩn hiện Phân trang hoặc link Xem tất cả.
type VideoLibrarySectionProps = {
  page?: number;
  pageSize?: number;
  showPagination?: boolean;
  showViewAllLink?: boolean;
  heading?: string;
  subheading?: string;
};
//! LƯU Ý 2: REACT SERVER COMPONENT (Đỉnh cao tối ưu SEO)
// Chữ "async" ở đây cho biết đây là Server Component. Nó không dùng useEffect() mà chạy gọi API trực tiếp ngay trên server. Tốc độ render cực nhanh và Google quét (SEO) rất dễ.
export default async function VideoLibrarySection({
  page = 1,
  pageSize = 4,
  showPagination = false,
  showViewAllLink = false,
  heading = "Kho video",
  subheading,
}: VideoLibrarySectionProps) {
  //! LƯU Ý 3: CHỖ GỌI API ĐỂ LẤY DỮ LIỆU
  // Dòng này gián tiếp gọi API "GET /media/public?type=video". 
  // Hàm fetchLibraryVideoPage ở tầng Service sẽ lo liệu việc nối link và bắt lỗi, trả về danh sách video sạch sẽ.
  const videos = await fetchLibraryVideoPage(page, pageSize);

  return (
    <section>
      <div className="mb-8 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <span className="material-symbols-outlined text-[#1f7a5a]">video_library</span>
            {heading}
          </h2>
          {subheading ? <p className="mt-2 text-sm text-slate-600">{subheading}</p> : null}
        </div>
        {/* Nút "Xem tất cả" sẽ hiện ra nếu Props showViewAllLink = true */}
        {showViewAllLink ? (
          <Link
            href="/thu-vien/video"
            className="flex items-center gap-1 text-sm font-semibold text-[#1f7a5a] hover:underline"
          >
            Xem tất cả
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        ) : null}
      </div>
  {/* LƯU Ý 4: LẬP TRÌNH PHÒNG THỦ (Bắt trường hợp không có dữ liệu) */}
      {/* Phải luôn kiểm tra length === 0 để hiện thông báo lịch sự, không để màn hình trống trơn hay bị lỗi đỏ (crash web) khi Backend chưa có dữ liệu. */}
      {videos.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-600">
          Hiện chưa có video nào được đăng trong thư viện media.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
           {/* LƯU Ý 5: MAP DỮ LIỆU VÀO COMPONENT CON */}
            {/* Dùng vòng lặp .map() để duyệt qua mảng video, mỗi phần tử sẽ được đưa cho component <VideoItem /> để vẽ cái khung hình chữ nhật và nút Play ra màn hình. */}
            {videos.items.map((video) => (
              <VideoItem key={video.id} video={video} />
            ))}
          </div>
 {/* Thanh phân trang sẽ hiện ra nếu Props showPagination = true */}
          {showPagination ? (
            <LibraryPagination
              basePath="/thu-vien/video"
              currentPage={videos.page}
              totalPages={videos.totalPages}
            />
          ) : null}
        </>
      )}
    </section>
  );
}
