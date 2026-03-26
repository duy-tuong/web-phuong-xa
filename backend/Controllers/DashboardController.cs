using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Editor")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        // ?? L?Y TH?NG KÊ T?NG QUAN
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalArticles = await _context.Articles.CountAsync();
            var publishedArticles = await _context.Articles.CountAsync(a => a.Status == "Published");
            
            var pendingApplications = await _context.Applications.CountAsync(a => a.Status == "Pending");
            var approvedApplications = await _context.Applications.CountAsync(a => a.Status == "Approved");
            var totalApplications = await _context.Applications.CountAsync();
            var totalServices = await _context.Services.CountAsync();

            var pendingComments = await _context.Comments.CountAsync(c => c.Status == "Pending");

            return Ok(new
            {
                TotalUsers = totalUsers,
                Articles = new
                {
                    Total = totalArticles,
                    Published = publishedArticles,
                    Drafts = totalArticles - publishedArticles
                },
                Applications = new
                {
                    Total = totalApplications,
                    Pending = pendingApplications,
                    Approved = approvedApplications
                },
                TotalServices = totalServices,
                PendingComments = pendingComments
            });
        }

        // ?? BI?U ?? H? S? D?CH V? CÔNG 7 NGÀY G?N NH?T
        [HttpGet("applications/monthly-chart")]
        public async Task<IActionResult> GetApplicationsChart()
        {
            var today = DateTime.Now.Date;
            var sevenDaysAgo = today.AddDays(-6);

            var applications = await _context.Applications
                .Where(a => a.CreatedAt >= sevenDaysAgo)
                .GroupBy(a => a.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key.ToString("dd/MM/yyyy"), // Tr? v? d?ng string d? ??c trên bi?u ??
                    Count = g.Count()
                })
                .OrderBy(x => x.Date)
                .ToListAsync();

            // Padding missing days with 0
            var resultDays = new List<object>();
            for (var i = 0; i <= 6; i++)
            {
                var targetDateStr = sevenDaysAgo.AddDays(i).ToString("dd/MM/yyyy");
                var existingData = applications.FirstOrDefault(x => x.Date == targetDateStr);
                
                resultDays.Add(new
                {
                    Date = targetDateStr,
                    Count = existingData?.Count ?? 0
                });
            }

            return Ok(resultDays);
        }

        // ?? DANH SÁCH H? S? M?I NH?T (DÙNG CHO B?NG DASHBOARD)
        [HttpGet("applications/recent")]
        public async Task<IActionResult> GetRecentApplications()
        {
            var recentApplications = await _context.Applications
                .Include(a => a.Service)
                .OrderByDescending(a => a.CreatedAt)
                .Take(5) // L?y 5 h? s? m?i nh?t
                .Select(a => new
                {
                    a.Id,
                    a.ApplicantName,
                    ServiceName = a.Service.Name,
                    a.Status,
                    CreatedAt = a.CreatedAt.ToString("dd/MM/yyyy HH:mm")
                })
                .ToListAsync();

            return Ok(recentApplications);
        }
    }
}