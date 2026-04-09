using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace backend.Services
{
    public class AuditLogCleanupOptions
    {
        public int DaysToKeep { get; set; } = 30;
        public int RunAtHour { get; set; } = 2;
    }

    public class AuditLogCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly AuditLogCleanupOptions _options;

        public AuditLogCleanupService(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _options = configuration.GetSection("AuditLogCleanup").Get<AuditLogCleanupOptions>()
                ?? new AuditLogCleanupOptions();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var delay = GetDelayUntilNextRun(_options.RunAtHour);
                if (delay > TimeSpan.Zero)
                {
                    await Task.Delay(delay, stoppingToken);
                }

                await CleanupAsync(stoppingToken);

                await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
            }
        }

        private async Task CleanupAsync(CancellationToken stoppingToken)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var threshold = DateTime.Now.AddDays(-_options.DaysToKeep);

                var oldLogs = await context.AuditLogs
                    .Where(log => log.CreatedAt <= threshold)
                    .ToListAsync(stoppingToken);

                if (oldLogs.Count == 0)
                {
                    return;
                }

                context.AuditLogs.RemoveRange(oldLogs);
                await context.SaveChangesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                Console.WriteLine($">>> Audit log cleanup failed: {ex.Message}");
            }
        }

        private static TimeSpan GetDelayUntilNextRun(int runAtHour)
        {
            var now = DateTime.Now;
            var nextRun = new DateTime(now.Year, now.Month, now.Day, runAtHour, 0, 0);
            if (nextRun <= now)
            {
                nextRun = nextRun.AddDays(1);
            }

            return nextRun - now;
        }
    }
}
