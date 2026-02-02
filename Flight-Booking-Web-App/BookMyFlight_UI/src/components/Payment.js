import React, { Component } from 'react';
import amex from '../assets/images/amex.png';
import visa from '../assets/images/visa.png';
import mastercard from '../assets/images/mastercard.png';
import BookingService from '../services/BookingService';
import { withRouter } from "react-router";
import Footer from './Footer';
import Header from './Header';

class Payment extends Component {
    constructor(props) {
        super(props)
        if (!localStorage.getItem('user')) {
            this.props.history.push('/login')
        } else {
            this.service = new BookingService();
            this.state = {
                ticketNumber: 0,
                booking_date: null,
                total_pay: 0,
                name: ''
            }
        }
    }

    createTicket = (e) => {
        e.preventDefault();
        if (!e.target.closest("form").reportValidity()) return;

        this.service.generateTicket(this.state).then(response => {
            if (response && response.status === 200) {
                this.props.history.push('/ticket')
            } else {
                alert("Payment failed or Booking not found. Please try again.");
            }
        }).catch(error => {
            console.error(error);
            alert("An error occurred during payment processing.");
        });
    }

    render() {
        if (!localStorage.getItem('user')) return null;
        const amount = localStorage.getItem('total_amount');

        return (
            <div className="bg-light min-vh-100">
                <Header />
                <div className="main-content container animate-fade-in pb-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="glass-card p-5 border-0 text-center">
                                <div className="mb-4">
                                    <div className="display-4 text-success mb-3">
                                        <i className="fas fa-shield-check"></i>
                                    </div>
                                    <h2 className="fw-bold mb-2">Secure Checkout</h2>
                                    <p className="text-muted">You are one step away from your journey.</p>
                                </div>

                                <div className="p-4 bg-white rounded-4 border shadow-sm mb-4">
                                    <div className="small text-muted text-uppercase fw-bold mb-2">Total Amount Payable</div>
                                    <h1 className="fw-bold text-primary-blue mb-0">₹{amount}</h1>
                                </div>

                                <div className="mb-4">
                                    <p className="small text-muted mb-3">We accept all major credit and debit cards</p>
                                    <div className="d-flex justify-content-center gap-3 align-items-center grayscale-hover opacity-75">
                                        <img src={visa} alt="visa" height="30" />
                                        <img src={mastercard} alt="mastercard" height="30" />
                                        <img src={amex} alt="amex" height="30" />
                                    </div>
                                </div>

                                <div className="alert alert-info border-0 shadow-sm small py-3 px-4 mb-4 text-start d-flex">
                                    <i className="fas fa-lock text-primary-blue mt-1 me-3 fs-5"></i>
                                    <div>
                                        <strong>Secure Gateway:</strong> You will be redirected to our encrypted Razorpay partner to complete the transaction safely.
                                    </div>
                                </div>

                                <button onClick={() => {
                                    const user = JSON.parse(localStorage.getItem('user'));
                                    const bid = localStorage.getItem('bid');
                                    const amount = localStorage.getItem('total_amount');
                                    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8980";
                                    const paymentUrl = `${apiUrl}/MyOrder/Index?` +
                                        `bookingId=${bid}&` +
                                        `userId=${user.userId}&` +
                                        `amount=${amount}&` +
                                        `name=${encodeURIComponent(user.fname || user.username)}&` +
                                        `email=${encodeURIComponent(user.email)}&` +
                                        `mobile=${encodeURIComponent(user.phone || '0000000000')}`;
                                    window.location.href = paymentUrl;
                                }}
                                    className="btn btn-premium w-100 py-3 mb-3 fs-5 fw-bold">
                                    Pay ₹{amount} Now
                                </button>

                                <p className="small text-muted mb-0">
                                    <i className="fas fa-info-circle me-1"></i> Your booking will be confirmed immediately after payment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default withRouter(Payment);
