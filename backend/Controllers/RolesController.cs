using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // Ch? Admin m?i ???c qu?n lý Role
    public class RolesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RolesController(AppDbContext context)
        {
            _context = context;
        }

        // ?? GET ALL ROLES
        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _context.Roles
                .OrderBy(r => r.Id)
                .Select(r => new
                {
                    r.Id,
                    r.Name
                })
                .ToListAsync();

            return Ok(roles);
        }

        // ?? GET ROLE BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRole(int id)
        {
            var role = await _context.Roles
                .Where(r => r.Id == id)
                .Select(r => new
                {
                    r.Id,
                    r.Name
                })
                .FirstOrDefaultAsync();

            if (role == null)
            {
                return NotFound("Role not found.");
            }

            return Ok(role);
        }

        // ?? CREATE ROLE
        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] string roleName)
        {
            if (string.IsNullOrWhiteSpace(roleName))
            {
                return BadRequest("Role name cannot be empty.");
            }

            var exists = await _context.Roles.AnyAsync(r => r.Name.Trim().ToLower() == roleName.Trim().ToLower());
            if (exists)
            {
                return BadRequest("Role with this name already exists.");
            }

            var role = new Role
            {
                Name = roleName.Trim()
            };

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            return Ok(new { role.Id, role.Name });
        }

        // ?? UPDATE ROLE
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] string roleName)
        {
            if (string.IsNullOrWhiteSpace(roleName))
            {
                return BadRequest("Role name cannot be empty.");
            }

            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound("Role not found.");
            }

            // Ng?n ch?n ??i tên 2 role cõi lõi c?a h? th?ng ?? tránh l?i logic c?ng
            if (role.Name == "Admin" || role.Name == "Editor")
            {
                return BadRequest("Cannot rename core system roles (Admin, Editor).");
            }

            var exists = await _context.Roles.AnyAsync(r => r.Name.Trim().ToLower() == roleName.Trim().ToLower() && r.Id != id);
            if (exists)
            {
                return BadRequest("Role with this name already exists.");
            }

            role.Name = roleName.Trim();
            await _context.SaveChangesAsync();

            return Ok(new { role.Id, role.Name });
        }

        // ?? DELETE ROLE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound("Role not found.");
            }

            // Ng?n ch?n xóa Core roles
            if (role.Name == "Admin" || role.Name == "Editor")
            {
                return BadRequest("Cannot delete core system roles (Admin, Editor).");
            }

            var hasUsers = await _context.Users.AnyAsync(u => u.RoleId == id);
            if (hasUsers)
            {
                return BadRequest("Cannot delete this role because there are users currently assigned to it.");
            }

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Role deleted successfully." });
        }
    }
}