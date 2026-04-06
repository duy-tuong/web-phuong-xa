using System.Globalization;
using System.Security.Claims;
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
    public class ArticlesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ArticlesController(AppDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetArticles(string? keyword, int page = 1, int pageSize = 5)
        {
            var query = _context.Articles
                .Include(a => a.Category)
                .Include(a => a.Author)
                .Where(a => a.Status == "Published")
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var normalizedKeyword = keyword.Trim();
                query = query.Where(a => a.Title.Contains(normalizedKeyword));
            }

            var total = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(total / (double)pageSize);

            var articles = await query
                .OrderByDescending(a => a.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Slug,
                    a.Excerpt,
                    a.FeaturedImage,
                    a.IsFeatured,
                    a.CreatedAt,
                    Category = a.Category.Name,
                    Author = string.IsNullOrWhiteSpace(a.Author.FullName) ? a.Author.Username : a.Author.FullName
                })
                .ToListAsync();

            return Ok(new { total, page, pageSize, totalPages, data = articles });
        }

        // 🔹 PUBLIC: API riêng lấy tin nổi bật
        [AllowAnonymous]
        [HttpGet("featured")]
        public async Task<IActionResult> GetFeaturedArticles(int limit = 5)
        {
            var articles = await _context.Articles
                .Include(a => a.Category)
                .Include(a => a.Author)
                .Where(a => a.Status == "Published" && a.IsFeatured == true)
                .OrderByDescending(a => a.CreatedAt)
                .Take(limit)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Slug,
                    a.Excerpt,
                    a.FeaturedImage,
                    a.CreatedAt,
                    Category = a.Category.Name,
                    Author = a.Author.Username
                })
                .ToListAsync();

            return Ok(articles);
        }

        // 🔹 PUBLIC: xem chi tiết
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetArticle(int id)
        {
            var article = await _context.Articles
                .Include(a => a.Category)
                .Include(a => a.Author)
                .Where(a => a.Id == id && a.Status == "Published")
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Excerpt,
                    a.FeaturedImage,
                    a.Content,
                    a.IsFeatured,
                    a.Slug,
                    a.CreatedAt,
                    Category = a.Category.Name,
                    Author = string.IsNullOrWhiteSpace(a.Author.FullName) ? a.Author.Username : a.Author.FullName
                })
                .FirstOrDefaultAsync();

            if (article == null)
            {
                return NotFound();
            }

            return Ok(article);
        }

        [Authorize(Roles = "Admin,Editor")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllArticles()
        {
            var articles = await _context.Articles
                .Include(a => a.Category)
                .Include(a => a.Author)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Slug,
                    a.Excerpt,
                    a.FeaturedImage,
                    a.IsFeatured,
                    a.Content,
                    a.Status,
                    a.CreatedAt,
                    a.PublishedAt,
                    a.CategoryId,
                    Category = a.Category.Name,
                    a.AuthorId,
                    Author = a.Author.Username
                })
                .ToListAsync();

            return Ok(articles);
        }

        [Authorize(Roles = "Admin,Editor")]
        [HttpPost]
        public async Task<IActionResult> CreateArticle(CreateArticleDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
            {
                return BadRequest("Category not found");
            }

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out var currentUserId))
            {
                return Unauthorized("User ID not found in token");
            }

            var normalizedStatus = NormalizeStatus(dto.Status);
            var article = new Article
            {
                Title = dto.Title,
                Slug = string.IsNullOrWhiteSpace(dto.Slug) ? GenerateSlug(dto.Title) : dto.Slug,
                Excerpt = dto.Excerpt,
                FeaturedImage = dto.FeaturedImage,
                Content = dto.Content,
                IsFeatured = dto.IsFeatured,
                CategoryId = dto.CategoryId,
                AuthorId = currentUserId,
                CreatedAt = DateTime.Now,
                Status = normalizedStatus,
                PublishedAt = normalizedStatus == "Published" ? DateTime.Now : null
            };

            _context.Articles.Add(article);
            await _context.SaveChangesAsync();

            return Ok(new { article.Id, article.Title, article.Status });
        }

        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArticle(int id, UpdateArticleDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var article = await _context.Articles.FindAsync(id);
            if (article == null)
            {
                return NotFound();
            }

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
            {
                return BadRequest("Category not found");
            }

            var normalizedStatus = NormalizeStatus(dto.Status);

            article.Title = dto.Title.Trim();
            article.Excerpt = NormalizeOptional(dto.Excerpt);
            article.FeaturedImage = NormalizeOptional(dto.FeaturedImage);
            article.Content = dto.Content;
            article.IsFeatured = dto.IsFeatured;
            article.CategoryId = dto.CategoryId;
            article.Slug = string.IsNullOrWhiteSpace(dto.Slug)
                ? GenerateSlug(dto.Title)
                : dto.Slug;
            article.Status = normalizedStatus;
            article.PublishedAt = normalizedStatus == "Published" ? (article.PublishedAt ?? DateTime.Now) : null;

            await _context.SaveChangesAsync();

            return Ok(new { article.Id, article.Title, article.Status });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/publish")]
        public async Task<IActionResult> PublishArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null)
            {
                return NotFound();
            }

            article.Status = "Published";
            article.PublishedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Published" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null)
            {
                return NotFound();
            }

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Deleted" });
        }

        private async Task<string> BuildUniqueSlugAsync(string? desiredSlug, string title, int? currentArticleId = null)
        {
            var baseSlug = GenerateSlug(string.IsNullOrWhiteSpace(desiredSlug) ? title : desiredSlug);
            if (string.IsNullOrWhiteSpace(baseSlug))
            {
                baseSlug = $"article-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
            }

            var uniqueSlug = baseSlug;
            var suffix = 2;

            while (await _context.Articles.AnyAsync(a =>
                       a.Slug == uniqueSlug &&
                       (!currentArticleId.HasValue || a.Id != currentArticleId.Value)))
            {
                uniqueSlug = $"{baseSlug}-{suffix}";
                suffix++;
            }

            return uniqueSlug;
        }

        private static string NormalizeStatus(string? value)
        {
            return string.Equals(value, "Published", StringComparison.OrdinalIgnoreCase)
                ? "Published"
                : "Draft";
        }

        private static string? NormalizeOptional(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        }

        private static string GenerateSlug(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
            {
                return string.Empty;
            }

            var normalizedString = title.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var character in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(character);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(character);
                }
            }

            var result = stringBuilder.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();
            result = result.Replace("đ", "d");
            result = Regex.Replace(result, @"[^a-z0-9\s-]", "");
            result = Regex.Replace(result, @"\s+", "-").Trim('-');

            return result;
        }
    }
}
