using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookMyFlight.Backend.Entities
{
    [Table("seat")]
    public class Seat
    {
        [Key]
        [Column("seat_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SeatId { get; set; }

        [Column("flight_id")]
        public int FlightId { get; set; }

        [Column("seat_number")]
        public string SeatNumber { get; set; }

        [Column("is_booked")]
        public bool IsBooked { get; set; } = false;

        [Column("class_type")]
        public string ClassType { get; set; } // Economy, Business, First

        [Column("price_multiplier")]
        public double PriceMultiplier { get; set; } = 1.0;

        [ForeignKey("FlightId")]
        public Flight? Flight { get; set; }
    }
}
