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
                if (response.status === 200) {
                    // Extract token and user data from JWT response
                    const { token, user } = response.data;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));

                    if (user.isadmin === 0)
                        this.props.history.push('/booking');
                    else
                        this.props.history.push('/admin');
                }
            }).catch(error => {
                console.log(error);
                this.setState({
                    errormsg: 'Invalid username or password.',
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

                                                    <div className="card-footer" > <button type="submit" disabled={!this.state.btn} onClick={this.validateUser} className="subscribe btn btn-primary btn-block shadow-sm">Login</button></div>

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