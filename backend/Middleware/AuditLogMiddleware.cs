using System.Security.Claims;
using backend.Services;

namespace backend.Middleware
{
    public class AuditLogMiddleware
    {
        private readonly RequestDelegate _next;

        public AuditLogMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IAuditLogService auditLogService)
        {
            await _next(context);

            if (context.Response.HasStarted)
            {
                return;
            }

            var path = context.Request.Path;
            if (path.StartsWithSegments("/api/auditlogs") || path.StartsWithSegments("/swagger"))
            {
                return;
            }

            if (!(context.User?.Identity?.IsAuthenticated ?? false))
            {
                return;
            }

            var method = context.Request.Method?.ToUpperInvariant();
            if (method == "GET" || method == "HEAD" || method == "OPTIONS")
            {
                return;
            }

            var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return;
            }

            if (context.Response.StatusCode >= 500)
            {
                return;
            }

            var entity = ResolveEntity(path);
            var detail = $"{method} {path} ({context.Response.StatusCode})";
            await auditLogService.LogActionAsync(userId, "Request", entity, detail);
        }

        private static string ResolveEntity(PathString path)
        {
            var segments = path.Value?.Split('/', StringSplitOptions.RemoveEmptyEntries);
            if (segments == null || segments.Length == 0)
            {
                return "System";
            }

            var segment = segments[0];
            if (segment.Equals("api", StringComparison.OrdinalIgnoreCase) && segments.Length > 1)
            {
                segment = segments[1];
            }

            return char.ToUpper(segment[0]) + segment.Substring(1);
        }
    }
}
