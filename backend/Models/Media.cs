namespace backend.Models
{
    public class Media
    {
        public int Id { get; set; }

        public string FileName { get; set; }

        public string Url { get; set; }

        public string Type { get; set; }

        public int UploadedBy { get; set; }

        public User User { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
