namespace BookMyFlight.Backend.Models
{
    public class EntityOrder
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Mobile { get; set; }

        public string Email { get; set; }
        public decimal Amount { get; set; }
        public string TransactionId { get; set; }

        public string OrderId { get; set; }
        public int UserId { get; set; }
    }
}
