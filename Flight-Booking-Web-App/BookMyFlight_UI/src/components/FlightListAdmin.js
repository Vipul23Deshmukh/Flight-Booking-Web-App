import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FlightServiceRest from '../services/FlightServiceRest';

class FlightListAdmin extends Component {
    constructor(props) {
        super(props);
        this.service = new FlightServiceRest();
        this.state = {
            flights: []
        };
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.isadmin !== 1) {
            alert('Access Denied');
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        this.getFlights();
    }

    getFlights = () => {
        this.service.getFlights().then(data => {
            if (data) this.setState({ flights: data });
        });
    }

    onDelete = (fid) => {
        if (window.confirm(`Are you sure you want to decommission Flight #${fid}?`)) {
            this.service.deleteFlight(fid).then(() => {
                this.getFlights();
            });
        }
    }

    onEdit = (flight) => {
        localStorage.setItem('flight', JSON.stringify(flight));
        this.props.history.push('/updateFlight');
    }

    render() {
        const { flights } = this.state;

        return (
            <div className="animate-fade-in">
                <div className="container py-2">
                    <div className="row mb-4 align-items-center">
                        <div className="col-md-6 text-center text-md-start">
                            <h2 className="fw-800 text-dark mb-1">Fleet Management</h2>
                            <p className="text-muted small mb-0">Overview of all active and scheduled flight services</p>
                        </div>
                        <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
                            <Link to="/addFlight" className="btn btn-primary-gold rounded-pill px-4 py-2 fw-bold" style={{ background: 'var(--accent-gold)', border: 'none' }}>
                                <i className="fas fa-plus me-2"></i>Schedule New Flight
                            </Link>
                        </div>
                    </div>

                    <div className="row g-4">
                        {flights.map(f => (
                            <div key={f.flightNumber} className="col-12 col-xl-6">
                                <div className="glass-panel p-4 h-100 position-relative animate-fade-in" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <span className="badge bg-primary px-3 py-1 rounded-pill mb-2 small">#{f.flightNumber}</span>
                                            <h4 className="fw-bold mb-0">{f.source} → {f.destination}</h4>
                                        </div>
                                        <div className="text-end">
                                            <div className="text-muted small fw-bold">FARE</div>
                                            <div className="h4 fw-800 text-primary mb-0">₹{f.price}</div>
                                        </div>
                                    </div>

                                    <div className="row g-2 mb-3">
                                        <div className="col-4 text-center border-end">
                                            <div className="text-muted small">Departure</div>
                                            <div className="fw-bold">{f.arrivalTime}</div>
                                        </div>
                                        <div className="col-4 text-center border-end">
                                            <div className="text-muted small">Date</div>
                                            <div className="fw-bold">{f.travelDate}</div>
                                        </div>
                                        <div className="col-4 text-center">
                                            <div className="text-muted small">Seats</div>
                                            <div className={`fw-bold ${f.availableSeats < 10 ? 'text-danger' : 'text-success'}`}>{f.availableSeats}</div>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2">
                                        <button className="btn btn-outline-primary flex-grow-1 fw-bold rounded-pill" onClick={() => this.onEdit(f)}>
                                            <i className="fas fa-edit me-1"></i>Modify
                                        </button>
                                        <button className="btn btn-outline-danger px-4 rounded-pill" onClick={() => this.onDelete(f.flightNumber)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default FlightListAdmin;