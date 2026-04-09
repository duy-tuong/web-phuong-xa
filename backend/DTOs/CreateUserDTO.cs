using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateUserDTO
    {
        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "M?t kh?u ph?i có ít nh?t 6 ký t?")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d).*$", ErrorMessage = "M?t kh?u ph?i ch?a ít nh?t 1 ch? in hoa và 1 ch? s?")]
        public string Password { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [Phone]
        public string? Phone { get; set; }

        public string? AvatarUrl { get; set; }

        [Required]
        public int RoleId { get; set; }
    }
}
