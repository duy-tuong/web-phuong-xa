using backend.Data;
using backend.DTOs;
using backend.Models;
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
    public class ArticlesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ArticlesController(AppDbContext context)
        {
            _context = context;
        }

        // 🔹 PUBLIC: chỉ xem bài đã publish
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetArticles(string? keyword, int page = 1, int pageSize = 5)
        {
            var query = _context.Articles
                .Include(a => a.Category)
                .Include(a => a.Author)
                .Where(a => a.Status == "Published") //  chỉ bài public
                .AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(a => a.Title.Contains(keyword));
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
                    a.CreatedAt,
                    Category = a.Category.Name,
                    Author = a.Author.Username
                })
                .ToListAsync();

            return Ok(new { total, page, pageSize, totalPages, data = articles });
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
                    a.Slug,
                    a.CreatedAt,
                    Category = a.Category.Name,
                    Author = a.Author.Username
                })
                .FirstOrDefaultAsync();

            if (article == null)
                return NotFound();

            return Ok(article);
        }

        // 🔹 ADMIN/EDITOR: xem tất cả (draft + published)
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

        // 🔹 ADMIN/EDITOR: CREATE
        [Authorize(Roles = "Admin,Editor")]
        [HttpPost]
        public async Task<IActionResult> CreateArticle(CreateArticleDTO dto)
        {
            // Kiểm tra Category thực sự tồn tại
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
            if (!categoryExists)
            {
                return BadRequest("Category not found");
            }

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int currentUserId))
            {
                return Unauthorized("User ID not found in token");
            }

            var article = new Article
            {
                Title = dto.Title,
                Slug = string.IsNullOrWhiteSpace(dto.Slug) ? GenerateSlug(dto.Title) : dto.Slug,
                Excerpt = dto.Excerpt,
                FeaturedImage = dto.FeaturedImage,
                Content = dto.Content,
                CategoryId = dto.CategoryId,
                AuthorId = currentUserId,
                CreatedAt = DateTime.Now,
                Status = "Draft", //  mặc định draft
            };

            _context.Articles.Add(article);
            await _context.SaveChangesAsync();

            return Ok(new { article.Id, article.Title, article.Status });
        }

        // 🔹 ADMIN/EDITOR: UPDATE
        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArticle(int id, UpdateArticleDTO dto)
        {
            var article = await _context.Articles.FindAsync(id);

            if (article == null)
                return NotFound();

            if (dto.CategoryId != 0) // check if CategoryId provided
            {
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
                if (!categoryExists)
                {
                    return BadRequest("Category not found");
                }
                article.CategoryId = dto.CategoryId;
            }

            article.Title = dto.Title;
            article.Excerpt = dto.Excerpt;
            article.FeaturedImage = dto.FeaturedImage;
            article.Content = dto.Content;
            article.Slug = string.IsNullOrWhiteSpace(dto.Slug)
                ? GenerateSlug(dto.Title)
                : dto.Slug;

            await _context.SaveChangesAsync();

            return Ok(new { article.Id, article.Title });
        }

        // 🔹 ADMIN: PUBLISH
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/publish")]
        public async Task<IActionResult> PublishArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);

            if (article == null)
                return NotFound();

            article.Status = "Published";
            article.PublishedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Published" });
        }

        // 🔹 ADMIN: DELETE
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);

            if (article == null)
                return NotFound();

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Deleted" });
        }

        private string GenerateSlug(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return string.Empty;

            var normalizedString = title.Normalize(NormalizationForm.FormD);
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