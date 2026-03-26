using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateArticleDTO
    {
        [Required]
        public string Title { get; set; }

        public string? Excerpt { get; set; }

        public string? FeaturedImage { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public string? Slug { get; set; }

        public string Status { get; set; } = "Draft";
    }
}
