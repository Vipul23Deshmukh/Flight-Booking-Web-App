import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const AdminDashboard = (props) => {
    const history = useHistory();

    const checkAdmin = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.isadmin !== 1) {
            alert('Admin access required');
            history.push('/admin-login');
            return false;
        }
        return true;
    };

    if (!checkAdmin()) return null;

    const adminActions = [
        { title: 'Add New Flight', icon: 'fa-plane-arrival', link: '/addFlight', color: 'bg-primary', desc: 'Schedule a new flight route' },
        { title: 'Manage Flights', icon: 'fa-list-ul', link: '/allFlights', color: 'bg-success', desc: 'Edit, update or cancel flights' },
        { title: 'View All Bookings', icon: 'fa-ticket-alt', link: '/admin-bookings', color: 'bg-info', desc: 'Monitor system-wide reservations' },
        { title: 'System Users', icon: 'fa-users-cog', link: '/admin-users', color: 'bg-warning', desc: 'View registered passenger data' },
    ];

    return (
        <div className="pt-5 bg-light min-vh-100">
            <Header />
            <div className="container py-5 mt-4">
                <div className="row mb-5 align-items-end">
                    <div className="col-md-8">
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 mb-3">Administrator Portal</span>
                        <h1 className="fw-800 text-dark mb-0">Control Center</h1>
                        <p className="text-muted mt-2 fs-5">Manage your airline operations and system integrity from one central hub.</p>
                    </div>
                    <div className="col-md-4 text-md-end">
                        <div className="d-inline-flex align-items-center bg-white p-3 rounded-4 shadow-sm border border-light">
                            <div className="bg-success rounded-circle p-2 me-3 animate-pulse"></div>
                            <div className="text-start">
                                <small className="text-muted d-block fw-bold">System Status</small>
                                <span className="fw-bold">Operational</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-5">
                    {adminActions.map((action, index) => (
                        <div key={index} className="col-md-6 col-lg-3">
                            <Link to={action.link} className="text-decoration-none h-100">
                                <div className="admin-card glass-card h-100 p-4 d-flex flex-column transition-transform">
                                    <div className={`${action.color} text-white rounded-4 p-3 d-inline-block mb-4 shadow-sm`}>
                                        <i className={`fas ${action.icon} fa-2x`}></i>
                                    </div>
                                    <h4 className="fw-bold text-dark mb-2">{action.title}</h4>
                                    <p className="text-muted small mb-4 flex-grow-1">{action.desc}</p>
                                    <div className="mt-auto d-flex align-items-center text-primary fw-bold small">
                                        Access Feature <i className="fas fa-chevron-right ms-2 fs-xs"></i>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="glass-card p-5 border-start border-5 border-warning shadow-sm">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h3 className="fw-bold mb-2">Security Audit Required?</h3>
                            <p className="text-muted mb-md-0">Review the latest system activity and ensure all protocol checks are passing for today's departures.</p>
                        </div>
                        <div className="col-md-4 text-md-end">
                            <button className="btn btn-dark px-4 py-2 rounded-pill fw-bold">Generate Audit Report</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <style>{`
                .admin-card { 
                    border: 2px solid transparent;
                    background: white;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .admin-card:hover {
                    border-color: var(--primary-blue);
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0, 45, 102, 0.1);
                }
                .transition-transform { transition: transform 0.3s; }
                .animate-pulse {
                    box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.4);
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(25, 135, 84, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0); }
                }
                .bg-primary-subtle { background-color: rgba(0, 45, 102, 0.1) !important; }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
