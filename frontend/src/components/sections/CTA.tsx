import React from 'react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Rocket } from 'lucide-react';

const CTA: React.FC = () => {
    const navigate = useNavigate();
    
    return (
        <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative container mx-auto text-center py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
                        <Rocket className="w-4 h-4 mr-2" />
                        Ready to Launch Your App?
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                        Transform Your Website Into a 
                        <span className="block text-yellow-300">Mobile App Today</span>
                    </h2>
                    
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
                        Join thousands of businesses who've already launched their mobile apps with Applaude. 
                        No coding required, just your website URL.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button 
                            size="lg" 
                            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            onClick={() => navigate('/signup')}
                        >
                            Start Building for Free
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg"
                            className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300"
                            onClick={() => navigate('/about')}
                        >
                            Learn How It Works
                        </Button>
                    </div>
                    
                    {/* Trust indicators */}
                    <div className="mt-12 pt-8 border-t border-white/20">
                        <p className="text-sm opacity-75 mb-4">Trusted by developers worldwide</p>
                        <div className="flex justify-center items-center space-x-8 opacity-60">
                            <div className="text-2xl font-bold">1000+</div>
                            <div className="text-sm">Apps Generated</div>
                            <div className="w-px h-8 bg-white/30"></div>
                            <div className="text-2xl font-bold">50+</div>
                            <div className="text-sm">Countries</div>
                            <div className="w-px h-8 bg-white/30"></div>
                            <div className="text-2xl font-bold">99%</div>
                            <div className="text-sm">Satisfaction</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;