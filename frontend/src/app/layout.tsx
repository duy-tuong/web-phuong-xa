import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "react-quill-new/dist/quill.snow.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cổng thông tin điện tử Phường Cao Lãnh",
  description: "Cổng thông tin điện tử và dịch vụ hành chính Phường Cao Lãnh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${plusJakarta.variable} antialiased bg-[hsl(45,22%,96%)]`}>
        {children}
      </body>
    </html>
  );
}
