
import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="w-full bg-black bg-opacity-20 mt-16 p-6 text-center text-gray-400">
            <p>&copy; 2025 Applause Inc. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
