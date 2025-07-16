import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import MobileNav from './MobileNav';
import { AuthContext } from '../../contexts/AuthContext';
import { Globe, Search } from 'lucide-react';
import logoIcon from '../../assets/images/logo_icon.png';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { t, i18n } = useTranslation();
    const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const authContext = useContext(AuthContext);

    const languages = [
        { code: 'en', name: 'English' }, { code: 'zh', name: '中文' },
        { code: 'fr', name: 'Français' }, { code: 'es', name: 'Español' },
        { code: 'hi', name: 'हिन्दी' }, { code: 'ar', name: 'العربية' },
        { code: 'pt', name: 'Português' }, { code: 'ru', name: 'Русский' },
        { code: 'ja', name: '日本語' }, { code: 'de', name: 'Deutsch' }
    ];

    const filteredLanguages = languages.filter(lang =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setLangDropdownOpen(false);
        setSearchTerm('');
    };

    return (
        <header className="sticky top-0 z-50 bg-white bg-opacity-80 backdrop-blur-lg shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <img src={logoIcon} alt="Applaude Logo" className="w-8 h-8" />
                <Link to="/" className="text-2xl font-bold text-black">Applaude</Link>
            </div>
            <nav className="space-x-6 hidden md:flex items-center">
                <Link to="/about" className="text-black hover:text-ion-blue transition-colors">{t('about')}</Link>
                <Link to="/faq" className="text-black hover:text-ion-blue transition-colors">{t('faq')}</Link>
                <Link to="/blog" className="text-black hover:text-ion-blue transition-colors">Blog</Link>
                {authContext?.isAuthenticated ? (
                    <>
                        <Link to="/dashboard" className="text-black hover:text-ion-blue transition-colors">{t('dashboard')}</Link>
                        <button onClick={authContext.logout} className="text-black hover:text-ion-blue transition-colors">{t('logout')}</button>
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
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50">
                            <div className="p-2 flex items-center border-b border-gray-200">
                                <Search size={18} className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search language"
                                    className="w-full pl-2 focus:outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {filteredLanguages.map(lang => (
                                    <button key={lang.code} onClick={() => changeLanguage(lang.code)} className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-ion-blue hover:text-black">
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            <div className="md:hidden">
                <MobileNav />
            </div>
        </header>
    );
};

export default Header;
