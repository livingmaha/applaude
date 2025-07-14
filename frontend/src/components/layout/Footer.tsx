import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import logoIcon from '../../assets/images/logo_icon.png';

const Footer = () => {
    return (
        <footer className="bg-gray-900 bg-opacity-40 text-gray-400 p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <Link to="/" className="flex items-center gap-2 mb-4">
                        <img src={logoIcon} alt="Applause Logo" className="w-8 h-8" />
                        <span className="text-xl font-bold text-soft-white">Applause</span>
                    </Link>
                    <p className="text-sm">Build your dream app with the power of AI.</p>
                </div>

                <div>
                    <h3 className="font-bold text-soft-white mb-4">Site Map</h3>
                    <ul className="space-y-2">
                        <li><Link to="/about" className="hover:text-ion-blue transition-colors">About Us</Link></li>
                        <li><Link to="/faq" className="hover:text-ion-blue transition-colors">FAQ</Link></li>
                        <li><Link to="/dashboard" className="hover:text-ion-blue transition-colors">Dashboard</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-soft-white mb-4">Legal</h3>
                    <ul className="space-y-2">
                        <li><Link to="/privacy" className="hover:text-ion-blue transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="hover:text-ion-blue transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-soft-white mb-4">Connect With Us</h3>
                    <div className="flex space-x-4">
                        <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="hover:text-ion-blue transition-colors"><Github /></a>
                        <a href="https://x.com/your-handle" target="_blank" rel="noopener noreferrer" className="hover:text-ion-blue transition-colors"><X /></a>
                        <a href="https://linkedin.com/your-page" target="_blank" rel="noopener noreferrer" className="hover:text-ion-blue transition-colors"><Linkedin /></a>
                        <a href="https://facebook.com/your-page" target="_blank" rel="noopener noreferrer" className="hover:text-ion-blue transition-colors"><Facebook /></a>
                        <a href="https://instagram.com/your-page" target="_blank" rel="noopener noreferrer" className="hover:text-ion-blue transition-colors"><Instagram /></a>
                        <a href="https://whatsapp.com/your-page" target="_blank" rel="noopener noreferrer" className="hover:text-ion-blue transition-colors"><Whatsapp /></a>
                        <a href="https://tiktok.com/your-page" target="_blank" rel="noopener noreferrer" className="hover:text-ion-blue transition-colors"><Tiktok /></a>
                        
                    </div>
                </div>
            </div>
            <div className="text-center mt-8 pt-8 border-t border-gray-800">
                <p>&copy; {new Date().getFullYear()} Applause. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
