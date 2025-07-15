import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import MobileNav from './MobileNav';
import { AuthContext, useAuth } from '../../contexts/AuthContext';
import { Globe } from 'lucide-react';
import logoIcon from '../../assets/images/logo_icon.png';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t, i18n } = useTranslation();
    const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
    const auth = useAuth();

    const languages = [
        { code: 'en', name: 'English' }, { code: 'es', name: 'Español' },
        { code: 'fr', name: 'Français' }, { code: 'de', name: 'Deutsch' },
        { code: 'zh', name: '中文' }, { code: 'ja', name: '日本語' },
        { code: 'ar', name: 'العربية' }, { code: 'hi', name: 'हिन्दी' },
        { code: 'pt', name: 'Português' }, { code: 'ru', name: 'Русский' }
    ];

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setLangDropdownOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white bg-opacity-80 backdrop-blur-lg shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <img src={logoIcon} alt="Applause Logo" className="w-8 h-8" />
                <Link to="/" className="text-2xl font-bold text-black">Applause</Link>
            </div>
            <nav className="space-x-6 hidden md:flex items-center">
                <Link to="/about" className="text-black hover:text-ion-blue transition-colors">{t('about')}</Link>
                <Link to="/faq" className="text-black hover:text-ion-blue transition-colors">{t('faq')}</Link>
                <Link to="/blog" className="text-black hover:text-ion-blue transition-colors">Blog</Link>
                {auth.isAuthenticated ? (
                    <>
                        <Link to="/dashboard" className="text-black hover:text-ion-blue transition-colors">{t('dashboard')}</Link>
                        {auth.user?.is_superuser && (
                           <Link to="/admin/blog" className="text-black hover:text-ion-blue transition-colors">Admin</Link>
                        )}
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-black hover:text-ion-blue transition-colors">{t('login')}</Link>
                        <Link to="/signup" className="px-4 py-2 bg-fusion-pink text-white font-bold rounded-lg hover:bg-opacity-90">
                            {t('signup')}
                        </Link>
                    </>
                )}
                 <div className="relative">
                    <button onClick={() => setLangDropdownOpen(!isLangDropdownOpen)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <Globe size={20} />
                    </button>
                    {isLangDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                            {languages.map(lang => (
                                <button key={lang.code} onClick={() => changeLanguage(lang.code)} className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-ion-blue hover:text-black">
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </nav>
            <div className="md:hidden flex items-center gap-4">
                <div className="relative">
                    <button onClick={() => setLangDropdownOpen(!isLangDropdownOpen)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <Globe size={20} />
                    </button>
                    {isLangDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                           {languages.map(lang => (
                                <button key={lang.code} onClick={() => changeLanguage(lang.code)} className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-ion-blue hover:text-black">
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <MobileNav />
            </div>
        </header>
    );
};

export default Header;
