// src/UpdateBills.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './Updatebills.css'; // Custom CSS for styling (optional)

const Updatebills = () => {
    const [hostelers, setHostelers] = useState([]);
    const [selectedHosteler, setSelectedHosteler] = useState('');
    const [dailyBill, setDailyBill] = useState(120);
    const [monthlyBill, setMonthlyBill] = useState('');
    const [messCut, setMessCut] = useState(false);
    const [activeTab, setActiveTab] = useState('daily'); // Track the active tab

    useEffect(() => {
        // Fetch hostelers from the backend
        const fetchHostelers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/all-hostelers/');
                setHostelers(response.data);
            } catch (error) {
                console.error('Error fetching hostelers:', error);
            }
        };

        fetchHostelers();
    }, []);
    const updateDaily= async () => {
        if (!selectedHosteler) return alert('Please select a hosteler.');
        try {
            await axios.put(`/api/hostelers/update-daily-bill/${selectedHosteler}`, {
                dailyBill,
                messCut,
            });
            alert('Bill updated successfully.');
        } catch (error) {
            console.error('Error updating bill:', error);
            alert('Failed to update bill. Please try again.');
        }

    
    }

    const handleUpdate = async () => {
        if (!selectedHosteler) return alert('Please select a hosteler.');

        try {
            await axios.put(`/api/hostelers/update-monthly-bill/${selectedHosteler}`, {
                monthlyBill,
                messCut,
            });
            alert('Bill updated successfully.');
        } catch (error) {
            console.error('Error updating bill:', error);
            alert('Failed to update bill. Please try again.');
        }
    };

    return (
        <div className="update-bills-container">
            <h2 className="text-center my-4">Update Hosteler Bills</h2>
            
            <div className="form-group">
                <label htmlFor="hosteler-select">Select Hosteler Number</label>
                <select
                    id="hosteler-select"
                    className="form-control"
                    value={selectedHosteler}
                    onChange={(e) => setSelectedHosteler(e.target.value)}
                >
                    <option value="">Select Hosteler</option>
                    {hostelers.map((hosteler) => (
                        <option key={hosteler._id} value={hosteler._id}>
                            {hosteler.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tab Navigation */}
            <ul className="nav nav-tabs my-4">
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'daily' ? 'active' : ''}`}
                        onClick={() => setActiveTab('daily')}
                    >
                        Daily Bill
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeTab === 'monthly' ? 'active' : ''}`}
                        onClick={() => setActiveTab('monthly')}
                    >
                        Monthly Bill
                    </a>
                </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'daily' && (
                    <div className="tab-pane active">
                        <div className="form-group">
                            <label htmlFor="daily-bill">Daily Bill Amount</label>
                            <input
                                type="number"
                                id="daily-bill"
                                className="form-control"
                                value={dailyBill}
                                onChange={(e) => setDailyBill(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'monthly' && (
                    <div className="tab-pane active">
                        <div className="form-group">
                            <label htmlFor="monthly-bill">Monthly Bill Amount</label>
                            <input
                                type="number"
                                id="monthly-bill"
                                className="form-control"
                                value={monthlyBill}
                                onChange={(e) => setMonthlyBill(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="form-group my-4">
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="mess-cut"
                        checked={messCut}
                        onChange={() => {
                            setMessCut(!messCut);
                            if (!messCut) {
                                setDailyBill(0);  // If messCut is true (checkbox is checked), set dailyBill to 0
                            }
                        }}
                    />
                    <label className="form-check-label" htmlFor="mess-cut">
                        Mark as Mess Cut
                    </label>
                </div>
            </div>
            {activeTab === 'daily' &&( <button onClick={updateDaily} className="btn btn-primary w-100">
                Update Daily Bill
            </button>)}

            {activeTab === 'monthly' &&( <button onClick={handleUpdate} className="btn btn-primary w-100">
                Update Montly Bill
            </button>)}
          
        </div>
    );
};

export default Updatebills;
