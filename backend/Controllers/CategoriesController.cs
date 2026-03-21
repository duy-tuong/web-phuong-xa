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

        // GET ALL
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories
                .OrderBy(c => c.Name)
                .ToListAsync();

            return Ok(categories);
        }


        // GET BY ID
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return NotFound("Category not found");

            return Ok(category);
        }


        // CREATE
        [Authorize(Roles = "Admin,Editor")]
        [HttpPost]
        public async Task<IActionResult> CreateCategory(CreateCategoryDTO dto)
        {
            var exists = await _context.Categories.AnyAsync(c => c.Name == dto.Name);
            if (exists)
            {
                return BadRequest("Category with the same name already exists.");
            }

            var category = new Category
            {
                Name = dto.Name,
                Description = dto.Description
            };

            _context.Categories.Add(category);

            await _context.SaveChangesAsync();

            return Ok(category);
        }


        // UPDATE
        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDTO dto)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
                return NotFound("Category not found");

            var exists = await _context.Categories.AnyAsync(c => c.Name == dto.Name && c.Id != id);
            if (exists)
            {
                return BadRequest("Category with the same name already exists.");
            }

            category.Name = dto.Name;
            category.Description = dto.Description;

            await _context.SaveChangesAsync();

            return Ok(category);
        }


        // DELETE
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
                return NotFound("Category not found");

            var hasArticles = await _context.Articles.AnyAsync(a => a.CategoryId == id);
            if (hasArticles)
            {
                return BadRequest("Cannot delete category because it contains articles. Please reassign or delete the articles first.");
            }

            _context.Categories.Remove(category);

            await _context.SaveChangesAsync();

            return Ok("Category deleted");
        }

    }
}
