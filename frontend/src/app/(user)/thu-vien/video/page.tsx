import VideoLibrarySection from "@/components/thu-vien/VideoLibrarySection";

type ThuVienVideoPageProps = {
    //! LƯU Ý 1: BẮT ĐƯỢC PARAM TỪ URL (Next.js 15+ standard)
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function ThuVienVideoPage({ searchParams }: ThuVienVideoPageProps) {
  //! LƯU Ý 2: BẢO VỆ DỮ LIỆU ĐẦU VÀO
  // Nếu người dùng gõ bậy bạ lên URL kiểu "?page=abc" hoặc "?page=-5", code này dùng `Number.isFinite` và kiểm tra `> 0` để ép nó tự động quay về trang 1. Không bao giờ bị lỗi sập màn hình!
  const params = (await searchParams) || {};
  const requestedPage = Number(params.page || "1");
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Kho video</h1>
        <p className="mt-2 text-slate-600">
          Video tư liệu giới thiệu hoạt động, văn hóa và nhịp sống địa phương.
        </p>
      </div>
{/* LƯU Ý 3: MÔ HÌNH COMPONENT ĐÓNG GÓI */}
      {/* Trang web chỉ cần gọi đúng 1 thẻ <VideoLibrarySection>. Mọi logic đi lấy danh sách video, xử lý link YouTube hay mã nhúng Iframe đều bị giấu kín bên trong Component này. */}
      <VideoLibrarySection
        page={currentPage}
        pageSize={4}
        showPagination
        showViewAllLink={false}
        heading="Danh sách video"
        subheading=""
      />
    </main>
  );
}
