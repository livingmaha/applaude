import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import logoIcon from '../../assets/images/logo_icon.png';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8 xl:col-span-1">
                        <div className="flex items-center gap-2">
                             <img src={logoIcon} alt="Applaude Logo" className="h-8 w-auto" />
                             <span className="text-2xl font-bold text-black">Applaude</span>
                        </div>
                        <p className="text-gray-500 text-base">
                            The future of mobile apps, Lead the Applause.
                        </p>
                        <div className="flex space-x-6">
                            <a href="https://github.com/mugambi-ndeke/applaude" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">GitHub</span>
                                <Github className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-6 w-6" />
                            </a>
                             <a href="#" className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <Link to="/#how-it-works" className="text-base text-gray-500 hover:text-gray-900">How It Works</Link>
                                    </li>
                                     <li>
                                        <Link to="/pricing" className="text-base text-gray-500 hover:text-gray-900">Pricing</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">About</Link>
                                    </li>
                                     <li>
                                        <Link to="/blog" className="text-base text-gray-500 hover:text-gray-900">Blog</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                         <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                                <ul className="mt-4 space-y-4">
                                     <li>
                                        <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">Privacy Policy</Link>
                                    </li>
                                     <li>
                                        <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">Terms of Service</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <p className="text-base text-gray-400 xl:text-center">&copy; {new Date().getFullYear()} Applaude, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
