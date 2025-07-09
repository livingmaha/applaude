import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import { ChevronDown } from 'lucide-react';

const FAQPage = () => {
    const [open, setOpen] = useState<number | null>(null);

    const faqs = [
        {
            question: "How does the AI work?",
            answer: "Our platform uses a swarm of specialized AI agents. Each agent is an expert in a specific domain, like market analysis, design, or coding. They work together to build your app from the ground up, just like a human team would."
        },
        {
            question: "What do I get when I download my app?",
            answer: "You receive the complete source code for a native mobile application, built for the platform you selected (iOS or Android). This includes all the files you need to compile and submit your app to the app stores."
        },
        {
            question: "Can I really do this with no coding experience?",
            answer: "Absolutely! Our platform is designed for non-technical users. You provide your website URL and make some high-level choices, and our AI agents handle all the coding for you."
        },
        {
            question: "What if I want to make changes to my app after it's generated?",
            answer: "You own the source code, so you or a developer can make any changes you want. We are also working on a feature to allow you to make changes directly on our platform."
        },
        {
            question: "How long does it take to get my app?",
            answer: "The initial AI analysis and design phase takes just a few minutes. The full code generation can take a bit longer, but you'll have a complete, ready-to-use app in a fraction of the time it would take to build one traditionally."
        },
        {
            question: "Is my app unique?",
            answer: "Yes. While our AI uses best practices and pre-defined architectures, the final app is tailored to your brand, content, and the user persona generated from your website."
        },
        {
            question: "What if I need help?",
            answer: "We have a dedicated support team ready to assist you. You can reach out to us via the chat on our platform or by emailing support@applause.ai."
        }
    ];

    const toggle = (index: number) => {
        if (open === index) {
            return setOpen(null);
        }
        setOpen(index);
    };

    return (
        <div className="min-h-screen bg-quantum-black text-soft-white">
            <Header />
            <main className="pt-32 pb-16 px-8 max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-ion-blue to-fusion-pink">
                    Frequently Asked Questions
                </h1>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <Card key={index} className="p-0">
                            <div className="p-6 cursor-pointer flex justify-between items-center" onClick={() => toggle(index)}>
                                <h2 className="text-xl font-bold">{faq.question}</h2>
                                <ChevronDown className={`transform transition-transform ${open === index ? 'rotate-180' : ''}`} />
                            </div>
                            {open === index && (
                                <div className="p-6 border-t border-white border-opacity-10">
                                    <p className="text-gray-300">{faq.answer}</p>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FAQPage;
