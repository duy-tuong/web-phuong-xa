using backend.Data;
using backend.Services;
using backend.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ==============================================================================
// 1. ADD SERVICES (Đăng ký các dịch vụ Dependency Injection vào Container)
// ==============================================================================

// Hỗ trợ xây dựng các API cơ bản (nhận HTTP Request và trả về JSON)
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Cấu hình lại lõi máy chủ Kestrel HTTP để chấp nhận File Upload dung lượng cực lớn (Upload Video 100MB)
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = 104857600; // 100 Megabytes
});
// Cấu hình thư viện nhận Form-Data giới hạn tương ứng
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 104857600; // 100 Megabytes
});

// Cấu hình giao diện Swagger (Tài liệu API tự động)
builder.Services.AddSwaggerGen(options =>
{
    // Khai báo cơ chế bảo mật (Ổ khóa) trên góc phải Swagger để điền Token Bearer
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Nhập JWT token vào đây"
    });

    // Ép các lệnh API yêu cầu Authorization phải có ổ khóa đó
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


// Kết nối Database SQL Server qua Entity Framework Core
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Cấu hình CORS (Cho phép React/VueJS ở các port khác gọi API mà không bị chặn lỗi CORS policy)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()    // Chấp nhận mọi domain
                  .AllowAnyMethod()    // Chấp nhận mọi phương thức POST/PUT/DELETE
                  .AllowAnyHeader();   // Chấp nhận mọi loại Headers
        });
});

// Cấu hình xác thực JWT (Json Web Token) thay vì dùng Session cổ điển
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
        ValidateLifetime = true,                  // Token có hạn sử dụng (hết hạn sẽ die)
        ValidateIssuerSigningKey = true,          // Yêu cầu chữ ký bí mật
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("THIS_IS_SUPER_SECRET_KEY_FOR_WARD_PROMOTION_PROJECT_2026")), // Khóa nêm mã hóa Token
        NameClaimType = ClaimTypes.Name,
        RoleClaimType = ClaimTypes.Role,
        ClockSkew = TimeSpan.Zero                 // Loại bỏ rác thời gian trễ của Server ảo
    };

    options.RequireHttpsMetadata = false;  
    options.SaveToken = true;

    // Các kịch bản bắt sự kiện chặn lỗi JWT
    options.Events = new JwtBearerEvents
    {
        // Có thể lấy Token từ một Custom Header (X-Admin-Authorization) nếu cần truyền lén
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
            Console.WriteLine(">>> JWT Token HOP LE cho: " + context.Principal?.Identity?.Name);
            return Task.CompletedTask;
        }
    };
});

// Đăng ký các Class Logic riêng mảng bảo mật
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<IAuditLogService, AuditLogService>(); // Theo dõi dấu vết thao tác Cán bộ (Audit log)
builder.Services.AddHostedService<AuditLogCleanupService>();     // Tự động dọn rác lịch sử cũ chạy ngầm

// Đăng ký dịch vụ ủy quyền (Authorization - Quyền của Role)
builder.Services.AddAuthorization();

var app = builder.Build();

// ==============================================================================
// 2. CONFIGURE PIPELINE (Cấu hình luồng thực thi Request, thứ tự khai báo RẤT QUAN TRỌNG)
// ==============================================================================

// Log kiểm soát luồng (Xem Terminal in ra để biết user đang truy cập URL nào)
app.Use(async (context, next) =>
{
    Console.WriteLine(">>> PIPELINE START: Nhận Request tại " + DateTime.Now);
    Console.WriteLine(">>> URL: " + context.Request.Path);
    await next();
    Console.WriteLine(">>> PIPELINE END: Trả về mã Status " + context.Response.StatusCode);
});

// Chỉ bật UI Swagger tài liệu API ở môi trường dev test
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Cấu hình cấp phát File Tĩnh (Ảnh, Video upload sẽ được lấy qua trình duyệt bằng đường link cố định)
var webRootPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot");
Directory.CreateDirectory(webRootPath); // Tự tạo thư mục wwwroot nếu tải code về chưa có
Directory.CreateDirectory(Path.Combine(webRootPath, "uploads")); // Tự tạo nơi lưu file

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(webRootPath)
}); 

// Tính năng Map đường dẫn
app.UseRouting();

// Cho phép chia sẻ chéo Domain Front-end
app.UseCors("AllowAll");

// Đính kèm Middleware xác thực danh tính (Bảo Vệ API)
app.UseAuthentication();  // Xác định Bạn Là Ai trước
app.UseAuthorization();   // Xác định Xem Bạn Có Quyền Không (Admin/Editor)

// Bắt buộc tích hợp Middleware ghi log của mình vào sau danh tính
app.UseMiddleware<AuditLogMiddleware>();

// Định tuyến URL tự động cho các Class [ApiController]
app.MapControllers();  

// Phóng Server!
app.Run();
