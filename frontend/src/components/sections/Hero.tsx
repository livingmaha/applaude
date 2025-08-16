import React from 'react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Zap, Smartphone } from 'lucide-react';

const Hero: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="relative container mx-auto px-4 py-20 md:py-32">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-8">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI-Powered Mobile App Generation
                    </div>

                    {/* Main headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {t('tagline')}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                        {t('sub_tagline')}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Button 
                            size="lg" 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            onClick={() => navigate('/signup')}
                        >
                            <Zap className="w-5 h-5 mr-2" />
                            {t('start_building')}
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg"
                            className="px-8 py-4 text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-300"
                            onClick={() => navigate('/about')}
                        >
                            Learn More
                        </Button>
                    </div>

                    {/* Features grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Smartphone className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">AI-Powered Generation</h3>
                            <p className="text-gray-600">Our AI agents analyze your website and generate native mobile apps automatically.</p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                            <p className="text-gray-600">Get your mobile app in minutes, not months. No coding required.</p>
                        </div>
                        <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="w-8 h-8 text-pink-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Production Ready</h3>
                            <p className="text-gray-600">Get complete source code ready for app store submission.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;