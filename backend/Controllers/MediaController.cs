using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public MediaController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [AllowAnonymous]
        [HttpGet("public")]
        public async Task<IActionResult> GetPublicMedia(string? type = null, int page = 1, int pageSize = 50)
        {
            var normalizedType = string.IsNullOrWhiteSpace(type) ? null : type.Trim().ToLowerInvariant();
            var query = _context.Media.AsQueryable();

            if (!string.IsNullOrWhiteSpace(normalizedType))
            {
                query = normalizedType switch
                {
                    "image" => query.Where(m => m.Type == "Image" || (m.FileType != null && m.FileType.StartsWith("image/"))),
                    "video" => query.Where(m => m.Type == "Video" || (m.FileType != null && m.FileType.StartsWith("video/"))),
                    "document" => query.Where(m => m.Type == "Document"),
                    _ => query,
                };
            }

            var total = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(total / (double)pageSize);

            var mediaFiles = await query
                .OrderByDescending(m => m.UploadedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new
                {
                    m.Id,
                    m.FileName,
                    m.FilePath,
                    m.Type,
                    m.FileType,
                    m.FileSize,
                    m.UploadedAt
                })
                .ToListAsync();

            return Ok(new { total, page, pageSize, totalPages, data = mediaFiles });
        }

        [Authorize(Roles = "Admin,Editor")]
        [HttpGet]
        public async Task<IActionResult> GetAllMedia(int page = 1, int pageSize = 20)
        {
            var query = _context.Media.Include(m => m.User).AsQueryable();

            var total = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(total / (double)pageSize);

            var mediaFiles = await query
                .OrderByDescending(m => m.UploadedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new
                {
                    m.Id,
                    m.FileName,
                    m.FilePath,
                    m.Type,
                    m.FileType,
                    m.FileSize,
                    UploadedBy = m.User.Username,
                    m.UploadedAt
                })
                .ToListAsync();

            return Ok(new { total, page, pageSize, totalPages, data = mediaFiles });
        }

        [Authorize(Roles = "Admin,Editor")]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadMedia(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var maxFileSize = 5 * 1024 * 1024;
            if (file.Length > maxFileSize)
            {
                return BadRequest("File size exceeds the 5MB limit.");
            }

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest("Invalid file type. Only JPG, PNG, GIF, PDF, DOC, DOCX are allowed.");
            }

            var uploadDir = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            if (!Directory.Exists(uploadDir))
            {
                Directory.CreateDirectory(uploadDir);
            }

            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadDir, uniqueFileName);

            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var currentUserId))
            {
                return Unauthorized("User ID not found in token");
            }

            var relativePath = $"/uploads/{uniqueFileName}";
            var fileType = (extension == ".pdf" || extension.Contains(".doc")) ? "Document" : "Image";

            var media = new Media
            {
                FileName = file.FileName,
                FilePath = relativePath,
                Type = fileType,
                FileType = file.ContentType,
                FileSize = file.Length,
                UploadedBy = currentUserId,
                UploadedAt = DateTime.Now
            };

            _context.Media.Add(media);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "File uploaded successfully",
                media.Id,
                url = relativePath,
                type = fileType,
                fileType = media.FileType,
                fileSize = media.FileSize
            });
        }

        [Authorize(Roles = "Admin,Editor")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteMedia(int id)
        {
            var media = await _context.Media.FindAsync(id);

            if (media == null)
            {
                return NotFound("Media not found.");
            }

            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var currentUserRole = User.FindFirstValue(ClaimTypes.Role);

            if (currentUserRole != "Admin" && media.UploadedBy != currentUserId)
            {
                return Forbid();
            }

            var uploadDir = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var physicalPath = Path.Combine(uploadDir, media.FilePath.TrimStart('/'));

            if (System.IO.File.Exists(physicalPath))
            {
                System.IO.File.Delete(physicalPath);
            }

            _context.Media.Remove(media);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Media deleted successfully." });
        }
    }
}
