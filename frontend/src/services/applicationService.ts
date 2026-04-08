//* API service để tương tác với backend liên quan đến tra cứu hồ sơ, bao gồm hàm tạo hồ sơ công khai và hàm tìm kiếm hồ sơ công khai
import api from "@/services/api";
import { toApplication, type ApiApplication } from "@/services/shared/applicationMapper";
import type { Application } from "@/types";
//! LƯU Ý 1: BẢN HỢP ĐỒNG DỮ LIỆU (Data Contract)
// Dùng TypeScript để quy định "khuôn đúc" cực kỳ chặt chẽ. 
// Khối Payload buộc thằng Component Form bên ngoài phải thu thập đủ 4 món (serviceId, tên, sđt, email) thì mới được gửi đi. Nhờ vậy Backend không bao giờ lo nhận phải "hồ sơ rác" bị thiếu thông tin.
type CreateApplicationPayload = {
  serviceId: number;
  applicantName: string;
  phone: string;
  email: string;
  attachedFiles?: string;
};
//! LƯU Ý 2: LUỒNG NỘP HỒ SƠ (API POST)
// Phương thức POST được dùng để GHI dữ liệu mới vào Database. Hàm này nhận cái gói hàng (payload) từ Component Form ném xuống, gắn vào đường dẫn "/applications" và phóng lên server.
type CreateApplicationResponse = {
  message: string;
  applicationId: number;
  status: string;
};

export async function createPublicApplication(payload: CreateApplicationPayload): Promise<CreateApplicationResponse> {
  const response = await api.post<CreateApplicationResponse>("/applications", payload);
  return response.data;
}

export async function uploadApplicationAttachment(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<{ url?: string }>("/applications/upload-attachment", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data?.url || "";
}
//* LƯU Ý 3: LUỒNG TRA CỨU BẰNG "MÁY LỌC" (API GET + MAPPER)
// Phương thức GET được dùng để ĐỌC dữ liệu. Nó vác số điện thoại/email (params) lên server để tìm.
export async function searchPublicApplications(params: { phone?: string; email?: string }): Promise<Application[]> {
  const response = await api.get<ApiApplication[]>("/applications/search", { params });
//! LƯU Ý 4: CHUẨN HÓA DỮ LIỆU (Data Normalization)
// Dữ liệu hồ sơ thô lấy từ Backend về KHÔNG ĐƯỢC ném thẳng ra UI, mà phải chạy qua màng lọc `toApplication` để chuẩn hóa lại ngày tháng, tên biến, phòng hờ vỡ layout trang Tra cứu.
  return Array.isArray(response.data) ? response.data.map(toApplication) : [];
}
