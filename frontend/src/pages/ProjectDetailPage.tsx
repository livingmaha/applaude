
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/api';
import Card from '../components/ui/Card';
import paymentService from '../services/paymentService';

interface ProjectDetails {
    id: number;
    name: string;
    status: string;
    source_url: string;
    app_type: string;
    user_persona_document?: string;
    brand_palette?: {
        primary: string;
        secondary: string;
        text_light: string;
        text_dark: string;
        background: string;
    };
}

const ProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                const response = await apiClient.get(`/projects/${id}/`);
                setProject(response.data);
            } catch (err) {
                setError('Failed to fetch project details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    const handleMonetization = async () => {
        if (!project) return;
        try {
            const paymentData = await paymentService.initializePayment(project.id);
            // Redirect user to Paystack's checkout page
            window.location.href = paymentData.authorization_url;
        } catch (error) {
            console.error("Failed to start payment process:", error);
            alert("Could not initiate payment. Please try again later.");
        }
    };

    if (loading) return <div className="text-center p-10 text-soft-white">Loading Project...</div>;
    if (error) return <div className="text-center p-10 text-solar-orange">{error}</div>;
    if (!project) return <div className="text-center p-10 text-soft-white">Project not found.</div>;

    return (
        <div className="min-h-screen bg-quantum-black text-soft-white p-8">
            <Link to="/dashboard" className="text-ion-blue hover:underline mb-8 block">&larr; Back to Dashboard</Link>
            
            <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
            <p className="text-lg text-gray-400 mb-4">Status: <span className="font-semibold text-solar-orange">{project.status}</span></p>
            <p className="mb-8">Source URL: <a href={project.source_url} target="_blank" rel="noopener noreferrer" className="text-ion-blue">{project.source_url}</a></p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-4">AI Market Analysis: User Persona</h2>
                    {project.user_persona_document ? (
                        <pre className="whitespace-pre-wrap font-sans text-gray-300">{project.user_persona_document}</pre>
                    ) : (
                        <p className="text-gray-400">AI analysis is pending...</p>
                    )}
                </Card>
                <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-4">AI Design Analysis: Brand Palette</h2>
                    {project.brand_palette ? (
                        <div className="space-y-3">
                            {Object.entries(project.brand_palette).map(([name, color]) => (
                                <div key={name} className="flex items-center justify-between">
                                    <span className="capitalize">{name}</span>
                                    <div className="flex items-center gap-2">
                                        <span>{color}</span>
                                        <div className="w-6 h-6 rounded border border-gray-500" style={{ backgroundColor: color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">AI analysis is pending...</p>
                    )}
                </Card>
            </div>

            {/* Monetization Section - Correctly placed outside the grid */}
            {project.status === 'DESIGN_COMPLETE' && (
                 <Card className="mt-8 p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Ready for Launch?</h2>
                            <p className="text-gray-400">Generate and download your mobile application.</p>
                        </div>
                        <button
                            onClick={handleMonetization}
                            className="mt-4 md:mt-0 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-fusion-pink to-solar-orange text-white font-bold rounded-lg hover:scale-105 transition-transform"
                        >
                            Generate App ($50.00)
                        </button>
                    </div>
                </Card>
            )}
        </div>
    );
};
            
export default ProjectDetailPage;
