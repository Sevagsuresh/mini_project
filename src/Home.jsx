import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import the CSS file for styling

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="overlay">
        <div className="center-content">
          <h1 className="display-4 animated-text">Welcome to QuickBite</h1>
          <p className="lead animated-text">Delicious food at your fingertips.</p>
          <div>
            <button className="btn btn-primary btn-lg mx-2" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-secondary btn-lg mx-2" onClick={() => navigate('/register')}>Register</button>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default Home;
