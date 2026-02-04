import React, { Component } from 'react';
import UserService from '../services/UserService';
import planeBG from "../assets/images/planebg1.jpg";
import Footer from './Footer';
import Header from './Header';
import { Link } from 'react-router-dom';

/** 
 * 
 * This component will render Login page for the app 
 * UserService: Service for authenticating user
*/
export default class Login extends Component {

    constructor(props) {
        super(props);
        this.service = new UserService();
        this.state = {
            username: "",
            password: "",
            errormsg: "",
            flag: false,
            btn: false,
            isAdmin: 0
        }
    }

    /**
     * this method interacts with service to authenticate user
     * Store user data in local storage
     * Redirects to Admin/Booking component based on condition
     */
    validateUser = (e) => {
        e.preventDefault();
        if (!e.target.closest("form").reportValidity()) {
            return;
        }



        if (this.state.username !== '' && this.state.password !== '') {
            this.service.validateUser(this.state.username, this.state.password).then(response => {
                if (response.status === 200 && response.data) {
                    // Extract token and user data from JWT response
                    // Support both camelCase and PascalCase for better resilience
                    const token = response.data.token || response.data.Token;
                    const user = response.data.user || response.data.User;

                    if (token && user) {
                        localStorage.setItem('token', token);
                        localStorage.setItem('user', JSON.stringify(user));

                        if ((user.isadmin || user.Isadmin) === 0)
                            this.props.history.push('/booking');
                        else
                            this.props.history.push('/admin');
                    } else {
                        throw new Error("Invalid response format");
                    }
                }
            }).catch(error => {
                console.log(error);
                this.setState({
                    errormsg: error.response?.status === 401 ? 'Invalid username or password.' : 'Login failed: ' + (error.response?.data?.message || error.message),
                    password: "",
                    flag: true
                });
            });
        } else {
            alert('All fields are required');
        }
    }

    render() {
        return (
            <div className='pt-5'>
                <Header />
                <div className="py-5" style={{ backgroundImage: `url(${planeBG})`, backgroundSize: 'cover' }}>
                    <div className="row mb-4">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="display-6" style={{ color: 'white', fontWeight: '50pt' }}>Login</h1>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-md-6 mx-auto">
                            <div className="card ">
                                <div className="card-header">
                                    <div className="bg-white shadow-sm pt-4 pl-2 pr-2 pb-2">

                                        <div className="tab-content">
                                            <div className="tab-pane fade show active pt-3">
                                                <form >

                                                    <div className="form-group">
                                                        <h6><span className="form-label">Username</span></h6>
                                                        <input type="text" name="username" required value={this.state.username} onChange={e => this.setState({ username: e.target.value })} className="form-control" />
                                                    </div>
                                                    <div className="form-group">
                                                        <h6><span className="form-label">Password</span></h6>
                                                        <input type="password" name="password" required value={this.state.password} onChange={e => this.setState({ password: e.target.value, flag: false, btn: true })} className="form-control" />
                                                    </div>

                                                    <div className="card-footer px-0 bg-transparent border-0 pt-4">
                                                        <button
                                                            type="submit"
                                                            disabled={!this.state.btn}
                                                            onClick={this.validateUser}
                                                            className="btn btn-navy-premium btn-block py-3 fw-bold text-uppercase shadow-lg transition-all"
                                                            style={{
                                                                background: '#00264d', // Deeper Navy for better accessibility
                                                                color: '#ffc107',      // Brighter Amber/Gold for accessibility contrast
                                                                border: '2px solid #ffc107',
                                                                borderRadius: '12px',
                                                                letterSpacing: '1.5px',
                                                                boxShadow: '0 8px 16px rgba(0,38,77,0.25)',
                                                                fontSize: '1.1rem'
                                                            }}
                                                        >
                                                            <i className="fas fa-sign-in-alt me-2"></i> Login to Account
                                                        </button>
                                                    </div>

                                                </form>
                                            </div>
                                            <br />{
                                                this.state.flag && <div style={{ textAlign: 'center' }} className="alert alert-danger"> {this.state.errormsg} </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="form-group" >

                                        <div ><Link className="card-link" to="/register"><button type="button" className="btn  btn-link btn-block">New User? Register Now!</button></Link>  </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

}