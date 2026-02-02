import React from 'react';
import { withRouter } from 'react-router-dom';

class FlightList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            flights: null
        }
    }

    componentDidMount() {
        this.setState({
            flights: this.props.flights
        });
    }

    calculateDuration = (f) => {
        let t1 = new Date('1970-01-01T' + f.departureTime + 'Z')
        let t2 = new Date('1970-01-01T' + f.arrivalTime + 'Z')
        let hour = t2.getUTCHours() - t1.getUTCHours()
        let min = t2.getUTCMinutes() - t1.getUTCMinutes()

        if (hour < 0) hour = 12 + hour;
        if (min < 0) min = 60 + min;

        return `${hour}hr ${min}min`;
    }

    handleFlight = (flight) => {
        localStorage.setItem('plane', JSON.stringify(flight));
        this.props.history.push('/booking');
    }

    render() {
        if (!this.state.flights) return null;

        const flightlist = this.state.flights.map(f => {
            return (
                <div key={f.flightId} className="glass-card mb-4 overflow-hidden border-0 shadow-sm">
                    <div className="row g-0 align-items-center">
                        <div className="col-md-2 p-4 text-center border-md-end bg-light d-flex flex-column justify-content-center">
                            <i className="fas fa-plane fa-3x text-primary-blue mb-2"></i>
                            <div className="fw-bold text-uppercase small text-muted">Flight</div>
                            <div className="fw-bold text-primary-blue">{f.flightNumber}</div>
                        </div>
                        <div className="col-md-7 p-4">
                            <div className="row align-items-center text-center">
                                <div className="col-4">
                                    <h4 className="mb-0 fw-bold">{f.departureTime.substring(0, 5)}</h4>
                                    <p className="text-muted small mb-0">{f.source}</p>
                                </div>
                                <div className="col-4 position-relative">
                                    <div className="small text-muted mb-1">{this.calculateDuration(f)}</div>
                                    <div className="d-flex align-items-center">
                                        <div className="flex-grow-1 border-top"></div>
                                        <i className="fas fa-plane mx-2 text-accent-gold" style={{ fontSize: '0.8rem' }}></i>
                                        <div className="flex-grow-1 border-top"></div>
                                    </div>
                                    <div className="small text-uppercase mt-1" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>Non-stop</div>
                                </div>
                                <div className="col-4">
                                    <h4 className="mb-0 fw-bold">{f.arrivalTime.substring(0, 5)}</h4>
                                    <p className="text-muted small mb-0">{f.destination}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 p-4 bg-light border-md-start text-center">
                            <div className="small text-muted text-uppercase mb-1">Price per adult</div>
                            <h3 className="fw-bold text-primary-blue mb-3">₹{f.price}</h3>
                            <div className="mb-3">
                                <span className={`badge ${f.availableSeats < 10 ? 'bg-danger' : 'bg-success'} rounded-pill px-3`}>
                                    {f.availableSeats} Seats Left
                                </span>
                            </div>
                            <button className="btn btn-premium w-100" onClick={() => this.handleFlight(f)}>
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            )
        });

        return (
            <div className="animate-fade-in">
                {flightlist}
            </div>
        );
    }
}

export default withRouter(FlightList);
