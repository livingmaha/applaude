import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/api';
import AppSimulator from '../components/core/AppSimulator';
import ChatWindow from '../components/core/ChatWindow';
import DeploymentModal from '../components/core/DeploymentModal';
import PaymentModal from '../components/core/PaymentModal';
import { Loader2 } from 'lucide-react';

interface Project {
    id: number;
    name: string;
    status: string;
    brand_palette?: {
        primary: string;
        secondary: string;
        background: string;
        text_dark: string;
    };
}

const BuildAndPreviewPage = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeploymentModalOpen, setDeploymentModalOpen] = useState(false);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await apiClient.get(`/projects/${id}/`);
                setProject(response.data);
                if (response.data.status !== 'COMPLETED') {
                    setTimeout(fetchProject, 5000);
                }
            } catch (err) {
                setError('Failed to fetch project details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const openDeploymentModal = () => setDeploymentModalOpen(true);
    const closeDeploymentModal = () => setDeploymentModalOpen(false);

    const openPaymentModal = () => setPaymentModalOpen(true);
    const closePaymentModal = () => setPaymentModalOpen(false);

    const handleDeploymentOptionClick = () => {
        closeDeploymentModal();
        openPaymentModal();
    };


    if (loading) {
        return <div className="min-h-screen bg-quantum-black text-soft-white flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-ion-blue" /></div>;
    }

    if (error) {
        return <div className="min-h-screen bg-quantum-black text-soft-white flex items-center justify-center">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-quantum-black text-soft-white p-8">
            <h1 className="text-4xl font-bold text-center mb-8">{project?.name} - Build & Preview</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">AI Agent Swarm Status</h2>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p>{project?.status}</p>
                    </div>

                    {project?.status === 'COMPLETED' && (
                         <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-4">Improve Your App</h2>
                            <p className="text-gray-400 mb-4">Use the chat below to provide text prompts for improvements.</p>
                             <ChatWindow projectId={project.id} />
                         </div>
                    )}
                </div>
                <div>
                    <AppSimulator palette={project?.brand_palette}>
                        <div className="w-full h-full flex items-center justify-center">
                            {project?.status === 'COMPLETED' ? (
                                <div>
                                    <h3 style={{ color: project?.brand_palette?.text_dark }}>App Preview</h3>
                                </div>
                            ) : (
                                <Loader2 className="animate-spin h-10 w-10" style={{ color: project?.brand_palette?.primary }}/>
                            )}
                        </div>
                    </AppSimulator>
                     {project?.status === 'COMPLETED' && (
                        <div className="mt-8 flex justify-center gap-4">
                            <button className="bg-ion-blue text-black font-bold py-2 px-4 rounded">Improve the App</button>
                             <button onClick={openDeploymentModal} className="bg-fusion-pink text-white font-bold py-2 px-4 rounded">Deploy the App</button>
                         </div>
                    )}
                </div>
            </div>
            <DeploymentModal isOpen={isDeploymentModalOpen} onClose={closeDeploymentModal} onDeployClick={handleDeploymentOptionClick} />
            <PaymentModal isOpen={isPaymentModalOpen} onClose={closePaymentModal} />
        </div>
    );
};

export default BuildAndPreviewPage;
