using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ApplicationsController(AppDbContext context)
        {
            _context = context;
        }

        // ?? NG??I DÂN: N?P H? S? (CREATE)
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateApplication(CreateApplicationDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var serviceExists = await _context.Services.AnyAsync(s => s.Id == dto.ServiceId);
            if (!serviceExists)
            {
                return BadRequest("Service not found.");
            }

            var application = new Application
            {
                ServiceId = dto.ServiceId,
                ApplicantName = dto.ApplicantName,
                Phone = dto.Phone,
                Email = dto.Email,
                Status = "Pending", // M?c ??nh là ch? x? lý
                CreatedAt = DateTime.Now
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Application submitted successfully",
                applicationId = application.Id,
                status = application.Status
            });
        }

        // ?? NG??I DÂN: TRA C?U H? S? THEO S? ?I?N THO?I HO?C EMAIL
        [AllowAnonymous]
        [HttpGet("search")]
        public async Task<IActionResult> SearchApplication([FromQuery] string? phone, [FromQuery] string? email)
        {
            if (string.IsNullOrEmpty(phone) && string.IsNullOrEmpty(email))
            {
                return BadRequest("Please provide a phone number or email to search.");
            }

            var query = _context.Applications
                .Include(a => a.Service)
                .AsQueryable();

            if (!string.IsNullOrEmpty(phone))
            {
                query = query.Where(a => a.Phone == phone);
            }

            if (!string.IsNullOrEmpty(email))
            {
                query = query.Where(a => a.Email == email);
            }

            var applications = await query
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new
                {
                    a.Id,
                    ServiceName = a.Service.Name,
                    a.ApplicantName,
                    a.Phone,
                    a.Email,
                    a.Status,
                    a.CreatedAt
                })
                .ToListAsync();

            return Ok(applications);
        }

        // ?? CÁN B?: XEM TOÀN B? H? S?
        [Authorize(Roles = "Admin,Editor")]
        [HttpGet]
        public async Task<IActionResult> GetAllApplications(string? status, int page = 1, int pageSize = 10)
        {
            var query = _context.Applications
                .Include(a => a.Service)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(a => a.Status == status);
            }

            var total = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(total / (double)pageSize);

            var applications = await query
                .OrderByDescending(a => a.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new
                {
                    a.Id,
                    ServiceName = a.Service.Name,
                    a.ApplicantName,
                    a.Phone,
                    a.Email,
                    a.Status,
                    a.CreatedAt
                })
                .ToListAsync();

            return Ok(new { total, page, pageSize, totalPages, data = applications });
        }

        // ?? CÁN B?: XEM CHI TI?T 1 H? S?
        [Authorize(Roles = "Admin,Editor")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetApplication(int id)
        {
            var application = await _context.Applications
                .Include(a => a.Service)
                .Where(a => a.Id == id)
                .Select(a => new
                {
                    a.Id,
                    ServiceId = a.ServiceId,
                    ServiceName = a.Service.Name,
                    RequiredDocuments = a.Service.RequiredDocuments, /* ?? cán b? bi?t c?n check gi?y t? gì */
                    a.ApplicantName,
                    a.Phone,
                    a.Email,
                    a.Status,
                    a.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (application == null)
            {
                return NotFound("Application not found.");
            }

            return Ok(application);
        }

        // ?? CÁN B?: C?P NH?T TR?NG THÁI H? S?
        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateApplicationStatus(int id, UpdateApplicationStatusDTO dto)
        {
            var allowedStatuses = new[] { "Pending", "Processing", "Approved", "Rejected" };
            if (!allowedStatuses.Contains(dto.Status))
            {
                return BadRequest("Invalid Status. Allowed values: Pending, Processing, Approved, Rejected.");
            }

            var application = await _context.Applications.FindAsync(id);

            if (application == null)
            {
                return NotFound("Application not found.");
            }

            application.Status = dto.Status;
            
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Application status updated successfully",
                applicationId = application.Id,
                status = application.Status
            });
        }

        // ?? CÁN B? (ADMIN): XÓA H? S? RÁC/L?I
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteApplication(int id)
        {
            var application = await _context.Applications.FindAsync(id);

            if (application == null)
            {
                return NotFound("Application not found.");
            }

            _context.Applications.Remove(application);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Application deleted successfully." });
        }
    }
}
