import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Booking from './components/Booking';
import Login from './components/Login';
import Register from './components/Register';
import Payment from './components/Payment';
import ErrorWorld from './components/ErrorWorld';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';
import AdminUsers from './components/AdminUsers';
import AdminBookings from './components/AdminBookings';
import AddFlight from './components/AddFlight';
import FlightListAdmin from './components/FlightListAdmin';
import Passengers from './components/Passengers';
import Ticket from './components/Ticket';
import Tickets from './components/Tickets';
import UpdateFlight from './components/UpdateFlight';
import Summary from './components/Summary';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import FlightResults from './components/FlightResults';
import AdminAnalytics from './components/AdminAnalytics';
import FlightManagement from './components/FlightManagement';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/AdminLayout';




function App() {
  return (
    <main>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/summary" component={Summary} />
        <Route path="/payment" component={Payment} />

        {/* Protected User Routes */}
        <PrivateRoute path="/booking" component={Booking} />
        <PrivateRoute path="/passengers" component={Passengers} />
        <PrivateRoute path="/ticket" component={Ticket} />
        <PrivateRoute path="/tickets" component={Tickets} />

        {/* Admin Portal Routes (Protected) */}
        <PrivateRoute path="/admin" exact adminOnly={true} component={(props) => (
          <AdminLayout><AdminAnalytics {...props} /></AdminLayout>
        )} />
        <PrivateRoute path="/admin/flights" adminOnly={true} component={(props) => (
          <AdminLayout><FlightManagement {...props} /></AdminLayout>
        )} />
        <PrivateRoute path="/admin-users" adminOnly={true} component={(props) => (
          <AdminLayout><AdminUsers {...props} /></AdminLayout>
        )} />
        <PrivateRoute path="/admin-bookings" adminOnly={true} component={(props) => (
          <AdminLayout><AdminBookings {...props} /></AdminLayout>
        )} />
        <PrivateRoute path="/addFlight" adminOnly={true} component={(props) => (
          <AdminLayout><AddFlight {...props} /></AdminLayout>
        )} />
        <PrivateRoute path="/allFlights" adminOnly={true} component={(props) => (
          <AdminLayout><FlightListAdmin {...props} /></AdminLayout>
        )} />
        <PrivateRoute path="/updateFlight" adminOnly={true} component={(props) => (
          <AdminLayout><UpdateFlight {...props} /></AdminLayout>
        )} />

        <Route path="/about" component={AboutUs} />
        <Route path="/contact" component={ContactUs} />
        <Route path="/search-results" component={FlightResults} />
        <Route component={ErrorWorld} />

      </Switch>
    </main>
  );
}

export default App;
