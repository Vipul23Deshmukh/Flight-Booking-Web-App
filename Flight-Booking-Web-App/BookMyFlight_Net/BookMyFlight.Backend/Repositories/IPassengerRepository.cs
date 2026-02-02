using System.Collections.Generic;
using BookMyFlight.Backend.Entities;

namespace BookMyFlight.Backend.Repositories
{
    public interface IPassengerRepository
    {
        Passenger Save(Passenger passenger);
        Passenger? FindById(int id);
        List<Passenger> FindAll();
    }
}
