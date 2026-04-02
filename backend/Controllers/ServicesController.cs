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
    public class ServicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServicesController(AppDbContext context)
        {
            _context = context;
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

            return Ok(new
            {
                message = "Deleted successfully"
            });
        }
    }
}
