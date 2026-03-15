using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Role> Roles { get; set; }

        public DbSet<UserRole> UserRoles { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Article> Articles { get; set; }

        public DbSet<Comment> Comments { get; set; }

        public DbSet<Media> Media { get; set; }

        public DbSet<Service> Services { get; set; }

        public DbSet<Application> Applications { get; set; }

        public DbSet<Feedback> Feedback { get; set; }

        public DbSet<AuditLog> AuditLogs { get; set; }
    }
}