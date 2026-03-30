export default function GlobalLoading() {
  return (
    <main className="min-h-screen bg-emerald-50 px-4">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" aria-hidden="true" />
        <p className="mt-4 text-sm font-medium text-emerald-700">Đang tải dữ liệu...</p>
      </div>
    </main>
  );
}
/*Khi Next.js thực hiện SSR hoặc chuyển trang mà dữ liệu chưa sẵn sàng, component này sẽ được hiển thị tự động.
Giao diện gồm:
Một vòng tròn xoay (loading spinner) ở giữa màn hình.
Dòng chữ “Đang tải dữ liệu...” bên dưới.
Sử dụng các class Tailwind CSS để căn giữa, tạo hiệu ứng xoay, và phối màu nền dịu mắt.*/