import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import logo from '../assets/logo/travelling.png';

/**
 * 
 * 
 * This component renders header and uses condition rendering for differnt users/ non user
 */
function Header(props) {
    const history = useHistory();
    const flightuser = localStorage.getItem('user');

    /** The component will be rendered when user has not signed in */
    const loggedIn = (

        <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
                <Link className="nav-link nav-link-premium" to="/">Home</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link nav-link-premium" to="/about">About Us</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link nav-link-premium" to="/contact">Contact Us</Link>
            </li>
            <li className="nav-item ms-lg-3">
                <Link to="/login">
                    <button className="btn btn-premium-outline btn-sm">Login</button>
                </Link>
            </li>
            <li className="nav-item ms-2">
                <Link to="/register">
                    <button className="btn btn-premium btn-sm">Register</button>
                </Link>
            </li>
        </ul>

    );

    // clearing local storage for given items when user logs out
    const userClear = () => (
        localStorage.removeItem('user'),
        localStorage.removeItem('plane'),
        localStorage.removeItem('bid'),
        localStorage.removeItem('sid'),
        localStorage.removeItem('tickets'),
        localStorage.removeItem('nop'),
        localStorage.removeItem('ticket'),
        localStorage.clear()
    )

    /** Redirecting to booking history */
    const onTickets = () => {
        history.push('/tickets')
    }

    /** The component will be rendered when user is signed in */
    const loggedOut = (
        <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
                <Link className="nav-link nav-link-premium" to="/">Home</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link nav-link-premium" to="/about">About Us</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link nav-link-premium" to="/contact">Contact Us</Link>
            </li>
            {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).isadmin === 0
                &&
                <li className="nav-item">
                    <button onClick={onTickets} className="btn nav-link nav-link-premium" style={{ background: 'none', border: 'none' }}>My Bookings</button>
                </li>
            }

            {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).isadmin === 1
                &&
                <li className="nav-item">
                    <Link className="nav-link nav-link-premium" to="/addFlight">Add Flight</Link>
                </li>}

            {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).isadmin === 1
                &&
                <li className="nav-item">
                    <Link className="nav-link nav-link-premium" to="/allFlights">All Flights</Link>
                </li>
            }

            {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).isadmin === 1
                &&
                <li className="nav-item ms-lg-3">
                    <Link to="/admin">
                        <button className="btn btn-premium-outline btn-sm">Admin Panel</button>
                    </Link>
                </li>
            }

            <li className="nav-item ms-2">
                <Link to="/" onClick={userClear}>
                    <button className="btn btn-premium btn-sm">Logout</button>
                </Link>
            </li>

            {localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).isadmin === 0
                &&
                <li className="nav-item ms-3">
                    <span className="badge bg-warning text-dark p-2">
                        Welcome, {JSON.parse(localStorage.getItem('user')).username}
                    </span>
                </li>
            }
        </ul>
    );


    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark navbar-premium fixed-top">
                <div className="container">
                    <Link style={navstyle.navbar_brand} to="/">
                        <i className="fas fa-plane-departure me-2"></i> BookMyFlight
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        {localStorage.getItem('user') ? loggedOut : loggedIn}
                    </div>
                </div>
            </nav>
        </div>
    );
};

let navstyle = {
    bg: {
        background: "var(--gradient-blue)",
    },
    navbar_brand: {
        color: "#ffffff",
        fontSize: "1.5rem",
        fontWeight: "700",
        letterSpacing: "1px",
        textDecoration: "none",
        textTransform: "uppercase"
    }
}

export default Header;