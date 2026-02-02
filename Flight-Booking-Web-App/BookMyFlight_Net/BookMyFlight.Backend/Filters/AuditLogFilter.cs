using System;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using BookMyFlight.Backend.Data;
using BookMyFlight.Backend.Entities;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace BookMyFlight.Backend.Filters
{
    public class AuditLogFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // Execute the action first
            var resultContext = await next();

            // Only log if the action was successful and it was a state-changing operation (POST, PUT, DELETE)
            if (resultContext.Exception == null && (context.HttpContext.Request.Method == "POST" || context.HttpContext.Request.Method == "PUT" || context.HttpContext.Request.Method == "DELETE"))
            {
                var adminIdClaim = context.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
                if (adminIdClaim != null)
                {
                    int adminId = int.Parse(adminIdClaim.Value);
                    var db = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();

                    var log = new AuditLog
                    {
                        AdminId = adminId,
                        Action = $"{context.HttpContext.Request.Method} {context.ActionDescriptor.DisplayName}",
                        Details = JsonSerializer.Serialize(context.ActionArguments, new JsonSerializerOptions 
                        { 
                            ReferenceHandler = ReferenceHandler.IgnoreCycles,
                            WriteIndented = false
                        }),
                        IpAddress = context.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                        Timestamp = DateTime.Now
                    };

                    db.AuditLogs.Add(log);
                    await db.SaveChangesAsync();
                }
            }
        }
    }
}
