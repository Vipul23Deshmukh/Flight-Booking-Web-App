using Microsoft.EntityFrameworkCore;
using BookMyFlight.Backend.Entities;

namespace BookMyFlight.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Flight> Flights { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Passenger> Passengers { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<Seat> Seats { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Flight>(entity =>
            {
                entity.ToTable("flight");
                entity.Property(e => e.FlightNumber).HasColumnName("flight_number");
                entity.Property(e => e.Source).HasColumnName("source");
                entity.Property(e => e.Destination).HasColumnName("destination");
                entity.Property(e => e.TravelDate).HasColumnName("travel_date");
                entity.Property(e => e.ArrivalTime).HasColumnName("arrival_time");
                entity.Property(e => e.DepartureTime).HasColumnName("departure_time");
                entity.Property(e => e.Price).HasColumnName("price");
                entity.Property(e => e.AvailableSeats).HasColumnName("available_seats");
                entity.Property(e => e.Isactive).HasColumnName("isactive");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("user");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Fname).HasColumnName("user_fullname");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Phone).HasColumnName("phone");
                entity.Property(e => e.Isadmin).HasColumnName("isadmin");
                entity.Property(e => e.Password).HasColumnName("password");
            });

            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.ToTable("audit_log");
                entity.HasKey(e => e.LogId);
                entity.Property(e => e.LogId).HasColumnName("log_id");
                entity.Property(e => e.AdminId).HasColumnName("admin_id");
                entity.Property(e => e.Action).HasColumnName("action");
                entity.Property(e => e.Details).HasColumnName("details");
                entity.Property(e => e.Timestamp).HasColumnName("timestamp");
                entity.Property(e => e.IpAddress).HasColumnName("ip_address");
            });

            modelBuilder.Entity<Seat>(entity =>
            {
                entity.ToTable("seat");
                entity.HasKey(e => e.SeatId);
                entity.Property(e => e.FlightId).HasColumnName("flight_id");
                entity.Property(e => e.SeatNumber).HasColumnName("seat_number");
                entity.Property(e => e.IsBooked).HasColumnName("is_booked");
                entity.Property(e => e.ClassType).HasColumnName("class_type");
                entity.Property(e => e.PriceMultiplier).HasColumnName("price_multiplier");
            });

            modelBuilder.Entity<Booking>(entity =>
            {
                entity.ToTable("booking");
                entity.Property(e => e.BookingId).HasColumnName("booking_id");
                entity.Property(e => e.NumberOfSeatsToBook).HasColumnName("seats");
                entity.Property(e => e.PayStatus).HasColumnName("pay_status");
                entity.Property(e => e.BookingDate).HasColumnName("booking_date");
                entity.Property(e => e.FlightNumber).HasColumnName("flight_number");
            });

            modelBuilder.Entity<Passenger>(entity =>
            {
                entity.ToTable("passenger");
                entity.Property(e => e.Pid).HasColumnName("pid");
                entity.Property(e => e.Pname).HasColumnName("pass_name");
                entity.Property(e => e.Gender).HasColumnName("gender");
                entity.Property(e => e.Age).HasColumnName("age");
                entity.Property(e => e.BookingId).HasColumnName("booking_id");
            });

            modelBuilder.Entity<Ticket>(entity =>
            {
                entity.ToTable("ticket");
                entity.Property(e => e.TicketNumber).HasColumnName("ticket_number");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.BookingId).HasColumnName("booking_id");
                entity.Property(e => e.Booking_date).HasColumnName("booking_date");
                entity.Property(e => e.Total_pay).HasColumnName("total_pay");
            });
        }
    }
}
