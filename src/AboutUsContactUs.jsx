import React from 'react';
import './AboutUsContactUs.css'; // Import the CSS file for styling

const AboutUsContactUs = () => {
    return (
        <div className="about-us-contact-us">
            <section className="about-us">
                <h2>About Us</h2>
                <p>KMCT QuickBite is a canteen system exclusively for KMCT students. We provide a seamless dining experience with a variety of delicious meals.</p>
            </section>
            <section className="contact-us">
                <h2>Contact Us</h2>
                <p>Address: KMCT Canteen, KMCT College of Engineering, Kallanthode, Manassery, Kozhikode, Kerala 673601</p>
                <p>Phone: 9946532650</p>
            </section>
        </div>
    );
};

export default AboutUsContactUs;
