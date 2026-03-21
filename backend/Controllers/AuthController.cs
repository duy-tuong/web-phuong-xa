using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
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


        // REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO model)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(x => x.Username == model.Username);

            if (existingUser != null)
            {
                return BadRequest("Username already exists");
            }

            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.Name == "Viewer");

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


        // LOGIN
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

            bool verifyPassword = BCrypt.Net.BCrypt
                .Verify(model.Password, user.PasswordHash);

            if (!verifyPassword)
            {
                return Unauthorized("Invalid password");
            }

            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                token,
                username = user.Username,
                role = user.Role.Name
            });
        }


        // GET CURRENT USER
        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            return Ok(User.Identity.Name);
        }

        [HttpGet("debug-token")]
        [AllowAnonymous]
        public IActionResult DebugToken([FromHeader(Name = "Authorization")] string authHeader)
        {
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                return BadRequest("No token");

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
    }
}
