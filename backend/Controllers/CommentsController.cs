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
    public class CommentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentsController(AppDbContext context)
        {
            _context = context;
        }

        // 🔹 GET COMMENTS BY ARTICLE
        [AllowAnonymous]
        [HttpGet("article/{articleId}")]
        public async Task<IActionResult> GetCommentsByArticle(int articleId)
        {
            var comments = await _context.Comments
                .Where(c => c.ArticleId == articleId && c.Status == "Approved")
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new
                {
                    c.Id,
                    c.UserName,
                    c.Content,
                    c.CreatedAt
                })
                .ToListAsync();

            return Ok(comments);
        }

        // 🔹 CREATE COMMENT
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateComment(CreateCommentDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var articleExists = await _context.Articles.AnyAsync(a => a.Id == dto.ArticleId);
            if (!articleExists)
                return BadRequest("Article not found");

            var comment = new Comment
            {
                ArticleId = dto.ArticleId,
                UserName = dto.UserName,
                Content = dto.Content,
                CreatedAt = DateTime.Now,
                Status = "Pending" // chờ duyệt
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Comment submitted, waiting for approval"
            });
        }

        // 🔹 ADMIN: GET ALL COMMENTS
        [Authorize(Roles = "Admin,Editor")]
        [HttpGet]
        public async Task<IActionResult> GetAllComments()
        {
            var comments = await _context.Comments
                .Include(c => c.Article)
                .OrderByDescending(c => c.CreatedAt)
                .Select(c => new
                {
                    c.Id,
                    c.ArticleId,
                    c.UserName,
                    c.Content,
                    c.Status,
                    c.CreatedAt,
                    ArticleTitle = c.Article.Title
                })
                .ToListAsync();

            return Ok(comments);
        }

        // 🔹 ADMIN: APPROVE / REJECT
        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, UpdateCommentDTO dto)
        {
            var allowedStatuses = new[] { "Pending", "Approved", "Rejected" };
            if (!allowedStatuses.Contains(dto.Status))
            {
                return BadRequest("Invalid Status. Allowed values: Pending, Approved, Rejected.");
            }

            var comment = await _context.Comments.FindAsync(id);

            if (comment == null)
                return NotFound();

            comment.Status = dto.Status;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Updated successfully",
                status = comment.Status
            });
        }

        // 🔹 DELETE COMMENT
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);

            if (comment == null)
                return NotFound();

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Deleted successfully"
            });
        }
    }
}
