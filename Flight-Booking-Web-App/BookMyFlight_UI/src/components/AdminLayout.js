import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import Header from './Header';
import Footer from './Footer';

const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 992;
            setIsMobile(mobile);
            if (mobile) setCollapsed(true);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.isadmin !== 1) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center p-5 glass-card">
                    <i className="fas fa-lock fa-4x text-danger mb-4"></i>
                    <h3>Access Denied</h3>
                    <p className="text-muted">Administrator privileges are required to view this portal.</p>
                    <a href="/admin-login" className="btn btn-primary-blue rounded-pill px-4">Login as Admin</a>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <main className={`admin-main ${collapsed ? 'expanded' : ''}`}>
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-light">
                    <div>
                        <h4 className="fw-800 text-dark mb-1">Skyport Fleet Control</h4>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb small mb-0">
                                <li className="breadcrumb-item"><a href="/admin" className="text-decoration-none">Dashboard</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Overview</li>
                            </ol>
                        </nav>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <div className="position-relative d-none d-md-block">
                            <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                            <input type="text" className="form-control form-control-sm rounded-pill ps-5 border-0 shadow-sm" placeholder="Global search..." style={{ width: '240px' }} />
                        </div>
                        <button className="btn btn-light btn-sm rounded-circle position-relative">
                            <i className="fas fa-bell"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ padding: '3px' }}> </span>
                        </button>
                    </div>
                </div>

                {children}

                <footer className="mt-5 pt-4 border-top text-center text-muted small">
                    <p>&copy; 2026 Skyport Air Reservations. Enterprise Management System v2.0</p>
                </footer>
            </main>
        </div>
    );
};

export default AdminLayout;
