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
    [Authorize(Roles = "Admin")] // Ton b? Controller ch? Admin m?i ???c truy c?p
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // ?? GET ALL USERS (C TM KI?M V PHN TRANG)
        [HttpGet]
        public async Task<IActionResult> GetUsers(string? keyword, int page = 1, int pageSize = 10)
        {
            var safePage = Math.Max(page, 1);
            var safePageSize = Math.Clamp(pageSize, 1, 100);

            var query = _context.Users
                .Include(u => u.Role)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var normalizedKeyword = keyword.Trim();
                query = query.Where(u =>
                    u.Username.Contains(normalizedKeyword) ||
                    u.Email.Contains(normalizedKeyword) ||
                    u.FullName.Contains(normalizedKeyword) ||
                    (u.Phone != null && u.Phone.Contains(normalizedKeyword)));
            }

            var total = await query.CountAsync();
            var totalPages = total == 0 ? 0 : (int)Math.Ceiling(total / (double)safePageSize);

            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((safePage - 1) * safePageSize)
                .Take(safePageSize)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.FullName,
                    u.Phone,
                    u.AvatarUrl,
                    Role = u.Role.Name,
                    u.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                total,
                page = safePage,
                pageSize = safePageSize,
                totalPages,
                data = users
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.FullName,
                    u.Phone,
                    u.AvatarUrl,
                    u.RoleId,
                    Role = new
                    {
                        u.Role.Id,
                        u.Role.Name
                    },
                    u.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(user);
        }

        // ?? CREATE USER (Admin t?o ti kho?n cho cn b?)
        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var username = dto.Username.Trim();
            var email = dto.Email.Trim();
            var fullName = dto.FullName.Trim();

            var usernameExists = await _context.Users.AnyAsync(u => u.Username == username);
            if (usernameExists)
            {
                return BadRequest("Username already exists.");
            }

            var emailExists = await _context.Users.AnyAsync(u => u.Email == email);
            if (emailExists)
            {
                return BadRequest("Email already in use.");
            }

            var roleExists = await _context.Roles.AnyAsync(r => r.Id == dto.RoleId);
            if (!roleExists)
            {
                return BadRequest("Role does not exist.");
            }

            var user = new User
            {
                Username = username,
                Email = email,
                FullName = fullName,
                Phone = NormalizeOptional(dto.Phone),
                AvatarUrl = NormalizeOptional(dto.AvatarUrl),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                RoleId = dto.RoleId,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "User created successfully",
                userId = user.Id
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var email = dto.Email.Trim();
            var fullName = dto.FullName.Trim();

            var emailExists = await _context.Users.AnyAsync(u => u.Email == email && u.Id != id);
            if (emailExists)
            {
                return BadRequest("Email already in use by another account.");
            }

            var roleExists = await _context.Roles.AnyAsync(r => r.Id == dto.RoleId);
            if (!roleExists)
            {
                return BadRequest("Role does not exist.");
            }

            user.Email = dto.Email;
            user.FullName = dto.FullName;

            if (dto.Phone != null)
            {
                user.Phone = dto.Phone.Trim();
            }

            if (dto.AvatarUrl != null)
            {
                user.AvatarUrl = dto.AvatarUrl.Trim();
            }

            user.RoleId = dto.RoleId;

            // N?u admin c truy?n ln Password m?i th m?i update pass
            if (!string.IsNullOrEmpty(dto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "User updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Trnh Admin t? xa chnh mnh n?u l? tay
            var currentUserUsername = User.Identity?.Name;
            if (user.Username == currentUserUsername)
            {
                return BadRequest("You cannot delete your own account.");
            }

            // Ki?m tra xem User ny c ?ang s? h?u Bi vi?t no khng (rng bu?c kha ngo?i)
            var hasArticles = await _context.Articles.AnyAsync(a => a.AuthorId == id);
            if (hasArticles)
            {
                return BadRequest("Cannot delete this user because they are the author of existing articles. Reassign the articles first.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully." });
        }

        private static string? NormalizeOptional(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        }
    }
}
