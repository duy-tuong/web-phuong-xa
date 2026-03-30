import VideoLibrarySection from "@/components/thu-vien/VideoLibrarySection";

type ThuVienVideoPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function ThuVienVideoPage({ searchParams }: ThuVienVideoPageProps) {
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

      <VideoLibrarySection
        page={currentPage}
        pageSize={4}
        showPagination
        showViewAllLink={false}
        heading="Danh sách video"
        subheading="Mỗi trang hiển thị tối đa 4 video để giao diện gọn và đồng đều hơn."
      />
    </main>
  );
}
