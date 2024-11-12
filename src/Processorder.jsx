// src/ProcessOrders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './ProcessOrders.css'; // Import the CSS file for additional styling

const ProcessOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/orders/today');
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleApprove = async (orderId) => {
        try {
            await axios.patch(`/api/orders/${orderId}/approve`);
            setOrders(orders.map(order => 
                order._id === orderId ? { ...order, orderStatus: 'completed' } : order
            ));
        } catch (error) {
            console.error('Error approving order:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Today's Orders</h2>
            <ul className="list-group">
                {orders.length > 0 ? (
                    orders.map(order => (
                        <li key={order._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h5>{order.foodName}</h5>
                                <p>Quantity: {order.quantity}</p>
                                <p>Token: {order.token}</p>
                                <p>Price: ₹{order.price}</p>
                                <p>Order Status: {order.orderStatus}</p>
                            </div>
                            {order.orderStatus !== 'completed' && (
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleApprove(order._id)}
                                >
                                    Approve & Dispatch
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                    <div>No orders for today.</div>
                )}
            </ul>
        </div>
    );
};

export default ProcessOrders;
