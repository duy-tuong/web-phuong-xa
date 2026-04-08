// Component này chạy ở phía Client (trình duyệt)
"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Import các hàm tiện ích tự viết để thao tác với URL Parameters
import {
  buildPathWithSearchParams,
  cloneSearchParams,
  setOptionalQueryParam,
  setPageQueryParam,
} from "@/lib/query-params";

// Danh sách các lĩnh vực cố định để hiển thị trong dropdown chọn lựa
const FIELD_OPTIONS = [
  { value: "", label: "Tất cả lĩnh vực" },
  { value: "ho-tich", label: "Hộ tịch" },
  { value: "dat-dai", label: "Đất đai" },
  { value: "kinh-doanh", label: "Kinh doanh" },
  { value: "hanh-chinh-cong", label: "Hành chính công" },
];

type ServiceSearchFormProps = {
  initialField: string;
  initialKeyword: string;
  pathname: string;
  searchParamsString: string;
};

//* Component con: Chứa giao diện Form và xử lý logic khi bấm tìm kiếm
function ServiceSearchForm({
  initialField,
  initialKeyword,
  pathname,
  searchParamsString,
}: ServiceSearchFormProps) {
  const router = useRouter();
  
  // State lưu trữ từ khóa và lĩnh vực mà người dùng đang nhập/chọn trên form
  const [keyword, setKeyword] = useState(initialKeyword);
  const [field, setField] = useState(initialField);

  // Hàm chạy khi người dùng nhấn nút "TÌM KIẾM" (Submit form)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Ngăn chặn hành vi tải lại trang mặc định của trình duyệt

    //* Tạo bản sao của URL hiện tại, gán thêm từ khóa (q) và lĩnh vực (field)
    const params = cloneSearchParams(searchParamsString);
    setOptionalQueryParam(params, "q", keyword);
    setOptionalQueryParam(params, "field", field);
    setPageQueryParam(params, 1); //* Reset luôn về trang 1 mỗi khi thực hiện tìm kiếm mới

    //* Đẩy (push) URL mới lên trình duyệt -> Cập nhật thanh địa chỉ để lọc dữ liệu và có thể chia sẻ
    router.push(buildPathWithSearchParams(pathname, params));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 lg:mb-10"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-end">
        
        {/* Ô nhập từ khóa tìm kiếm */}
        <div className="md:col-span-5 lg:col-span-5">
          <label className="mb-2 block text-sm font-bold text-slate-800" htmlFor="keyword">
            Từ khóa tìm kiếm
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              id="keyword"
              type="text"
              value={keyword} // Trói buộc với state keyword
              onChange={(event) => setKeyword(event.target.value)} // Cập nhật state khi nhập
              placeholder="Nhập tên thủ tục hoặc nội dung cần tìm..."
              className="w-full rounded-xl border border-slate-300 py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/10"
            />
          </div>
        </div>

        {/* Dropdown chọn lĩnh vực */}
        <div className="md:col-span-4 lg:col-span-4">
          <label className="mb-2 block text-sm font-bold text-slate-800" htmlFor="category">
            Lĩnh vực
          </label>
          <div className="relative">
            <select
              id="category"
              value={field} // Trói buộc với state field
              onChange={(event) => setField(event.target.value)} // Cập nhật state khi đổi lựa chọn
              className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3.5 pl-4 pr-10 text-sm font-medium outline-none transition-all focus:border-[#1f7a5a] focus:ring-4 focus:ring-[#1f7a5a]/10"
            >
              {/* Duyệt mảng FIELD_OPTIONS để in ra các thẻ <option> */}
              {FIELD_OPTIONS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              expand_more
            </span>
          </div>
        </div>

        {/* Nút bấm Submit form */}
        <div className="flex shrink-0 items-center justify-end gap-3 pt-2 md:col-span-3 md:pt-0 lg:col-span-3">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1f7a5a] py-3.5 text-sm font-black tracking-wide text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#186248] focus:ring-4 focus:ring-[#1f7a5a]/30"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            TÌM KIẾM
          </button>
        </div>
      </div>
    </form>
  );
}

// Component cha: Được gọi trực tiếp ra ngoài (export default)
// Nhiệm vụ: Đọc URL hiện tại của trình duyệt và truyền vào cho Component con (ServiceSearchForm)
export default function ServiceSearchBar() {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại (VD: /danh-sach-dich-vu)
  const searchParams = useSearchParams(); // Lấy các tham số đằng sau dấu "?" trên URL
  const searchParamsString = searchParams.toString(); 

  return (
    <ServiceSearchForm
      // Dùng URL hiện tại làm 'key'. Nếu URL thay đổi từ bên ngoài (ví dụ bấm nút Back), 
      // component sẽ tự re-render và đồng bộ lại giá trị trong Form.
      key={searchParamsString}
      
      // Lấy tham số 'field' và 'q' từ URL gán vào Form làm giá trị mặc định lúc mới tải trang
      initialField={searchParams.get("field") ?? ""}
      initialKeyword={searchParams.get("q") ?? ""}
      
      pathname={pathname}
      searchParamsString={searchParamsString}
    />
  );
}