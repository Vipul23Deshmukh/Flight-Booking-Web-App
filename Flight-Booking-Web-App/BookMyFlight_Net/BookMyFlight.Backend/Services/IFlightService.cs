using System;
using System.Collections.Generic;
using BookMyFlight.Backend.Entities;
using BookMyFlight.Backend.Exceptions;

namespace BookMyFlight.Backend.Services
{
    public interface IFlightService
    {
        int AddFlight(Flight flight); // throws FlightException - In C# we just document or let it bubble
        List<Flight> FetchAll();
        Flight FetchFlight(string source, string destination, DateOnly scheduleDate);
        List<Flight> FetchFlightsOnCondition(string source, string destination, DateOnly scheduleDate);
        int UpdateFlight(Flight flight);
        void RemoveFlight(int flightNumber);
        Flight FetchById(int fid);
    }
}
