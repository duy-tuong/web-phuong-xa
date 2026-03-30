using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class UpdateCategoryDTO
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public string Description { get; set; }

        public string? Slug { get; set; }
    }
}
