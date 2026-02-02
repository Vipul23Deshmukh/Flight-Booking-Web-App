import React, { Component } from 'react';
import BookingService from '../services/BookingService';

export default class AdminBookings extends Component {
    constructor(props) {
        super(props);
        this.service = new BookingService();
        this.state = {
            bookings: [],
            isLoading: true,
            error: ""
        }
    }

    componentDidMount() {
        this.service.getAdminAllBookings()
            .then(res => this.setState({ bookings: res.data, isLoading: false }))
            .catch(err => this.setState({ error: "Failed to fetch bookings", isLoading: false }));
    }

    render() {
        const { bookings, isLoading, error } = this.state;

        return (
            <div className="animate-fade-in">
                <div className="glass-panel p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">Manage All Bookings</h2>
                        <div className="text-end">
                            <span className="text-muted small d-block">System Overview</span>
                            <span className="fw-bold text-primary">Live Transactions</span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-5 opacity-50">
                            <i className="fas fa-history fa-4x mb-3"></i>
                            <h4>No bookings found in the system</h4>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Booking ID</th>
                                        <th>Flight #</th>
                                        <th>Route</th>
                                        <th>Seats</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b.bookingId}>
                                            <td className="fw-bold text-primary">#BK-{b.bookingId}</td>
                                            <td>{b.flight?.flightId || 'N/A'}</td>
                                            <td>
                                                <div className="small fw-bold">{b.flight?.source} → {b.flight?.destination}</div>
                                            </td>
                                            <td>{b.numberOfSeatsToBook}</td>
                                            <td>{b.bookingDate}</td>
                                            <td>
                                                {b.payStatus === 1 ?
                                                    <span className="badge bg-success">Confirmed</span> :
                                                    <span className="badge bg-warning text-dark">Pending</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
