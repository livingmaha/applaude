import React from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
    const { t } = useTranslation();
    return (
        <footer className="bg-gray-100 border-t">
            <div className="container mx-auto py-8 px-4 lg:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Applaude</h3>
                        <p className="text-gray-600 text-sm">Build mobile apps with AI</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Resources</h3>
                        <ul className="space-y-2">
                            <li><Link to="/api" className="text-sm text-gray-600 hover:underline hover:text-blue-600">API</Link></li>
                            <li><Link to="/support" className="text-sm text-gray-600 hover:underline hover:text-blue-600">Support</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Company</h3>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="text-sm text-gray-600 hover:underline hover:text-blue-600">About</Link></li>
                            <li><Link to="/blog" className="text-sm text-gray-600 hover:underline hover:text-blue-600">Blog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Legal</h3>
                        <ul className="space-y-2">
                            <li><Link to="/terms" className="text-sm text-gray-600 hover:underline hover:text-blue-600">Terms</Link></li>
                            <li><Link to="/privacy-policy" className="text-sm text-gray-600 hover:underline hover:text-blue-600">Privacy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-6 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Applaude, Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
