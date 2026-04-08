//! thu-vien tổng hợp: hiển thị các video nổi bật, thư viện ảnh và video mới nhất từ kho media công khai.
import FeaturedVideoSection from "@/components/thu-vien/FeaturedVideoSection";
import MediaHeroSection from "@/components/thu-vien/MediaHeroSection";
import PhotoLibrarySection from "@/components/thu-vien/PhotoLibrarySection";
import VideoLibrarySection from "@/components/thu-vien/VideoLibrarySection";
 {/*  Banner giới thiệu */}
export default function ThuVienTongHopPage() {
  return (
    <main className="flex flex-grow flex-col">
      <MediaHeroSection />
{/*  vidoe nổi bật */}
      <div className="w-full bg-[#f8fafc]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-16 sm:px-6 lg:px-8">
         {/* Cục Lego số 2: Tivi chiếu video nổi bật Video VIP */}
          <FeaturedVideoSection />
       {/* xem trước hình ảnh */}
          <PhotoLibrarySection
            pageSize={4}
            showViewAllLink //!Biến thành dạng Preview có nút "Xem tất cả"
            heading="Thư viện ảnh"
            subheading="Hiển thị gọn các hình ảnh mới nhất từ kho media công khai."
          />
          {/*  xem trước video */}
          <VideoLibrarySection
            pageSize={4}
            showViewAllLink
            heading="Kho video"
            subheading="Chỉ hiển thị một số video mới nhất để trang thư viện gọn và dễ xem hơn."
          />
        </div>
      </div>
    </main>
  );
}
