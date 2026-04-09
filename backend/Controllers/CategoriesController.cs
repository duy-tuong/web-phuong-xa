using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Text;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAuditLogService _auditLogService;

        public CategoriesController(AppDbContext context, IAuditLogService auditLogService)
        {
            _context = context;
            _auditLogService = auditLogService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .OrderBy(c => c.Name)
                .ToListAsync();

            return Ok(categories);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound("Category not found");
            }

            return Ok(category);
        }

        [Authorize(Roles = "Admin,Editor")]
        [HttpPost]
        public async Task<IActionResult> CreateCategory(CreateCategoryDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var normalizedName = dto.Name.Trim();
            var exists = await _context.Categories.AnyAsync(c => c.Name == normalizedName);
            if (exists)
            {
                return BadRequest("Category with the same name already exists.");
            }

            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description,
                Slug = GenerateSlug(dto.Name)
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            var userIdClaim = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdClaim, out var currentUserId))
            {
                await _auditLogService.LogActionAsync(
                    currentUserId,
                    "Create",
                    "Categories",
                    $"Category {category.Id}: {category.Name}"
                );
            }

            return Ok(category);
        }

        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound("Category not found");
            }

            var normalizedName = dto.Name.Trim();
            var exists = await _context.Categories.AnyAsync(c => c.Name == normalizedName && c.Id != id);
            if (exists)
            {
                return BadRequest("Category with the same name already exists.");
            }

            category.Name = dto.Name;
            category.Description = dto.Description;
            category.Slug = GenerateSlug(dto.Name);

            await _context.SaveChangesAsync();

            var userIdClaim = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdClaim, out var currentUserId))
            {
                await _auditLogService.LogActionAsync(
                    currentUserId,
                    "Update",
                    "Categories",
                    $"Category {category.Id}: {category.Name}"
                );
            }

            return Ok(category);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound("Category not found");
            }

            var hasArticles = await _context.Articles.AnyAsync(a => a.CategoryId == id);
            if (hasArticles)
            {
                return BadRequest("Cannot delete category because it contains articles. Please reassign or delete the articles first.");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            var userIdClaim = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdClaim, out var currentUserId))
            {
                await _auditLogService.LogActionAsync(
                    currentUserId,
                    "Delete",
                    "Categories",
                    $"Category {category.Id}: {category.Name}"
                );
            }

            return Ok("Category deleted");
        }

        private string GenerateSlug(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return string.Empty;

            var normalizedString = text.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != System.Globalization.UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            string result = stringBuilder.ToString().Normalize(NormalizationForm.FormC).ToLower();
            result = result.Replace("đ", "d");
            
            // Xóa tất cả các ký tự không phải chữ cái và số, thay khoảng trắng thành gạch ngang
            result = Regex.Replace(result, @"[^a-z0-9\s-]", "");
            result = Regex.Replace(result, @"\s+", "-").Trim('-');

            return result;
        }

    }
}
