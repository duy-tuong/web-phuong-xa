namespace backend.Models
{
    public class Contact
    {
        public int Id { get; set; }

        public string FullName { get; set; }

        public string Phone { get; set; }

        public string? Email { get; set; }

        public string Category { get; set; } // Ph?n ánh, Ki?n ngh?, Góp ý

        public string Content { get; set; }

        public string Status { get; set; } = "Pending"; // Pending, Processed, Resolved

        public DateTime CreatedAt { get; set; }
    }
}