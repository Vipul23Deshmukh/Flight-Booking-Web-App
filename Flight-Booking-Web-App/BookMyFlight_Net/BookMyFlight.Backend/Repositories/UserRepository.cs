using System.Collections.Generic;
using System.Linq;
using BookMyFlight.Backend.Data;
using BookMyFlight.Backend.Entities;

namespace BookMyFlight.Backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public User FindByUsernameAndPassword(string username, string password)
        {
            return _context.Users.FirstOrDefault(u => u.Username == username && u.Password == password);
        }

        public User Save(User user)
        {
            if (user.UserId == 0)
            {
                _context.Users.Add(user);
            }
            else
            {
                _context.Users.Update(user);
            }
            _context.SaveChanges();
            return user;
        }

        public User? FindById(int id)
        {
            return _context.Users.Find(id);
        }

        public List<User> FindAll()
        {
            return _context.Users.ToList();
        }
    }
}
