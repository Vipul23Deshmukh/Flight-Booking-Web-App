import React, { Component } from 'react';
import FlightList from './FlightList';
import { withRouter } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

class FlightResults extends Component {
    constructor(props) {
        super(props);
        this.flights = this.props.location.state ? this.props.location.state.flights : [];
    }

    render() {
        const { source, destination, date } = this.props.location.state || {};

        return (
            <div className="bg-light min-vh-100">
                <Header />
                <div className="main-content container animate-fade-in pb-5">
                    {/* Search Info Banner */}
                    <div className="glass-card p-4 mb-4 border-0">
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <div className="d-flex align-items-center">
                                    <div className="me-4 border-end pe-4">
                                        <div className="small fw-bold text-muted text-uppercase mb-1">Departure</div>
                                        <h5 className="mb-0 text-primary-blue">{source || 'Any'}</h5>
                                    </div>
                                    <div className="me-4">
                                        <i className="fas fa-arrow-right text-accent-gold mx-2"></i>
                                    </div>
                                    <div className="me-4 border-end pe-4">
                                        <div className="small fw-bold text-muted text-uppercase mb-1">Arrival</div>
                                        <h5 className="mb-0 text-primary-blue">{destination || 'Any'}</h5>
                                    </div>
                                    <div>
                                        <div className="small fw-bold text-muted text-uppercase mb-1">Date</div>
                                        <h5 className="mb-0 text-primary-blue">{date || 'Selected Date'}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                <button className="btn btn-premium-outline btn-sm" onClick={() => this.props.history.push('/')}>
                                    Modify Search
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bold mb-0">Select Your Flight</h3>
                        <span className="badge bg-white text-primary-blue border shadow-sm p-2 px-3 fw-normal">
                            {this.flights.length} Flights Available
                        </span>
                    </div>

                    {this.flights && this.flights.length > 0 ? (
                        <FlightList flights={this.flights} />
                    ) : (
                        <div className="glass-card text-center py-5">
                            <div className="display-1 mb-4">✈️</div>
                            <h3 className="text-secondary-blue">No Flights Found</h3>
                            <p className="text-muted mb-4">We couldn't find any flights for this route on the selected date.</p>
                            <button className="btn btn-premium" onClick={() => this.props.history.push('/')}>
                                Back to Search
                            </button>
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        );
    }
}

export default withRouter(FlightResults);
