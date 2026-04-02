using backend.Data;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


// Add services
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

// Configure Max Request Body Size to 100MB (For Video uploads)
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = 104857600; // 100 Megabytes
});
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 104857600; // 100 Megabytes
});

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter JWT token"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});


// JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("THIS_IS_SUPER_SECRET_KEY_FOR_WARD_PROMOTION_PROJECT_2026")),
        NameClaimType = ClaimTypes.Name,
        RoleClaimType = ClaimTypes.Role,
        ClockSkew = TimeSpan.Zero
    };

    options.RequireHttpsMetadata = false;  // cho local https
    options.SaveToken = true;

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (string.IsNullOrWhiteSpace(context.Token))
            {
                var forwardedAuth = context.Request.Headers["X-Admin-Authorization"].FirstOrDefault();
                if (!string.IsNullOrWhiteSpace(forwardedAuth) &&
                    forwardedAuth.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    context.Token = forwardedAuth["Bearer ".Length..].Trim();
                }
            }

            return Task.CompletedTask;
        },

        OnTokenValidated = context =>
        {
            Console.WriteLine(">>> JWT Token VALIDATED SUCCESSFULLY for user: " + context.Principal?.Identity?.Name);
            return Task.CompletedTask;
        },

        OnAuthenticationFailed = context =>
        {
            Console.WriteLine(">>> JWT Authentication FAILED: " + context.Exception?.Message);
            if (context.Exception?.InnerException != null)
                Console.WriteLine(">>> Inner: " + context.Exception.InnerException.Message);
            return Task.CompletedTask;
        },

        OnChallenge = context =>
        {
            Console.WriteLine(">>> JWT Challenge: " + context.Error + " - " + context.ErrorDescription);
            return Task.CompletedTask;
        }
    };
});
builder.Services.AddScoped<JwtService>();

builder.Services.AddAuthorization();

var app = builder.Build();

app.Use(async (context, next) =>
{
    Console.WriteLine(">>> PIPELINE START: Request received at " + DateTime.Now);
    Console.WriteLine(">>> Path: " + context.Request.Path);
    Console.WriteLine(">>> Authorization header: " + context.Request.Headers["Authorization"]);
    await next();
    Console.WriteLine(">>> PIPELINE END: Status " + context.Response.StatusCode);
});
// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// Middleware
app.UseHttpsRedirection();  // có thể comment tạm nếu dùng HTTP

var webRootPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot");
Directory.CreateDirectory(webRootPath);
Directory.CreateDirectory(Path.Combine(webRootPath, "uploads"));

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(webRootPath)
}); // Serve uploaded media files from backend/wwwroot/uploads

app.UseRouting();

app.UseCors("AllowAll");

app.Use(async (context, next) =>
{
    var forwardedAuth = context.Request.Headers["X-Forwarded-Authorization"].ToString();
    if (!string.IsNullOrWhiteSpace(forwardedAuth))
    {
        var currentAuth = context.Request.Headers["Authorization"].ToString();
        if (string.IsNullOrWhiteSpace(currentAuth) || currentAuth.StartsWith("Basic "))
        {
            context.Request.Headers["Authorization"] = forwardedAuth;
        }
        context.Request.Headers.Remove("X-Forwarded-Authorization");
    }

    await next();
});

app.UseAuthentication();  // phải trước UseAuthorization
app.UseAuthorization();

app.MapControllers();  // hoặc app.MapGroup nếu dùng Minimal API

app.Run();
