using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class UpdateArticleDTO
    {
        [Required]
        public string Title { get; set; }

        public string? Slug { get; set; }

        public string? Excerpt { get; set; }

        public string? FeaturedImage { get; set; }

        [Required]
        public string Content { get; set; }

        public bool IsFeatured { get; set; } = false;

        [Required]
        public int CategoryId { get; set; }

        public string Status { get; set; }
    }
}
