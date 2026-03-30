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
    public class ContactsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContactsController(AppDbContext context)
        {
            _context = context;
        }

        // ?? NG??I DÂN TRUY C?P (KHÔNG C?N ??NG NH?P): G?I LIÊN H? GÓP Ý
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateContact(CreateContactDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var contact = new Contact
            {
                FullName = dto.FullName,
                Phone = dto.Phone,
                Email = dto.Email,
                Category = dto.Category,
                Content = dto.Content,
                Status = "Pending", // M?c ??nh là ch? x? lý
                CreatedAt = DateTime.Now
            };

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Góp ý / Liên h? c?a b?n ?ã ???c g?i thành công. Chân thành c?m ?n!"
            });
        }

        // ?? ADMIN/EDITOR TRUY C?P: L?Y DANH SÁCH CÁC LIÊN H? ?? X? LÝ
        [Authorize(Roles = "Admin,Editor")]
        [HttpGet]
        public async Task<IActionResult> GetContacts(string? status, int page = 1, int pageSize = 10)
        {
            var query = _context.Contacts.AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(c => c.Status == status);
            }

            var total = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(total / (double)pageSize);

            var contacts = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new
                {
                    c.Id,
                    c.FullName,
                    c.Phone,
                    c.Email,
                    c.Category,
                    c.Content,
                    c.Status,
                    c.CreatedAt
                })
                .ToListAsync();

            return Ok(new { total, page, pageSize, totalPages, data = contacts });
        }
        
        // ?? ADMIN/EDITOR TRUY C?P: L?Y CHI TI?T 1 CÁI ?? ??C
        [Authorize(Roles = "Admin,Editor")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);

            if (contact == null)
            {
                return NotFound("Contact not found.");
            }

            return Ok(contact);
        }

        // ?? ADMIN/EDITOR TRUY C?P: C?P NH?T TR?NG THÁI (?Ã ??C / ?Ã GI?I QUY?T)
        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateContactStatus(int id, [FromBody] string newStatus)
        {
            var allowedStatuses = new[] { "Pending", "Processed", "Resolved" };
            if (!allowedStatuses.Contains(newStatus))
            {
                return BadRequest("Tr?ng thái không h?p l?. Ch? ch?p nh?n: Pending, Processed, Resolved.");
            }

            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                return NotFound("Contact not found.");
            }

            contact.Status = newStatus;
            await _context.SaveChangesAsync();

            return Ok(new { message = "C?p nh?t tr?ng thái thành công.", status = contact.Status });
        }

        // ?? ADMIN: XÓA LIÊN H? RÁC
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                return NotFound("Contact not found.");
            }

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa liên h? thành công." });
        }
    }
}