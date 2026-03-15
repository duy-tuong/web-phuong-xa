namespace backend.Models
{
    public class Comment
    {
        public int Id { get; set; }

        public int ArticleId { get; set; }

        public Article Article { get; set; }

        public string UserName { get; set; }

        public string Content { get; set; }

        public string Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}