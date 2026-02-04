import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import FlightServiceRest from '../services/FlightServiceRest';
import searchIcon from '../assets/logo/magnifying-glass.png';

class SearchFlight extends Component {
    constructor(props) {
        super(props);
        this.service = new FlightServiceRest();
        this.state = {
            source: "Chennai",
            destination: "Chennai",
            travelDate: "",
            searched: false
        }
    }

    componentDidMount() {
        this.setState({ searched: false });
    }

    handleInput = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    getFlightsList = (e) => {
        e.preventDefault();
        if (!e.target.closest("form").reportValidity()) return;

        this.setState({ searched: false });

        const { source, destination, travelDate: t } = this.state;
        const normalizedSource = source.trim().toLowerCase();
        const normalizedDest = destination.trim().toLowerCase();

        this.service.getFlightsForUser(normalizedSource, normalizedDest, t).then(data => {
            if (data && data.length > 0) {
                const now = new Date();
                const localTodayStr = now.toISOString().split('T')[0];

                if (t === localTodayStr) {
                    const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

                    data = data.filter(flight => {
                        if (!flight.departureTime) return true; // Defensive check

                        // Support both camelCase and PascalCase
                        const depTime = flight.departureTime || flight.DepartureTime;
                        if (!depTime) return true;

                        const [fHours, fMinutes, fSeconds] = depTime.split(':').map(Number);
                        const flightTimeInSeconds = fHours * 3600 + (fMinutes || 0) * 60 + (fSeconds || 0);
                        return flightTimeInSeconds > currentTimeInSeconds;
                    });
                }

                if (data.length > 0) {
                    this.props.history.push({
                        pathname: '/search-results',
                        state: { flights: data, source: source, destination: destination, date: t }
                    });
                } else {
                    alert('No more flights available for today!!');
                }
            } else {
                alert('No Flights Found!!');
            }
        }).catch(error => {
            console.error("Flight search error:", error);
            alert('Flight search failed: ' + error.message);
        })
    }

    render() {
        const localTodayStr = new Date().toISOString().split('T')[0];
        const cities = ["Chennai", "Delhi", "Mumbai", "Kolkata", "Goa", "Pune", "Jaipur", "Bangalore", "Cochin", "Ahmadabad"];

        return (
            <div className="container main-content animate-fade-in">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="glass-card p-5">
                            <h2 className="mb-4 text-center">
                                <span className="text-primary-blue">Find Your </span>
                                <span className="text-accent-gold">Next Adventure</span>
                            </h2>
                            <form className="row g-3 align-items-end">
                                <div className="col-md-4">
                                    <label className="form-label small fw-bold text-uppercase text-muted">From</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-transparent border-end-0">
                                            <i className="fas fa-plane-departure text-primary-blue"></i>
                                        </span>
                                        <select className="form-select form-control-premium border-start-0"
                                            name="source" value={this.state.source} onChange={this.handleInput} required>
                                            {cities.map(city => <option key={`src-${city}`} value={city}>{city}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label small fw-bold text-uppercase text-muted">To</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-transparent border-end-0">
                                            <i className="fas fa-plane-arrival text-primary-blue"></i>
                                        </span>
                                        <select className="form-select form-control-premium border-start-0"
                                            name="destination" value={this.state.destination} onChange={this.handleInput} required>
                                            {cities.map(city => <option key={`dest-${city}`} value={city}>{city}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label small fw-bold text-uppercase text-muted">Departure Date</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-transparent border-end-0">
                                            <i className="far fa-calendar-alt text-primary-blue"></i>
                                        </span>
                                        <input className="form-control form-control-premium border-start-0"
                                            type="date" name="travelDate" value={this.state.travelDate}
                                            min={localTodayStr} onChange={this.handleInput} required />
                                    </div>
                                </div>
                                <div className="col-md-1 text-center">
                                    <button type="submit" onClick={this.getFlightsList}
                                        className="btn btn-premium w-100 d-flex align-items-center justify-content-center"
                                        style={{ height: '50px' }}>
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-12 text-center">
                        <p className="text-muted small">
                            <i className="fas fa-info-circle me-1"></i> Best prices guaranteed. Flexible bookings.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(SearchFlight);
