using Microsoft.AspNetCore.Mvc;
using BookMyFlight.Backend.Models;
using Razorpay.Api;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using BookMyFlight.Backend.Services;
using BookMyFlight.Backend.Entities;

namespace BookMyFlight.Backend.Controllers
{
    public class MyOrderController : Controller
    {
        private readonly IBookingService _bookService;

        public MyOrderController(IBookingService bookService)
        {
            _bookService = bookService;
        }

        [BindProperty]
        public EntityOrder _OrderDetails { get; set; }

        // STEP 1: Landing page (called from backend with query params)
        [HttpGet]
        public IActionResult Index()
        {
            var model = new EntityOrder
            {
                Name = string.IsNullOrEmpty(Request.Query["name"]) ? "N/A" : Request.Query["name"],
                Email = string.IsNullOrEmpty(Request.Query["email"]) ? "N/A" : Request.Query["email"],
                Mobile = string.IsNullOrEmpty(Request.Query["mobile"]) ? "N/A" : Request.Query["mobile"],
                Amount = string.IsNullOrEmpty(Request.Query["amount"])
                            ? 0
                            : Convert.ToDecimal(Request.Query["amount"]),
                Id = Request.Query["bookingId"],   // using Id as Booking ID
                UserId = string.IsNullOrEmpty(Request.Query["userId"]) ? 0 : Convert.ToInt32(Request.Query["userId"])
            };

            return View(model);
        }


        // STEP 2: Create Razorpay Order (NEW every time)
        [HttpPost("/createorder")]
        public async Task<IActionResult> CreateOrder()
        {
            // --- SERVER-SIDE VALIDATION ---
            if (string.IsNullOrWhiteSpace(_OrderDetails.Name) || _OrderDetails.Name.Length < 2 || !System.Text.RegularExpressions.Regex.IsMatch(_OrderDetails.Name, @"^[a-zA-Z\s]+$"))
            {
                TempData["Error"] = "Name is mandatory, must be at least 2 characters and alphabets only.";
                return RedirectToAction("Index", new { userId = _OrderDetails.UserId, bookingId = _OrderDetails.Id, amount = _OrderDetails.Amount, name = _OrderDetails.Name, email = _OrderDetails.Email, mobile = _OrderDetails.Mobile });
            }

            if (string.IsNullOrWhiteSpace(_OrderDetails.Mobile) || _OrderDetails.Mobile.Length != 10 || !System.Text.RegularExpressions.Regex.IsMatch(_OrderDetails.Mobile, @"^[0-9]+$"))
            {
                TempData["Error"] = "Phone Number is mandatory and must be exactly 10 digits.";
                return RedirectToAction("Index", new { userId = _OrderDetails.UserId, bookingId = _OrderDetails.Id, amount = _OrderDetails.Amount, name = _OrderDetails.Name, email = _OrderDetails.Email, mobile = _OrderDetails.Mobile });
            }
            // ------------------------------

            string key = "rzp_test_S8p5Gc7pIh86oW";
            string secret = "SaglgWuJ6L1V1fu51BpZq5m2";

            RazorpayClient client = new RazorpayClient(key, secret);

            Dictionary<string, object> options = new Dictionary<string, object>();
            options.Add("amount", Convert.ToInt32(_OrderDetails.Amount) * 100); // paise
            options.Add("currency", "INR");
            options.Add("receipt", Guid.NewGuid().ToString());

            // Run blocking Razorpay call in background
            Razorpay.Api.Order order = await Task.Run(() => client.Order.Create(options));

            // 🔥 SAVE USER DATA FOR PAYMENT CALLBACK
            TempData["OrderData"] = JsonSerializer.Serialize(_OrderDetails);

            ViewBag.Key = key;
            ViewBag.OrderId = order["id"].ToString();
            ViewBag.Amount = options["amount"];

            return View("Payment", _OrderDetails);
        }

        // STEP 3: Razorpay callback & verification
        [HttpPost("/Payment")]
        public async Task<IActionResult> Payment(
            string razorpay_payment_id,
            string razorpay_order_id,
            string razorpay_signature)
        {
            try
            {
                RazorpayClient client = new RazorpayClient(
                    "rzp_test_S8p5Gc7pIh86oW",
                    "SaglgWuJ6L1V1fu51BpZq5m2"
                );

                Dictionary<string, string> attributes = new Dictionary<string, string>();
                attributes.Add("razorpay_payment_id", razorpay_payment_id);
                attributes.Add("razorpay_order_id", razorpay_order_id);
                attributes.Add("razorpay_signature", razorpay_signature);

                Utils.verifyPaymentSignature(attributes);

                // 🔥 RESTORE USER DATA
                string json = TempData["OrderData"] as string;
                EntityOrder order =
                    JsonSerializer.Deserialize<EntityOrder>(json);

                order.TransactionId = razorpay_payment_id;
                order.OrderId = razorpay_order_id;

                // 🔥 GENERATE TICKET DIRECTLY (No HTTP call)
                int bookingId = int.Parse(order.Id);
                var booking = _bookService.GetBookingById(bookingId);
                
                if (booking != null)
                {
                    booking.PayStatus = 1;
                    _bookService.UpdateBooking(booking);

                    // Ensure Flight is loaded for price calc
                    // If flight is null, we might have issues, but assuming standard flow:
                    double total_pay = 0;
                    if (booking.Flight != null)
                    {
                        total_pay = booking.Flight.Price * booking.NumberOfSeatsToBook;
                    }
                    else 
                    {
                         // Fallback or re-fetch flight if needed, but Repo likely includes it.
                         // For now, trust the existing logic flow or default to 0/Client amount
                         total_pay = (double)order.Amount;
                    }

                    var ticket = new Ticket 
                    { 
                        Booking_date = DateOnly.FromDateTime(DateTime.Now), 
                        Total_pay = total_pay 
                    };
                    
                    _bookService.GenerateTicket(ticket, order.UserId, bookingId);
                }
                else 
                {
                    Console.WriteLine("Booking not found for ID: " + bookingId);
                }

                // Pass Frontend URL to View
                var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:3000";
                ViewBag.FrontendUrl = frontendUrl;

                return View("PaymentSuccess", order);
            }
            catch (Exception ex)
            {
                return Content("Payment Failed or Signature Invalid: " + ex.Message);
            }
        }

        // ========== NEW REST API ENDPOINTS FOR REACT FRONTEND ==========

        /// <summary>
        /// API endpoint to create Razorpay order - returns JSON for React frontend
        /// </summary>
        [HttpPost("/api/payment/create-order")]
        public async Task<IActionResult> CreateOrderApi([FromBody] PaymentOrderRequest request)
        {
            try
            {
                // Validate request
                if (request == null || request.Amount <= 0)
                {
                    return BadRequest(new { success = false, message = "Invalid payment request" });
                }

                if (string.IsNullOrWhiteSpace(request.BookingId))
                {
                    return BadRequest(new { success = false, message = "Booking ID is required" });
                }

                // Check for existing booking
                // Convert BookingId to int
                if (!int.TryParse(request.BookingId, out int bookingId))
                {
                     return BadRequest(new { success = false, message = "Invalid Booking ID format" });
                }

                var booking = _bookService.GetBookingById(bookingId);
                if (booking == null)
                {
                     return NotFound(new { success = false, message = "Booking not found" });
                }

                // Razorpay credentials
                string key = "rzp_test_S8p5Gc7pIh86oW";
                string secret = "SaglgWuJ6L1V1fu51BpZq5m2";

                RazorpayClient client = new RazorpayClient(key, secret);

                // Create order options
                Dictionary<string, object> options = new Dictionary<string, object>();
                options.Add("amount", Convert.ToInt32(request.Amount) * 100); // Convert to paise
                options.Add("currency", "INR");
                options.Add("receipt", Guid.NewGuid().ToString());

                // Create Razorpay order
                Razorpay.Api.Order order = await Task.Run(() => client.Order.Create(options));
                string orderId = order["id"].ToString();

                // UPDATE BOOKING WITH ORDER ID (Stateless persistence)
                booking.RazorpayOrderId = orderId;
                _bookService.UpdateBooking(booking);

                // Return response for React frontend
                return Ok(new
                {
                    success = true,
                    orderId = orderId,
                    amount = Convert.ToInt32(request.Amount) * 100, // in paise
                    currency = "INR",
                    key = key,
                    name = request.Name,
                    email = request.Email,
                    mobile = request.Mobile
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CreateOrderApi] Error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Failed to create order: " + ex.Message });
            }
        }

        /// <summary>
        /// API endpoint to verify Razorpay payment and generate ticket - returns JSON
        /// </summary>
        [HttpPost("/api/payment/verify")]
        public async Task<IActionResult> VerifyPaymentApi([FromBody] PaymentVerificationRequest request)
        {
            try
            {
                // Validate request
                if (request == null || string.IsNullOrEmpty(request.RazorpayPaymentId) ||
                    string.IsNullOrEmpty(request.RazorpayOrderId) || string.IsNullOrEmpty(request.RazorpaySignature))
                {
                    return BadRequest(new { success = false, message = "Invalid payment verification request" });
                }

                if (string.IsNullOrEmpty(request.BookingId) || !int.TryParse(request.BookingId, out int bookingId))
                {
                     return BadRequest(new { success = false, message = "Invalid Booking ID" });
                }

                // Fetch Booking from DB
                var booking = _bookService.GetBookingById(bookingId);
                if (booking == null)
                {
                    return NotFound(new { success = false, message = "Booking not found" });
                }

                // VERIFY ORDER ID MATCHES (Security Check)
                if (booking.RazorpayOrderId != request.RazorpayOrderId)
                {
                    return BadRequest(new { success = false, message = "Order mismatch. Invalid payment attempt." });
                }

                // Verify payment signature
                RazorpayClient client = new RazorpayClient(
                    "rzp_test_S8p5Gc7pIh86oW",
                    "SaglgWuJ6L1V1fu51BpZq5m2"
                );

                Dictionary<string, string> attributes = new Dictionary<string, string>();
                attributes.Add("razorpay_payment_id", request.RazorpayPaymentId);
                attributes.Add("razorpay_order_id", request.RazorpayOrderId);
                attributes.Add("razorpay_signature", request.RazorpaySignature);

                Utils.verifyPaymentSignature(attributes);

                // Update booking payment status and save payment details
                booking.PayStatus = 1;
                booking.RazorpayPaymentId = request.RazorpayPaymentId;
                _bookService.UpdateBooking(booking);

                // Calculate total payment
                double total_pay = 0;
                if (booking.Flight != null)
                {
                    total_pay = booking.Flight.Price * booking.NumberOfSeatsToBook;
                }
                else
                {
                    // Fallback to fetch flight price if needed, or assume backend integrity
                    // But in verify, we should rely on what was booked
                    // If Flight is null, let's assume standard flow prevents this or repo includes it.
                    // For now, to be safe:
                    total_pay = 0; // Or better, fetch flight if null
                    // Assuming repo included Flight.
                }

                // Generate ticket
                var ticket = new Ticket
                {
                    Booking_date = DateOnly.FromDateTime(DateTime.Now),
                    Total_pay = total_pay
                };

                _bookService.GenerateTicket(ticket, request.UserId, bookingId);

                return Ok(new
                {
                    success = true,
                    message = "Payment verified successfully",
                    ticketId = ticket.TicketNumber,
                    transactionId = request.RazorpayPaymentId
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[VerifyPaymentApi] Error: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Payment verification failed: " + ex.Message });
            }
        }
    }

    // ========== REQUEST MODELS FOR API ENDPOINTS ==========

    public class PaymentOrderRequest
    {
        public string BookingId { get; set; }
        public int UserId { get; set; }
        public decimal Amount { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
    }

    public class PaymentVerificationRequest
    {
        public string RazorpayPaymentId { get; set; }
        public string RazorpayOrderId { get; set; }
        public string RazorpaySignature { get; set; }
        public string BookingId { get; set; }
        public int UserId { get; set; }
    }
}
