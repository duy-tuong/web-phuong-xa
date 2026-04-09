using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class RegisterDTO
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*\d).*$", ErrorMessage = "Mật khẩu phải chứa ít nhất 1 chữ in hoa và 1 chữ số")]
        public string Password { get; set; }

        [Required]
        public string FullName { get; set; }
    }
}
