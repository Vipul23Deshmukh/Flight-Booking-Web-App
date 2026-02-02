using System.Collections.Generic;
using BookMyFlight.Backend.Models;
using BookMyFlight.Backend.Entities;
using BookMyFlight.Backend.Exceptions;

namespace BookMyFlight.Backend.Services
{
    public interface IUserService
    {
        int CreateUser(User user);
        User FetchUserById(int userId);
        User? Validate(Login login); // Returns User or null
        List<User> FetchAll();
    }
}
