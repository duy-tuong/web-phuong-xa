namespace backend.Models
{
    public class Service
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string FileUrl { get; set; }

        public DateTime CreatedAt { get; set; }

        public ICollection<Application> Applications { get; set; }
    }
}
