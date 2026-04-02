using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class UpdateServiceDTO
    {
        [Required]
        public string Name { get; set; }

        public string Category { get; set; } = "Hành chính công";

        public string Description { get; set; }

        public string RequiredDocuments { get; set; }

        public string ProcessingTime { get; set; }

        public decimal Fee { get; set; }

        public string? TemplateFile { get; set; }
    }
}
