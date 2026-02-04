import React, { Component } from 'react';
import UserService from '../services/UserService';
import planeBG from "../assets/images/planebg1.jpg";
import Footer from './Footer';
import Header from './Header';

export default class AdminLogin extends Component {
    constructor(props) {
        super(props);
        this.service = new UserService();
        this.state = {
            username: "",
            password: "",
            errormsg: "",
            isLoading: false
        }
    }

    validateAdmin = (e) => {
        e.preventDefault();
        this.setState({ isLoading: true, errormsg: "" });

        this.service.validateUser(this.state.username, this.state.password)
            .then(response => {
                if (response.status === 200 && response.data) {
                    // Support both camelCase and PascalCase just in case
                    const token = response.data.token || response.data.Token;
                    const user = response.data.user || response.data.User;

                    if (user && (user.isadmin === 1 || user.Isadmin === 1)) {
                        localStorage.setItem('token', token);
                        localStorage.setItem('user', JSON.stringify(user));
                        this.props.history.push('/admin');
                    } else if (user) {
                        this.setState({
                            errormsg: 'Access Denied: You do not have administrator privileges.',
                            isLoading: false
                        });
                    } else {
                        throw new Error("Invalid response format: Missing user data");
                    }
                }
            })
            .catch(error => {
                console.error("Login detail error:", error);
                const message = error.response?.data?.message || error.response?.data || error.message;
                this.setState({
                    errormsg: (message === "Unauthorized" || error.response?.status === 401)
                        ? 'Invalid admin credentials.'
                        : `Login error: ${message}`,
                    password: "",
                    isLoading: false
                });
            });
    }

    render() {
        return (
            <div className='pt-5'>
                <Header />
                <div className="py-5 bg-navy-gradient min-vh-100 d-flex align-items-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,51,0.8), rgba(0,0,51,0.8)), url(${planeBG})`, backgroundSize: 'cover' }}>
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-5">
                                <div className="glass-card p-5 animate-fade-in text-white">
                                    <div className="text-center mb-5">
                                        <div className="admin-icon-box mx-auto mb-3">
                                            <i className="fas fa-user-shield fa-3x"></i>
                                        </div>
                                        <h2 className="fw-bold mb-1">Admin Central</h2>
                                        <p className="text-white-50">Authorized Personnel Only</p>
                                    </div>

                                    <form onSubmit={this.validateAdmin}>
                                        <div className="form-group mb-4">
                                            <label className="text-white-50 small text-uppercase fw-bold mb-2">Admin Username</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-transparent border-white-20 text-white">
                                                    <i className="fas fa-user"></i>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control bg-transparent border-white-20 text-white placeholder-white-50"
                                                    placeholder="Enter username"
                                                    required
                                                    value={this.state.username}
                                                    onChange={e => this.setState({ username: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group mb-5">
                                            <label className="text-white-50 small text-uppercase fw-bold mb-2">Admin Password</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-transparent border-white-20 text-white">
                                                    <i className="fas fa-lock"></i>
                                                </span>
                                                <input
                                                    type="password"
                                                    className="form-control bg-transparent border-white-20 text-white placeholder-white-50"
                                                    placeholder="Enter password"
                                                    required
                                                    value={this.state.password}
                                                    onChange={e => this.setState({ password: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit" // Keep type="submit" to trigger form's onSubmit
                                            className="btn btn-navy-premium btn-block py-3 fw-bold text-uppercase shadow-lg transition-all"
                                            disabled={this.state.isLoading}
                                            style={{
                                                background: '#00264d',
                                                color: '#ffc107',
                                                border: '2px solid #ffc107',
                                                borderRadius: '12px',
                                                letterSpacing: '1.5px',
                                                boxShadow: '0 8px 16px rgba(0,38,77,0.25)',
                                                fontSize: '1.1rem'
                                            }}
                                        >
                                            {this.state.isLoading ?
                                                <span><i className="fas fa-spinner fa-spin me-2"></i>Verifying...</span> :
                                                <span><i className="fas fa-lock me-2"></i>Admin Secure Login</span>
                                            }
                                        </button>

                                        {this.state.errormsg && (
                                            <div className="alert alert-danger-glass mt-4 mb-0 text-center animate-shake">
                                                <i className="fas fa-exclamation-circle me-2"></i> {this.state.errormsg}
                                            </div>
                                        )}
                                    </form>
                                </div>
                                <p className="text-center mt-4 text-white-50 small">
                                    Return to <a href="/login" className="text-gold text-decoration-none fw-bold">User Login</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
                <style>{`
                    .bg-navy-gradient { background: linear-gradient(135deg, #001a3d 0%, #000033 100%); }
                    .border-white-20 { border-color: rgba(255,255,255,0.2) !important; }
                    .placeholder-white-50::placeholder { color: rgba(255,255,255,0.4); }
                    .admin-icon-box {
                        width: 80px; height: 80px;
                        background: rgba(255,184,0,0.1);
                        border-radius: 20px;
                        display: flex; align-items: center; justify-content: center;
                        color: #ffb800;
                    }
                    .btn-gold { 
                        background: #ffb800; color: #000033;
                        transition: all 0.3s;
                    }
                    .btn-gold:hover { 
                        background: #e6a600; transform: translateY(-2px); 
                        box-shadow: 0 10px 20px rgba(255,184,0,0.3);
                    }
                    .alert-danger-glass {
                        background: rgba(220,53,69,0.2);
                        border: 1px solid rgba(220,53,69,0.2);
                        color: #ff8a93;
                        border-radius: 12px;
                        padding: 12px;
                    }
                `}</style>
            </div>
        );
    }
}
