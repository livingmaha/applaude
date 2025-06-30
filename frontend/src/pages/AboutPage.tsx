import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-quantum-black text-soft-white">
            <Header />
            <main className="pt-32 pb-16 px-8 max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-ion-blue to-fusion-pink">
                    The Future of Mobile Apps
                </h1>
                <p className="text-xl text-center text-gray-300 mb-16">
                    Applause was founded on a simple principle: your vision for a mobile application should not be limited by technical barriers. We are a team of AI engineers and designers dedicated to building a platform that empowers creators, entrepreneurs, and businesses to bring their ideas to life, instantly.
                </p>
                <Card className="p-8">
                    <h2 className="text-3xl font-bold mb-4">Our Technology</h2>
                    <p className="text-gray-400">
                        Our platform is powered by a sophisticated system of interconnected AI agents. Each agent is a specialist in its domain—from market analysis and brand design to native code generation. When you create a project, you're not just using a tool; you're collaborating with a world-class AI team dedicated to realizing your vision with precision and creativity.
                    </p>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default AboutPage;
