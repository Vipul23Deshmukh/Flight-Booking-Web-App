using System.Collections.Generic;
using BookMyFlight.Backend.Entities;

namespace BookMyFlight.Backend.Repositories
{
    public interface ITicketRepository
    {
        List<Ticket> FindByUser(User user);
        Ticket Save(Ticket ticket);
        Ticket? FindById(int id);
        Ticket? FindByBookingId(int bookingId);
        List<Ticket> FindAll();
    }
}
