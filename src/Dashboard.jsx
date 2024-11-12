import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

const Dashboard = () => {
    const [menu, setMenu] = useState([]);
    const [specialMenu, setSpecialMenu] = useState([]);
    const [bill, setBill] = useState(0);
    const [hNo, setHno] = useState('');
    const [uId, setuId] = useState('');
    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [messCut, setMessCut] = useState(false);
    const [showMessCut, setShowMessCut] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showDateRange, setShowDateRange] = useState(false);
    const [messCutSuccess, setMessCutSuccess] = useState(false); // Success message state
    const [notification, setNotification] = useState('');
    const [notifications, setNotifications] = useState('');

    const navigate = useNavigate();

    // Retrieve hostelNumber from localStorage
    const hostelNumber = localStorage.getItem('hostelNumber');

    useEffect(() => {
        if (!hostelNumber) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get('/api/menu');
                setMenu(response.data.menus);
                setHno(localStorage.getItem('hostelNumber'));
                setuId(localStorage.getItem('_id'));
                setEmail(localStorage.getItem('email'));
                setName(localStorage.getItem("name"));
                const filteredMenu = response.data.menus.filter(item => item.isSpecial === "true");
                setSpecialMenu(filteredMenu);
                // const billResponse = await fetch(`http://localhost:5000/api/bill/${hostelNumber}`);
                // const billData = await billResponse.json();
                // setBill(billData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const fetchNotification = async () => {
            try {
              const response = await axios.get(`/api/hosteler/${hostelNumber}/notification`);
              setNotifications(response.data.notification || ''); // Set the notification message
              console.log(response.data.notification)
            } catch (error) {
              console.error('Error fetching notification:', error);
            }
          };

        fetchData();
        fetchNotification();
    }, [hostelNumber, notifications, navigate]);

    const handleMessCut = async () => {
        try {
            const apiUrl = `http://localhost:5000/api/mess-cut/${hostelNumber}`;
            const payload = { messCut: true, startDate: startDate, endDate: endDate, name: Name };

            // Make the POST request using axios
            await axios.post(apiUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // Toggle messCut state
            setMessCut(!messCut);
            setShowMessCut(true);
            setMessCutSuccess(true);
            // Redirect to dashboard after success
            navigate('/dashboard');
        } catch (error) {
            console.error('Error updating mess cut status:', error);
        }
    };
    const handleClearNotification = async () => {
        console.log("jjjjjjj")
        try {
          await axios.post('http://localhost:5000/api/clear-notification', { hostelNumber });
          setNotification(''); // Clear the notification in the frontend as well
        } catch (error) {
          console.error('Error clearing notification:', error);
        }
      };

    const handleBooking = async (foodId, price, quantity) => {
        console.log(foodId, price, quantity, "lllllllllllllbooook");
        if (quantity <= 0) {
            setNotification('Item is out of stock.');
            return;
        }

        try {
            // Step 1: Create an order on your backend and get the token
            const response = await axios.post('http://localhost:5000/api/book', {
                foodId,
                hostelNumber,
            });

            const { orderId, key, token } = response.data;

            // Step 2: Initialize Razorpay payment with token as part of metadata
            const options = {
                key, // Razorpay API key
                amount: price * 100, // Razorpay expects the amount in paise
                currency: 'INR',
                name: 'Food Booking',
                description: 'Test transaction',
                order_id: orderId, // Order ID returned from backend
                handler: async (response) => {
                    // Step 3: After successful payment, confirm booking on backend
                    const paymentResponse = await axios.post('http://localhost:5000/api/payment-success', {
                        paymentId: response.razorpay_payment_id,
                        orderId,
                        foodId,
                        hostelNumber,
                        token, // Pass the generated token
                    });

                    if (paymentResponse.data.success) {
                        alert(`Booking successful! Your token is: ${token}`);
                        setNotification(`Booking successful! Your token is: ${token}`);
                    } else {
                        setNotification('Booking failed!');
                    }
                },
                prefill: {
                    name: Name,
                    email: 'your.email@example.com',
                    contact: '9946532650',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Error during booking:', error);
            setNotification('Error during booking process.');
        }
    };

    return (
        <div className="container mt-5">
            <header className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="display-4">Hosteler Dashboard : {hNo}</h1>
                <h4>Name : {Name}</h4>
                <button className="btn btn-secondary" onClick={() => navigate('/profile')}>Profile</button>
            </header>

            <main>
                <div className="row">
                    {/* Menu Section */}
                    <div className="col-md-6 mb-4">
                        <section className="card shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h2 className="card-title">Select Your Menu</h2>
                            </div>
                            <ul className="list-group list-group-flush">
                                {specialMenu.length > 0 ? (
                                    specialMenu.map((item, index) => {
                                        if (item.isSpecial === "true") {
                                            return (
                                                <li key={item._id || index} className="list-group-item">
                                                    <div className="card mb-3">
                                                        <img
                                                            src={`/images/${item.foodImage}`} // Adjust the image path as needed
                                                            className="card-img-top"
                                                            alt={item.foodName}
                                                            style={{ height: '200px', objectFit: 'cover' }} // Adjust height as necessary
                                                        />
                                                        <div className="card-body">
                                                            <h5 className="card-title">{item.foodName}</h5>
                                                            <p className="card-text">Price: ₹{item.price}</p>
                                                            <button
                                                                className="btn btn-success"
                                                                onClick={() => handleBooking(item._id, item.price, item.quantity)}
                                                            >
                                                                Book Now
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        }
                                        return null;
                                    })
                                ) : (
                                    <div className="alert alert-info" role="alert">
                                        No special menu items available.
                                    </div>
                                )}
                            </ul>
                        </section>
                    </div>

                    {/* Billing Section */}
                    <div className="col-md-6">
                        <section className="card shadow-sm">
                            <div className="card-header bg-success text-white">
                                <h2 className="card-title">Notification</h2>
                            </div>
                            <div className="card-body">
                            {notifications ? (
        <div>
          <p>{notifications}</p>
          <button onClick={handleClearNotification}>Mark as Read</button>
        </div>
      ) : (
        <p>No new notifications.</p>
      )}

                            </div>
                        </section>
                        <section className="card shadow-sm">
                            <div className="card-header bg-success text-white">
                                <h2 className="card-title">Billing Information</h2>
                            </div>
                            <div className="card-body">
                                <p className="lead">Your current bill: <strong>₹{bill}</strong></p>
                                <button
                                    className={`btn ${messCut ? 'btn-danger' : 'btn-warning'}`}
                                    onClick={() => setShowDateRange(!showDateRange)}
                                >
                                    {messCut ? 'Mess Cuted' : 'Cut Mess'}
                                </button>

                                {showDateRange && (
                                    <div className="mt-3">
                                        <div className="form-group">
                                            <label htmlFor="startDate" className="form-label">Start Date</label>
                                            <input
                                                type="date"
                                                id="startDate"
                                                className="form-control"
                                                value={startDate}
                                                onChange={(e) => setStartDate(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="form-group mt-3">
                                            <label htmlFor="endDate" className="form-label">End Date</label>
                                            <input
                                                type="date"
                                                id="endDate"
                                                className="form-control"
                                                value={endDate}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <button
                                            className="btn btn-primary mt-3"
                                            onClick={handleMessCut}
                                        >
                                            Confirm Mess Cut
                                        </button>
                                    </div>
                                )}

                                {showMessCut && (
                                    <p className="text-success mt-2">Mess cut status updated.</p>
                                )}
                                {messCutSuccess && (
                                    <p className="text-success mt-2">Mess cut has been successfully applied.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
