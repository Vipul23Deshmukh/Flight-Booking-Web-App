/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Footer from './Footer';
import Header from './Header';
import { send } from 'emailjs-com';
import BookingService from '../services/BookingService';

class Ticket extends Component {
    constructor(props) {
        super(props)
        if (!localStorage.getItem('user')) {
            this.props.history.push('/login')
        } else {
            if (localStorage.getItem('ticket') !== null) {
                this.ticket = JSON.parse(localStorage.getItem('ticket'))
                this.airplane = JSON.parse(localStorage.getItem('plane'))
            } else if (localStorage.getItem('view-ticket') !== null) {
                this.ticket = JSON.parse(localStorage.getItem('view-ticket'))
                localStorage.removeItem('view-ticket')
            }
        }
        this.passengers = this.ticket?.booking?.passengers || []
    }

    async componentDidMount() {
        if (!localStorage.getItem('user')) {
            this.props.history.push('/login')
            return;
        }

        const params = new URLSearchParams(this.props.location.search);
        const bookingId = params.get('bookingId');

        if (bookingId) {
            const service = new BookingService();
            try {
                const response = await service.getTicketByBookingId(bookingId);
                if (response.data) {
                    this.ticket = response.data;
                    this.passengers = this.ticket.booking.passengers;
                    this.forceUpdate();
                }
            } catch (err) {
                console.error("Failed to fetch specific ticket:", err);
            }
        }

        if (!this.ticket) {
            const service = new BookingService();
            try {
                const response = await service.getTickets();
                if (response.data && response.data.length > 0) {
                    const latestTicket = response.data[response.data.length - 1];
                    this.ticket = latestTicket;
                    this.passengers = latestTicket.booking.passengers;
                    this.forceUpdate();
                }
            } catch (err) {
                console.error("Failed to fetch latest ticket:", err);
            }
        }
    }

    onMail = () => {
        if (!this.ticket?.booking?.flight) {
            alert("Cannot send email: Ticket details missing.");
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));

        // Prepare template parameters
        let templateParams = {
            from_name: 'BookMyFlight',
            to_name: `${user.fname} ${user.lname || ''}`,
            to_email: user.email,
            ticket_number: this.ticket.ticketNumber,
            source: this.ticket.booking.flight.source,
            destination: this.ticket.booking.flight.destination,
            travel_date: this.ticket.booking.flight.travelDate,
            departure_time: this.ticket.booking.flight.departureTime,
            total_fare: this.ticket.total_pay,
            booking_id: this.ticket.booking.bookingId,
            reply_to: 'support@bookmyflight.com',
        }

        alert("Sending your ticket via email...");

        send(
            'service_enui0by',
            'template_xkbuxqd',
            templateParams,
            'user_yzrYhjB6DwK4wPq69r043'
        )
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                alert('Your E-Ticket has been sent to ' + user.email);
            })
            .catch((err) => {
                console.error('FAILED...', err);
                alert('Failed to send email. Please check your internet connection and try again.');
            });
    }

    handleDownloadPDF = () => {
        const input = this.componentRef;
        html2canvas(input, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff"
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
            pdf.save(`Ticket_${this.ticket.ticketNumber}.pdf`);
        });
    }

    render() {
        if (!this.ticket) {
            return (
                <div className="bg-light min-vh-100">
                    <Header />
                    <div className="main-content container text-center py-5">
                        <div className="spinner-border text-primary-blue mb-3" role="status"></div>
                        <h3>Fetching your ticket details...</h3>
                    </div>
                    <Footer />
                </div>
            )
        }

        const flight = this.ticket.booking.flight;

        return (
            <div className="bg-light min-vh-100">
                <Header />
                <div className="main-content container animate-fade-in pb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">Your E-Ticket</h2>
                        <div className="d-flex gap-2">
                            <ReactToPrint
                                trigger={() => <button className="btn btn-premium-outline"><i className="fas fa-print me-2"></i> Print</button>}
                                content={() => this.componentRef}
                            />
                            <button className="btn btn-premium-outline" onClick={this.handleDownloadPDF}>
                                <i className="fas fa-file-pdf me-2"></i> Download PDF
                            </button>
                            <button className="btn btn-premium" onClick={this.onMail}>
                                <i className="fas fa-envelope me-2"></i> Email Ticket
                            </button>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-9">
                            <div className="ticket-card bg-white rounded-4 shadow-lg overflow-hidden border-0" ref={el => this.componentRef = el}>
                                <div className="bg-nav p-4 text-white d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <i className="fas fa-plane-departure fs-3 me-3 text-accent-gold"></i>
                                        <div>
                                            <h4 className="mb-0 fw-bold">BookMyFlight</h4>
                                            <div className="small opacity-75">Electronic Boarding Pass</div>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="small opacity-75">Ticket Number</div>
                                        <div className="h5 mb-0 fw-bold">{this.ticket.ticketNumber}</div>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="row align-items-center mb-5 text-center">
                                        <div className="col-4">
                                            <div className="h1 mb-0 fw-bold text-primary-blue">{flight?.source}</div>
                                            <div className="text-muted small fw-bold">ORIGIN</div>
                                        </div>
                                        <div className="col-4 position-relative">
                                            <div className="border-bottom border-2 w-75 mx-auto mb-2"></div>
                                            <i className="fas fa-plane text-accent-gold fs-4 position-absolute top-0 start-50 translate-middle mt-1"></i>
                                            <div className="badge bg-light text-primary-blue border small">{flight?.flightNumber}</div>
                                        </div>
                                        <div className="col-4">
                                            <div className="h1 mb-0 fw-bold text-primary-blue">{flight?.destination}</div>
                                            <div className="text-muted small fw-bold">DESTINATION</div>
                                        </div>
                                    </div>

                                    <div className="row g-4 mb-5">
                                        <div className="col-md-3 col-6">
                                            <div className="small text-muted text-uppercase fw-bold mb-1">Date</div>
                                            <div className="fw-bold">{flight?.travelDate}</div>
                                        </div>
                                        <div className="col-md-3 col-6">
                                            <div className="small text-muted text-uppercase fw-bold mb-1">Departure</div>
                                            <div className="fw-bold">{flight?.departureTime}</div>
                                        </div>
                                        <div className="col-md-3 col-6">
                                            <div className="small text-muted text-uppercase fw-bold mb-1">Gate</div>
                                            <div className="fw-bold">G-12</div>
                                        </div>
                                        <div className="col-md-3 col-6">
                                            <div className="small text-muted text-uppercase fw-bold mb-1">Class</div>
                                            <div className="fw-bold">Economy</div>
                                        </div>
                                    </div>

                                    <div className="border-top border-bottom py-4 mb-5">
                                        <h6 className="text-muted text-uppercase fw-bold mb-3 small">Passenger Information</h6>
                                        <div className="table-responsive">
                                            <table className="table table-sm table-borderless mb-0">
                                                <thead>
                                                    <tr className="small text-muted">
                                                        <th>NAME</th>
                                                        <th>AGE</th>
                                                        <th>GENDER</th>
                                                        <th>SEAT</th>
                                                        <th>STATUS</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.passengers.map((p, idx) => (
                                                        <tr key={idx} className="fw-bold">
                                                            <td>{p.pname}</td>
                                                            <td>{p.age}</td>
                                                            <td>{p.gender}</td>
                                                            <td>{p.seatNumber || 'N/A'}</td>
                                                            <td className="text-success"><i className="fas fa-check-circle me-1"></i> Confirmed</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-end">
                                        <div>
                                            <div className="small text-muted mb-1">Total Fare Paid</div>
                                            <div className="h3 mb-0 fw-bold text-primary-blue">₹{this.ticket.total_pay}</div>
                                        </div>
                                        <div className="text-end">
                                            <div className="barcode-placeholder bg-light rounded p-2 mb-2 d-inline-block">
                                                <i className="fas fa-barcode fs-1 text-dark"></i>
                                            </div>
                                            <div className="small text-muted font-monospace">{this.ticket.booking.bookingId}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-light p-3 text-center border-top">
                                    <span className="small text-muted"><i className="fas fa-info-circle me-1"></i> Please carry a valid Photo ID and arrive at least 2 hours before departure.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default withRouter(Ticket);
