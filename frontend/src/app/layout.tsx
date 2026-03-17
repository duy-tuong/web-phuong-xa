import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cong thong tin dien tu Phuong Cao Lanh",
  description: "Cong thong tin dien tu va dich vu hanh chinh Phuong Cao Lanh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${publicSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
