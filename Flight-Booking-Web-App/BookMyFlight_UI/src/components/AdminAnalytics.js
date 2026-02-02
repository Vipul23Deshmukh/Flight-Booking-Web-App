import React, { useState, useEffect } from 'react';
import FlightServiceRest from '../services/FlightServiceRest';
import BookingService from '../services/BookingService';
import UserService from '../services/UserService';

const AdminAnalytics = () => {
    const [stats, setStats] = useState({
        totalFlights: 0,
        totalBookings: 0,
        revenue: 0,
        activeUsers: 0,
        recentBookings: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const flightService = new FlightServiceRest();
        const bookingService = new BookingService();
        const userService = new UserService();

        Promise.all([
            flightService.getFlights(),
            bookingService.getAdminAllBookings(),
            userService.getAdminAllUsers()
        ]).then(([flights, bookings, users]) => {
            const rev = bookings.data?.reduce((acc, b) => acc + (b.total_pay || 0), 0) || 0;

            // Calculate Top Routes
            const routeCounts = {};
            bookings.data?.forEach(b => {
                if (b.flight) {
                    const route = `${b.flight.source} → ${b.flight.destination}`;
                    routeCounts[route] = (routeCounts[route] || 0) + 1;
                }
            });
            const topRoutes = Object.entries(routeCounts)
                .map(([route, count]) => ({ route, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            // Generate some mock historical data for the chart based on current stats
            const historicalData = Array.from({ length: 7 }, (_, i) => ({
                day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
                bookings: Math.floor(Math.random() * 20) + 10,
                revenue: Math.floor(Math.random() * 5000) + 2000
            }));

            setStats({
                totalFlights: flights?.length || 0,
                totalBookings: bookings.data?.length || 0,
                revenue: rev,
                activeUsers: users.data?.length || 0,
                recentBookings: historicalData,
                topRoutes: topRoutes
            });
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

    const cards = [
        { title: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: 'fa-wallet', color: 'bg-primary-soft', iconColor: 'text-primary' },
        { title: 'Fleet Size', value: stats.totalFlights, icon: 'fa-plane', color: 'bg-success-soft', iconColor: 'text-success' },
        { title: 'Active Bookings', value: stats.totalBookings, icon: 'fa-ticket-alt', color: 'bg-info-soft', iconColor: 'text-info' },
        { title: 'System Users', value: stats.activeUsers, icon: 'fa-users', color: 'bg-warning-soft', iconColor: 'text-warning' },
    ];

    return (
        <div className="animate-fade-in">
            {/* KPI Cards Row */}
            <div className="row g-4 mb-5">
                {cards.map((card, i) => (
                    <div key={i} className="col-md-6 col-xl-3">
                        <div className="kpi-card">
                            <div className="kpi-info">
                                <h6>{card.title}</h6>
                                <h3>{card.value}</h3>
                                <p className="small text-success mb-0 mt-2">
                                    <i className="fas fa-arrow-up me-1"></i> 12% <span className="text-muted">vs last month</span>
                                </p>
                            </div>
                            <div className={`kpi-icon ${card.color} ${card.iconColor}`}>
                                <i className={`fas ${card.icon}`}></i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="row g-4 mb-5">
                <div className="col-lg-8">
                    <div className="glass-panel">
                        <div className="panel-header">
                            <h5 className="fw-bold mb-0">Booking Volume Trends</h5>
                            <div className="dropdown">
                                <button className="btn btn-light btn-sm rounded-pill px-3">Weekly View</button>
                            </div>
                        </div>
                        <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
                            {/* Custom SVG Line Chart for Zero Dependency Performance */}
                            <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="rgba(78, 115, 223, 0.2)" />
                                        <stop offset="100%" stopColor="rgba(78, 115, 223, 0)" />
                                    </linearGradient>
                                </defs>
                                {/* Grid Lines */}
                                {[0, 1, 2, 3].map(i => (
                                    <line key={i} x1="0" y1={i * 100} x2="800" y2={i * 100} stroke="#edf2f9" strokeWidth="1" />
                                ))}
                                {/* Area Path */}
                                <path
                                    d={`M 0 300 ${stats.recentBookings.map((d, i) => `L ${(i * 800) / 6} ${300 - (d.bookings * 8)}`).join(' ')} L 800 300 Z`}
                                    fill="url(#lineGrad)"
                                />
                                {/* Line Path */}
                                <path
                                    d={`M 0 ${300 - (stats.recentBookings[0].bookings * 8)} ${stats.recentBookings.map((d, i) => `L ${(i * 800) / 6} ${300 - (d.bookings * 8)}`).join(' ')}`}
                                    fill="none" stroke="var(--admin-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                />
                                {/* Data Points */}
                                {stats.recentBookings.map((d, i) => (
                                    <circle key={i} cx={(i * 800) / 6} cy={300 - (d.bookings * 8)} r="6" fill="#fff" stroke="var(--admin-primary)" strokeWidth="3" />
                                ))}
                            </svg>
                            <div className="d-flex justify-content-between mt-3 px-2">
                                {stats.recentBookings.map((d, i) => (
                                    <span key={i} className="small text-muted fw-bold">{d.day}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="glass-panel">
                        <h5 className="fw-bold mb-4 text-center">Revenue Share</h5>
                        <div className="chart-container d-flex flex-column align-items-center justify-content-center" style={{ height: '300px' }}>
                            {/* Custom SVG Donut Chart */}
                            <svg width="200" height="200" viewBox="0 0 40 40">
                                <circle cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke="#edf2f9" strokeWidth="6" />
                                <circle cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke="var(--admin-primary)" strokeWidth="6" strokeDasharray="65 35" strokeDashoffset="25" />
                                <circle cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke="var(--admin-success)" strokeWidth="6" strokeDasharray="20 80" strokeDashoffset="-40" />
                                <circle cx="20" cy="20" r="15.91549430918954" fill="transparent" stroke="var(--admin-warning)" strokeWidth="6" strokeDasharray="15 85" strokeDashoffset="-60" />
                            </svg>
                            <div className="mt-4 w-100 px-4">
                                <div className="d-flex justify-content-between small mb-2">
                                    <span><i className="fas fa-circle text-primary me-2"></i>Domestic</span>
                                    <span className="fw-bold">65%</span>
                                </div>
                                <div className="d-flex justify-content-between small mb-2">
                                    <span><i className="fas fa-circle text-success me-2"></i>International</span>
                                    <span className="fw-bold">20%</span>
                                </div>
                                <div className="d-flex justify-content-between small">
                                    <span><i className="fas fa-circle text-warning me-2"></i>Cargo</span>
                                    <span className="fw-bold">15%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Extra Row for CSS Utility */}
            <style>{`
                .bg-primary-soft { background: rgba(78, 115, 223, 0.1); }
                .bg-success-soft { background: rgba(28, 200, 138, 0.1); }
                .bg-info-soft { background: rgba(54, 185, 204, 0.1); }
                .bg-warning-soft { background: rgba(246, 194, 62, 0.1); }
                .text-primary { color: #4e73df !important; }
                .text-success { color: #1cc88a !important; }
                .text-info { color: #36b9cc !important; }
                .text-warning { color: #f6c23e !important; }
                .x-small { font-size: 0.7rem; }
                .col-xl-2-4 { flex: 0 0 20%; max-width: 20%; }
                @media (max-width: 1200px) { .col-xl-2-4 { flex: 0 0 33.33%; max-width: 33.33%; } }
                @media (max-width: 768px) { .col-xl-2-4 { flex: 0 0 100%; max-width: 100%; } }
                .route-stat-card { background: #f8fafc; transition: all 0.2s ease; }
                .route-stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); background: white; border-color: var(--admin-primary); }
            `}</style>
        </div>
    );
};

export default AdminAnalytics;
