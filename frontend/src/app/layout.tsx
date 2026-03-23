import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = { //  SEO metadata
  title: {
    default: "Cổng thông tin điện tử Phường Cao Lãnh",
    template: "%s | Cổng thông tin điện tử Phường Cao Lãnh",
  },
  description:
    "Cổng thông tin điện tử chính thức của UBND Phường Cao Lãnh, cung cấp tin tức, dịch vụ hành chính công và thông tin phục vụ nhân dân.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${publicSans.variable} antialiased`}>
        <main className="min-h-screen flex flex-col">{children}</main>
      </body>
    </html>
  );
}