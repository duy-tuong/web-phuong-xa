# Tài liệu Tóm tắt Dự án: Phát triển Website Quảng bá Phường Xã

Tài liệu này cung cấp một cái nhìn tổng quan toàn diện về dự án phát triển Website Quảng bá Phường Xã, bao gồm các yêu cầu tính năng, thông số kỹ thuật, vai trò của các thành viên và quy trình làm việc dựa trên tài liệu dự án được cung cấp.

## Tóm tắt Tổng quan

Dự án "Web Quảng Bá Phường Xã" là một sáng kiến phát triển full-stack được lên lịch cho năm học 2025-2026. Mục tiêu là xây dựng một website hoàn chỉnh dành cho việc quảng bá một phường hoặc xã địa phương, tích hợp cả công nghệ frontend và backend. Dự án được chia thành ba thành phần chính: Frontend dành cho Người dùng (NextJS), Frontend dành cho Quản trị viên (NextJS), và một Backend mạnh mẽ (ASP.NET Core). Quy trình phát triển được điều hành nghiêm ngặt bởi một quy trình làm việc trên GitHub có cấu trúc và phân chia lao động rõ ràng giữa 5 thành viên nhóm để đảm bảo tính toàn vẹn dữ liệu, bảo mật và hiệu suất cao.

---

## Kiến trúc Kỹ thuật và Công nghệ

Dự án sử dụng một stack công nghệ hiện đại được thiết kế cho khả năng mở rộng, bảo mật và hiệu suất đáp ứng tốt (responsive).

### 1. Thông số Frontend (Người dùng & Admin)
*   **Framework:** NextJS (App Router), React.js.
*   **Styling:** HTML5, CSS3, Thiết kế Responsive sử dụng Bootstrap 5 hoặc Tailwind CSS.
*   **Dữ liệu:** Axios/Fetch API cho giao tiếp RESTful, validation các form.
*   **Tính năng:** Dynamic routing (định tuyến động), tối ưu hóa SEO, trạng thái tải (loading state), và xử lý lỗi.

### 2. Thông số Backend
*   **Framework:** ASP.NET Core 6.0+.
*   **Mẫu thiết kế (Pattern):** MVC Pattern hoặc Clean Architecture.
*   **Giao tiếp:** RESTful API với tài liệu Swagger.
*   **Bảo mật:** JWT/ASP.NET Identity, Dependency Injection, và ghi log/xử lý lỗi toàn diện.

### 3. Cơ sở Dữ liệu và Bảo mật
*   **Hệ quản trị CSDL:** SQL Server hoặc PostgreSQL.
*   **ORM:** Entity Framework (EF) Core với Migration và Seed data.
*   **Chuẩn Thiết kế:** Dạng chuẩn 3 (3NF) để đảm bảo không bị trùng lặp dữ liệu.
*   **Bảo vệ Bảo mật:** Mã hóa mật khẩu, HTTPS, Kiểm duyệt đầu vào (Input validation), và phòng chống SQL Injection, XSS, CSRF.

---

## Phân tích Tính năng Cốt lõi

### Tính năng Trang Người dùng (User Site)
Frontend dành cho người dùng phổ thông tập trung vào việc phổ biến thông tin và dịch vụ công:
*   **Trung tâm Thông tin:** Trang chủ (tổng quan, tin tức, banner, thống kê) và Giới thiệu (lịch sử, địa lý, hạ tầng).
*   **Tin tức & Truyền thông:** Các bài báo được phân loại với tính năng tìm kiếm, phân trang, bình luận, và chia sẻ xã hội. Thư viện đa phương tiện cho hình ảnh và video.
*   **Dịch vụ Hành chính:** Cổng kỹ thuật số cho danh sách thủ tục, nộp hồ sơ trực tuyến, và theo dõi trạng thái.
*   **Tương tác:** Thông tin liên hệ, tích hợp Google Maps, và các form đóng góp ý kiến/phản ánh.

### Tính năng Trang Quản trị (Admin Site)
Bảng điều khiển admin cung cấp sự giám sát toàn diện đối với nội dung và hoạt động của nền tảng:
*   **Bảng điều khiển (Dashboard):** Chỉ số phân tích trực quan sử dụng Chart.js để theo dõi người dùng, bài viết và hồ sơ.
*   **Quản lý Người dùng:** Các thao tác CRUD cho tài khoản, điều khiển truy cập dựa trên vai trò (Admin, Editor, Viewer), và nhật ký kiểm toán (audit logs).
*   **Quản lý Nội dung:** Trình soạn thảo WYSIWYG (React-Quill/TinyMCE/CKEditor) cho các bài viết, quản lý danh mục, và tải lên thư viện phương tiện.
*   **Xử lý Hồ sơ:** Quản lý các thủ tục hành chính, biểu mẫu tài liệu, và cập nhật trạng thái hồ sơ (Chờ duyệt, Đang xử lý, Hoàn tất, Từ chối).

---

## Vai trò và Trách nhiệm Nhóm

Dự án được phân chia qua 5 vai trò chuyên môn hóa để đảm bảo phủ sóng toàn diện toàn bộ stack.

| Thành viên | Trách nhiệm Chính | Nhiệm vụ Then chốt |
| :--- | :--- | :--- |
| **Duy Tường** | Backend chính & Trưởng nhóm | Logic backend, kiến trúc hệ thống, và merge code vào các nhánh `dev`/`main`. |
| **Nguyễn Khiêm** | Backend chính | Phát triển API cốt lõi và các dịch vụ backend. |
| **Tú Phạm** | Cơ sở Dữ liệu & Bảo mật | Thiết kế CSDL 3NF, EF Core migrations, Seed data, và triển khai bảo mật (SQLi/XSS/CSRF). |
| **Minh Hiếu** | Frontend Trang Người dùng | Phát triển NextJS cho trang công cộng, SEO, và tích hợp API. |
| **Minh Chiến** | Frontend Trang Admin | Phát triển NextJS cho dashboard quản lý, các form CRUD, và tích hợp Chart.js. |

---

## Quy trình Làm việc và Quản trị Git

Để duy trì chất lượng code và tránh xung đột, nhóm tuân thủ một quy trình làm việc nghiêm ngặt trên Git.

### Chiến lược Phân nhánh (Branching)
*   **`main`:** Nhánh production ổn định. **Nghiêm cấm push trực tiếp lên `main`.**
*   **`dev`:** Nhánh tích hợp được quản lý bởi Trưởng nhóm.
*   **Feature Branches:** Mỗi thành viên có một nhánh chuyên dụng (ví dụ: `backend`, `database`, `frontend-user-minh-hieu`).

### Cấu trúc Repository
Dự án được tổ chức thành một cấp bậc thư mục rõ ràng:
*   `frontend-user`: Ứng dụng NextJS dành cho người dân.
*   `frontend-admin`: Ứng dụng NextJS dành cho quản trị viên.
*   `backend`: Logic API ASP.NET Core.
*   `database`: Các tập lệnh (scripts) và file migration.
*   `docs`: Tài liệu dự án và báo cáo PDF.

### Quy định Commit và Merge
1.  **Pull Trước Khi Code:** Thành viên phải pull những thay đổi mới nhất trước khi bắt đầu làm việc.
2.  **Commit Rõ ràng:** Tin nhắn commit phải sử dụng các tiền tố như `feat:`, `fix:`, `ui:`, `db:`, hoặc `api:`.
3.  **Quy trình Merge:** Chỉ có Trưởng nhóm mới có quyền merge các nhánh của thành viên vào `dev` và sau đó vào `main` sau khi giải quyết xung đột và xác minh tính ổn định.

---

## Chỉ thị và Bối cảnh Quan trọng

> **"Phải đúng 3NF, không lặp dữ liệu, phải có khóa ngoại."**
*   *Bối cảnh:* Đây là yêu cầu nền tảng cho thiết kế cơ sở dữ liệu để đảm bảo tính toàn vẹn dữ liệu và tiêu chuẩn chuyên nghiệp.

> **"Không được push code lên nhánh 'main' (quan trọng nhắc lại 3 lần)."**
*   *Bối cảnh:* Một quy tắc sống còn trong quy trình Git để ngăn chặn code không ổn định làm hỏng trạng thái dự án chính.

> **"Trang quản trị (Admin) phải có Dashboard: Thống kê truy cập, báo cáo tin tức, biểu đồ (Chart.js)."**
*   *Bối cảnh:* Nhấn mạnh tầm quan trọng của việc trực quan hóa dữ liệu và báo cáo trong giao diện quản lý.

---

## Đề xuất Hành động cho Thành công của Dự án

*   **Đồng bộ hóa các Model:** Đảm bảo rằng `Models/` ở Backend và `types/` ở Frontend được đồng bộ hóa hoàn hảo để ngăn chặn sự không khớp dữ liệu trong các cuộc gọi API.
*   **Bảo mật Trước tiên:** Bảo mật cơ sở dữ liệu (SQL/XSS/CSRF) và xác thực (JWT/Bearer tokens) phải được triển khai sớm trong chu kỳ phát triển.
*   **Ghi chép Tài liệu:** Dự án yêu cầu một báo cáo PDF dài 30-50 trang. Duy trì một "Nhật ký Kiểm toán" chi tiết về các quyết định phát triển và kết quả kiểm thử sẽ đơn giản hóa giai đoạn báo cáo cuối cùng.
*   **Tính Responsive:** Vì nền tảng phục vụ dân cư cấp phường, tính responsive **"Mobile-first"** là cực kỳ quan trọng để tiếp cận tốt trên các thiết bị khác nhau.
*   **Quản lý Tài nguyên:** Sử dụng các công cụ quản lý `media/` trong trang Admin để xử lý tải lên file qua `FormData` để đảm bảo kiểm soát tập trung hình ảnh và tài liệu.
