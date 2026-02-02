using System.Collections.Generic;
using BookMyFlight.Backend.Entities;

namespace BookMyFlight.Backend.Repositories
{
    public interface IUserRepository
    {
        User FindByUsernameAndPassword(string username, string password);
        User Save(User user);
        User? FindById(int id);
        List<User> FindAll();
    }
}
