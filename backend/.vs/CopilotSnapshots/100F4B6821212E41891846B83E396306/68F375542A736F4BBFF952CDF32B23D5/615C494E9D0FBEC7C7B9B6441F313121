namespace backend.Models
{
    public class Article
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Slug { get; set; }

        public string Content { get; set; }

        public int CategoryId { get; set; }

        public Category Category { get; set; }

        public int AuthorId { get; set; }

        public User Author { get; set; }

        public ICollection<Comment> Comments { get; set; }

        public string Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? PublishedAt { get; set; }
    }
}