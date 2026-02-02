import React, { useState, useEffect } from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';
import '../assets/css/admin-dashboard.css';

const AdminSidebar = ({ collapsed, setCollapsed }) => {
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        history.push('/admin-login');
    };

    return (
        <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <Link to="/admin" className="sidebar-brand">
                    <i className="fas fa-plane-departure me-2"></i>
                    {!collapsed && <span>SKYPORT ADMIN</span>}
                </Link>
                <button
                    className="btn btn-link text-white p-0 d-none d-lg-block"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <i className={`fas ${collapsed ? 'fa-indent' : 'fa-outdent'}`}></i>
                </button>
            </div>

            <nav className="sidebar-menu">
                <p className="px-4 small text-uppercase text-white-50 fw-bold mb-2">Metrics</p>
                <NavLink to="/admin" exact className="menu-item" activeClassName="active">
                    <i className="fas fa-chart-line"></i>
                    <span>Analytics</span>
                </NavLink>

                <div className="mt-4">
                    <p className="px-4 small text-uppercase text-white-50 fw-bold mb-2">Management</p>
                    <NavLink to="/admin/flights" className="menu-item" activeClassName="active">
                        <i className="fas fa-route"></i>
                        <span>Flight Inventory</span>
                    </NavLink>
                    <NavLink to="/admin-bookings" className="menu-item" activeClassName="active">
                        <i className="fas fa-ticket-alt"></i>
                        <span>Reservations</span>
                    </NavLink>
                    <NavLink to="/admin-users" className="menu-item" activeClassName="active">
                        <i className="fas fa-users-cog"></i>
                        <span>Registered Users</span>
                    </NavLink>
                </div>

                <div className="mt-4">
                    <p className="px-4 small text-uppercase text-white-50 fw-bold mb-2">Operations</p>
                    <NavLink to="/addFlight" className="menu-item" activeClassName="active">
                        <i className="fas fa-plus-circle"></i>
                        <span>Schedule Flight</span>
                    </NavLink>
                </div>
            </nav>

            <div className="sidebar-footer p-4 border-top border-white-10">
                <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary-blue rounded-circle p-2 me-2" style={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-user-shield text-white small"></i>
                    </div>
                    {!collapsed && (
                        <div className="small overflow-hidden">
                            <div className="fw-bold truncate">{user?.fname || 'Admin'}</div>
                            <div className="text-white-50 x-small">System Manager</div>
                        </div>
                    )}
                </div>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm w-100 rounded-pill">
                    <i className="fas fa-sign-out-alt me-1"></i> {!collapsed && 'Sign Out'}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
