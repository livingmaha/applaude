import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import heroImage from '../../assets/images/hero_image.png';

const Hero = () => {
    const { t } = useTranslation();

    return (
        <section className="bg-white text-black text-center py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight animate-fade-in">
                    {t('tagline')}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 animate-fade-in animation-delay-300">
                    {t('sub_tagline')}
                </p>
                <div className="animate-fade-in animation-delay-600">
                    <Link to="/signup">
                        <Button size="lg" className="bg-fusion-pink text-white hover:bg-opacity-90 transition-transform transform hover:scale-105">
                            {t('start_building')}
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="mt-12 max-w-6xl mx-auto animate-fade-in animation-delay-900">
                 <img src={heroImage} alt="Applaude Platform Showcase" className="rounded-lg shadow-2xl" />
            </div>
        </section>
    );
};

export default Hero;
