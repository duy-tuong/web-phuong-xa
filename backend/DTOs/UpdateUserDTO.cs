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

        public string? Password { get; set; } // Optional: only update if provided

        [Required]
        public int RoleId { get; set; }
    }
}
