import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Testimonials from '@/components/sections/Testimonials';
import CTA from '@/components/sections/CTA';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <Hero />
            <Testimonials />
            <CTA />
            <Footer />
        </div>
    );
};

export default LandingPage;