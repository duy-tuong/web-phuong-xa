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
                CreatedAt = GetVietnamNow()
            };

            await context.AuditLogs.AddAsync(log);
            await context.SaveChangesAsync();
        }

        private static DateTime GetVietnamNow()
        {
            var utcNow = DateTime.UtcNow;
            TimeZoneInfo? timeZone = null;

            try
            {
                timeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            }
            catch (TimeZoneNotFoundException)
            {
            }
            catch (InvalidTimeZoneException)
            {
            }

            if (timeZone == null)
            {
                try
                {
                    timeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
                }
                catch (TimeZoneNotFoundException)
                {
                }
                catch (InvalidTimeZoneException)
                {
                }
            }

            return timeZone == null
                ? utcNow.AddHours(7)
                : TimeZoneInfo.ConvertTimeFromUtc(utcNow, timeZone);
        }
    }
}