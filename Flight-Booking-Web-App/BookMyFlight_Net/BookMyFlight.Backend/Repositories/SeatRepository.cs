using System.Collections.Generic;
using System.Linq;
using BookMyFlight.Backend.Data;
using BookMyFlight.Backend.Entities;

namespace BookMyFlight.Backend.Repositories
{
    public class SeatRepository : ISeatRepository
    {
        private readonly AppDbContext _context;

        public SeatRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Save(Seat seat)
        {
            _context.Seats.Add(seat);
            _context.SaveChanges();
        }

        public List<Seat> FindByFlightId(int flightId)
        {
            return _context.Seats.Where(s => s.FlightId == flightId).ToList();
        }

        public void Update(Seat seat)
        {
            _context.Seats.Update(seat);
            _context.SaveChanges();
        }

        public Seat? FindById(int seatId)
        {
            return _context.Seats.Find(seatId);
        }
    }
}
