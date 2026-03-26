using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IAuditLogService
    {
        Task LogActionAsync(int userId, string action, string entity, string? detail = null);
    }

    public class AuditLogService : IAuditLogService
    {
        private readonly IServiceProvider _serviceProvider;

        public AuditLogService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task LogActionAsync(int userId, string action, string entity, string? detail = null)
        {
            // Resolve AppDbContext scope to avoid issue with parallel Scope issues
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var log = new AuditLog
            {
                UserId = userId,
                Action = action,
                Entity = entity,
                Detail = detail,
                CreatedAt = DateTime.Now
            };

            await context.AuditLogs.AddAsync(log);
            await context.SaveChangesAsync();
        }
    }
}