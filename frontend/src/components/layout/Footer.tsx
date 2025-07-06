import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="w-full bg-black bg-opacity-20 mt-16 p-6 text-center text-gray-400">
            <div className="flex justify-center gap-4 mb-4">
                 <Link to="/about" className="hover:text-ion-blue transition-colors">About</Link>
                 <Link to="/api" className="hover:text-ion-blue transition-colors">Partner API</Link>
                 <a href="#" className="hover:text-ion-blue transition-colors">Terms of Service</a>
            </div>
            <p>&copy; {currentYear} Applause Inc. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
