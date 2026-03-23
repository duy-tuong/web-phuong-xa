import PhotoLibrarySection from "@/components/thu-vien/PhotoLibrarySection";

export default function ThuVienHinhAnhPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Thư Viện Hình Ảnh</h1>
        <p className="mt-2 text-slate-600">Kho ảnh hoạt động văn hóa, du lịch và đời sống cộng đồng Phường Cao Lãnh.</p>
      </div>
      <PhotoLibrarySection />
    </main>
  );
}
