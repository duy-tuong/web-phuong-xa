namespace backend.Models
{
    public class Media
    {
        public int Id { get; set; }

        public string FileName { get; set; }

        public string FilePath { get; set; }

        public string Type { get; set; }

        public string? FileType { get; set; }

        public long? FileSize { get; set; }

        public int UploadedBy { get; set; }

        public User User { get; set; }

        public DateTime UploadedAt { get; set; }

        public bool IsPublic { get; set; } = true;
    }
}