import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UpdateMenu = () => {
    const [name, setName] = useState('');
    const [menu, setMenu] = useState([]);
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [category, setCategory] = useState('');
    const [isSpecial, setIsSpecial] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [editingItemId, setEditingItemId] = useState(null); // For editing item

    const fetchMenu = async () => {
        try {
            const response = await axios.get('/api/menu');
            setMenu(response.data.menus);
        } catch (error) {
            console.error('Error fetching menu:', error);
        }
    };
    
    useEffect(() => {
        fetchMenu();
    }, []);

    const handleFileSelectionChange = (event) => {
        const newFile = event.target.files[0];
        setImage(newFile);
    };

    const handleMenuSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('isSpecial', isSpecial);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('image', image);

        try {
            if (editingItemId) {
                // Update menu item
                await axios.put(`http://localhost:5000/api/update-menu/${editingItemId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Add new menu item
                await axios.post('http://localhost:5000/api/update-menu', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            alert('Menu updated successfully!');
            setEditingItemId(null); // Reset editing state
            fetchMenu(); // Refresh the menu list
        } catch (error) {
            console.error('Error updating menu:', error);
        }
    };

    const handleEdit = (item) => {
        setEditingItemId(item._id); // Set the item ID for editing
        setName(item.foodName);
        setPrice(item.price);
        setQuantity(item.quantity);
        setCategory(item.category);
        setIsSpecial(item.isSpecial);
        setIsVisible(item.isVisible);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/delete-menu/${id}`);
            alert('Menu item deleted successfully!');
            fetchMenu(); // Refresh the menu list
        } catch (error) {
            console.error('Error deleting menu item:', error);
        }
    };

    return (
        <div className="container">
            <h2>{editingItemId ? 'Edit Menu' : 'Update Menu'}</h2>
            <form onSubmit={handleMenuSubmit}>
                <div className="form-group">
                    <label>Food Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                    <div className="mt-2">
                        <label className="inline-flex items-center mr-6">
                            <input
                                type="radio"
                                className="form-radio"
                                name="category"
                                style={{ marginRight: 10 }}
                                value="breakfast"
                                checked={category === 'breakfast'}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                            <span className="ml-2">Breakfast</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="category"
                                value="lunch"
                                style={{ marginLeft: 10, marginRight: 10 }}
                                checked={category === 'lunch'}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                            <span className="ml-2">Lunch</span>
                        </label>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={isSpecial}
                            onChange={(e) => setIsSpecial(e.target.checked)}
                        />
                        <span className="ml-2">Special Food</span>
                    </label>
                </div>
                <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input
                            type="checkbox"
                            className="form-checkbox"
                            checked={isVisible}
                            onChange={(e) => setIsVisible(e.target.checked)}
                        />
                        <span className="ml-2">Visibility</span>
                    </label>
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Quantity</label>
                    <input
                        type="number"
                        className="form-control"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Food Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        name="image"
                        onChange={handleFileSelectionChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    {editingItemId ? 'Update Menu' : 'Add Menu'}
                </button>
            </form>

            <table className="table border mt-4">
                <thead className="table-dark">
                    <tr>
                        <th>NAME</th>
                        <th>QTY</th>
                        <th>PRICE</th>
                        <th>VISIBILITY</th>
                        <th>Manage</th>
                    </tr>
                </thead>
                <tbody>
                    {menu.map((item) => (
                        <tr key={item._id}>
                            <td>{item.foodName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price}</td>
                            <td>{item.isSpecial ? 'Yes' : 'No'}</td>
                            <td>
                                <button
                                    className="btn btn-warning mr-2"
                                    onClick={() => handleEdit(item)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(item._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UpdateMenu;
