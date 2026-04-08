//* API service lấy danh sách dịch vụ công từ backend và chuyển đổi dữ liệu cho giao diện
import { resolveApiAssetUrl } from "@/lib/api-base-url";
import api from "@/services/api";
import { slugify } from "@/services/shared/slugify";
import type { ProcedureDetail } from "@/types/service";

type ApiService = {
  id: number;
  name: string;
  category?: string | null;
  field?: string | null;
  description?: string | null;
  requiredDocuments?: string | null;
  processingTime?: string | null;
  fee?: number | string | null;
  templateFile?: string | null;
};
// 1. XỬ LÝ DANH SÁCH HỒ SƠ YÊU CẦU
// Chuyển dữ liệu lộn xộn từ Backend (dạng JSON hoặc chuỗi dài) thành một mảng các dòng gọn gàng để in ra màn hình.
function parseRequiredDocuments(value?: string | null) {
  if (!value) {
    return [] as string[];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [] as string[];
  }
// Thử đọc kiểu JSON
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map(String).map((item) => item.trim()).filter(Boolean);
      }
    } catch { //! Bỏ qua lỗi JSON, rơi xuống Regex bên dưới
      
    }
  }
// Cắt chuỗi bằng các dấu phẩy, chấm phẩy, hoặc dấu gạch ngang
  return trimmed
    .split(/\r?\n|;|,|-/)
    .map((item) => item.trim())
    .filter(Boolean);
}
// 2. CHUẨN HÓA TIỀN PHÍ LÀM THỦ TỤC
// Nếu bỏ trống thì báo "Đang cập nhật". Nếu có số (VD: 50000) thì định dạng thành "50.000 VNĐ".
function formatFee(value?: number | string | null) {
  if (value === null || value === undefined || value === "") {
    return "Đang cập nhật";
  }

  if (typeof value === "number") {
    return `${new Intl.NumberFormat("vi-VN").format(value)} VNĐ`;
  }

  return String(value).trim();
}
//! 3. TỰ ĐỘNG SINH NỘI DUNG (Dynamic Fallback)
// Do Backend không trả về các bước, Frontend tự lấy "Tên thủ tục" và "Thời gian" ghép vào câu mẫu để tạo ra 4 bước hướng dẫn.
function buildSteps(title: string, processingTime: string) {
  return [
    `Chuẩn bị hồ sơ cho thủ tục ${title.toLowerCase()}.`,
    "Nộp hồ sơ trực tuyến hoặc tại Bộ phận Một cửa của UBND phường.",
    `Cơ quan chuyên môn tiếp nhận, thẩm tra và xử lý hồ sơ trong ${processingTime.toLowerCase()}.`,
    "Nhận kết quả theo phiếu hẹn hoặc thông báo từ hệ thống.",
  ];
}
// 4. GỌT TỈA VÀ ĐÓNG GÓI DỮ LIỆU (MAPPER)
// Gom dữ liệu thô từ API, đưa qua các hàm lọc ở trên để tạo thành một cục dữ liệu chuẩn chỉnh, sạch đẹp giao cho UI hiển thị.
function adaptProcedure(service: ApiService): ProcedureDetail {
  const requirements = parseRequiredDocuments(service.requiredDocuments);//
  const processingTime = service.processingTime?.trim() || "Đang cập nhật";
  const title = service.name.trim();

  return {
    id: service.id,
    slug: slugify(title),
    title,
    field: service.category?.trim() || service.field?.trim() || undefined,
    requiredDocuments: requirements,
    processingTime,
    fee: formatFee(service.fee),//
    wordTemplateHref: resolveApiAssetUrl(service.templateFile) || "#",
    requirements,
    steps: buildSteps(title, processingTime),//
  };
}
// 5. GỌI API LẤY DANH SÁCH THỦ TỤC
// Chọc xuống Backend lấy dữ liệu. Nếu rớt mạng hoặc lỗi thì tự động trả về mảng rỗng [] để web không bị sập (chỉ báo "Chưa có dữ liệu").
export async function getProcedures(): Promise<ProcedureDetail[]> {
  try {
    const response = await api.get<ApiService[]>("/services");
  // Lấy xong thì ném từng thủ tục qua hàm adaptProcedure ở trên để gọt tỉa
    return Array.isArray(response.data) ? response.data.map(adaptProcedure) : [];
  } catch (error) {
    console.error("Không thể tải danh sách dịch vụ công:", error);
    return [];
  }
}
