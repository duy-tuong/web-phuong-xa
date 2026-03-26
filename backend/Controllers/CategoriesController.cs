using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
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
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
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
                Name = normalizedName,
                Description = dto.Description?.Trim() ?? string.Empty,
                Slug = await BuildUniqueSlugAsync(dto.Slug, normalizedName)
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

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

            category.Name = normalizedName;
            category.Description = dto.Description?.Trim() ?? string.Empty;
            category.Slug = await BuildUniqueSlugAsync(dto.Slug, normalizedName, id);

            await _context.SaveChangesAsync();

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

            return Ok("Category deleted");
        }

        private async Task<string?> BuildUniqueSlugAsync(string? slug, string name, int? currentCategoryId = null)
        {
            var candidate = ToSlug(string.IsNullOrWhiteSpace(slug) ? name : slug);
            if (string.IsNullOrWhiteSpace(candidate))
            {
                return null;
            }

            var uniqueSlug = candidate;
            var suffix = 2;

            while (await _context.Categories.AnyAsync(c =>
                       c.Slug == uniqueSlug &&
                       (!currentCategoryId.HasValue || c.Id != currentCategoryId.Value)))
            {
                uniqueSlug = $"{candidate}-{suffix}";
                suffix++;
            }

            return uniqueSlug;
        }

        private static string ToSlug(string value)
        {
            var normalized = value.Normalize(NormalizationForm.FormD);
            var builder = new StringBuilder();

            foreach (var character in normalized)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(character);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    builder.Append(character);
                }
            }

            var withoutDiacritics = builder
                .ToString()
                .Normalize(NormalizationForm.FormC)
                .Replace("đ", "d")
                .Replace("Đ", "D")
                .ToLowerInvariant();

            return Regex.Replace(withoutDiacritics, @"[^a-z0-9]+", "-").Trim('-');
        }
    }
}
