using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateCommentDTO
    {
        [Required]
        public int ArticleId { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required]
        public string Content { get; set; }
    }
}
