import React from 'react';
import Header from './Header';
import Footer from './Footer';
import planetravel from "../assets/images/travel.jpg";

const ContactUs = () => {
    return (
        <div className="pt-5">
            <Header />
            <div className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="container mt-5">
                    <div className="row shadow-lg rounded-lg overflow-hidden bg-white">
                        <div className="col-md-6 p-0 d-none d-md-block">
                            <img src={planetravel} alt="Contact" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div className="col-md-6 p-5">
                            <h2 className="mb-4 fw-bold text-primary">Get In Touch</h2>
                            <p className="text-muted mb-4">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (e.target.reportValidity()) {
                                    alert('Message Sent Successfully!');
                                }
                            }}>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-control" name="name" required placeholder="Your Name" pattern="[A-Za-z ]+" title="Name should only contain alphabets and spaces" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" name="email" required placeholder="email@example.com" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Message</label>
                                    <textarea className="form-control" name="message" required rows="4" placeholder="How can we help?"></textarea>
                                </div>
                                <div className="d-grid shadow-sm">
                                    <button type="submit" className="btn btn-primary btn-lg">Send Message</button>
                                </div>
                            </form>

                            <div className="mt-5 pt-3 border-top">
                                <div className="row text-center">
                                    <div className="col-4">
                                        <div className="fw-bold text-primary">Email</div>
                                        <small className="text-muted">patilyashoda.2004@gmail.com</small>
                                    </div>
                                    <div className="col-4 border-start border-end">
                                        <div className="fw-bold text-primary">Phone</div>
                                        <small className="text-muted">+1 234 567 890</small>
                                    </div>
                                    <div className="col-4">
                                        <div className="fw-bold text-primary">Office</div>
                                        <small className="text-muted">New York, NY</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactUs;
