using System.ComponentModel.DataAnnotations; // Thư viện cung cấp các Attribute dùng để Validate (kiểm duyệt) dữ liệu tự động

namespace backend.DTOs
{
    // Lớp DTO (Data Transfer Object) dùng để chứa dữ liệu do Client (Frontend) gửi lên khi tạo bài viết mới.
    // Việc dùng DTO mang lại sự an toàn, ngăn chặn lỗi "Overposting" (khi hacker cố tình gán thêm trường dữ liệu nhạy cảm vào request).
    public class CreateArticleDTO
    {
        [Required(ErrorMessage = "Tiêu đề bài viết không được để trống")] // Ràng buộc bắt buộc phải có. Nếu Frontend gửi thiếu, ASP.NET sẽ tự động chặn và trả về lỗi HTTP 400
        public string Title { get; set; }

        public string? Slug { get; set; } // Dấu '?' biểu thị trường này có thể rỗng (nullable). Là đường dẫn ảo (VD: bai-viet-moi)

        public string? Excerpt { get; set; } // Tóm tắt ngắn của bài viết

        public string? FeaturedImage { get; set; } // Đường dẫn gốc trên server của ảnh đại diện

        [Required(ErrorMessage = "Nội dung bài viết không được để trống")]
        public string Content { get; set; }

        public bool IsFeatured { get; set; } = false; // Biến cờ (Flag) xác định xem có đưa lên slider (nổi bật) không. Gán mặc định là false.

        [Required(ErrorMessage = "Vui lòng chọn danh mục cho bài viết")]
        public int CategoryId { get; set; } // ID của thư mục chứa bài viết này (Ví dụ: 1 là Xã Hội, 2 là Y Tế,...) (Ràng buộc khóa ngoại)

        public string Status { get; set; } = "Draft"; // Trạng thái mặc định khi vừa tạo tạo (Draft = Nháp), thay vì xuất bản luôn thì cần chờ duyệt.
    }
}
