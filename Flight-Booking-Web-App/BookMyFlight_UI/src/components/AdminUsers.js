import React, { Component } from 'react';
import UserService from '../services/UserService';

export default class AdminUsers extends Component {
    constructor(props) {
        super(props);
        this.service = new UserService();
        this.state = {
            users: [],
            isLoading: true,
            error: ""
        }
    }

    componentDidMount() {
        this.service.getAdminAllUsers()
            .then(res => this.setState({ users: res.data, isLoading: false }))
            .catch(err => this.setState({ error: "Failed to fetch users", isLoading: false }));
    }

    render() {
        const { users, isLoading, error } = this.state;

        return (
            <div className="animate-fade-in">
                <div className="glass-panel p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">Registered Users</h2>
                        <span className="badge bg-primary px-3 py-2 rounded-pill">Total: {users.length}</span>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle border-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="border-0 rounded-start">ID</th>
                                        <th className="border-0">Full Name</th>
                                        <th className="border-0">Username</th>
                                        <th className="border-0">Email</th>
                                        <th className="border-0">Phone</th>
                                        <th className="border-0 rounded-end">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.userId}>
                                            <td className="fw-bold">#{u.userId}</td>
                                            <td>{u.fname}</td>
                                            <td>{u.username}</td>
                                            <td>{u.email}</td>
                                            <td>{u.phone}</td>
                                            <td>
                                                {u.isadmin === 1 ?
                                                    <span className="badge bg-warning text-dark">Admin</span> :
                                                    <span className="badge bg-info text-white">User</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
