namespace backend.Models
{
    public class Application
    {
        public int Id { get; set; }

        public int ServiceId { get; set; }

        public Service Service { get; set; }

        public string FullName { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public string Address { get; set; }

        public string FileUrl { get; set; }

        public string Status { get; set; }

        public string Code { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
