import React, { Component } from 'react';
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

class Summary extends Component {
    constructor(props) {
        super(props)
        if (!localStorage.getItem('user')) {
            this.props.history.push('/login')
        } else {
            this.summary = JSON.parse(localStorage.getItem('sid') || "[]")
            this.airplane = JSON.parse(localStorage.getItem('plane') || "{}")
            this.selectedSeats = JSON.parse(localStorage.getItem('selectedSeats') || "[]")

            // Calculate total amount based on base price and seat multipliers
            this.amount = this.selectedSeats.reduce((total, seat) => {
                return total + (this.airplane.price * (seat.priceMultiplier || 1.0));
            }, 0);

            if (this.amount === 0 && this.summary.length > 0) {
                this.amount = this.summary.length * (this.airplane.price || 0);
            }

            localStorage.setItem('total_amount', this.amount);
        }
    }

    render() {
        if (!localStorage.getItem('user')) return null;

        const passList = this.summary.map((p, index) => {
            return (
                <tr key={index} className="align-middle border-bottom">
                    <td className="py-3">
                        <div className="fw-bold">{p.pname}</div>
                        <div className="small text-muted text-uppercase">{p.gender} • Seat {p.seatNumber}</div>
                    </td>
                    <td className="py-3 text-end fw-bold">{p.age} Yrs</td>
                </tr>
            )
        })

        return (
            <div className="bg-light min-vh-100">
                <Header />
                <div className="main-content container animate-fade-in pb-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="glass-card p-5 border-0">
                                <div className="text-center mb-5">
                                    <h2 className="fw-bold mb-2">Review Your Booking</h2>
                                    <p className="text-muted">Double-check all details before proceeding to payment.</p>
                                </div>

                                <div className="row g-4">
                                    <div className="col-md-7">
                                        <div className="p-4 bg-white rounded-4 shadow-sm border mb-4">
                                            <h5 className="fw-bold mb-4 d-flex align-items-center">
                                                <i className="fas fa-users text-primary-blue me-2"></i> Passenger Details
                                            </h5>
                                            <div className="table-responsive">
                                                <table className="table table-borderless">
                                                    <thead>
                                                        <tr className="text-muted small text-uppercase">
                                                            <th className="pb-3 border-bottom">Name & Gender</th>
                                                            <th className="pb-3 text-end border-bottom">Age</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {passList}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-white rounded-4 shadow-sm border">
                                            <h5 className="fw-bold mb-4 d-flex align-items-center">
                                                <i className="fas fa-plane-departure text-primary-blue me-2"></i> Flight Details
                                            </h5>
                                            <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                                                <div>
                                                    <div className="small text-muted text-uppercase fw-bold">Flight No.</div>
                                                    <div className="fw-bold text-primary-blue">{this.airplane.flightNumber}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="small text-muted text-uppercase fw-bold">Route</div>
                                                    <div className="fw-bold">{this.airplane.source} <i className="fas fa-arrow-right mx-1 text-accent-gold"></i> {this.airplane.destination}</div>
                                                </div>
                                                <div className="text-end">
                                                    <div className="small text-muted text-uppercase fw-bold">Date</div>
                                                    <div className="fw-bold">{this.airplane.travelDate}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-5">
                                        <div className="p-4 bg-white rounded-4 shadow-sm border sticky-top" style={{ top: '120px' }}>
                                            <h5 className="fw-bold mb-4">Fare Summary</h5>
                                            <div className="d-flex justify-content-between mb-3">
                                                <span className="text-muted">Base Fare ({this.summary.length} Passengers)</span>
                                                <span className="fw-bold">₹{this.amount}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-3">
                                                <span className="text-muted">Taxes & Fees</span>
                                                <span className="text-success fw-bold">Included</span>
                                            </div>
                                            <hr className="my-4" />
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <h5 className="fw-bold mb-0">Total Amount</h5>
                                                <h4 className="fw-bold text-primary-blue mb-0">₹{this.amount}</h4>
                                            </div>

                                            <Link to='/payment' className="text-decoration-none">
                                                <button className="btn btn-premium w-100 py-3 d-flex align-items-center justify-content-center">
                                                    Confirm & Pay <i className="fas fa-chevron-right ms-2"></i>
                                                </button>
                                            </Link>

                                            <div className="mt-4 text-center">
                                                <div className="small text-muted d-flex align-items-center justify-content-center">
                                                    <i className="fas fa-shield-alt text-success me-2"></i>
                                                    Secure booking with BookMyFlight
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Summary;
