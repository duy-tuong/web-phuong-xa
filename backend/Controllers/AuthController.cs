using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO model)
        {
            //var existingUser = await _context.Users
            //    .FirstOrDefaultAsync(x => x.Username == model.Username);

            //if (existingUser != null)
            //{
            //    return BadRequest("Username already exists");
            //}

            //var role = await _context.Roles
            //    .FirstOrDefaultAsync(r => r.Name == "Viewer");
            var existingUser = await _context.Users
    .FirstOrDefaultAsync(x => x.Username == model.Username);

            if (existingUser != null)
            {
                return BadRequest("Username already exists");
            }

            var existingEmail = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == model.Email);

            if (existingEmail != null)
            {
                return BadRequest("Email already exists");
            }

            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.Name == "Viewer");

            if (role == null)
            {
                return StatusCode(500, "Role 'Viewer' not found");
            }
            var user = new User
            {
                Username = model.Username,
                Email = model.Email,
                FullName = model.FullName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                RoleId = role.Id,
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "User registered successfully"
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO model)
        {
            var user = await _context.Users
                .Include(x => x.Role)
                .FirstOrDefaultAsync(x => x.Username == model.Username);

            if (user == null)
            {
                return Unauthorized("Invalid username");
            }

            var verifyPassword = BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash);
            if (!verifyPassword)
            {
                return Unauthorized("Invalid password");
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                token,
                username = user.Username,
                role = user.Role.Name,
                fullName = user.FullName
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .Include(u => u.Role)
                .Where(u => u.Id == userId)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.FullName,
                    u.Phone,
                    u.AvatarUrl,
                    u.RoleId,
                    role = u.Role.Name,
                    u.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(user);
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var email = dto.Email.Trim();
            var fullName = dto.FullName.Trim();

            var emailExists = await _context.Users.AnyAsync(u => u.Email == email && u.Id != userId);
            if (emailExists)
            {
                return BadRequest("Email already in use by another account.");
            }

            user.Email = email;
            user.FullName = fullName;
            user.Phone = NormalizeOptional(dto.Phone);
            user.AvatarUrl = NormalizeOptional(dto.AvatarUrl);

            if (!string.IsNullOrWhiteSpace(dto.NewPassword) || !string.IsNullOrWhiteSpace(dto.CurrentPassword))
            {
                if (string.IsNullOrWhiteSpace(dto.CurrentPassword))
                {
                    return BadRequest("Current password is required.");
                }

                var verified = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash);
                if (!verified)
                {
                    return BadRequest("Current password is incorrect.");
                }

                if (string.IsNullOrWhiteSpace(dto.NewPassword))
                {
                    return BadRequest("New password is required.");
                }

                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                user = new
                {
                    user.Id,
                    user.Username,
                    user.Email,
                    user.FullName,
                    user.Phone,
                    user.AvatarUrl,
                    user.RoleId,
                    role = user.Role?.Name,
                    user.CreatedAt
                }
            });
        }

        // CHANGE PASSWORD
        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var verified = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash);
            if (!verified)
            {
                return BadRequest("Current password is incorrect.");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password updated successfully" });
        }

        [HttpGet("debug-token")]
        [AllowAnonymous]
        public IActionResult DebugToken([FromHeader(Name = "Authorization")] string authHeader)
        {
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return BadRequest("No token");
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();

            try
            {
                var keyBytes = Encoding.UTF8.GetBytes("THIS_IS_SUPER_SECRET_KEY_FOR_WARD_PROMOTION_PROJECT_2026");
                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                return Ok(new
                {
                    Message = "Token valid!",
                    Claims = jwtToken.Claims.Select(c => new { c.Type, c.Value }).ToList()
                });
            }
            catch (SecurityTokenInvalidSignatureException ex)
            {
                return BadRequest("Invalid signature: " + ex.Message);
            }
            catch (SecurityTokenExpiredException ex)
            {
                return BadRequest("Token expired: " + ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest("Validation failed: " + ex.Message);
            }
        }

        [HttpGet("test-auth")]
        [Authorize]
        public IActionResult TestAuth()
        {
            return Ok("Authentication OK! User: " + User.Identity?.Name);
        }

        private static string? NormalizeOptional(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        }
    }
}
