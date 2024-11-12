import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import DashboardStaffProfile from './DashboardstaffProfile';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './DashboardStaff.css';

const DashboardStaff = () => {
  const [menu, setMenu] = useState([]);
  const [profileVisible, setProfileVisible] = useState(false);
  const [notification, setNotification] = useState('');
  const Id = localStorage.getItem('_id');
  const Name = localStorage.getItem('name');


  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('/api/menu');
        setMenu(response.data.menus);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };
  

    fetchMenu();
    
  }, []);



  const handleBooking = async (foodId, price, quantity) => {
    if (quantity <= 0) {
      setNotification('Item is out of stock.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/staff-book', { foodId, Id });
      const { orderId, key, token } = response.data;
      const options = {
        key,
        amount: price * 100,
        currency: 'INR',
        name: 'Food Booking',
        description: 'Test transaction',
        order_id: orderId,
        handler: async (response) => {
          const paymentResponse = await axios.post('http://localhost:5000/api/payment-success', {
            paymentId: response.razorpay_payment_id,
            orderId,
            foodId,
            hostelNumber: Id,
            token,
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
    <div className="dashboard bg-black text-white">
      <header className="bg-primary text-white text-center py-4 d-flex justify-content-between align-items-center">
        <h1>Welcome to QuickBite!</h1>
        <FaUserCircle
          size={40}
          className="profile-icon"
          onClick={() => setProfileVisible(!profileVisible)}
        />
      </header>
      <div className="container my-4">
        {profileVisible && <DashboardStaffProfile />}
        <div className="row">
          {menu.length > 0 ? (
            menu.map((item) => (
              <div key={item._id} className="col-lg-4 col-md-6 mb-4">
                <div className="card h-100 bg-dark text-white animate__animated animate__bounce">
                  <img
                    src={`/images/${item.foodImage}`}
                    alt={item.foodName}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.foodName}</h5>
                    <p className="card-text">Price: ₹{item.price}</p>
                    <button
                      className="btn btn-success animate__animated animate__pulse animate__infinite"
                      onClick={() => handleBooking(item._id, item.price, item.quantity)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-info w-100 text-center" role="alert">
              No menu items available.
            </div>
          )}
        </div>
        {notification && (
          <div className="alert alert-info mt-4 text-center animate__animated animate__fadeIn">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardStaff;
