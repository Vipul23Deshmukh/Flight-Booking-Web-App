/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import BookingService from '../services/BookingService';
import Footer from './Footer';
import Header from './Header';

class Passengers extends Component {
    constructor(props) {
        super(props)
        if (!localStorage.getItem('user')) {
            this.props.history.push('/login')
        } else {
            this.service = new BookingService();
            this.values = []
            this.state = {
                npsgn: parseInt(localStorage.getItem("nop") || "0"),
                pname: '',
                gen: ['Select', 'Male', 'Female', 'Other'],
                gender: '',
                age: '',
                id: 1,
                btn: false,
                info: false,
                selectedSeats: JSON.parse(localStorage.getItem("selectedSeats") || "[]")
            }
        }
    }

    handleClick = (event, idx) => {
        event.preventDefault();
        const row = event.target.closest("tr");
        if (!row.closest("form").reportValidity()) return;

        const pnameInput = row.querySelector('input[name="pname"]');
        const genderSelect = row.querySelector('select[name="gender"]');
        const ageInput = row.querySelector('input[name="age"]');

        const pname = pnameInput.value;
        const gender = genderSelect.value;
        const age = ageInput.value;

        if (gender === "Select") {
            alert("Please select a gender");
            return;
        }

        const seat = this.state.selectedSeats[this.values.length];

        this.values.push({
            "id": this.state.id++,
            "pname": pname,
            "gender": gender,
            "age": age,
            "seatNumber": seat ? seat.seatNumber : null
        })
        this.setState({ info: true, lastAddedPname: pname })

        if (this.values.length === this.state.npsgn) {
            this.setState({ btn: true })
        }

        event.target.disabled = true;
        event.target.innerHTML = '<i class="fas fa-check me-1"></i> Added';
        event.target.className = "btn btn-success btn-sm w-100";
        pnameInput.readOnly = true;
        genderSelect.disabled = true;
        ageInput.readOnly = true;
        row.style.opacity = '0.7';
        row.style.backgroundColor = '#f8f9fa';
    }

    savePassenger = (e) => {
        e.preventDefault();
        if (!e.target.closest("form").reportValidity()) return;

        localStorage.setItem('sid', JSON.stringify(this.values))
        this.service.addPassengers({ "pass1": this.values })
        this.props.history.push('/summary')
    }

    render() {
        if (!localStorage.getItem('user')) return null;

        const fieldsArray = [];
        for (let i = 0; i < this.state.npsgn; i++) {
            fieldsArray.push(
                <tr key={i} className="align-middle">
                    <td style={{ width: '40%' }}>
                        <input className="form-control form-control-premium"
                            type='text' name='pname' required pattern="[A-Za-z ]+"
                            title="Name should only contain alphabets and spaces"
                            placeholder="Full Name"
                            onChange={() => this.setState({ info: false })} />
                    </td>
                    <td className="text-center">
                        <span className="badge bg-primary-blue-outline text-primary-blue">
                            {this.state.selectedSeats[i] ? this.state.selectedSeats[i].seatNumber : 'TBD'}
                        </span>
                    </td>
                    <td style={{ width: '25%' }}>
                        <select className="form-select form-control-premium" name='gender' required>
                            {this.state.gen.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </td>
                    <td style={{ width: '15%' }}>
                        <input className="form-control form-control-premium"
                            type='number' name='age' required min="5" max="110" placeholder="Age" />
                    </td>
                    <td style={{ width: '20%' }} className="text-center">
                        <button disabled={this.state.btn} className="btn btn-premium-outline btn-sm w-100"
                            onClick={(e) => this.handleClick(e, i)}>
                            Add Details
                        </button>
                    </td>
                </tr>
            );
        }

        return (
            <div className="bg-light min-vh-100">
                <Header />
                <div className="main-content container animate-fade-in pb-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="glass-card p-5 border-0">
                                <div className="text-center mb-5">
                                    <h2 className="fw-bold mb-2">Passenger Information</h2>
                                    <p className="text-muted">Please provide the details for all {this.state.npsgn} passengers traveling.</p>
                                </div>

                                {this.state.info && (
                                    <div className="alert alert-success border-0 shadow-sm mb-4 animate-fade-in d-flex align-items-center">
                                        <i className="fas fa-check-circle me-2 fs-5"></i>
                                        <span><strong>Success!</strong> Passenger <strong>{this.state.lastAddedPname}</strong> information captured.</span>
                                    </div>
                                )}

                                <div className="p-4 bg-white rounded-3 shadow-sm border mb-4">
                                    <form>
                                        <div className="table-responsive">
                                            <table className="table table-borderless">
                                                <thead>
                                                    <tr className="text-uppercase small fw-bold text-muted border-bottom">
                                                        <th className="pb-3 px-0">Passenger Name</th>
                                                        <th className="pb-3 px-0 text-center">Seat</th>
                                                        <th className="pb-3 px-0">Gender</th>
                                                        <th className="pb-3 px-0">Age</th>
                                                        <th className="pb-3 px-0 text-center">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {fieldsArray}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="d-flex align-items-center mt-4 p-3 bg-light rounded-3">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="terms" required />
                                                <label className="form-check-label small" htmlFor="terms">
                                                    I agree to the <a href="#" data-bs-toggle="modal" data-bs-target="#termsModal" className="text-primary-blue fw-bold text-decoration-none">Terms and Conditions</a> and COVID-19 health protocols.
                                                </label>
                                            </div>
                                        </div>

                                        <div className="mt-5 text-center">
                                            <button onClick={this.savePassenger} type="submit"
                                                disabled={!this.state.btn}
                                                className={`btn btn-premium px-5 py-3 ${!this.state.btn ? 'opacity-50' : ''}`}>
                                                Proceed to Booking Summary
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Terms Modal */}
                    <div className="modal fade" id="termsModal" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                                <div className="modal-header bg-nav text-white border-0 py-3">
                                    <h5 className="modal-title fw-bold">Post COVID-19 Carriage Rules</h5>
                                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                </div>
                                <div className="modal-body p-4">
                                    <div className="mb-3 d-flex">
                                        <i className="fas fa-info-circle text-primary-blue mt-1 me-3"></i>
                                        <p className="mb-0">Vulnerable persons (elderly, pregnant, etc.) are advised to avoid travel per GOI directives.</p>
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <i className="fas fa-shield-virus text-primary-blue mt-1 me-3"></i>
                                        <p className="mb-0">Suitable PPE and face masks are mandatory at all times in the airport terminal.</p>
                                    </div>
                                    <div className="mb-3 d-flex">
                                        <i className="fas fa-arrows-alt-h text-primary-blue mt-1 me-3"></i>
                                        <p className="mb-0">Maintain social distancing norms throughout the airport premises.</p>
                                    </div>
                                    <div className="d-flex border-top pt-3 mt-3">
                                        <i className="fas fa-exclamation-triangle text-danger mt-1 me-3"></i>
                                        <p className="mb-0 small text-muted">Airlines reserve the right to debar passengers showing any COVID-19 symptoms.</p>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-3 bg-light">
                                    <button type="button" className="btn btn-secondary px-4" data-bs-dismiss="modal">I Understand</button>
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

export default Passengers;
