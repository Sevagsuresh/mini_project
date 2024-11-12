import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const HostelerInfo = () => {
    const [hostelers, setHostelers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHostelerInfo = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/hostelers/messcutinfo`);
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
            <h1>No hostelers with active mess cut today.</h1>
            </div>
        )
    }

    return (
        <div className="container mt-4">
            <h1>Hostelers with Active Mess Cut</h1>
            {hostelers.map((hosteler) => (
                <div key={hosteler._id} className="card mb-3">
                    <div className="card-header">
                        <h2>{hosteler.name}</h2>
                    </div>
                    <div className="card-body">
                        <p><strong>Hostel Number:</strong> {hosteler.hostelNumber}</p>
                        <p><strong>Mess Cut Status:</strong> {hosteler.messCut ? 'Active' : 'Inactive'}</p>
                        {hosteler.messCut && (
                            <div>
                                <p><strong>Mess Cut Start Date:</strong> {new Date(hosteler.messCutStartDate).toLocaleDateString()}</p>
                                <p><strong>Mess Cut End Date:</strong> {new Date(hosteler.messCutEndDate).toLocaleDateString()}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HostelerInfo; 

