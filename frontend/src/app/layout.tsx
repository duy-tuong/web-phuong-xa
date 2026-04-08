/* Đây là file layout gốc (RootLayout) cho toàn bộ ứng dụng Next.js.
Định nghĩa cấu trúc HTML, import font, style toàn cục, và bọc toàn bộ nội dung app bằng các provider (ví dụ: SmoothScrollProvider).
Thiết lập metadata (SEO, tiêu đề, mô tả) cho trang web.
 */
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";//cấu hình biến CSS để dùng cho toàn app.
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
// Import file CSS toàn cục (globals.css) và style cho trình soạn thảo văn bản (Quill Editor).
import "./globals.css";
import "react-quill-new/dist/quill.snow.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});
//đặt tiêu đề và mô tả mặc định cho website, giúp tối ưu SEO và hiển thị trên trình duyệt.
export const metadata: Metadata = {
  title: {
    default: "Cổng thông tin điện tử Phường Cao Lãnh",
    //%s sẽ được thay thế bằng tiêu đề cụ thể của từng trang nếu có, nếu không sẽ dùng tiêu đề mặc định.
    template: "%s | Cổng thông tin điện tử Phường Cao Lãnh",
  },
  description: "Cổng thông tin điện tử chính thức của Phường Cao Lãnh, Đồng Tháp. Cập nhật tin tức, thông báo, và hỗ trợ nộp hồ sơ dịch vụ hành chính công trực tuyến cho người dân.",
  keywords: ["Cổng thông tin", "Phường Cao Lãnh", "Đồng Tháp", "Dịch vụ công", "Hành chính", "Tin tức Cao Lãnh"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${plusJakarta.variable} antialiased bg-[hsl(45,22%,96%)]`}>
        <SmoothScrollProvider>
          <main className="min-h-screen flex flex-col">{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
/*Bọc toàn bộ app trong thẻ <html lang="vi"> (hỗ trợ tiếng Việt).
Thẻ <body> dùng font đã import, khử răng cưa (antialiased), đặt màu nền.
Dùng SmoothScrollProvider để tạo hiệu ứng cuộn mượt cho toàn app.
Nội dung trang được đặt trong <main>, đảm bảo tối thiểu chiều cao màn hình, bố cục dạng cột.*/
