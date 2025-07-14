import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import MobileNav from './MobileNav';
import { AuthContext } from '../../contexts/AuthContext';
import { MessageSquare, Globe } from 'lucide-react';
import ChatWindow from '../core/ChatWindow';
import logoIcon from '../../assets/images/logo_icon.png';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
    const { t, i18n } = useTranslation();
    const [isLangDropdownOpen, setLangDropdownOpen] = useState(false);
    const auth = useAuth();

    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("Header must be within AuthProvider");
    const {
        isAuthenticated,
        isSubscribed,
        isPaymentModalOpen,
        closePaymentConversation,
        paymentConversation,
        sendPaymentMessage
    } = authContext;

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
        <header /* ... */>
            {/* ... Logo */}
            <nav className="space-x-6 hidden md:flex items-center">
                <Link to="/about" className="text-gray-300 hover:text-ion-blue transition-colors">{t('about')}</Link>
                <Link to="/faq" className="text-gray-300 hover:text-ion-blue transition-colors">{t('faq')}</Link>
                <Link to="/blog" className="text-gray-300 hover:text-ion-blue transition-colors">Blog</Link>
                {auth.isAuthenticated ? (
                    <>
                        <Link to="/dashboard" className="text-gray-300 hover:text-ion-blue transition-colors">{t('dashboard')}</Link>
                        {auth.user?.is_superuser && (
                           <Link to="/admin/blog" className="text-gray-300 hover:text-ion-blue transition-colors">Admin</Link>
                        )}
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-300 hover:text-ion-blue transition-colors">{t('login')}</Link>
                        <Link to="/signup" className="px-4 py-2 bg-fusion-pink text-white font-bold rounded-lg hover:bg-opacity-90">
                            {t('signup')}
                        </Link>
                    </>
                )}
                 <div className="relative">
                    <button onClick={() => setLangDropdownOpen(!isLangDropdownOpen)} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <Globe size={20} />
                    </button>
                    {isLangDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1">
                            {languages.map(lang => (
                                <button key={lang.code} onClick={() => changeLanguage(lang.code)} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-ion-blue hover:text-black">
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </nav>
            <div className="md:hidden flex items-center gap-4">
                <div className="relative">
                    <button onClick={() => setLangDropdownOpen(!isLangDropdownOpen)} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
                        <Globe size={20} />
                    </button>
                    {isLangDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                           {languages.map(lang => (
                                <button key={lang.code} onClick={() => changeLanguage(lang.code)} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-ion-blue hover:text-black">
                                    {lang.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <MobileNav />
            </div>

            {isPaymentModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
                    <div className="relative w-full max-w-2xl">
                         <button onClick={closePaymentConversation} className="absolute top-0 right-0 mt-4 mr-4 text-soft-white hover:text-ion-blue z-10 text-2xl font-bold">&times;</button>
                        <ChatWindow
                            messages={paymentConversation.messages}
                            onSendMessage={sendPaymentMessage}
                            input={paymentConversation.input}
                            setInput={(value) => authContext.setPaymentConversation(prev => ({ ...prev, input: value }))}
                            placeholder="Select a plan or ask a question..."
                            interactiveOptions={paymentConversation.interactiveOptions}
                        />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
