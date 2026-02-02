import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, adminOnly = false, ...rest }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <Route
            {...rest}
            render={(props) => {
                if (!token) {
                    // Not logged in, redirect to login
                    return <Redirect to="/login" />;
                }

                if (adminOnly && (!user || user.isadmin !== 1)) {
                    // Requires admin but user is not admin
                    return <Redirect to="/booking" />;
                }

                // Authorized, render component
                return <Component {...props} />;
            }}
        />
    );
};

export default PrivateRoute;
