using System.Collections.Generic;
using BookMyFlight.Backend.Entities;

namespace BookMyFlight.Backend.Services
{
    public interface IBookingService
    {
        int AddBooking(Booking booking);
        int AddPassenger(Passenger passenger, int bookingId);
        Ticket GenerateTicket(Ticket ticket, int userId, int bid);
        List<Ticket> GetTicket(int uid);
        Booking GetBookingById(int bid);
        Ticket? GetTicketByBookingId(int bid);
        void UpdateBooking(Booking booking);
        void CancelBooking(int bid);
    }
}
