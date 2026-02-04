using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using BookMyFlight.Backend.Entities;
using BookMyFlight.Backend.Services;

namespace BookMyFlight.Backend.Controllers
{
    [ApiController]
    [Route("api/seed")]
    public class SeedController : ControllerBase
    {
        private readonly IFlightService _flightService;

        public SeedController(IFlightService flightService)
        {
            _flightService = flightService;
        }

        [HttpGet]
        public IActionResult SeedDatabase()
        {
            try
            {
                var existing = _flightService.FetchAll();
                if (existing != null && existing.Any())
                {
                    // Allow appending if count is low, or just return existing count
                     // For now, let's just return to avoid duplicates if they run it multiple times without clearing
                    if (existing.Count() >= 25) 
                        return Ok($"Database already has {existing.Count()} flights. Seeding skipped.");
                }

                var flights = new List<Flight>();
                var today = DateOnly.FromDateTime(DateTime.Now);

                // Routes
                var routes = new[] 
                { 
                    ("Pune", "Delhi"), ("Delhi", "Pune"),
                    ("Mumbai", "Bangalore"), ("Bangalore", "Mumbai"),
                    ("Chennai", "Kolkata"), ("Kolkata", "Chennai"),
                    ("Hyderabad", "Pune"), ("Pune", "Hyderabad"),
                    ("Delhi", "Mumbai"), ("Mumbai", "Delhi")
                };

                // Generate 25+ flights
                int k = 1;
                foreach (var (src, dst) in routes)
                {
                    // Flight for Today
                    flights.Add(new Flight { 
                        Source = src, Destination = dst, 
                        TravelDate = today, 
                        DepartureTime = new TimeOnly(8 + (k % 4) * 3, 0), // 8:00, 11:00, 14:00...
                        ArrivalTime = new TimeOnly(10 + (k % 4) * 3, 30), 
                        Price = 3000 + (k * 150), 
                        AvailableSeats = 60 
                    });

                    // Flight for Tomorrow
                    flights.Add(new Flight { 
                        Source = src, Destination = dst, 
                        TravelDate = today.AddDays(1), 
                        DepartureTime = new TimeOnly(9 + (k % 3) * 4, 15), 
                        ArrivalTime = new TimeOnly(11 + (k % 3) * 4, 45), 
                        Price = 2800 + (k * 120), 
                        AvailableSeats = 60 
                    });

                    // Flight for Day After Tomorrow
                    flights.Add(new Flight { 
                        Source = src, Destination = dst, 
                        TravelDate = today.AddDays(2), 
                        DepartureTime = new TimeOnly(7 + (k % 5) * 2, 0), 
                        ArrivalTime = new TimeOnly(9 + (k % 5) * 2, 30), 
                        Price = 2500 + (k * 100), 
                        AvailableSeats = 60 
                    });

                    k++;
                }

                // Add a few explicit ones for testing current time logic
                flights.Add(new Flight { Source = "Pune", Destination = "Bangalore", TravelDate = today, DepartureTime = new TimeOnly(23, 0), ArrivalTime = new TimeOnly(0, 30), Price = 4200, AvailableSeats = 60 });
                flights.Add(new Flight { Source = "Bangalore", Destination = "Pune", TravelDate = today.AddDays(5), DepartureTime = new TimeOnly(10, 0), ArrivalTime = new TimeOnly(12, 0), Price = 3900, AvailableSeats = 60 });
                
                int addedCount = 0;
                foreach (var f in flights)
                {
                    _flightService.AddFlight(f);
                    addedCount++;
                }

                return Ok($"Successfully seeded {addedCount} flights into the database! Total flights checks: 30+");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Seeding failed: " + ex.Message);
            }
        }
    }
}
