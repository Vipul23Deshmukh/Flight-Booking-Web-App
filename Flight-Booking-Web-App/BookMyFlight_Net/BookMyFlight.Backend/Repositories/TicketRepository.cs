using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using BookMyFlight.Backend.Data;

using BookMyFlight.Backend.Entities;

namespace BookMyFlight.Backend.Repositories
{
    public class TicketRepository : ITicketRepository
    {
        private readonly AppDbContext _context;

        public TicketRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Ticket> FindByUser(User user)
        {
            return _context.Tickets
                .Include(t => t.Booking)
                    .ThenInclude(b => b.Flight)
                .Include(t => t.Booking)
                    .ThenInclude(b => b.Passengers)
                .Where(t => t.UserId == user.UserId)
                .ToList();
        }


        public Ticket Save(Ticket ticket)
        {
             if (ticket.TicketNumber == 0)
            {
                _context.Tickets.Add(ticket);
            }
            else
            {
                _context.Tickets.Update(ticket);
            }
            _context.SaveChanges();
            return ticket;
        }

        public Ticket? FindById(int id)
        {
            return _context.Tickets.Find(id);
        }

        public Ticket? FindByBookingId(int bookingId)
        {
            return _context.Tickets
                .Include(t => t.Booking)
                    .ThenInclude(b => b.Flight)
                .Include(t => t.Booking)
                    .ThenInclude(b => b.Passengers)
                .FirstOrDefault(t => t.BookingId == bookingId);
        }

        public List<Ticket> FindAll()
        {
            return _context.Tickets.ToList();
        }
    }
}
