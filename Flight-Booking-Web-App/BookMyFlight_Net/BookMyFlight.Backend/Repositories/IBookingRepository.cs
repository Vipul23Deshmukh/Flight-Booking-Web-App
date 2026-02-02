using System.Collections.Generic;
using BookMyFlight.Backend.Entities;

namespace BookMyFlight.Backend.Repositories
{
    public interface IBookingRepository
    {
        Booking Save(Booking booking);
        Booking? FindById(int id);
        List<Booking> FindAll();
    }
}
