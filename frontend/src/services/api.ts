//  lớp trung gian gọi API chung cho toàn frontend
import axios, { AxiosHeaders } from "axios";

import { API_BASE_URL, getRemoteBasicAuthHeader } from "@/lib/api-base-url";
//! 1. KHỞI TẠO INSTANCE AXIOS CHUNG
// Tạo một instance của Axios với cấu hình chung cho toàn bộ ứng dụng. 
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// 2. TRẠM KIỂM DUYỆT TRƯỚC KHI GỬI 
// Mọi lệnh gọi API trong dự án trước khi bay qua Backend ĐỀU PHẢI CHẠY QUA ĐÂY ĐỂ KIỂM TRA.
api.interceptors.request.use(
  (config) => {
    const headers = AxiosHeaders.from(config.headers);
// Bước 2.1: Nếu đang gửi File (Hình ảnh, PDF) thì gỡ chuẩn JSON ra để trình duyệt tự xử lý.
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      headers.delete("Content-Type");
    } else {
      headers.set("Content-Type", "application/json");
    }
  // Bước 2.2: LẤY THẺ RA VÀO (TOKEN) NHÉT VÀO HEADER
    if (typeof window !== "undefined") {
    // Phân biệt đang đứng ở trang Admin hay trang Người dân để lấy đúng Token trong kho localStorage
      const isAdminRoute = window.location.pathname.startsWith("/admin");
      const adminToken = localStorage.getItem("admin_token");
      const userToken = localStorage.getItem("user_token");
      const token = isAdminRoute ? adminToken || userToken : userToken || adminToken;
      const headers = AxiosHeaders.from(config.headers);
// Nếu có Token thì gắn vào tiêu đề (Header) để gửi cho Backend chứng minh "tôi đã đăng nhập".
      if (token) {
        headers.set("X-Admin-Authorization", `Bearer ${token}`);
      }

      config.headers = headers;

      return config;
    }

    const basicAuthHeader = getRemoteBasicAuthHeader();
    if (basicAuthHeader) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set("Authorization", basicAuthHeader);
      config.headers = headers;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
// 3. kiểm tra dữ liệu gửi về
// Mọi kết quả từ Backend trả về ĐỀU PHẢI CHẠY QUA ĐÂY trước khi hiển thị lên giao diện.
api.interceptors.response.use(
 // Nếu API thành công (Mã 200) thì cho qua bình thường.
  (response) => response,
 // Nếu API báo lỗi
  (error) => {
    const requestUrl = String(error.config?.url || "");
    const isAuthLoginRequest = requestUrl.includes("/auth/login");
    const authChallengeHeader = String(error.response?.headers?.["www-authenticate"] || "");
    const isServerLevelBasicAuth = authChallengeHeader.toLowerCase().includes("basic");
// XỬ LÝ LỖI MẤT QUYỀN (401 - Unauthorized)
    // Nếu Backend báo lỗi 401 (Nghĩa là Token hết hạn, hoặc chưa đăng nhập mà dám gọi API cấm)
    if (error.response?.status === 401 && !isAuthLoginRequest && !isServerLevelBasicAuth) {
      if (typeof window !== "undefined") {
      // Bước 3.1: Dọn dẹp sạch sẽ kho chứa - Xóa hết mọi Token cũ bị hết hạn.
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_role");
        localStorage.removeItem("admin_display_name");
        localStorage.removeItem("admin_role");
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_session");
        document.cookie = "admin_token=; Path=/; Max-Age=0; SameSite=Lax";
      // Bước 3.2: Lưu lại địa chỉ trang đang đứng, sau đó "đá" người dùng văng về trang Đăng nhập (/login).
        const nextRedirect =
          window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/trang-ca-nhan")
            ? window.location.pathname
            : "/login";
        window.location.href = `/login?redirect=${encodeURIComponent(nextRedirect)}`;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
