"use client";

import ServiceSearchBar from "@/components/services/ServiceSearchBar";
import ServiceSidebar from "@/components/services/ServiceSidebar";
import ServiceList from "@/components/services/ServiceList";

export default function DichVuHanhChinhPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24 pt-8 sm:pt-12">
      <section className="mx-auto w-full max-w-[1240px] px-4 md:px-6">
        <div className="mb-8 text-center md:mb-10 lg:text-left">
          <h1 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Dich vu hanh chinh cong
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg lg:mx-0">
            Cong thong tin giai quyet thu tuc hanh chinh truc tuyen Phuong Cao Lanh nhanh chong, minh bach va an toan.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="order-2 lg:order-1 lg:col-span-4 xl:col-span-3">
            <ServiceSidebar />
          </div>

          <div className="order-1 flex flex-col lg:order-2 lg:col-span-8 xl:col-span-9">
            <ServiceSearchBar />
            <ServiceList />
          </div>
        </div>
      </section>
    </main>
  );
}
