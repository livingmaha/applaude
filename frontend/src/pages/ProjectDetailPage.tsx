import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api'; // Corrected import path
import { useAuthStore } from '../stores/useAuth'; // Corrected import path

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Loader, AlertTriangle, ArrowLeft, FileQuestion } from 'lucide-react';
import CodeBlock from '../components/ui/CodeBlock'; // Corrected import path

interface MobileApp {
    id: string;
    platform: string;
    highlighted_code: string;
}

interface ProjectDetails {
    id: string;
    name: string;
    source_url: string;
    created_at: string;
    apps: MobileApp[];
    testimonials: any[];
}

const fetchProjectDetails = async (projectId: string): Promise<ProjectDetails> => {
    const { data } = await api.get(`/projects/${projectId}/`);
    return data;
};


const ProjectDetailPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);


    const { data: project, isLoading, isError, error } = useQuery<ProjectDetails, Error>({
        queryKey: ['projectDetails', projectId],
        queryFn: () => fetchProjectDetails(projectId!),
        enabled: isAuthenticated && !!projectId,
    });

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader className="animate-spin h-12 w-12 text-ion-blue" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <main className="flex-grow container mx-auto px-6 py-12 flex items-center justify-center">
                    <div className="text-center bg-white p-12 rounded-lg shadow-lg">
                        <FileQuestion className="mx-auto h-16 w-16 text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Project Not Found</h2>
                        <p className="text-gray-600 mb-6 max-w-md">{error?.message || "An unexpected error occurred."}</p>
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center px-6 py-3 font-semibold text-white bg-ion-blue rounded-lg hover:bg-blue-700 transition-all"
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Return to Dashboard
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-6 py-12">
                {project && (
                    <>
                        <div className="mb-8">
                            <Link to="/dashboard" className="text-ion-blue hover:underline flex items-center mb-4">
                               <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                            </Link>
                            <h1 className="text-4xl font-bold text-gray-800">{project.name}</h1>
                            <a href={project.source_url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-fusion-pink">
                                {project.source_url}
                            </a>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md">
                           <h2 className="text-2xl font-semibold mb-4">Generated Application Code</h2>
                           {project.apps && project.apps.length > 0 ? (
                               project.apps.map(app => (
                                   <div key={app.id}>
                                       <h3 className="text-xl font-semibold mt-6 mb-2">{app.platform} Code</h3>
                                       <CodeBlock htmlContent={app.highlighted_code} />
                                   </div>
                               ))
                           ) : (
                               <p>No application code has been generated for this project yet.</p>
                           )}
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default ProjectDetailPage;
