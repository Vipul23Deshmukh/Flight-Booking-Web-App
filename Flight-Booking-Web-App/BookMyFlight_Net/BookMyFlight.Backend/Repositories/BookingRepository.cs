using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using BookMyFlight.Backend.Data;
using BookMyFlight.Backend.Entities;

namespace BookMyFlight.Backend.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly AppDbContext _context;

        public BookingRepository(AppDbContext context)
        {
            _context = context;
        }

        public Booking Save(Booking booking)
        {
            if (booking.BookingId == 0)
            {
                _context.Bookings.Add(booking);
            }
            else
            {
                _context.Bookings.Update(booking);
            }
            _context.SaveChanges();
            return booking;
        }

        public Booking? FindById(int id)
        {
            return _context.Bookings.Include(b => b.Passengers).Include(b => b.Flight).FirstOrDefault(b => b.BookingId == id);
        }

        public List<Booking> FindAll()
        {
            return _context.Bookings.ToList();
        }
    }
}
