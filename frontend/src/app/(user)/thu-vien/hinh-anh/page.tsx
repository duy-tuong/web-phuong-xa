import PhotoLibrarySection from "@/components/thu-vien/PhotoLibrarySection";

type ThuVienHinhAnhPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function ThuVienHinhAnhPage({ searchParams }: ThuVienHinhAnhPageProps) {
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
