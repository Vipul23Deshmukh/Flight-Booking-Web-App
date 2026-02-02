using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookMyFlight.Backend.Entities
{
    [Table("ticket")]
    public class Ticket
    {
        [Key]
        [Column("ticket_number")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TicketNumber { get; set; }

        [Column("user_id")]
        public int? UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Column("booking_id")]
        public int? BookingId { get; set; }

        [ForeignKey("BookingId")]
        public Booking? Booking { get; set; }

        [Column("booking_date")]
        public DateOnly? Booking_date { get; set; }

        [Column("total_pay")]
        public double Total_pay { get; set; } = 0;
    }
}
