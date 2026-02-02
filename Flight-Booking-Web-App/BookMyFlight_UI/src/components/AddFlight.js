import React from 'react';
import { Link } from 'react-router-dom';
import FlightServiceRest from '../services/FlightServiceRest';

class AddFlight extends React.Component {
    constructor(props) {
        super(props);
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.isadmin !== 1) {
            alert('Admin access required');
            this.props.history.push('/admin-login');
        } else {
            this.service = new FlightServiceRest();
            this.state = {
                source: "Chennai",
                destination: "Delhi",
                travelDate: "",
                arrivalTime: "",
                departureTime: "",
                price: 0,
                availableSeats: 0
            }
        }
    }

    handleInput = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    onSave = (e) => {
        e.preventDefault();
        this.service.saveFlight(this.state).then(() => {
            alert("Flight successfully scheduled");
            this.props.history.push('/allFlights');
        });
    }

    render() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.isadmin !== 1) return null;

        const cities = ["Chennai", "Delhi", "Mumbai", "Kolkata", "Goa", "Pune", "Jaipur", "Bangalore", "Cochin", "Ahmadabad"];

        return (
            <div className="animate-fade-in">
                <div className="container py-2">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="glass-card overflow-hidden shadow-lg border-0 animate-fade-in">
                                <div className="p-5 bg-navy-gradient text-white">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-white-20 p-3 rounded-4 me-4">
                                            <i className="fas fa-plane-departure fa-2x"></i>
                                        </div>
                                        <div>
                                            <h2 className="fw-800 mb-1 text-white">Schedule New Flight</h2>
                                            <p className="mb-0 text-white-50">Enter flight route and technical details</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 bg-white">
                                    <form onSubmit={this.onSave}>
                                        <div className="row g-4 mb-4">
                                            <div className="col-md-6">
                                                <label className="premium-label small fw-bold text-muted mb-2 d-block">Departure City</label>
                                                <select className="form-select premium-select py-3" name="source" value={this.state.source} onChange={this.handleInput} required>
                                                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="premium-label small fw-bold text-muted mb-2 d-block">Arrival City</label>
                                                <select className="form-select premium-select py-3" name="destination" value={this.state.destination} onChange={this.handleInput} required>
                                                    {cities.map(city => <option key={city} value={city}>{city}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row g-4 mb-4">
                                            <div className="col-md-4">
                                                <label className="premium-label small fw-bold text-muted mb-2 d-block">Travel Date</label>
                                                <input type="date" className="form-control premium-control py-3" name="travelDate" value={this.state.travelDate} onChange={this.handleInput} required />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="premium-label small fw-bold text-muted mb-2 d-block">Takeoff</label>
                                                <input type="time" className="form-control premium-control py-3" name="arrivalTime" value={this.state.arrivalTime} onChange={this.handleInput} required />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="premium-label small fw-bold text-muted mb-2 d-block">Landing</label>
                                                <input type="time" className="form-control premium-control py-3" name="departureTime" value={this.state.departureTime} onChange={this.handleInput} required />
                                            </div>
                                        </div>

                                        <div className="row g-4 mb-5">
                                            <div className="col-md-6">
                                                <label className="premium-label small fw-bold text-muted mb-2 d-block">Base Fare (₹)</label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-0 px-4">₹</span>
                                                    <input type="number" className="form-control premium-control py-3" name="price" value={this.state.price} onChange={this.handleInput} required min="1" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="premium-label small fw-bold text-muted mb-2 d-block">Seat Capacity</label>
                                                <input type="number" className="form-control premium-control py-3" name="availableSeats" value={this.state.availableSeats} onChange={this.handleInput} required min="1" />
                                            </div>
                                        </div>

                                        <div className="d-flex gap-3 pt-3 border-top mt-4">
                                            <button type="submit" className="btn btn-primary-blue btn-lg px-5 py-3 rounded-pill fw-bold">Schedule Flight</button>
                                            <button type="reset" className="btn btn-outline-secondary btn-lg px-5 py-3 rounded-pill fw-bold" onClick={() => this.setState({ source: "Chennai", destination: "Delhi", travelDate: "", arrivalTime: "", departureTime: "", price: 0, availableSeats: 0 })}>Reset</button>
                                            <Link to="/admin" className="btn btn-link ms-auto text-decoration-none text-muted fw-bold">Cancel</Link>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddFlight;
