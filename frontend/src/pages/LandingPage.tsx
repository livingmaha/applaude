import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-quantum-black text-soft-white">
            <Header />
            <main className="flex flex-col items-center justify-center text-center p-8 flex-grow">
                 <img src="/logo_icon.png" alt="Applause Logo" className="w-32 h-32 mb-8 animate-pulse" />
                <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-ion-blue to-fusion-pink">Did you know mobile apps build brand awareness, increase customer loyalty, & unlock revenue you never thought possible?</h1>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl">Build your Business mobile app today! No coding, no stress, you just need your Website Url.</p>
                <Link to="/signup" className="px-10 py-4 bg-gradient-to-r from-fusion-pink to-solar-orange text-white font-bold rounded-lg hover:scale-105 transition-transform text-xl">
                    Start Building for Free
                </Link>
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
