import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardstaffProfile.css';
const DashboardstaffProfile = () => {
    const Name = localStorage.getItem("name");
    const Email = localStorage.getItem("email");
    const Id = localStorage.getItem('_id');

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(Name);
    const [editEmail, setEditEmail] = useState(Email);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    const handleEditClick = () => {
        setIsEditing(true); // Enable edit mode
    };

    const handleSaveClick = async () => {
        try {
            // Send the updated details to the backend
            const response = await fetch('/api/users/updateProfile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: Id,               // Send the user's ID
                    name: editName,        // Updated name
                    email: editEmail,      // Updated email
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save the updated details in localStorage
                localStorage.setItem('name', editName);
                localStorage.setItem('email', editEmail);

                setIsEditing(false);
                setSuccessMessage("Profile updated successfully!");
                setErrorMessage("");
            } else {
                setErrorMessage(data.message || "Failed to update profile.");
                setSuccessMessage("");
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage("An error occurred while updating the profile.");
            setSuccessMessage("");
        }
    };

    const handleLogout = () => {
        // Clear localStorage and navigate to login page
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="dashboard-staff-profile">
            <h2>Staff Profile</h2>
            {isEditing ? (
                <ul className="list-group">
                    <li className="list-group-item">
                        <strong>Name:</strong>
                        <input
                            type="text"
                            className="form-control"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />
                    </li>
                    <li className="list-group-item">
                        <strong>Email:</strong>
                        <input
                            type="email"
                            className="form-control"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                        />
                    </li>
                </ul>
            ) : (
                <ul className="list-group">
                    <li className="list-group-item">
                        <strong>Name:</strong> {Name}
                    </li>
                    <li className="list-group-item">
                        <strong>Email:</strong> {Email}
                    </li>
                </ul>
            )}

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <div className="profile-actions">
                {isEditing ? (
                    <button className="btn btn-success" onClick={handleSaveClick}>Save</button>
                ) : (
                    <button className="btn btn-primary" onClick={handleEditClick}>Edit Profile</button>
                )}
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default DashboardstaffProfile;
