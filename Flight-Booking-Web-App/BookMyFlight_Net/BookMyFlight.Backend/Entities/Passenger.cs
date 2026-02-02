using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BookMyFlight.Backend.Entities
{
    [Table("passenger")]
    public class Passenger
    {
        [Key]
        [Column("pid")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Pid { get; set; }

        [Column("pass_name")]
        [JsonPropertyName("pname")]
        public string Pname { get; set; }

        [Column("gender")]
        [JsonPropertyName("gender")]
        public string Gender { get; set; }

        [Column("age")]
        [JsonPropertyName("age")]
        public int Age { get; set; }

        [Column("seat_number")]
        [JsonPropertyName("seat_number")]
        public string? SeatNumber { get; set; }



        [Column("booking_id")]
        public int? BookingId { get; set; }

        [ForeignKey("BookingId")]
        [JsonIgnore]
        public Booking? Booking { get; set; }

    }
}
