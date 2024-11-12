import React, { useState, useEffect } from 'react';

function HomePage({ user }) {
    const [loginCode, setLoginCode] = useState('');

    useEffect(() => {
        // Assuming loginCode is passed as part of the user object
        if (user && user.code) {
            setLoginCode(user.code);
        }
    }, [user]);

    return (
        <div>
            <h1>Welcome, {user.name}!</h1>
            {loginCode && (
                <div>
                    <h2>Your Unique Code:</h2>
                    <p>{loginCode}</p>
                </div>
            )}
            {/* Add other content for the homepage */}
        </div>
    );
}

export default HomePage;
