// src/ViewReports.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
// import './ViewReports.css'; // Import the CSS file for additional styling

const ViewReports = () => {
    // Placeholder content; replace with actual data and charts
    return (

        <div className="container mt-4">
        <h1>View Reports</h1>
        <div className="card">
            <div className="card-header">
                <Link to={'/outstandingReport'} className='btn btn-warning'>Outstanding Report</Link>
            </div>
            </div>
    </div>
      
    );
};

export default ViewReports;
