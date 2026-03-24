namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public string PasswordHash { get; set; }

        public string FullName { get; set; }
        public string? Phone { get; set; }
        public string? AvatarUrl { get; set; }

        public int RoleId { get; set; }

        public Role Role { get; set; }

        public ICollection<Article> Articles { get; set; }

        public ICollection<Media> MediaUploads { get; set; }

        public ICollection<AuditLog> AuditLogs { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}