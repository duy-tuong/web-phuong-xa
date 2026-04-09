using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // Ch?c n?ng ki?m to�n ch? d�nh ri�ng cho Admin
    public class AuditLogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuditLogsController(AppDbContext context)
        {
            _context = context;
        }

        // ?? XEM L?CH S? HO?T ??NG (C� PH�N TRANG V� L?C)
        [HttpGet]
        public async Task<IActionResult> GetLogs(string? keyword, string? actionType, string? entityName, int page = 1, int pageSize = 20)
        {
            var query = _context.AuditLogs
                .Include(a => a.User)
                .AsQueryable();

            // T�m ki?m theo t�n ho?c username ng??i th?c hi?n
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(a => a.User.Username.Contains(keyword) || a.User.FullName.Contains(keyword));
            }

            // L?c theo h�nh ??ng (VD: Create, Update, Delete, Login...)
            if (!string.IsNullOrEmpty(actionType))
            {
                query = query.Where(a => a.Action.Contains(actionType));
            }

            // L?c theo ??i t??ng (VD: Article, Service, User...)
            if (!string.IsNullOrEmpty(entityName))
            {
                query = query.Where(a => a.Entity.Contains(entityName));
            }

            var total = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(total / (double)pageSize);

            var logs = await query
                .OrderByDescending(a => a.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new
                {
                    a.Id,
                    User = a.User.Username,
                    a.Action,
                    a.Entity,
                    a.Detail,
                    a.CreatedAt
                })
                .ToListAsync();

            return Ok(new { total, page, pageSize, totalPages, data = logs });
        }

        // ?? X�A L?CH S? C? (Bao g?m x�a h�ng lo?t)
        // Admin ch? ???c x�a c�c Log ?� qu� c? (v� d? tr??c 30 ng�y) ?? gi?m nh? CSDL
        [HttpDelete("clean-old")]
        public async Task<IActionResult> CleanOldLogs(int daysOld = 30)
        {
            var targetDate = GetVietnamNow().AddDays(-daysOld);

            var oldLogs = _context.AuditLogs.Where(a => a.CreatedAt <= targetDate);
            var deletedCount = await oldLogs.CountAsync();

            _context.AuditLogs.RemoveRange(oldLogs);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Successfully cleaned {deletedCount} old audit logs prior to {targetDate.ToString("dd/MM/yyyy")}." });
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