using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BookMyFlight.Backend.Entities
{
    [Table("booking")]
    public class Booking
    {
        [Key]
        [Column("booking_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BookingId { get; set; }

        [Column("seats")]
        [JsonPropertyName("numberOfSeatsToBook")]
        public int NumberOfSeatsToBook { get; set; }

        [Column("pay_status")]
        public int PayStatus { get; set; } = 0;

        [Column("booking_date")]
        public DateOnly? BookingDate { get; set; }

        [Column("flight_number")]
        public int? FlightNumber { get; set; }

        [ForeignKey("FlightNumber")]
        public Flight? Flight { get; set; }

        public Booking()
        {
            Passengers = new List<Passenger>();
        }

        [JsonPropertyName("passengers")]
        public List<Passenger>? Passengers { get; set; }


    }
}
