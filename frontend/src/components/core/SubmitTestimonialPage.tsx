import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import apiClient from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const SubmitTestimonialPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error("Please write your testimonial before submitting.");
            return;
        }
        setLoading(true);
        try {
            await apiClient.post('/testimonials/create/', {
                project: projectId,
                content: content,
            });
            toast.success("Thank you for your feedback! Your testimonial has been submitted for review.");
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to submit testimonial. Please try again.");
            console.error("Testimonial submission error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <main className="flex-grow container mx-auto p-8 flex items-center justify-center">
                <Card className="w-full max-w-2xl p-8">
                    <h1 className="text-3xl font-bold text-center mb-4">Share Your Experience</h1>
                    <p className="text-center text-gray-600 mb-8">Your story helps other creators like you. Tell us about your journey with Applause.</p>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            rows={8}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ion-blue focus:outline-none"
                            placeholder="I was amazed by how quickly..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="mt-6 flex justify-center">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Submitting..." : "Submit Testimonial"}
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default SubmitTestimonialPage;
