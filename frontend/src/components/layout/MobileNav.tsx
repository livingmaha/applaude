import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const MobileNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const auth = useAuth();

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <button onClick={toggleMenu} className="z-50">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-quantum-black bg-opacity-90 backdrop-blur-lg z-40 flex flex-col items-center justify-center"
                    onClick={toggleMenu}
                >
                    <nav className={`fixed top-0 right-0 h-full w-64 bg-gray-900 bg-opacity-90 backdrop-blur-sm p-8 z-40 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                        <ul className="space-y-6 text-xl">
                            <li><Link to="/about" onClick={toggleNav} className="hover:text-ion-blue transition-colors">{t('about')}</Link></li>
                            <li><Link to="/faq" onClick={toggleNav} className="hover:text-ion-blue transition-colors">{t('faq')}</Link></li>
                            <li><Link to="/blog" onClick={toggleNav} className="hover:text-ion-blue transition-colors">Blog</Link></li>
                            {auth.isAuthenticated ? (
                    <>
                        <li><Link to="/dashboard" onClick={toggleNav} className="hover:text-ion-blue transition-colors">{t('dashboard')}</Link></li>
                        {auth.user?.is_superuser && (
                        <li><Link to="/admin/blog" onClick={toggleNav} className="hover:text-ion-blue transition-colors">Admin</Link></li>
                        )}
                        <li><button onClick={() => { auth.logout(); toggleNav(); }} className="hover:text-ion-blue transition-colors">{t('logout')}</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login" onClick={toggleNav} className="hover:text-ion-blue transition-colors">{t('login')}</Link></li>
                        <li><Link to="/signup" onClick={toggleNav} className="px-4 py-2 bg-fusion-pink text-white font-bold rounded-lg hover:bg-opacity-90">{t('signup')}</Link></li>
                    </>
                )}
            </ul>
        </nav>
                </div>
            )}
        </>
    );
};

export default MobileNav;
