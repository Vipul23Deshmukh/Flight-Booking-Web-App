using System;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using BookMyFlight.Backend.Entities;
using BookMyFlight.Backend.Exceptions;
using BookMyFlight.Backend.Services;
using BookMyFlight.Backend.Models;

namespace BookMyFlight.Backend.Controllers
{
    [ApiController]
    [Route("")] // Root mapping as Java controller has no class level mapping
    [Microsoft.AspNetCore.Authorization.Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IJwtService _jwtService;

        public UserController(IUserService userService, IJwtService jwtService)
        {
            _userService = userService;
            _jwtService = jwtService;
        }

        // Post request on user body for adding user in the database
        [HttpPost("createuser")]
        [Microsoft.AspNetCore.Authorization.AllowAnonymous]
        public string CreateUser([FromBody] User user)
        {
            // Encoder logic
            Console.WriteLine($"Received Register Request: Username={user.Username}, Email={user.Email}, Fname={user.Fname}, Phone={user.Phone}");
            string encrypt = Convert.ToBase64String(Encoding.UTF8.GetBytes(user.Password));
            user.Password = encrypt;
            int uid;
            try
            {
                uid = _userService.CreateUser(user);
                return "User added successfully with user id" + uid;
            }
            catch (UserException e)
            {
                Console.WriteLine(e);
                return "" + e.Message;
            }
        }

        // Get request to fetch user based on user id
        [HttpGet("get/{uid}")]
        public IActionResult GetUser([FromRoute] int uid)
        {
            User? u = null;
            try
            {
                u = _userService.FetchUserById(uid);
                // Decoder logic
                byte[] decodedBytes = Convert.FromBase64String(u.Password);
                string password = Encoding.UTF8.GetString(decodedBytes);
                Console.WriteLine("Password is" + password);
                // Returning User object (which has encrypted password in memory but we decoded it for print. 
                // Java code returns `u` which has password encrypted still? 
                // Java code: 
                // String password=new String(decoder.decode(u.getPassword()));
                // return new ResponseEntity<User>(u,HttpStatus.OK);
                // The User object `u` in Java is from DB. .getPassword() is encrypted. 
                // The `password` string variable is local.
                // So the returned JSON has encrypted password.
                // Strict translation: Same.
                return Ok(u);
            }
            catch (UserException e)
            {
                Console.WriteLine(e);
                return NotFound(e.Message);
            }
        }

        // Post request for authenticating user and returning JWT
        [HttpPost("auth/login")]
        [Microsoft.AspNetCore.Authorization.AllowAnonymous]
        public IActionResult Authenticate([FromBody] Login login)
        {
            User? user = _userService.Validate(login);
            if (user != null)
            {
                var token = _jwtService.GenerateToken(user);
                return Ok(new
                {
                    Token = token,
                    User = new
                    {
                        user.UserId,
                        user.Username,
                        user.Fname,
                        user.Email,
                        user.Isadmin
                    }
                });
            }
            else
            {
                return Unauthorized("Invalid username or password");
            }
        }

        // Admin: Get all users
        [HttpGet("admin/users")]
        public IActionResult GetAllUsers()
        {
            var isAdminClaim = User.FindFirst("isadmin")?.Value;
            if (isAdminClaim != "1")
                return Forbid("Access denied: Admins only");

            var users = _userService.FetchAll();
            // Important: Remove passwords before sending to frontend
            foreach (var u in users) u.Password = "********";
            return Ok(users);
        }

        // Get request for logging out user
        [HttpGet("logout")]
        public string Logout()
        {
            HttpContext.Session.Clear(); // session.invalidate()
            return "logged out successfully";
        }
    }
}
