using System.Collections.Generic;
using System.Text.Json.Serialization;
using BookMyFlight.Backend.Entities;


namespace BookMyFlight.Backend.Models
{
    public class ListPassenger
    {
        [JsonPropertyName("pass1")]
        public List<Passenger> Pass1 { get; set; }

    }
}
