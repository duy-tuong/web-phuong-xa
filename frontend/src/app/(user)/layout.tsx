import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}
