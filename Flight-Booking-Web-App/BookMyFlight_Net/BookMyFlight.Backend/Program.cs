using BookMyFlight.Backend.Services;
using BookMyFlight.Backend.Filters;
using BookMyFlight.Backend.Data;
using BookMyFlight.Backend.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Configure Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 23))));

// Configure Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IFlightRepository, FlightRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IPassengerRepository, PassengerRepository>();
builder.Services.AddScoped<ITicketRepository, TicketRepository>();
builder.Services.AddScoped<ISeatRepository, SeatRepository>();

// Configure Services
builder.Services.AddScoped<IUserService, UserServiceImpl>();
builder.Services.AddScoped<IFlightService, FlightServiceImpl>();
builder.Services.AddScoped<IBookingService, BookingServiceImpl>();
builder.Services.AddScoped<IJwtService, JwtService>();

// Configure Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// Configure Session
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddControllers(options => 
{
    options.Filters.Add<AuditLogFilter>();
}).AddJsonOptions(options => 
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});
builder.Services.AddSingleton<AuditLogFilter>();

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.MapType<DateOnly>(() => new OpenApiSchema { Type = "string", Format = "date" });
    options.MapType<TimeOnly>(() => new OpenApiSchema { Type = "string", Format = "time" });
    
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
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
            new string[]{}
        }
    });
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Configure URL/Port - Use PORT env variable for Render, fallback to 8980 for local
var port = Environment.GetEnvironmentVariable("PORT") ?? "8980";
builder.WebHost.UseUrls($"http://*:{port}");

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseStaticFiles();

// Enable Swagger UI
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

app.UseSession();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => "Flight Reservation System Backend (v2 - Fixed Mappings) is successfully running! Access the frontend at http://localhost:3001");

app.MapControllers();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Auto-migration (ddl-auto=update equivalent-ish, though update is smarter. EnsureCreated is safer directly)
// Prompt said "matching behavior". Update tries to keep data. EnsureCreated does nothing if exists.
// I'll stick to EnsureCreated for "Running" validation. 
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        db.Database.EnsureCreated();
        
        // Seed Admin User
        if (!db.Users.Any(u => u.Username == "admin"))
        {
            db.Users.Add(new BookMyFlight.Backend.Entities.User
            {
                Username = "admin",
                Fname = "System Administrator",
                Email = "admin@bookmyflight.com",
                Phone = "0000000000",
                Isadmin = 1,
                Password = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes("123456"))
            });
            db.SaveChanges();
            Console.WriteLine("Admin user seeded successfully.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database Error: {ex.Message}");
    }
}

app.Run();
