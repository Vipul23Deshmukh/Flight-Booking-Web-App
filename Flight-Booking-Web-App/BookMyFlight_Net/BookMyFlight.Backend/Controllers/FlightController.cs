using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using BookMyFlight.Backend.Entities;
using BookMyFlight.Backend.Exceptions;
using BookMyFlight.Backend.Services;

namespace BookMyFlight.Backend.Controllers
{
    [ApiController]
    [Route("flight")]
    public class FlightController : ControllerBase
    {
        private readonly IFlightService _fservice;
        private readonly IUserService _userService;

        public FlightController(IFlightService fservice, IUserService userService)
        {
            _fservice = fservice;
            _userService = userService;
        }

        private bool IsAuthorizedAdmin()
        {
            var isAdminClaim = User.FindFirst("isadmin")?.Value;
            return isAdminClaim == "1";
        }

        // Post request for adding flight
        [HttpPost("add")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public IActionResult AddFlight([FromBody] Flight flight) 
        {
            if (!IsAuthorizedAdmin()) return Forbid("Admin access required");
            try
            {
                int id = _fservice.AddFlight(flight);
                return Ok("Flight added with flight number " + id);
            }
            catch (FlightException e)
            {
                return BadRequest(e.Message);
            }
        }

        // Get request to fetch all the flights
        [HttpGet("fetchall")]
        public IEnumerable<Flight> SerachFlights() // Typo 'Serach' kept match Java
        {
            return _fservice.FetchAll();
        }

        // Get request for searching flight based on source, destination and date
        [HttpGet("fetch")]
        public IActionResult SearchFlight([FromQuery] string source, [FromQuery] string destination, [FromQuery] string date)
        {
            Console.WriteLine($"Search Request: Source={source}, Dest={destination}, Date={date}");
            try
            {
                DateOnly dt = DateOnly.Parse(date);
                IEnumerable<Flight> flights = _fservice.FetchFlightsOnCondition(source, destination, dt);
                return Ok(flights);
            }
            catch (FlightException e)
            {
                Console.WriteLine(e);
                return NotFound(e.Message);
            }
        }

        // Delete requset to remove flight
        [HttpDelete("remove/{fid}")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public IActionResult RemoveFlight([FromRoute] int fid)
        {
            if (!IsAuthorizedAdmin()) return Forbid("Admin access required");
            _fservice.RemoveFlight(fid);
            return Ok("flight removed with id" + fid);
        }

        // Put request to update flight
        [HttpPut("update")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public IActionResult UpdateFlight([FromBody] Flight flight)
        {
            if (!IsAuthorizedAdmin()) return Forbid("Admin access required");
            try
            {
                int id = _fservice.UpdateFlight(flight);
                return Ok("Flight updated with id " + id);
            }
            catch (FlightException e)
            {
                return BadRequest(e.Message);
            }
        }

        // Put request to toggle flight status
        [HttpPut("status/{fid}/{status}")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public IActionResult ToggleFlightStatus([FromRoute] int fid, [FromRoute] int status)
        {
            if (!IsAuthorizedAdmin()) return Forbid("Admin access required");
            try
            {
                var flight = _fservice.FetchById(fid);
                if (flight == null) return NotFound("Flight not found");
                
                flight.Isactive = status;
                _fservice.UpdateFlight(flight);
                
                return Ok(new { message = $"Flight status updated to {(status == 1 ? "Active" : "Inactive")}", flightId = fid, status = status });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
