using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class UpdateProfileDTO
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

        public string? CurrentPassword { get; set; }

        [MinLength(6)]
        public string? NewPassword { get; set; }
    }
}
