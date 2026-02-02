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
        public IActionResult CreateOrder()
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

            Razorpay.Api.Order order = client.Order.Create(options);

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
    }
}
