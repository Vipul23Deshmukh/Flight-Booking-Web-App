import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SearchFlight from './SearchFlight';

import plane1 from '../assets/images/plane1.jpg';
import plane2 from '../assets/images/plane2.jpg';
import plane3 from '../assets/images/plane3.jpg';
import plane5 from '../assets/images/plane5.jpg';
import Corousal from './Corousal';

/** 
 * 
 * This component will render Home page for the app 
 * Sub Components : Corousal, SearchFlight, Header, Footer
*/

const features = [
    {
        image: plane1,
        feature: "Memorable Travel",
        desc: "Experience luxury and comfort in every journey."
    },
    {
        image: plane2,
        feature: "Safety First",
        desc: "Leading industry standards for your health and safety."
    },
    {
        image: plane3,
        feature: "Excellence in Service",
        desc: "Our dedicated crew is at your service 24/7."
    },
    {
        image: plane5,
        feature: "Seamless Booking",
        desc: "Book your flights in just a few clicks."
    }
];

function Home(props) {
    const featureCard = features.map((f, index) => {
        return (
            <div key={index} className="col-lg-3 col-md-6 mb-4">
                <div className="glass-card h-100 border-0 overflow-hidden">
                    <div className="grayscale-hover">
                        <img className="card-img-top" src={f.image} alt={f.feature} style={{ height: '200px', objectFit: 'cover' }} />
                    </div>
                    <div className="card-body p-4">
                        <h5 className="fw-bold text-primary-blue mb-2">{f.feature}</h5>
                        <p className="text-muted small mb-0">{f.desc}</p>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <div className="bg-light">
            <Header />

            <main>
                <section className="animate-fade-in">
                    <Corousal />
                </section>

                <section className="py-5 bg-white border-bottom shadow-sm">
                    <div className="container">
                        <SearchFlight />
                    </div>
                </section>

                <section className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold mb-2">Why BookMyFlight?</h2>
                        <div className="border-bottom border-3 border-accent-gold w-25 mx-auto"></div>
                        <p className="text-muted mt-3">Discover the difference of flying with India's most trusted airline partner.</p>
                    </div>
                    <div className="row">
                        {featureCard}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Home;