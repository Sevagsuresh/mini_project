import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from './BackButton';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedUser, setEditedUser] = useState({ name: '', email: '', role: '', hostelNumber: '', paymentStatus: '' });

    useEffect(() => {
        // Fetch users from the server
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/admin/manage-users');  // Adjusted API endpoint
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleEditClick = (user) => {
        setEditingUserId(user._id);
        setEditedUser(user);  // Pre-fill the form with user data
    };

    const handleDeleteClick = async (userId) => {
        try {
            await axios.delete(`/api/admin/manage-users/${userId}`);
            setUsers(users.filter(user => user._id !== userId));  // Remove the deleted user from state
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleUpdateClick = async () => {
        try {
            const response = await axios.put(`/api/admin/manage-users/${editingUserId}`, editedUser);
            setUsers(users.map(user => user._id === editingUserId ? response.data : user));
            setEditingUserId(null);  // Exit edit mode after successful update
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className="container mt-4">
             <BackButton/>
            <h1 className="display-4 mb-4">Manage Users</h1>
            {users.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Hostel Number</th>
                            <th>Payment Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                {editingUserId === user._id ? (
                                    <>
                                        <td>
                                            <input 
                                                type="text" 
                                                value={editedUser.name} 
                                                onChange={e => setEditedUser({ ...editedUser, name: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="email" 
                                                value={editedUser.email} 
                                                onChange={e => setEditedUser({ ...editedUser, email: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="text" 
                                                value={editedUser.role} 
                                                onChange={e => setEditedUser({ ...editedUser, role: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="text" 
                                                value={editedUser.hostelNumber} 
                                                onChange={e => setEditedUser({ ...editedUser, hostelNumber: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="text" 
                                                value={editedUser.paymentStatus} 
                                                onChange={e => setEditedUser({ ...editedUser, paymentStatus: e.target.value })}
                                            />
                                        </td>
                                        <td>
                                            <button className="btn btn-primary" onClick={handleUpdateClick}>Update</button>
                                            <button className="btn btn-secondary" onClick={() => setEditingUserId(null)}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.hostelNumber}</td>
                                        <td>{user.paymentStatus}</td>
                                        <td>
                                            <button className="btn btn-warning" onClick={() => handleEditClick(user)}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => handleDeleteClick(user._id)}>Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
};

export default ManageUsers;
