using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAuditLogService _auditLogService;

        public ContactsController(AppDbContext context, IAuditLogService auditLogService)
        {
            _context = context;
            _auditLogService = auditLogService;
        }

        // ?? NG??I D�N TRUY C?P (KH�NG C?N ??NG NH?P): G?I LI�N H? G�P �
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
                Status = "Pending", // M?c ??nh l� ch? x? l�
                CreatedAt = DateTime.Now
            };

            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            var userIdClaim = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdClaim, out var currentUserId))
            {
                await _auditLogService.LogActionAsync(
                    currentUserId,
                    "Create",
                    "Contacts",
                    $"Contact {contact.Id}: {contact.FullName}"
                );
            }

            return Ok(new
            {
                message = "G�p � / Li�n h? c?a b?n ?� ???c g?i th�nh c�ng. Ch�n th�nh c?m ?n!"
            });
        }

        // ?? ADMIN/EDITOR TRUY C?P: L?Y DANH S�CH C�C LI�N H? ?? X? L�
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
        
        // ?? ADMIN/EDITOR TRUY C?P: L?Y CHI TI?T 1 C�I ?? ??C
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

        // ?? ADMIN/EDITOR TRUY C?P: C?P NH?T TR?NG TH�I (?� ??C / ?� GI?I QUY?T)
        [Authorize(Roles = "Admin,Editor")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateContactStatus(int id, [FromBody] string newStatus)
        {
            var allowedStatuses = new[] { "Pending", "Processed", "Resolved" };
            if (!allowedStatuses.Contains(newStatus))
            {
                return BadRequest("Tr?ng th�i kh�ng h?p l?. Ch? ch?p nh?n: Pending, Processed, Resolved.");
            }

            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                return NotFound("Contact not found.");
            }

            contact.Status = newStatus;
            await _context.SaveChangesAsync();

            var userIdClaim = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdClaim, out var currentUserId))
            {
                await _auditLogService.LogActionAsync(
                    currentUserId,
                    "UpdateStatus",
                    "Contacts",
                    $"Contact {contact.Id} status {contact.Status}"
                );
            }

            return Ok(new { message = "C?p nh?t tr?ng th�i th�nh c�ng.", status = contact.Status });
        }

        // ?? ADMIN: X�A LI�N H? R�C
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

            var userIdClaim = User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdClaim, out var currentUserId))
            {
                await _auditLogService.LogActionAsync(
                    currentUserId,
                    "Delete",
                    "Contacts",
                    $"Contact {contact.Id}: {contact.FullName}"
                );
            }

            return Ok(new { message = "X�a li�n h? th�nh c�ng." });
        }
    }
}