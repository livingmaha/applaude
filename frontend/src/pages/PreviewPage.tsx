import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import AppSimulator from '../components/core/AppSimulator';
import ChatWindow from '../components/core/ChatWindow';
import DeploymentModal from '../components/core/DeploymentModal';
import PaymentModal from '../components/core/PaymentModal';
import { Loader2, ChevronDown } from 'lucide-react';

interface Project {
    id: number;
    name: string;
    status: string;
    status_message?: string;
    brand_palette?: {
        primary: string;
        secondary: string;
        background: string;
        text_dark: string;
    };
}

const ProjectSelector: React.FC<{ currentProjectId: string; userProjects: Project[] }> = ({ currentProjectId, userProjects }) => {
    const navigate = useNavigate();

    const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newProjectId = event.target.value;
        navigate(`/projects/${newProjectId}/preview`);
    };

    return (
        <div className="relative">
            <select
                value={currentProjectId}
                onChange={handleProjectChange}
                className="appearance-none p-2 pr-8 border border-gray-300 rounded-md bg-white text-black font-bold focus:outline-none focus:ring-2 focus:ring-ion-blue"
            >
                {userProjects.map(project => (
                    <option key={project.id} value={project.id}>
                        {project.name}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-black pointer-events-none" />
        </div>
    );
};

const BuildAndPreviewPage = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isDeploymentModalOpen, setDeploymentModalOpen] = useState(false);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<{text: string, sender: string}[]>([]);
    const [chatInput, setChatInput] = useState('');

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const projectDetailsPromise = apiClient.get(`/projects/${id}/`);
                const allProjectsPromise = apiClient.get('/projects/');
                
                const [detailsResponse, projectsResponse] = await Promise.all([projectDetailsPromise, allProjectsPromise]);

                setProject(detailsResponse.data);
                setAllProjects(projectsResponse.data);

                if (detailsResponse.data.status !== 'COMPLETED') {
                    // Set up polling only if the project isn't completed
                    const interval = setInterval(() => {
                        apiClient.get(`/projects/${id}/`).then(res => {
                           setProject(res.data)
                           if (res.data.status === 'COMPLETED') {
                               clearInterval(interval);
                           }
                        }).catch(console.error);
                    }, 5000);
                    return () => clearInterval(interval);
                }
            } catch (err) {
                setError('Failed to fetch project details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [id]);

    const openDeploymentModal = () => setDeploymentModalOpen(true);
    const closeDeploymentModal = () => setDeploymentModalOpen(false);
    const openPaymentModal = () => setPaymentModalOpen(true);
    const closePaymentModal = () => setPaymentModalOpen(false);
    
    const handleDeploymentOptionClick = () => {
        closeDeploymentModal();
        openPaymentModal();
    };
    
    const handleSendMessage = (message: string | object) => {
        console.log("Sending message:", message);
        const userMessage = typeof message === 'string' ? message : (message as any).text;
        setChatMessages(prev => [...prev, {text: userMessage, sender: 'user'}]);
    };

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-ion-blue" /></div>;
    }

    if (error) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">{project?.name} - Build & Preview</h1>
                {allProjects.length > 1 && id && (
                    <ProjectSelector currentProjectId={id} userProjects={allProjects} />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">AI Agent Swarm Status</h2>
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p>{project?.status_message || project?.status}</p>
                    </div>

                    {project?.status === 'COMPLETED' && (
                         <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-4">Improve Your App</h2>
                            <p className="text-gray-400 mb-4">Use the chat below to provide text prompts for improvements.</p>
                             <ChatWindow 
                                messages={chatMessages}
                                onSendMessage={handleSendMessage}
                                input={chatInput}
                                setInput={setChatInput}
                                placeholder="Chat with Applause Prime..."
                             />
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
