import React, { useState, useEffect } from 'react';
import FlightServiceRest from '../services/FlightServiceRest';

const FlightManagement = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingFid, setEditingFid] = useState(null);
    const [editData, setEditData] = useState({});

    const service = new FlightServiceRest();

    useEffect(() => {
        loadFlights();
    }, []);

    const loadFlights = () => {
        service.getFlights().then(data => {
            setFlights(data || []);
            setLoading(false);
        });
    };

    const handleToggleStatus = (fid, currentStatus) => {
        const newStatus = currentStatus === 0 ? 1 : 0;
        service.updateFlightStatus(fid, newStatus).then(() => {
            loadFlights();
        });
    };

    const startEdit = (flight) => {
        setEditingFid(flight.flightNumber);
        setEditData({ ...flight });
    };

    const saveEdit = () => {
        service.updateFlight(editData).then(() => {
            setEditingFid(null);
            loadFlights();
        });
    };

    const filteredFlights = flights.filter(f =>
        f.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.flightNumber.toString().includes(searchTerm)
    );

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="glass-panel animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <h5 className="fw-bold mb-0">Active Fleet Inventory</h5>
                <div className="d-flex gap-2">
                    <div className="input-group input-group-sm" style={{ width: '250px' }}>
                        <span className="input-group-text bg-light border-0"><i className="fas fa-search"></i></span>
                        <input
                            type="text"
                            className="form-control border-0 bg-light"
                            placeholder="Filter by route or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary-blue btn-sm rounded-pill px-3" onClick={loadFlights}>
                        <i className="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr className="header-row">
                            <th className="ps-4">Flight ID</th>
                            <th>Route</th>
                            <th>Schedule</th>
                            <th>Inventory</th>
                            <th>Fare</th>
                            <th>Status</th>
                            <th className="text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFlights.map(f => (
                            <tr key={f.flightNumber}>
                                <td className="ps-4">
                                    <span className="fw-bold text-primary">#FL-{f.flightNumber}</span>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <div className="fw-bold">{f.source}</div>
                                        <i className="fas fa-arrow-right mx-2 text-muted x-small"></i>
                                        <div className="fw-bold">{f.destination}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="small fw-bold">{f.travelDate}</div>
                                    <div className="text-muted x-small">{f.arrivalTime} Depart</div>
                                </td>
                                <td>
                                    {editingFid === f.flightNumber ? (
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            value={editData.availableSeats}
                                            onChange={(e) => setEditData({ ...editData, availableSeats: e.target.value })}
                                            style={{ width: '80px' }}
                                        />
                                    ) : (
                                        <div className={`fw-bold ${f.availableSeats < 15 ? 'text-danger' : 'text-success'}`}>
                                            {f.availableSeats} Available
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {editingFid === f.flightNumber ? (
                                        <div className="input-group input-group-sm" style={{ width: '100px' }}>
                                            <span className="input-group-text">₹</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={editData.price}
                                                onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                                            />
                                        </div>
                                    ) : (
                                        <div className="fw-bold text-dark">₹{f.price}</div>
                                    )}
                                </td>
                                <td>
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={f.isactive !== 0}
                                            onChange={() => handleToggleStatus(f.flightNumber, f.isactive)}
                                        />
                                        <span className={`status-badge ${f.isactive === 0 ? 'status-inactive' : 'status-active'}`}>
                                            {f.isactive === 0 ? 'Suspended' : 'Scheduled'}
                                        </span>
                                    </div>
                                </td>
                                <td className="text-end pe-4">
                                    {editingFid === f.flightNumber ? (
                                        <div className="d-flex justify-content-end gap-2">
                                            <button className="btn btn-success btn-sm rounded-pill" onClick={saveEdit}>
                                                <i className="fas fa-check"></i>
                                            </button>
                                            <button className="btn btn-light btn-sm rounded-pill" onClick={() => setEditingFid(null)}>
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="d-flex justify-content-end gap-2">
                                            <button className="btn btn-light btn-sm rounded-circle action-btn" title="Edit Data" onClick={() => startEdit(f)}>
                                                <i className="fas fa-pen text-primary"></i>
                                            </button>
                                            <button className="btn btn-light btn-sm rounded-circle action-btn" title="Delete Flight"
                                                onClick={() => { if (window.confirm('Decommission this flight?')) service.deleteFlight(f.flightNumber).then(loadFlights) }}>
                                                <i className="fas fa-trash-alt text-danger"></i>
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
                <p className="text-muted small mb-0">Showing {filteredFlights.length} of {flights.length} total flights</p>
                <nav>
                    <ul className="pagination pagination-sm mb-0">
                        <li className="page-item disabled"><span className="page-link rounded-start">Prev</span></li>
                        <li className="page-item active"><span className="page-link">1</span></li>
                        <li className="page-item"><span className="page-link rounded-end">Next</span></li>
                    </ul>
                </nav>
            </div>

            <style>{`
                .action-btn { width: 32px; height: 32px; display: flex; alignItems: center; justifyContent: center; }
                .action-btn:hover { background: #eee; }
                .form-check-input:checked { background-color: var(--admin-success); border-color: var(--admin-success); }
                .truncate { max-width: 100px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            `}</style>
        </div>
    );
};

export default FlightManagement;
