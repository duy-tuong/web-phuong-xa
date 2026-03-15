namespace backend.Models
{
    public class AuditLog
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public string Action { get; set; }

        public string Entity { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}