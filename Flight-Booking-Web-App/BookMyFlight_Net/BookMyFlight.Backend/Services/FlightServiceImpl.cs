using System;
using System.Collections.Generic;
using BookMyFlight.Backend.Entities;
using BookMyFlight.Backend.Exceptions;
using BookMyFlight.Backend.Repositories;

namespace BookMyFlight.Backend.Services
{
    public class FlightServiceImpl : IFlightService
    {
        private readonly IFlightRepository _frepo;
        private readonly ISeatRepository _srepo;

        public FlightServiceImpl(IFlightRepository frepo, ISeatRepository srepo)
        {
            _frepo = frepo;
            _srepo = srepo;
        }

        public int AddFlight(Flight flight)
        {
            List<Flight> flights = _frepo.FindAll();
            Flight? flight_temp = null;
            foreach (Flight f in flights)
            {
                if (f.Source.Equals(flight.Source) && f.Destination.Equals(flight.Destination)
                        && f.TravelDate.Equals(flight.TravelDate) && f.ArrivalTime.Equals(flight.ArrivalTime)
                        && f.DepartureTime.Equals(flight.DepartureTime))
                {
                    flight_temp = f;
                }
            }

            if (flight_temp == null)
            {
                _frepo.Save(flight);
                GenerateSeats(flight.FlightNumber);
                return flight.FlightNumber;
            }
            else
            {
                throw new FlightException("Flight already exists with flight number " + flight_temp.FlightNumber);
            }
        }

        private void GenerateSeats(int flightId)
        {
            string[] cols = { "A", "B", "C", "D", "E", "F" };
            for (int row = 1; row <= 10; row++)
            {
                foreach (var col in cols)
                {
                    var seat = new Seat
                    {
                        FlightId = flightId,
                        SeatNumber = $"{row}{col}",
                        IsBooked = false,
                        ClassType = row <= 2 ? "Business" : "Economy",
                        PriceMultiplier = row <= 2 ? 1.5 : 1.0
                    };
                    _srepo.Save(seat);
                }
            }
        }

        public List<Flight> FetchAll()
        {
            return _frepo.FindAll();
        }

        public Flight FetchFlight(string source, string destination, DateOnly scheduleDate)
        {
            Console.WriteLine(source + " " + destination + " " + scheduleDate);
            List<Flight> flights = _frepo.FindAll();
            Flight? flight = null;
            foreach (Flight f in flights)
            {
                if ((f.Source.Equals(source) && f.Destination.Equals(destination)) && f.TravelDate.Equals(scheduleDate))
                {
                    flight = f;
                }
            }

            if (flight != null)
            {
                return flight;
            }
            return null;
        }

        public List<Flight> FetchFlightsOnCondition(string source, string destination, DateOnly scheduleDate)
        {
            var flights = _frepo.FindByCondition(source, destination, scheduleDate)
                        .FindAll(f => f.Isactive == 1);
            
            // Self-healing: Ensure seats exist for these flights
            foreach (var flight in flights)
            {
                if (flight.Seats == null || flight.Seats.Count == 0)
                {
                    GenerateSeats(flight.FlightNumber);
                    // Re-fetch seats for this flight to populate the collection
                    flight.Seats = _srepo.FindByFlightId(flight.FlightNumber);
                }
            }
            return flights;
        }

        public int UpdateFlight(Flight flight)
        {
            List<Flight> flights = _frepo.FindAll();
            Flight? flight1 = null;
            foreach (Flight f in flights)
            {
                if (f.FlightNumber == flight.FlightNumber)
                {
                    flight1 = f;
                }
            }

            if (flight1 != null)
            {
                flight1.FlightNumber = flight.FlightNumber;
                flight1.ArrivalTime = flight.ArrivalTime;
                flight1.AvailableSeats = flight.AvailableSeats;
                flight1.DepartureTime = flight.DepartureTime;
                flight1.Destination = flight.Destination;
                flight1.Source = flight.Source;
                flight1.Price = flight.Price;
                flight1.TravelDate = flight.TravelDate;
                flight1.Isactive = flight.Isactive;
                _frepo.Save(flight1);
                return flight.FlightNumber;
            }
            else
            {
                throw new FlightException("Flight not found with id " + flight.FlightNumber);
            }
        }

        public void RemoveFlight(int flightNumber)
        {
            _frepo.DeleteById(flightNumber);
            Console.WriteLine("Deleted flight");
        }

        public Flight FetchById(int fid)
        {
            Flight flight = _frepo.FindById(fid)!;
            if (flight != null && (flight.Seats == null || flight.Seats.Count == 0))
            {
                GenerateSeats(flight.FlightNumber);
                flight.Seats = _srepo.FindByFlightId(flight.FlightNumber);
            }
            return flight;
        }
    }
}
