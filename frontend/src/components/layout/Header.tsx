import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
            <Link to="/" className="flex items-center gap-2">
                <img src="/logo_icon.png" alt="Applause Logo" className="w-8 h-8" />
                <span className="text-2xl font-bold text-soft-white">Applause</span>
            </Link>
            <nav className="space-x-6">
                <Link to="/about" className="text-gray-300 hover:text-ion-blue transition-colors">About</Link>
                <Link to="/login" className="text-gray-300 hover:text-ion-blue transition-colors">Login</Link>
                <Link to="/signup" className="px-4 py-2 bg-fusion-pink text-white font-bold rounded-lg hover:bg-opacity-90">
                    Sign Up
                </Link>
            </nav>
        </header>
    );
};

export default Header;
