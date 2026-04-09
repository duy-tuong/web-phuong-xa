using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAuditLogService _auditLogService;

        public ServicesController(AppDbContext context, IAuditLogService auditLogService)
        {
            _context = context;
            _auditLogService = auditLogService;
        }

        // 🔹 GET ALL CATEGORIES (Danh sách lĩnh vực dành cho Frontend làm Menu/Tab)
        [AllowAnonymous]
        [HttpGet("categories")]
        public IActionResult GetServiceCategories()
        {
            var categories = new[] { "Hộ tịch", "Đất đai", "Kinh doanh", "Hành chính công" };
            return Ok(categories);
        }

        // 🔹 GET ALL
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetServices([FromQuery] string? category)
        {
            var query = _context.Services.AsQueryable();

            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(s => s.Category == category);
            }

            var services = await query
                .OrderByDescending(s => s.Id)
                .Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.Category,
                    s.Description,
                    s.RequiredDocuments,
                    s.ProcessingTime,
                    s.Fee,
                    s.TemplateFile
                })
                .ToListAsync();

            return Ok(services);
        }

        // 🔹 GET BY ID
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetService(int id)
        {
            var service = await _context.Services
                .Where(s => s.Id == id)
                .Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.Category,
                    s.Description,
                    s.RequiredDocuments,
                    s.ProcessingTime,
                    s.Fee,
                    s.TemplateFile
                })
                .FirstOrDefaultAsync();

            if (service == null)
                return NotFound();

            return Ok(service);
        }

        // 🔹 CREATE
        [Authorize(Roles = "Admin,Editor")]
        [HttpPost]
        public async Task<IActionResult> CreateService(CreateServiceDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var exists = await _context.Services.AnyAsync(s => s.Name == dto.Name);
            if (exists)
            {
                return BadRequest("Service with the same name already exists.");
            }

            var allowedCategories = new[] { "Hộ tịch", "Đất đai", "Kinh doanh", "Hành chính công" };
            var category = allowedCategories.Contains(dto.Category) ? dto.Category : "Hành chính công";

            var service = new Service
            {
                Name = dto.Name,
                Category = category,
                Description = dto.Description,
                RequiredDocuments = dto.RequiredDocuments,
                ProcessingTime = dto.ProcessingTime,
                Fee = dto.Fee,
                TemplateFile = dto.TemplateFile
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            var userIdClaim = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdClaim, out var currentUserId))
            {
                await _auditLogService.LogActionAsync(
                    currentUserId,
                    "Create",
                    "Services",
                    $"Service {service.Id}: {service.Name}"
                );
            }

            return Ok(new
            {
                service.Id,
                service.Name
            });
        }

        // 🔹 UPDATE
        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateService(int id, UpdateServiceDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var service = await _context.Services.FindAsync(id);

            if (service == null)
                return NotFound();

            var exists = await _context.Services.AnyAsync(s => s.Name == dto.Name && s.Id != id);
            if (exists)
            {
                return BadRequest("Service with the same name already exists.");
            }

            var allowedCategories = new[] { "Hộ tịch", "Đất đai", "Kinh doanh", "Hành chính công" };
            service.Category = allowedCategories.Contains(dto.Category) ? dto.Category : "Hành chính công";

            service.Name = dto.Name;
            service.Description = dto.Description;
            service.RequiredDocuments = dto.RequiredDocuments;
            service.ProcessingTime = dto.ProcessingTime;
            service.Fee = dto.Fee;
            service.TemplateFile = dto.TemplateFile;

            await _context.SaveChangesAsync();

            var userIdClaim = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdClaim, out var currentUserId))
            {
                await _auditLogService.LogActionAsync(
                    currentUserId,
                    "Update",
                    "Services",
                    $"Service {service.Id}: {service.Name}"
                );
            }

            return Ok(new
            {
                service.Id,
                service.Name
            });
        }

        // 🔹 DELETE
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Services.FindAsync(id);

            if (service == null)
                return NotFound();

            var hasApplications = await _context.Applications.AnyAsync(a => a.ServiceId == id);
            if (hasApplications)
            {
                return BadRequest("Cannot delete this service because there are existing applications linked to it.");
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            var userIdClaim = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdClaim, out var currentUserId))
            {
                await _auditLogService.LogActionAsync(
                    currentUserId,
                    "Delete",
                    "Services",
                    $"Service {service.Id}: {service.Name}"
                );
            }

            return Ok(new
            {
                message = "Deleted successfully"
            });
        }
    }
}
