import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MobileNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

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
                    <nav className="flex flex-col items-center gap-y-8 text-2xl">
                        <Link to="/about" className="text-gray-300 hover:text-ion-blue transition-colors">{t('about')}</Link>
                        <Link to="/faq" className="text-gray-300 hover:text-ion-blue transition-colors">{t('faq')}</Link>
                        <Link to="/login" className="text-gray-300 hover:text-ion-blue transition-colors">{t('login')}</Link>
                        <Link to="/signup" className="mt-4 px-6 py-3 bg-fusion-pink text-white font-bold rounded-lg hover:bg-opacity-90">
                            {t('signup')}
                        </Link>
                    </nav>
                </div>
            )}
        </>
    );
};

export default MobileNav;
