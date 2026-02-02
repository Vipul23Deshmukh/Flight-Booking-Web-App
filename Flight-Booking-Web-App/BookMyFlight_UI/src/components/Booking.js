import React, { Component } from 'react';
import BookingService from '../services/BookingService';
import Header from './Header';
import Footer from './Footer';
import SeatSelector from './SeatSelector';

class Booking extends Component {
    constructor(props) {
        super(props)
        this.service = new BookingService();
        this.flag = false
        const plane = JSON.parse(localStorage.getItem('plane'));
        if (!plane) {
            this.props.history.push("/")
        } else {
            this.flight = plane;
            this.flag = true
            this.state = {
                flightNumber: this.flight.flightNumber,
                source: this.flight.source,
                destination: this.flight.destination,
                date: this.flight.travelDate,
                passengers: [1, 2, 3, 4, 5, 6],
                numberOfSeatsToBook: 1,
                selectedSeats: [],
                showSeatSelector: false
            }
        }
    }

    componentDidMount() {
        if (!JSON.parse(localStorage.getItem("user"))) {
            this.props.history.push("/login")
        }
    }

    handleInput = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    goOnPassangers = () => {
        if (this.state.numberOfSeatsToBook <= 0) {
            alert('Please select at least 1 passenger');
            return;
        }

        if (!this.state.showSeatSelector) {
            this.setState({ showSeatSelector: true });
            return;
        }

        if (this.state.selectedSeats.length !== parseInt(this.state.numberOfSeatsToBook)) {
            alert(`Please select exactly ${this.state.numberOfSeatsToBook} seats.`);
            return;
        }

        localStorage.setItem('nop', this.state.numberOfSeatsToBook);
        localStorage.setItem('selectedSeats', JSON.stringify(this.state.selectedSeats));

        this.service.addBooking(this.state.numberOfSeatsToBook, this.state.flightNumber, this.state.source, this.state.destination, this.state.date
        ).then(response => {
            // response.data is the booking ID (bid)
            this.props.history.push('/passengers')
        }).catch(error => {
            console.error("Booking error:", error);
            alert('Booking failed: ' + (error.message || 'Unknown error'));
        })
    }

    handleSeatSelection = (seats) => {
        this.setState({ selectedSeats: seats });
    }

    change = (event) => {
        this.setState({ numberOfSeatsToBook: event.target.value });
    }

    render() {
        if (!this.flag) return null;

        return (
            <div className="bg-light min-vh-100">
                <Header />
                <div className="main-content container animate-fade-in">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <div className="glass-card p-5 border-0">
                                <h2 className="mb-4 text-center">Confirm Your Selection</h2>

                                <div className="flight-summary mb-4 p-4 rounded-3 border bg-white shadow-sm">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="fw-bold text-primary-blue">
                                            <i className="fas fa-plane me-2"></i> Flight {this.state.flightNumber}
                                        </div>
                                        <div className="badge bg-light text-primary-blue border">{this.state.date}</div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between text-center">
                                        <div className="flex-fill">
                                            <div className="h4 mb-0 fw-bold">{this.flight.departureTime.substring(0, 5)}</div>
                                            <div className="text-muted small">{this.state.source}</div>
                                        </div>
                                        <div className="px-3 flex-fill position-relative">
                                            <i className="fas fa-long-arrow-alt-right text-accent-gold fs-4"></i>
                                        </div>
                                        <div className="flex-fill">
                                            <div className="h4 mb-0 fw-bold">{this.flight.arrivalTime.substring(0, 5)}</div>
                                            <div className="text-muted small">{this.state.destination}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-uppercase text-muted">Number of Passengers</label>
                                    <select className="form-select form-control-premium"
                                        name="nop" onChange={this.change} value={this.state.numberOfSeatsToBook} required>
                                        <option value="">Select No. of Passengers</option>
                                        {this.state.passengers.map(psng => (
                                            <option key={`nop-${psng}`} value={psng}>{psng} {psng === 1 ? 'Passenger' : 'Passengers'}</option>
                                        ))}
                                    </select>
                                    <p className="small text-muted mt-2">
                                        <i className="fas fa-info-circle me-1"></i> You can book up to 6 seats per transaction.
                                    </p>
                                </div>

                                {this.state.showSeatSelector && (
                                    <div className="mb-4 animate-slide-up">
                                        <SeatSelector
                                            seats={this.flight.seats || []}
                                            maxSelectable={parseInt(this.state.numberOfSeatsToBook)}
                                            onSelectionChange={this.handleSeatSelection}
                                        />
                                    </div>
                                )}

                                <button onClick={this.goOnPassangers} className="btn btn-premium w-100 py-3 mt-2">
                                    {this.state.showSeatSelector ? 'Confirm Seats & Proceed' : 'Select Seats'}
                                </button>

                                <button className="btn btn-link w-100 mt-3 text-muted text-decoration-none small"
                                    onClick={() => this.props.history.push('/')}>
                                    <i className="fas fa-arrow-left me-1"></i> Choose a different flight
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default Booking;
