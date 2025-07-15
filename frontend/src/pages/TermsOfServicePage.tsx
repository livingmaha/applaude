import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const TermsOfServicePage = () => {
    return (
        <div className="bg-white text-black">
            <Header />
            <main className="max-w-4xl mx-auto py-20 px-8">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <div className="prose lg:prose-xl">
                    <p>Welcome to Applause! These terms and conditions outline the rules and regulations for the use of Applause's Website, located at applause.ai.</p>
                    <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Applause if you do not agree to take all of the terms and conditions stated on this page.</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Intellectual Property Rights</h2>
                    <p>Other than the content you own, under these Terms, Applause and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted a limited license only for purposes of viewing the material contained on this Website.</p>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-4">Restrictions</h2>
                    <p>You are specifically restricted from all of the following:</p>
                    <ul>
                        <li>publishing any Website material in any other media;</li>
                        <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
                        <li>publicly performing and/or showing any Website material;</li>
                        <li>using this Website in any way that is or may be damaging to this Website;</li>
                    </ul>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfServicePage;
