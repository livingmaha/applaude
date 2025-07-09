import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();
    return (
        <footer className="w-full bg-black bg-opacity-20 mt-16 p-6 text-center text-gray-400">
            <div className="flex justify-center gap-4 mb-4">
                 <Link to="/about" className="hover:text-ion-blue transition-colors">{t('about')}</Link>
                 <Link to="/faq" className="hover:text-ion-blue transition-colors">{t('faq')}</Link>
                 <Link to="/api" className="hover:text-ion-blue transition-colors">Partner API</Link>
                 <a href="#" className="hover:text-ion-blue transition-colors">Terms of Service</a>
            </div>
            <p>&copy; 2026 Applause Inc. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
