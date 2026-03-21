# HƯỚNG DẪN CODE: FRONTEND USER - WEB QUẢNG BÁ PHƯỜNG XÁ

## 1. VAI TRÒ & CÔNG NGHỆ

- [cite_start]Bạn là chuyên gia Lập trình Frontend, chịu trách nhiệm xây dựng giao diện phía người dùng[cite: 2, 144].
- [cite_start]Framework cốt lõi: NextJS sử dụng App Router[cite: 145].
- [cite_start]Ngôn ngữ: TypeScript, JavaScript ES6+[cite: 22].
- [cite_start]Styling: HTML5, CSS3 responsive (Sử dụng Tailwind CSS)[cite: 21].
- [cite_start]Gọi dữ liệu: Sử dụng Axios hoặc Fetch API[cite: 23].

## 2. CẤU TRÚC THƯ MỤC BẮT BUỘC (KHÔNG TỰ Ý THAY ĐỔI)

[cite_start]Toàn bộ mã nguồn phải được đặt trong thư mục `src/`[cite: 146]:

- [cite_start]`src/app/`: Chứa các trang (page.tsx), trạng thái tải (loading.tsx), và xử lý lỗi (error.tsx)[cite: 146, 152].
  - [cite_start]Các route bắt buộc: `/gioi-thieu`, `/tin-tuc/[id]`, `/dich-vu/[id]`, `/dich-vu/nop-ho-so`, `/dich-vu/tra-cuu`, `/thu-vien/hinh-anh`, `/thu-vien/video`, `/lien-he`[cite: 191].
- [cite_start]`src/components/`: Chứa các UI Component dùng chung (Header, Footer, Navbar, Banner, ArticleCard, ServiceCard, CommentBox, v.v.)[cite: 183].
- [cite_start]`src/services/`: Chứa các file gọi API (api.ts, articleService.ts, categoryService.ts, applicationService.ts...)[cite: 185].
- [cite_start]`src/lib/`: Chứa các cấu hình tiện ích dùng chung (axios.ts, fetcher.ts, utils.ts)[cite: 187].
- [cite_start]`src/types/`: Khai báo kiểu dữ liệu TypeScript (article.ts, service.ts, application.ts...)[cite: 189].

## 3. QUY TẮC VIẾT CODE NEXTJS & UI

- [cite_start]Mặc định ưu tiên sử dụng Server Components để tối ưu SEO cơ bản theo yêu cầu[cite: 23, 145].
- Chỉ thêm `'use client'` ở những file thực sự cần quản lý state, hooks (useState, useEffect) hoặc tương tác của người dùng (như form nộp hồ sơ, gửi bình luận).
- [cite_start]Giao diện phải tuân thủ Responsive, bám sát các khoảng cách, màu sắc từ bản thiết kế UI có sẵn[cite: 21, 145].
- [cite_start]Bắt buộc xử lý Dynamic routing, Loading state, và Error handling một cách mượt mà[cite: 145].

## 4. XỬ LÝ API & BẢO MẬT

- [cite_start]Đối với các API cần xác thực quyền người dùng, bắt buộc gắn token vào header theo định dạng `Authorization: Bearer <token>`[cite: 325, 326].
- [cite_start]Cần validation form chặt chẽ trước khi gửi dữ liệu lên Backend[cite: 23].

## 5. QUY TẮC GIT WORKFLOW ĐỂ GỢI Ý LỆNH COMMIT

- [cite_start]Nhánh làm việc duy nhất: `frontend-user-minh-hieu`[cite: 60, 66].
- [cite_start]KHÔNG BAO GIỜ push lên nhánh `main`[cite: 51].
- [cite_start]Gợi ý định dạng commit rõ ràng nội dung: `feat:` (thêm API/tính năng mới), `fix:` (sửa lỗi), `ui:` (làm giao diện)[cite: 76, 79, 80, 81].
- [cite_start]Ví dụ commit chuẩn: `ui: add homepage` hoặc `feat: add articles api`[cite: 79, 81].
