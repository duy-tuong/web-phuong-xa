import VideoLibrarySection from "@/components/thu-vien/VideoLibrarySection";

export default function ThuVienVideoPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Kho Video Clip</h1>
        <p className="mt-2 text-slate-600">Video tư liệu giới thiệu hoạt động, văn hóa và phát triển địa phương.</p>
      </div>
      <VideoLibrarySection />
    </main>
  );
}
