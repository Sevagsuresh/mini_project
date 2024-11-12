import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OutstandingReport = () => {
    const [hostelers, setHostelers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHostelerInfo = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/hostelers/outstanding`);
                const data = await response.json();

                if (Array.isArray(data)) {
                    setHostelers(data);  // Ensure only arrays are set to state
                } else {
                    setHostelers([]);  // In case of an unexpected response, set to an empty array
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching hosteler info:', error);
                setLoading(false);
            }
        };

        fetchHostelerInfo();
    }, []);

    if (loading) {
        return <p>Loading hosteler information...</p>;
    }

    if (hostelers.length === 0) {
        return (
        <div className="container mt-4">
            <h1>No hostelers pending.</h1>
            </div>
        )
    }

    return (
        <div className="container mt-4">
            <h1>Outstanding Report</h1>
            {hostelers.map((hosteler) => (
                <div key={hosteler._id} className="card mb-3">
                    <div className="card-header">
                        <h2>{hosteler.name}</h2>
                    </div>
                    <div className="card-body">
                        <p><strong>Hostel Number:</strong> {hosteler.hostelNumber}</p>
                        <p><strong>Paid Status:</strong> {hosteler.paid_status}</p>
                        <p><strong>Amount :</strong> {hosteler.daily_amount ||0}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OutstandingReport;

