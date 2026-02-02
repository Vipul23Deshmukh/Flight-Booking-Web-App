using System;

namespace BookMyFlight.Backend.Exceptions
{
    public class FlightException : Exception
    {
        public FlightException() : base()
        {
        }

        public FlightException(string message) : base(message)
        {
        }
    }
}
