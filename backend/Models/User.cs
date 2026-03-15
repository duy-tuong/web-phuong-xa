namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public string PasswordHash { get; set; }

        public string Email { get; set; }

        public string FullName { get; set; }

        public DateTime CreatedAt { get; set; }

        public bool IsActive { get; set; }

        public ICollection<UserRole> UserRoles { get; set; }

        public ICollection<Article> Articles { get; set; }

        public ICollection<Media> Media { get; set; }

        public ICollection<AuditLog> AuditLogs { get; set; }
    }
}
