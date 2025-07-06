import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ApiPage = () => {

    const handleApiKeyRequest = (e: React.FormEvent) => {
        e.preventDefault();
        // This would trigger the backend to create an ApiClient and initiate payment
        alert("This form is a placeholder. In a real application, this would initiate the payment flow.");
    };

    return (
        <div className="min-h-screen bg-quantum-black text-soft-white">
            <Header />
            <main className="pt-32 pb-16 px-8 max-w-5xl mx-auto">
                <section className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-ion-blue to-fusion-pink">
                        Build with Applause: The Partner API
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Easily integrate Applause into your platform and empower your users to create mobile apps with a single API call.
                    </p>
                </section>

                <section className="mb-16">
                    <h2 className="text-4xl font-bold text-center mb-8">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <Card className="p-6">
                            <h3 className="text-2xl font-bold mb-2">1. Sign Up</h3>
                            <p className="text-gray-400">Provide your business details and get ready to connect.</p>
                        </Card>
                        <Card className="p-6">
                            <h3 className="text-2xl font-bold mb-2">2. Get API Key</h3>
                            <p className="text-gray-400">After a one-time setup fee, your unique API key is activated.</p>
                        </Card>
                        <Card className="p-6">
                            <h3 className="text-2xl font-bold mb-2">3. Make API Call</h3>
                            <p className="text-gray-400">Start creating apps for your users instantly.</p>
                        </Card>
                    </div>
                </section>

                <section className="mb-16">
                    <h2 className="text-4xl font-bold text-center mb-8">Endpoint Documentation</h2>
                    <Card className="p-8 font-mono text-sm">
                        <h3 className="text-xl font-bold text-solar-orange mb-2">Create Project</h3>
                        <p className="mb-4"><span className="font-bold text-ion-blue">POST</span> /api/v1/projects/create</p>

                        <h4 className="font-bold mb-2">Authentication</h4>
                        <p className="mb-4">Include your API Key in the request header.</p>
                        <pre className="bg-gray-800 p-4 rounded-lg mb-4"><code>X-API-Key: &lt;YOUR_API_KEY&gt;</code></pre>

                        <h4 className="font-bold mb-2">Request Body</h4>
                        <pre className="bg-gray-800 p-4 rounded-lg mb-4"><code>
{`{
    "source_url": "https://example-customer.com",
    "app_type": "ANDROID"
}`}
                        </code></pre>

                        <h4 className="font-bold mb-2">Success Response (201 Created)</h4>
                        <pre className="bg-gray-800 p-4 rounded-lg"><code>
{`{
    "id": 123,
    "name": "App for example-customer.com",
    "status": "ANALYSIS_PENDING",
    ...
}`}
                        </code></pre>
                    </Card>
                </section>

                <section id="get-api-key">
                    <h2 className="text-4xl font-bold text-center mb-8">Get Your API Key</h2>
                     <Card className="max-w-xl mx-auto p-8">
                         <form onSubmit={handleApiKeyRequest} className="space-y-6">
                            <p className="text-center text-lg">The API is usage-based at a rate of <span className="font-bold text-solar-orange">$10 per app created</span>, with an initial setup fee.</p>
                             <Input type="text" placeholder="Business Name" required />
                             <Input type="url" placeholder="https://your-business.com" required />
                             <Input type="email" placeholder="Contact Email" required />
                             <Button type="submit" variant="primary" className="w-full">Proceed to Payment</Button>
                         </form>
                     </Card>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ApiPage;
