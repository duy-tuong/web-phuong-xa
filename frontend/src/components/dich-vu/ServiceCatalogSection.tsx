import Link from "next/link";
import ServiceCard, { type ServiceCardData } from "@/components/dich-vu/ServiceCard";

const services: ServiceCardData[] = [
  {
    slug: "khai-sinh",
    profileCode: "HS-HOTICH-001",
    level: "Mức độ 4",
    levelClass: "border-blue-200 bg-blue-100 text-blue-800",
    field: "Lĩnh vực: Hộ tịch",
    title: "Đăng ký khai sinh",
    description:
      "Thủ tục đăng ký khai sinh cho trẻ em sinh ra tại Việt Nam, có cha hoặc mẹ là công dân Việt Nam...",
    duration: "Thời gian GQ: 1 ngày làm việc",
    fee: "Lệ phí: Miễn phí",
  },
  {
    slug: "ket-hon",
    profileCode: "HS-HOTICH-002",
    level: "Mức độ 4",
    levelClass: "border-blue-200 bg-blue-100 text-blue-800",
    field: "Lĩnh vực: Hộ tịch",
    title: "Đăng ký kết hôn",
    description: "Thủ tục đăng ký kết hôn giữa công dân Việt Nam cư trú ở trong nước...",
    duration: "Thời gian GQ: Ngay trong ngày",
    fee: "Lệ phí: Miễn phí",
  },
  {
    slug: "dang-ky-ho-kinh-doanh",
    profileCode: "HS-KD-003",
    level: "Mức độ 3",
    levelClass: "border-green-200 bg-green-100 text-green-800",
    field: "Lĩnh vực: Kinh doanh",
    title: "Cấp Giấy chứng nhận đăng ký hộ kinh doanh",
    description: "Đăng ký thành lập mới hộ kinh doanh cá thể trên địa bàn phường...",
    duration: "Thời gian GQ: 3 ngày làm việc",
    fee: "Lệ phí: 100.000 VNĐ",
  },
  {
    slug: "khai-tu",
    profileCode: "HS-HOTICH-004",
    level: "Mức độ 4",
    levelClass: "border-blue-200 bg-blue-100 text-blue-800",
    field: "Lĩnh vực: Hộ tịch",
    title: "Đăng ký khai tử",
    description: "Thủ tục đăng ký khai tử cho người chết tại địa phương...",
    duration: "Thời gian GQ: Ngay trong ngày",
    fee: "Lệ phí: Miễn phí",
  },
  {
    slug: "xac-nhan-tinh-trang-bat-dong-san",
    profileCode: "HS-DATDAI-005",
    level: "Mức độ 3",
    levelClass: "border-green-200 bg-green-100 text-green-800",
    field: "Lĩnh vực: Đất đai",
    title: "Xác nhận tình trạng bất động sản",
    description:
      "Xin xác nhận tình trạng nhà đất, không có tranh chấp khiếu kiện để thực hiện các giao dịch dân sự...",
    duration: "Thời gian GQ: 5 ngày làm việc",
    fee: "Lệ phí: 50.000 VNĐ",
  },
];

export default function ServiceCatalogSection() {
  return (
    <div className="lg:col-span-3">
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="keyword">
              Từ khóa tìm kiếm
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 align-middle text-slate-400">search</span>
              <input
                id="keyword"
                type="text"
                placeholder="Nhập tên thủ tục..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 outline-none transition-shadow focus:border-[#1f7a5a] focus:ring-2 focus:ring-[#1f7a5a]"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="category">
              Lĩnh vực
            </label>
            <div className="relative">
              <select
                id="category"
                className="w-full appearance-none rounded-lg border border-slate-300 py-2 pl-4 pr-10 outline-none transition-shadow focus:border-[#1f7a5a] focus:ring-2 focus:ring-[#1f7a5a]"
              >
                <option value="">Tất cả lĩnh vực</option>
                <option value="hotich">Hộ tịch</option>
                <option value="datdai">Đất đai</option>
                <option value="kinhdoanh">Kinh doanh</option>
                <option value="xaydung">Xây dựng</option>
                <option value="laodong">Lao động - Thương binh và Xã hội</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 align-middle text-slate-400">
                expand_more
              </span>
            </div>
          </div>
          <div className="mt-2 flex justify-end gap-3 md:col-span-2">
            <button type="button" className="rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-600 transition-colors hover:bg-slate-200">
              Thiết lập lại
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-[#1f7a5a] px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-[#1f7a5a]/90"
            >
              <span className="material-symbols-outlined align-middle text-[18px]">search</span>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Danh sách thủ tục (<span className="text-[#1f7a5a]">24</span>)
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-600">Sắp xếp theo:</span>
            <select className="cursor-pointer border-none bg-transparent font-medium text-[#1f7a5a] focus:ring-0">
              <option>Mức độ sử dụng</option>
              <option>Tên A-Z</option>
              <option>Mới cập nhật</option>
            </select>
          </div>
        </div>

        {services.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}

        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-1">
            <Link
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-500 transition-colors hover:bg-slate-50"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </Link>
            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1f7a5a] font-medium text-white">
              1
            </Link>
            <Link
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              2
            </Link>
            <Link
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              3
            </Link>
            <span className="flex h-10 w-10 items-center justify-center text-slate-500">...</span>
            <Link
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              5
            </Link>
            <Link
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-500 transition-colors hover:bg-slate-50"
            >
              <span className="material-symbols-outlined align-middle text-[20px]">chevron_right</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
