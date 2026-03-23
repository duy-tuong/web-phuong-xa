import Link from "next/link";
import ServiceCard, { type ServiceCardData } from "./ServiceCard";

const services: ServiceCardData[] = [
  {
    slug: "khai-sinh",
    profileCode: "HS-HOTICH-001",
    level: "Mức độ 4",
    levelClass: "border-blue-200 bg-blue-50 text-blue-700",
    field: "Hộ tịch",
    title: "Đăng ký khai sinh",
    description: "Thủ tục đăng ký khai sinh cho trẻ em sinh ra tại Việt Nam, có cha hoặc mẹ là công dân Việt Nam...",
    duration: "1 ngày làm việc",
    fee: "Miễn phí",
  },
  {
    slug: "ket-hon",
    profileCode: "HS-HOTICH-002",
    level: "Mức độ 4",
    levelClass: "border-blue-200 bg-blue-50 text-blue-700",
    field: "Hộ tịch",
    title: "Đăng ký kết hôn",
    description: "Thủ tục đăng ký kết hôn giữa công dân Việt Nam cư trú ở trong nước...",
    duration: "Ngay trong ngày",
    fee: "Miễn phí",
  },
  {
    slug: "dang-ky-ho-kinh-doanh",
    profileCode: "HS-KD-003",
    level: "Mức độ 3",
    levelClass: "border-orange-200 bg-orange-50 text-orange-700",
    field: "Kinh doanh",
    title: "Cấp Giấy chứng nhận đăng ký hộ kinh doanh",
    description: "Đăng ký thành lập mới hộ kinh doanh cá thể trên địa bàn phường...",
    duration: "3 ngày làm việc",
    fee: "100.000 VNĐ",
  },
  {
    slug: "xac-nhan-tinh-trang-bat-dong-san",
    profileCode: "HS-DATDAI-005",
    level: "Mức độ 3",
    levelClass: "border-orange-200 bg-orange-50 text-orange-700",
    field: "Đất đai",
    title: "Xác nhận tình trạng bất động sản",
    description: "Xin xác nhận tình trạng nhà đất, không có tranh chấp khiếu kiện để thực hiện các giao dịch dân sự...",
    duration: "5 ngày làm việc",
    fee: "50.000 VNĐ",
  },
];

export default function ServiceList() {
  return (
    <div className="flex w-full flex-col space-y-4">
      {/* Header List */}
      <div className="mb-4 flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900">
          Danh sách thủ tục
          <span className="flex h-7 items-center justify-center rounded-full bg-emerald-100 px-3 text-sm font-black text-[#1f7a5a]">
            {services.length}
          </span>
        </h2>
        
        <div className="flex w-full items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 text-sm sm:w-auto md:justify-end md:gap-3">
          <span className="font-semibold text-slate-500">Sắp xếp theo:</span>
          <select className="cursor-pointer appearance-none border-none bg-transparent font-bold text-[#1f7a5a] outline-none">
            <option>Mức độ sử dụng</option>
            <option>Tên A-Z</option>
            <option>Mới cập nhật</option>
          </select>
        </div>
      </div>

      {/* List Body */}
      <div className="flex w-full flex-col gap-5">
        {services.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </div>

      {/* Pagination component */}
      <div className="mt-8 flex justify-center pb-6">
        <nav className="flex items-center gap-1.5 md:gap-2">
          <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700">
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </Link>
          <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f7a5a] text-sm font-bold text-white shadow-md">
            1
          </Link>
          <Link href="#" className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#1f7a5a]">
            2
          </Link>
          <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#1f7a5a]">
            3
          </Link>
          <span className="flex h-10 w-10 items-center justify-center text-slate-400">...</span>
          <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#1f7a5a]">
            5
          </Link>
          <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700">
            <span className="material-symbols-outlined align-middle text-[20px]">chevron_right</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
