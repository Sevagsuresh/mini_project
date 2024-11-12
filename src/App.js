import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home'; // Import the Home component
import Login from './Login';
import Register from './Register';
import Admin from './Admin';

import Hostelerinfo from './Hostelerinfo';
import Manageusers from './Manageusers';
import Updatemenu from './Updatemenu';
import Updatebills from './Updatebill';
import Dashboard from './Dashboard'
import DashboardStaff from './DashboardStaff';
import AboutUsContactUs from './AboutUsContactUs';
import ProcessOrders from './Processorder';
import Managestock from './Managestock';
import ViewReports from './Viewreports';
import OutstandingReport from './OutstandingReport';
import Profile from './Profile';
import NotificationPage from './NotificationPage';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} /> {/* Connect Home component */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/Admin" element={<Admin/>}/>
                <Route path="/hostelers-info" element={<Hostelerinfo/>}/>
                <Route path="/process-orders" element={<ProcessOrders/>}/>
                <Route path="/manage-users" element={<Manageusers/>}/>
                <Route path="/manage-stock" element={<Managestock/>}/>
                <Route path="/view-reports" element={<ViewReports/>}/>
                <Route path="/update-menu" element={<Updatemenu/>}/>
                <Route path="/updatebill" element={<Updatebills/>}/>
                <Route path="/outstandingReport" element={<OutstandingReport/>}/>
               <Route path="/dashboard" element={<Dashboard/>}/>
               <Route path='/profile' element={<Profile/>}/>
               <Route path="/dashboard-staff" element={<DashboardStaff/>}/>
               <Route path="/about-us-contact-us" element={<AboutUsContactUs />} />
                <Route path="/NotificationPage" element={<NotificationPage/>} />
            </Routes>
        </Router>
    );
}

export default App;
