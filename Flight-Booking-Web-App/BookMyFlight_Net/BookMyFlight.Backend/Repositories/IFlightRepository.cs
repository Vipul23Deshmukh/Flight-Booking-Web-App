using System;
using System.Collections.Generic;
using BookMyFlight.Backend.Entities;

namespace BookMyFlight.Backend.Repositories
{
    public interface IFlightRepository
    {
        List<Flight> FindByCondition(string source, string destination, DateOnly travelDate);
        Flight Save(Flight flight);
        Flight? FindById(int id);
        List<Flight> FindAll();
        void DeleteById(int id);
    }
}
