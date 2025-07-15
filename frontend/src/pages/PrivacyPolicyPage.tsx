import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const PrivacyPolicyPage = () => {
    return (
        <div className="bg-white text-black">
            <Header />
            <main className="max-w-4xl mx-auto py-20 px-8">
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <div className="prose lg:prose-xl">
                    <p>Your privacy is important to us. It is Applause's policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.</p>
                    
                    <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>

                    <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
                    <p>Log data, information about your device, and personal information you provide to us directly.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicyPage;
