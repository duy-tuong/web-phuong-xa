import PhotoLibrarySection from "@/components/thu-vien/PhotoLibrarySection";

type ThuVienHinhAnhPageProps = {
   //! LƯU Ý 1: BẮT THAM SỐ URL BẰNG PROMISE (Chuẩn Next.js mới)
  // Tính năng này dùng để tóm cái đuôi "?page=2" trên thanh địa chỉ. Ở Next.js App Router, searchParams bắt buộc phải là một Promise (bất đồng bộ).
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function ThuVienHinhAnhPage({ searchParams }: ThuVienHinhAnhPageProps) {
  //! LƯU Ý 2: XỬ LÝ PHÂN TRANG BẰNG URL (SEO-friendly)
  // Thay vì dùng useState để lưu trang 1, trang 2... Code này lấy số trang trực tiếp từ thanh địa chỉ trình duyệt.
  // Lợi ích: Nếu em đang xem trang 3, em copy link gửi cho bạn em, bạn em bấm vào sẽ mở đúng trang 3. Nếu dùng useState thì bạn em sẽ bị quay về trang 1. Đây là điểm cộng cực lớn về UX!
  const params = (await searchParams) || {};
  const requestedPage = Number(params.page || "1");
  const currentPage = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Thư viện hình ảnh</h1>
        <p className="mt-2 text-slate-600">
          Kho ảnh hoạt động văn hóa, du lịch và đời sống cộng đồng Phường Cao Lãnh.
        </p>
      </div>
{/* LƯU Ý 3: MÔ HÌNH ỦY QUYỀN (Component Delegation)
          Trang giao diện đóng vai trò Giám đốc, nó chỉ thị cho nhân viên PhotoLibrarySection: "Cậu vẽ cho tôi cái danh sách ảnh ở trang số [currentPage], mỗi trang đúng [4] tấm ảnh cho tôi". Còn việc nhân viên đi lấy ảnh ở API nào, vẽ ra sao, Giám đốc không cần biết. */}
      <PhotoLibrarySection
        page={currentPage}
        pageSize={4}
        showPagination
        showViewAllLink={false}
        heading="Bộ sưu tập ảnh"
        subheading=""
      />
    </main>
  );
}
