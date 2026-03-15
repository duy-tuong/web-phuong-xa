namespace backend.Models
{
    public class AuditLog
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public string Action { get; set; }

        public string TableName { get; set; }

        public int RecordId { get; set; }

        public DateTime CreatedAt { get; set; }

        public string IpAddress { get; set; }
    }
}
