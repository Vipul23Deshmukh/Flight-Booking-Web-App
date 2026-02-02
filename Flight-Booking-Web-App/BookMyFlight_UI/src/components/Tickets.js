import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import BookingService from '../services/BookingService';

class Tickets extends Component {
    constructor(props) {
        super(props)
        this.service = new BookingService();
        this.state = {
            multiple_ticket: [],
            loading: true
        }
    }

    componentDidMount() {
        if (!localStorage.getItem('user')) {
            this.props.history.push('/login')
        } else {
            this.service.getTickets().then(response => {
                this.setState({ multiple_ticket: response.data || [], loading: false })
            }).catch(err => {
                console.error("Failed to fetch tickets:", err);
                this.setState({ loading: false });
            });
        }
    }

    showTicket(x) {
        localStorage.setItem('view-ticket', JSON.stringify(x))
        this.props.history.push('/ticket')
    }

    handleCancel(bid) {
        if (window.confirm("Are you sure you want to cancel this booking? This action is irreversible.")) {
            this.service.cancelBooking(bid).then(res => {
                alert("Booking cancelled successfully. Refund will be processed soon.");
                window.location.reload();
            }).catch(err => {
                alert("Failed to cancel booking: " + (err.response?.data || err.message));
            });
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="bg-light min-vh-100">
                    <Header />
                    <div className="main-content container text-center py-5">
                        <div className="spinner-border text-primary-blue mb-3" role="status"></div>
                        <h3>Loading your bookings...</h3>
                    </div>
                    <Footer />
                </div>
            )
        }

        const ticketList = (this.state.multiple_ticket || []).map((x) => (
            <div key={x.ticketNumber} className="col-lg-6 mb-4">
                <div className="glass-card p-4 border-0 hover-lift h-100">
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                        <div>
                            <div className="small text-muted text-uppercase fw-bold">Ticket Number</div>
                            <div className="h5 mb-0 fw-bold text-primary-blue">{x.ticketNumber}</div>
                        </div>
                        <div className="text-end">
                            <div className="small text-muted text-uppercase fw-bold">Status</div>
                            {x.booking?.payStatus === 2 ? (
                                <div className="badge bg-danger-light text-danger border-danger-subtle px-3 py-2">
                                    <i className="fas fa-times-circle me-1"></i> Cancelled
                                </div>
                            ) : (
                                <div className="badge bg-success-light text-success border-success-subtle px-3 py-2">
                                    <i className="fas fa-check-circle me-1"></i> Confirmed
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="row align-items-center text-center mb-4">
                        <div className="col-5">
                            <div className="h4 mb-0 fw-bold">{x.booking?.flight?.source}</div>
                            <div className="small text-muted">Origin</div>
                        </div>
                        <div className="col-2 px-0">
                            <i className="fas fa-plane text-accent-gold"></i>
                        </div>
                        <div className="col-5">
                            <div className="h4 mb-0 fw-bold">{x.booking?.flight?.destination}</div>
                            <div className="small text-muted">Destination</div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                        <div className="small text-muted">
                            <i className="fas fa-calendar-alt me-2 text-primary-blue"></i>
                            Travel Date: <span className="fw-bold">{x.booking?.flight?.travelDate || 'TBD'}</span>
                        </div>
                        <div className="d-flex gap-2">
                            {x.booking && x.booking.payStatus !== 2 && (
                                <button className="btn btn-outline-danger btn-sm px-3" onClick={() => this.handleCancel(x.booking.bookingId)}>
                                    Cancel
                                </button>
                            )}
                            <button className="btn btn-premium-outline btn-sm px-4" onClick={() => this.showTicket(x)}>
                                View Ticket <i className="fas fa-chevron-right ms-2 scale-hover"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ));

        return (
            <div className="bg-light min-vh-100">
                <Header />
                <div className="main-content container animate-fade-in pb-5">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold mb-2">My Bookings</h2>
                        <p className="text-muted">Manage your upcoming and past flight journeys.</p>
                    </div>

                    <div className="row">
                        {ticketList.length > 0 ? ticketList : (
                            <div className="col-12 text-center py-5">
                                <div className="glass-card p-5 border-0">
                                    <div className="display-3 text-muted mb-4 opacity-25">
                                        <i className="fas fa-suitcase-rolling"></i>
                                    </div>
                                    <h3>No upcoming trips found</h3>
                                    <p className="text-muted mb-4">Ready for your next adventure? Start searching now!</p>
                                    <button className="btn btn-premium px-5 py-3" onClick={() => this.props.history.push('/')}>
                                        <i className="fas fa-search me-2"></i> Find Flights
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Tickets;
