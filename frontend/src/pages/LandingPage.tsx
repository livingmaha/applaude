import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import logoIcon from '../assets/images/logo_icon.png';
import { useTranslation } from 'react-i18next';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';


const WordPressLogo = () => <img src="https://s.w.org/style/images/about/WordPress-logotype-wmark.png" alt="WordPress" className="h-12" />;
const WixLogo = () => <img src="https://static.wixstatic.com/media/48a2a42b4e3349aa9910d540c49b6a03.png/v1/fill/w_240,h_60,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/48a2a42b4e3349aa9910d540c49b6a03.png" alt="Wix" className="h-12" />;
const ShopifyLogo = () => <img src="https://cdn.shopify.com/shopify-marketing_assets/static/shopify-logo-dark.svg" alt="Shopify" className="h-12" />;

const LandingPage = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white text-black">
            <Header />
            <main className="flex-grow">
                <section className="text-center p-8 flex flex-col items-center justify-center">
                    <img src={logoIcon} alt="Applause Logo" className="w-32 h-32 mb-8 animate-pulse" />
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-ion-blue to-fusion-pink">4X Your Business with a Mobile App</h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl">No more spendy 6-9 months waits. Get your app in Mins.</p>
                    <Link to="/signup">
                        <Button variant="primary" size="lg">{t('start_building')}</Button>
                    </Link>
                </section>

                <section className="py-20 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-8">
                        <h2 className="text-4xl font-bold text-center mb-12">Why Applause is Your Unfair Advantage</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card>
                                <h3 className="text-2xl font-bold mb-4">Full Solution, Not a Component</h3>
                                <p className="text-gray-600">Other platforms give you pieces. We deliver a complete, ready-to-launch mobile application with a full codebase. No lock-in, full ownership.</p>
                            </Card>
                            <Card>
                                <h3 className="text-2xl font-bold mb-4">Real Codebase, No Lock-in</h3>
                                <p className="text-gray-600">You get the full source code. Host it, modify it, extend it. It's your asset, giving you ultimate freedom and control.</p>
                            </Card>
                        </div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="max-w-6xl mx-auto px-8 text-center">
                        <h2 className="text-4xl font-bold mb-12">Seamless Integrations</h2>
                        <div className="flex justify-center items-center space-x-12">
                            <WordPressLogo />
                            <WixLogo />
                            <ShopifyLogo />
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-8 text-center">
                        <h2 className="text-4xl font-bold mb-12">How It Works</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center">
                                <div className="text-5xl font-bold text-ion-blue mb-4">1</div>
                                <h3 className="text-2xl font-bold mb-2">Prompt & Strategize</h3>
                                <p className="text-gray-600">Provide your website URL or a simple prompt. Our AI analyzes your brand and strategizes the perfect app.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-5xl font-bold text-ion-blue mb-4">2</div>
                                <h3 className="text-2xl font-bold mb-2">Design & Build</h3>
                                <p className="text-gray-600">AI agents design the UI/UX and write the entire native codebase for iOS and Android.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="text-5xl font-bold text-ion-blue mb-4">3</div>
                                <h3 className="text-2xl font-bold mb-2">Test & Deploy</h3>
                                <p className="text-gray-600">We conduct rigorous QA and security scans before providing you with the final, deployable mobile app.</p>
                            </div>
                        </div>
                         <div className="mt-12">
                            <Link to="/signup">
                               <Button variant="primary" size="lg">{t('start_building')}</Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
