using System.Collections.Generic;
using System.Linq;
using BookMyFlight.Backend.Data;
using BookMyFlight.Backend.Entities;

namespace BookMyFlight.Backend.Repositories
{
    public class PassengerRepository : IPassengerRepository
    {
        private readonly AppDbContext _context;

        public PassengerRepository(AppDbContext context)
        {
            _context = context;
        }

        public Passenger Save(Passenger passenger)
        {
            if (passenger.Pid == 0)
            {
                _context.Passengers.Add(passenger);
            }
            else
            {
                _context.Passengers.Update(passenger);
            }
            _context.SaveChanges();
            return passenger;
        }

        public Passenger? FindById(int id)
        {
            return _context.Passengers.Find(id);
        }

        public List<Passenger> FindAll()
        {
            return _context.Passengers.ToList();
        }
    }
}
