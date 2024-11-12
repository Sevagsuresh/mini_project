// src/MenuPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('/api/menu');
                setMenuItems(response.data);
            } catch (error) {
                console.error('Error fetching menu items:', error);
            }
        };

        fetchMenuItems();
    }, []); // Fetch menu items on component mount

    return (
        <div className="menu-page-container">
            <h2>Menu</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {menuItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>${item.price}</td>
                            <td><img src={item.image} alt={item.name} style={{ width: '100px' }} /></td>
                            <td>{item.quantity <= 0 ? 'Stock Out' : item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MenuPage;
