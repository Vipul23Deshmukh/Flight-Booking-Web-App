import React from 'react';

/**
 *
 * This component renders Footer 
 */
const Footer = () => {
    return (
        <footer className="footer py-5 mt-auto" style={{ background: 'var(--secondary-blue)', color: 'white' }}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        <h5 className="fw-bold mb-1">BookMyFlight</h5>
                        <p className="text-white-50 small mb-0">&copy; 2026 Flight Reservation System. All rights reserved.</p>
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <div className="footer-links">
                            <a href="/about" className="text-white-50 text-decoration-none me-3 hover-white transition">About</a>
                            <a href="/contact" className="text-white-50 text-decoration-none me-3 hover-white transition">Contact</a>
                            <a href="/admin-login" className="btn btn-outline-light btn-sm rounded-pill px-3 py-1 opacity-75 hover-opacity-100 transition">
                                <i className="fas fa-user-shield me-2"></i>Admin Portal
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

let footerStyle = {
    bg: {
        background: "var(--secondary-blue)",
        borderTop: "1px solid rgba(255,255,255,0.1)"
    }
}

export default Footer;