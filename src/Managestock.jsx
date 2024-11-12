// src/ManageStock.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './ManageStock.css'; // Import the CSS file for additional styling

const ManageStock = () => {
    const [stockItems, setStockItems] = useState([]);

    useEffect(() => {
        axios.get('/api/menu')
            .then(response => setStockItems(response.data.menus))
            .catch(error => console.error('Error fetching stock items:', error));
    }, []);

    return (
        <div className="manage-stock-container">
            <h2>Manage Stock</h2>
            {/* Add components to manage stock and handle stock-out messages */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        {/* <th>ID</th> */}
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {stockItems.map(item => (
                        <tr key={item.id}>
                            {/* <td>{item.id}</td> */}
                            <td>{item.foodName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.quantity === 0 ? 'Out of Stock' : 'In Stock'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageStock;
