using BookMyFlight.Backend.Entities;
using System.Collections.Generic;

namespace BookMyFlight.Backend.Repositories
{
    public interface ISeatRepository
    {
        void Save(Seat seat);
        List<Seat> FindByFlightId(int flightId);
        void Update(Seat seat);
        Seat? FindById(int seatId);
    }
}
