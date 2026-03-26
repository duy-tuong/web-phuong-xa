using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateApplicationDTO
    {
        [Required]
        public int ServiceId { get; set; }

        [Required]
        [MaxLength(100)]
        public string ApplicantName { get; set; }

        [Required]
        [Phone]
        [MaxLength(20)]
        public string Phone { get; set; }

        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; }
    }
}
