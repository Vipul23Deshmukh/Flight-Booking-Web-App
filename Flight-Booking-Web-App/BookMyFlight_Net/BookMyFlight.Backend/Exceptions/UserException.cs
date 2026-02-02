using System;

namespace BookMyFlight.Backend.Exceptions
{
    public class UserException : Exception
    {
        public UserException() : base()
        {
        }

        public UserException(string message) : base(message)
        {
        }
    }
}
