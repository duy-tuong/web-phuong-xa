namespace backend.Models
{
    public class Application
    {
        public int Id { get; set; }

        public int ServiceId { get; set; }

        public Service Service { get; set; }

        public string ApplicantName { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public string? AttachedFiles { get; set; }

        public string Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}