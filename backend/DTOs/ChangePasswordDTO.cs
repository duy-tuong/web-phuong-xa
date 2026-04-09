using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class ChangePasswordDTO
    {
        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "M?t kh?u m?i ph?i có ít nh?t 6 ký t?")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d).*$", ErrorMessage = "M?t kh?u m?i ph?i ch?a ít nh?t 1 ch? in hoa và 1 ch? s?")]
        public string NewPassword { get; set; }
    }
}
