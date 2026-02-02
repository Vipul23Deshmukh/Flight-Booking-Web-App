import React from 'react';
import Header from './Header';
import Footer from './Footer';
import planeBG from "../assets/images/planebg1.jpg";

const AboutUs = () => {
    return (
        <div className="pt-5">
            <Header />
            <div className="py-5" style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${planeBG})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                color: '#ffffff'
            }}>
                <div className="container text-center">
                    <div className="row justify-content-center">
                        <div className="col-md-8 bg-dark bg-opacity-50 p-5 rounded-lg shadow-lg" style={{ backdropFilter: 'blur(5px)' }}>
                            <h1 className="display-4 mb-4 fw-bold">About BookMyFlight</h1>
                            <p className="lead fs-4 mb-4">
                                We are your trusted partner in air travel, dedicated to making your journey seamless, affordable, and enjoyable.
                            </p>
                            <div className="text-start fs-5">
                                <p>Founded in 2024, BookMyFlight has quickly grown to become one of the leading flight reservation systems. Our mission is to bridge the gap between you and the skies with state-of-the-art technology and unparalleled customer service.</p>
                                <p>Whether you're flying for business or leisure, our platform offers a wide range of flights, competitive pricing, and a secure booking experience that you can rely on.</p>
                            </div>
                            <div className="mt-5">
                                <button className="btn btn-primary btn-lg px-5 rounded-pill shadow">Explore More</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AboutUs;
