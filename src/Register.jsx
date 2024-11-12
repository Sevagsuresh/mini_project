import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [college, setCollege] = useState('');
    const [role, setRole] = useState('');
    const [hostelNumber, setHostelNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePassword = (password) => password.length >= 6;

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate inputs
        if (!validateEmail(email)) {
            setErrorMessage('Invalid email address');
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        if (college === '') {
            setErrorMessage('College selection is required');
            return;
        }

        if (role === '') {
            setErrorMessage('Role selection is required');
            return;
        }

        if (role === 'hosteler') {
            // Validate hostel number
            if (hostelNumber.trim() === '') {
                setErrorMessage('Hostel number is required for hostelers');
                return;
            }
            if (!/^[1-9][0-9]{2}$/.test(hostelNumber)) {
                setErrorMessage('Hostel number must be a 3-digit number between 100 and 999');
                return;
            }
        }

        if (!/^\d{10}$/.test(phoneNumber)) {
            setErrorMessage('Phone number must be 10 digits');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                name,
                email,
                password,
                college,
                role,
                hostelNumber,
                phoneNumber,
            });
            if (response.data.success) {
                setSuccessMessage('Registration successful! Please log in.');
                navigate('/login');
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-card shadow-lg">
                <h2 className="text-center mb-4">Register for QuickBite</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="college" className="form-label">College</label>
                        <select
                            className="form-select"
                            id="college"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            required
                        >
                            <option value="">Select your college</option>
                            <option value="KMCT COLLEGE ENGINEERING">KMCT COLLEGE ENGINEERING</option>
                            <option value="KMCT WOMENS ENGINEERING">KMCT WOMENS ENGINEERING</option>
                            <option value="KMCT SCHOOL OF BUSINESS">KMCT SCHOOL OF BUSINESS</option>
                            <option value="KMCT B PHARM">KMCT B PHARM</option>
                            <option value="KMCT BEd">KMCT BEd</option>
                            <option value="KMCT DEd">KMCT DEd</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">Role</label>
                        <select
                            className="form-select"
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="">Select your role</option>
                            <option value="hosteler">Hosteler</option>
                            <option value="student">Student</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>
                    {role === 'hosteler' && (
                        <div className="mb-3">
                            <label htmlFor="hostelNumber" className="form-label">Hostel Number</label>
                            <input
                                type="text"
                                className="form-control"
                                id="hostelNumber"
                                value={hostelNumber}
                                onChange={(e) => setHostelNumber(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Register</button>
                    <button
                        type="button"
                        className="btn btn-link w-100 mt-2"
                        onClick={() => navigate('/login')}
                    >
                        Already have an account? Login here
                    </button>
                    {successMessage && <p className="text-success text-center mt-3">{successMessage}</p>}
                    {errorMessage && <p className="text-danger text-center mt-3">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
}

export default Register;
