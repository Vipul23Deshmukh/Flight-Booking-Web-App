import React, { Component } from 'react';
import amex from '../assets/images/amex.png';
import visa from '../assets/images/visa.png';
import mastercard from '../assets/images/mastercard.png';
import { withRouter } from "react-router";
import Footer from './Footer';
import Header from './Header';

class Payment extends Component {
    constructor(props) {
        super(props)
        if (!localStorage.getItem('user')) {
            this.props.history.push('/login')
        } else {
            this.state = {
                isProcessing: false,
                errorMessage: '',
                showRetry: false
            }
        }
    }

    handlePayment = async () => {
        // Prevent double-clicks
        if (this.state.isProcessing) {
            console.log('[Payment] Already processing, ignoring click');
            return;
        }

        this.setState({ isProcessing: true, errorMessage: '', showRetry: false });

        try {
            // Step 1: Validate localStorage data
            const userJson = localStorage.getItem('user');
            const bid = localStorage.getItem('bid');
            const amount = localStorage.getItem('total_amount');

            console.log('[Payment] LocalStorage Check:', {
                hasUser: !!userJson,
                hasBid: !!bid,
                hasAmount: !!amount
            });

            if (!userJson) {
                throw new Error('User not logged in. Please login again.');
            }

            const user = JSON.parse(userJson);
            console.log('[Payment] Parsed user:', user);

            // Extract userId (support multiple formats)
            const userId = user.userId || user.userid || user.UserId;
            if (!userId) {
                throw new Error('User ID not found. Please re-login.');
            }

            if (!bid || !amount) {
                throw new Error('Booking information missing. Please start booking again.');
            }

            // Step 2: Call backend API to create Razorpay order
            const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8980";
            const createOrderUrl = `${apiUrl}/api/payment/create-order`;

            console.log('[Payment] Creating order via API:', createOrderUrl);

            const orderResponse = await fetch(createOrderUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: bid,
                    userId: userId,
                    amount: parseFloat(amount),
                    name: user.fname || user.username || 'Guest',
                    email: user.email || 'noemail@example.com',
                    mobile: user.phone || user.mobile || '0000000000'
                })
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.message || 'Failed to create payment order');
            }

            const orderData = await orderResponse.json();
            console.log('[Payment] Order created:', orderData);

            if (!orderData.success || !orderData.orderId) {
                throw new Error('Invalid order response from server');
            }

            // Step 3: Check if Razorpay is loaded
            if (typeof window.Razorpay === 'undefined') {
                throw new Error('Razorpay SDK not loaded. Please refresh the page.');
            }

            // Step 4: Initialize Razorpay with order details
            const options = {
                key: orderData.key,
                amount: orderData.amount, // Amount in paise
                currency: orderData.currency,
                name: "BookMyFlight",
                description: "Flight Ticket Payment",
                order_id: orderData.orderId,
                prefill: {
                    name: orderData.name,
                    email: orderData.email,
                    contact: orderData.mobile
                },
                theme: {
                    color: "#003D8A"
                },
                handler: async (response) => {
                    console.log('[Payment] Razorpay success:', response);
                    await this.verifyPayment(response, bid, userId);
                },
                modal: {
                    ondismiss: () => {
                        console.log('[Payment] Payment cancelled by user');
                        this.setState({
                            isProcessing: false,
                            errorMessage: 'Payment cancelled. You can try again.',
                            showRetry: true
                        });
                    }
                }
            };

            // Step 5: Open Razorpay checkout
            const rzp = new window.Razorpay(options);

            rzp.on('payment.failed', (response) => {
                console.error('[Payment] Payment failed:', response.error);
                this.setState({
                    isProcessing: false,
                    errorMessage: `Payment failed: ${response.error.description || 'Unknown error'}`,
                    showRetry: true
                });
            });

            console.log('[Payment] Opening Razorpay checkout...');
            rzp.open();

            // Reset processing state after opening (user can still interact if they cancel)
            this.setState({ isProcessing: false });

        } catch (error) {
            console.error('[Payment] Error:', error);
            this.setState({
                isProcessing: false,
                errorMessage: error.message || 'Payment initialization failed. Please try again.',
                showRetry: true
            });
        }
    }

    verifyPayment = async (razorpayResponse, bookingId, userId) => {
        try {
            this.setState({ isProcessing: true, errorMessage: '', showRetry: false });

            const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8980";
            const verifyUrl = `${apiUrl}/api/payment/verify`;

            console.log('[Payment] Verifying payment via API:', verifyUrl);

            const verifyResponse = await fetch(verifyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                    razorpayOrderId: razorpayResponse.razorpay_order_id,
                    razorpaySignature: razorpayResponse.razorpay_signature,
                    bookingId: bookingId,
                    userId: userId
                })
            });

            if (!verifyResponse.ok) {
                const errorData = await verifyResponse.json();
                throw new Error(errorData.message || 'Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            console.log('[Payment] Payment verified:', verifyData);

            if (verifyData.success) {
                // Store ticket number for retrieval
                if (verifyData.ticketId) {
                    localStorage.setItem('ticketId', verifyData.ticketId);
                }

                // Redirect to ticket page with booking ID
                this.props.history.push(`/ticket?bookingId=${bookingId}`);
            } else {
                throw new Error(verifyData.message || 'Payment verification failed');
            }

        } catch (error) {
            console.error('[Payment] Verification error:', error);
            this.setState({
                isProcessing: false,
                errorMessage: `Verification failed: ${error.message}. Please contact support with your payment details.`,
                showRetry: false
            });
        }
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
                                        <strong>Secure Gateway:</strong> Powered by Razorpay - India's most trusted payment gateway with 256-bit encryption.
                                    </div>
                                </div>

                                <button
                                    onClick={this.handlePayment}
                                    disabled={this.state.isProcessing}
                                    className="btn btn-premium w-100 py-3 mb-3 fs-5 fw-bold position-relative"
                                    style={{ minHeight: '60px' }}
                                >
                                    {this.state.isProcessing ? (
                                        <span>
                                            <i className="fas fa-spinner fa-spin me-2"></i>
                                            Processing...
                                        </span>
                                    ) : (
                                        <span>
                                            <i className="fas fa-lock me-2"></i>
                                            Pay ₹{amount} Now
                                        </span>
                                    )}
                                </button>

                                {this.state.errorMessage && (
                                    <div className="alert alert-danger small mb-3" role="alert">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        {this.state.errorMessage}
                                    </div>
                                )}

                                {this.state.showRetry && (
                                    <button
                                        onClick={this.handlePayment}
                                        className="btn btn-outline-primary w-100 py-2 mb-3"
                                    >
                                        <i className="fas fa-redo me-2"></i>
                                        Retry Payment
                                    </button>
                                )}

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
