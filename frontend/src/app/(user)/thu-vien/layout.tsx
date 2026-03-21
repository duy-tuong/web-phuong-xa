import type { ReactNode } from "react";
import { Work_Sans } from "next/font/google";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export default function ThuVienLayout({ children }: { children: ReactNode }) {
  return <div className={workSans.className}>{children}</div>;
}
