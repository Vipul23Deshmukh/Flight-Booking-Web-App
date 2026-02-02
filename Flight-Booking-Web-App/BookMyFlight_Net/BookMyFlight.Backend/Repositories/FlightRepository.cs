using BookMyFlight.Backend.Data;
using BookMyFlight.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace BookMyFlight.Backend.Repositories
{
    public class FlightRepository : IFlightRepository
    {
        private readonly AppDbContext _context;

        public FlightRepository(AppDbContext context)
        {
            _context = context;
        }

        public List<Flight> FindByCondition(string source, string destination, DateOnly travelDate)
        {
            return _context.Flights
                .Include(f => f.Seats)
                .Where(f => f.Source == source && f.Destination == destination && f.TravelDate == travelDate)
                .ToList();
        }

        public Flight Save(Flight flight)
        {
            if (flight.FlightNumber == 0)
            {
                _context.Flights.Add(flight);
            }
            else
            {
                _context.Flights.Update(flight);
            }
            _context.SaveChanges();
            return flight;
        }

        public Flight? FindById(int id)
        {
            return _context.Flights
                .Include(f => f.Seats)
                .FirstOrDefault(f => f.FlightNumber == id);
        }

        public List<Flight> FindAll()
        {
            return _context.Flights
                .Include(f => f.Seats)
                .ToList();
        }

        public void DeleteById(int id)
        {
            var flight = _context.Flights.Find(id);
            if (flight != null)
            {
                _context.Flights.Remove(flight);
                _context.SaveChanges();
            }
        }
    }
}
