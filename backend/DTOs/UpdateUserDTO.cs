using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class UpdateUserDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [Phone]
        public string? Phone { get; set; }

        public string? AvatarUrl { get; set; }

        [MinLength(6, ErrorMessage = "M?t kh?u m?i n?u nh?p thì ph?i có ít nh?t 6 ký t?")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d).*$", ErrorMessage = "M?t kh?u m?i ph?i ch?a ít nh?t 1 ch? in hoa và 1 ch? s?")]
        public string? Password { get; set; } // Optional: only update if provided

        [Required]
        public int RoleId { get; set; }
    }
}
