using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateContactDTO
    {
        [Required(ErrorMessage = "H? và tên là b?t bu?c")]
        [StringLength(100)]
        public string FullName { get; set; }

        [Required(ErrorMessage = "S? ?i?n tho?i là b?t bu?c")]
        [Phone]
        [StringLength(20)]
        public string Phone { get; set; }

        [EmailAddress(ErrorMessage = "Email không h?p l?")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Chuyên m?c là b?t bu?c")]
        public string Category { get; set; }

        [Required(ErrorMessage = "N?i dung ph?n h?i là b?t bu?c")]
        public string Content { get; set; }
    }
}