using System;
using System.Collections.Generic;
using System.Text;
using BookMyFlight.Backend.Entities;
using BookMyFlight.Backend.Exceptions;
using BookMyFlight.Backend.Models;
using BookMyFlight.Backend.Repositories;

namespace BookMyFlight.Backend.Services
{
    public class UserServiceImpl : IUserService
    {
        private readonly IUserRepository _userRepo;

        public UserServiceImpl(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        public int CreateUser(User user)
        {
            List<User> users = FetchAll();
            User? user_temp = null;
            foreach (User u in users)
            {
                if (u.Username.Equals(user.Username) && u.Email.Equals(user.Email))
                    user_temp = u;
            }

            if (user_temp == null)
            {
                _userRepo.Save(user);
                return user.UserId;
            }
            else
            {
                throw new UserException("User already exist with userId " + user_temp.UserId);
            }
        }

        public User FetchUserById(int userId)
        {
            List<User> users = FetchAll();
            User? user = null;
            foreach (User u in users)
            {
                if (u.UserId == userId)
                {
                    user = u;
                }
            }
            if (user != null)
            {
                return _userRepo.FindById(userId)!;
            }
            else
            {
                throw new UserException("User not found with id" + userId);
            }
        }

        public User? Validate(Login login)
        {
            // Encoding logic from Java
            // Encoder encoder=Base64.getEncoder();
            // String encrypt=encoder.encodeToString(login.getPassword().getBytes());
            string encrypt = Convert.ToBase64String(Encoding.UTF8.GetBytes(login.Password));
            User user = _userRepo.FindByUsernameAndPassword(login.Username, encrypt);
            return user;
        }

        public List<User> FetchAll()
        {
            return _userRepo.FindAll();
        }
    }
}
