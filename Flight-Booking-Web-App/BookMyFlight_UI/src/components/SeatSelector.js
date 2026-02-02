import React, { useState, useEffect } from 'react';
import './SeatSelector.css';

const SeatSelector = ({ seats, maxSelectable, onSelectionChange }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        onSelectionChange(selectedSeats);
    }, [selectedSeats, onSelectionChange]);

    const toggleSeat = (seat) => {
        if (seat.isBooked) return;

        if (selectedSeats.find(s => s.seatId === seat.seatId)) {
            setSelectedSeats(selectedSeats.filter(s => s.seatId !== seat.seatId));
        } else {
            if (selectedSeats.length < maxSelectable) {
                setSelectedSeats([...selectedSeats, seat]);
            } else {
                alert(`You can only select up to ${maxSelectable} seats.`);
            }
        }
    };

    // Organize seats by row
    const rows = {};
    seats.forEach(seat => {
        const rowNum = seat.seatNumber.replace(/[A-F]/, '');
        if (!rows[rowNum]) rows[rowNum] = [];
        rows[rowNum].push(seat);
    });

    return (
        <div className="seat-selector-container p-4 rounded-4 shadow-sm bg-white animate-fade-in">
            <h4 className="mb-4 text-center">Select Your Seats ({selectedSeats.length}/{maxSelectable})</h4>

            <div className="seat-grid mb-4">
                <div className="seat-legend d-flex justify-content-center gap-4 mb-4">
                    <div className="legend-item"><span className="seat-icon available"></span> Available</div>
                    <div className="legend-item"><span className="seat-icon selected"></span> Selected</div>
                    <div className="legend-item"><span className="seat-icon booked"></span> Booked</div>
                </div>

                <div className="plane-cabin">
                    {Object.keys(rows).map(rowNum => (
                        <div key={rowNum} className="seat-row d-flex justify-content-center align-items-center mb-2">
                            <div className="row-number me-3 text-muted small fw-bold" style={{ width: '20px' }}>{rowNum}</div>
                            {rows[rowNum].map(seat => (
                                <div
                                    key={seat.seatId}
                                    className={`seat-item ${seat.isBooked ? 'booked' : ''} ${selectedSeats.find(s => s.seatId === seat.seatId) ? 'selected' : 'available'} ${seat.classType.toLowerCase()}`}
                                    onClick={() => toggleSeat(seat)}
                                    title={`${seat.seatNumber} (${seat.classType})`}
                                >
                                    {seat.seatNumber.slice(-1)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {selectedSeats.length > 0 && (
                <div className="selected-info p-3 rounded-3 bg-light border">
                    <div className="small fw-bold text-muted mb-2">SELECTED SEATS</div>
                    <div className="d-flex flex-wrap gap-2">
                        {selectedSeats.map(s => (
                            <span key={s.seatId} className="badge bg-primary-blue rounded-pill px-3 py-2">
                                {s.seatNumber} <small className="opacity-75">({s.classType})</small>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatSelector;
