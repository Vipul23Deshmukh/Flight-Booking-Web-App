using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookMyFlight.Backend.Entities
{
    [Table("flight")]
    public class Flight
    {
        [Key]
        [Column("flight_number")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FlightNumber { get; set; }

        [Column("source")]
        public string Source { get; set; }

        [Column("destination")]
        public string Destination { get; set; }

        [Column("travel_date")]
        public DateOnly TravelDate { get; set; }

        [Column("arrival_time")]
        public TimeOnly ArrivalTime { get; set; }

        [Column("departure_time")]
        public TimeOnly DepartureTime { get; set; }

        [Column("price")]
        public double Price { get; set; }

        [Column("available_seats")]
        public int AvailableSeats { get; set; }
        
        [Column("isactive")]
        public int Isactive { get; set; } = 1;

        public ICollection<Seat> Seats { get; set; } = new List<Seat>();
    }
}
