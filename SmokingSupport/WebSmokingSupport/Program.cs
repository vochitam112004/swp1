    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.IdentityModel.Tokens;
    using System.Text;
using WebSmokingSupport.Data;
using WebSmokingSupport.Repositories;
using WebSmokingSupport.Interfaces;
using WebSmokingSupport.Service;
using Microsoft.OpenApi.Models;
using WebSmokingSupport.Entity;
using Microsoft.Extensions.FileProviders;

    namespace WebSmokingSupport
    {
        public class Program
        {
            public static void Main(string[] args)
            {
                var builder = WebApplication.CreateBuilder(args);

                // Add services to the container.
                builder.Services.AddControllers()
            .AddJsonOptions(options =>
             {
                 
             });

            builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
            {
                options.SerializerOptions.Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping;
            });

            // Add Swagger + JWT config
            builder.Services.AddEndpointsApiExplorer();
                builder.Services.AddSwaggerGen(c =>
                {
                    c.SwaggerDoc("v1", new OpenApiInfo
                    {
                        Title = "Smoking Support API",
                        Version = "v1"
                    });

                    // ✅ Add JWT Bearer token support in Swagger
                    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                    {
                        Name = "Authorization",
                        Type = SecuritySchemeType.ApiKey,
                        Scheme = "Bearer",
                        BearerFormat = "JWT",
                        In = ParameterLocation.Header,
                        Description = "Nhập token theo định dạng: Bearer {token}"
                    });

                    c.AddSecurityRequirement(new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            new string[] {}
                        }
                    });
                });

            // EF Core DbContext
            builder.Services.AddDbContext<QuitSmokingSupportContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            
            // Add JWT Authentication
            builder.Services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                }).AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "YourDefaultJwtKeyHere"))
                    };
                });
            builder.Services.AddAuthorization();
            builder.Services.AddScoped<IJwtService, JwtService>();
            builder.Services.AddScoped<IEmailService, EmailService>();
            builder.Services.AddScoped<IOtpService, OtpService>();
            builder.Services.AddScoped<IRankingService, RankingService>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            builder.Services.AddScoped<IChatMessageRepository, ChatMessageRepository>();
            builder.Services.Configure<MomoOptionModel>(
                        builder.Configuration.GetSection("MomoOptions"));   
            builder.Services.AddScoped<IMomoService, MomoService>();

            builder.Services.AddMemoryCache();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    policy => policy
                        .AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod());
            });
            var app = builder.Build();
            

            // ✅ In ra connection string để kiểm tra
            Console.WriteLine("✅ Connection string đang dùng: " +
                builder.Configuration.GetConnectionString("DefaultConnection"));

            // Các dòng cấu hình tiếp theo
            app.UseSwagger();
            app.UseSwaggerUI();
            // ...
            var contentRootPath = app.Environment.ContentRootPath;

            // Định nghĩa đường dẫn đến thư mục uploads
            var uploadsDirectoryPath = Path.Combine(contentRootPath, "uploads");

            // Kiểm tra và tạo thư mục 'uploads' nếu nó chưa tồn tại
            if (!Directory.Exists(uploadsDirectoryPath))
            {
                Directory.CreateDirectory(uploadsDirectoryPath);
                Console.WriteLine($"Đã tạo thư mục: {uploadsDirectoryPath}");
            }

            // Cấu hình để phục vụ các tệp tĩnh từ thư mục "uploads"
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(uploadsDirectoryPath),
                RequestPath = "/uploads"
            });

            app.UseCors("AllowAll");


                app.UseSwagger();
                app.UseSwaggerUI();
            //app.UseHttpsRedirection();
            app.UseAuthentication();
                app.UseAuthorization();

                app.MapControllers();   

                app.Run();
            }
        }
    }
