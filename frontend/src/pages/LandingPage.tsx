import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import logoIcon from '../assets/images/logo_icon.png';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex flex-col justify-between bg-quantum-black text-soft-white">
            <Header />
            <main className="flex flex-col items-center justify-center text-center p-8 flex-grow">
                 <img src={logoIcon} alt="Applause Logo" className="w-32 h-32 mb-8 animate-pulse" />
                <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-ion-blue to-fusion-pink">4X Your Business with a Custom App</h1>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl">No more spendy 6-9 month development cycles. Get your app in minutes.</p>
                <Link to="/signup" className="px-10 py-4 bg-gradient-to-r from-fusion-pink to-solar-orange text-white font-bold rounded-lg hover:scale-105 transition-transform text-xl">
                    {t('start_building')}
                </Link>
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
