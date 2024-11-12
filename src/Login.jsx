import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'; // Ensure to import the CSS file
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState(''); // state for email
    const [password, setPassword] = useState(''); // state for password
    const [errorMessage, setErrorMessage] = useState(''); // state for error message
    const [isLoading, setIsLoading] = useState(false); // state for loading status
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // prevent default form submission behavior
        setIsLoading(true); // set loading state to true
        setErrorMessage(''); // clear any previous error messages

        if (email === 'admin@gmail.com' && password === 'admin') {
            navigate('/Admin'); // Redirect to admin page
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
            
            const { success, role, user } = response.data;
            // console.log("logeeesh ",role, hostelNumber,"response.dataresponse.data",response.data)

            if (success) {
                localStorage.setItem('role', role);
                localStorage.setItem('_id', user._id); 
                localStorage.setItem('name', user.name); 
                localStorage.setItem('email', user.email); 


                if (role === 'hosteler') {
                    localStorage.setItem('hostelNumber', user.hostelNumber); // Save hostelNumber in localStorage
                    navigate('/dashboard');
                } else if (role === 'staff' || role === 'student') {
                    navigate('/dashboard-staff');
                }
            } else {
                setErrorMessage('Invalid credentials');
            }
        } catch (error) {
            setErrorMessage('Server error');
        } finally {
            setIsLoading(false); // set loading state to false
        }
    };

    return (
        <div className="login-container">
            <div className="overlay"></div>
            <div className="login-card">
                <h2 className="login-title"> QuickBite</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // set email state
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
                            onChange={(e) => setPassword(e.target.value)} // set password state
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'} {/* isLoading used here */}
                    </button>
                    <button
                        type="button"
                        className="btn btn-link w-100 mt-2"
                        onClick={() => navigate('/register')}
                    >
                        Need an account? Register here
                    </button>
                    {errorMessage && <p className="text-danger text-center mt-3">{errorMessage}</p>} {/* Display error message */}
                </form>
            </div>
        </div>
    );
}

export default Login;
