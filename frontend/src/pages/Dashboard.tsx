import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../store/auth';
import { api } from '../api/axios';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { PlusCircle, Loader, AlertTriangle, ArrowRight } from 'lucide-react';

// Define the type for a single project
interface Project {
    id: string;
    name: string;
    source_url: string;
    created_at: string;
    apps_count: number; // Example derived property
    testimonials_count: number; // Example derived property
}

const fetchProjects = async (token: string | null): Promise<Project[]> => {
    if (!token) {
        throw new Error("Authentication token not found.");
    }
    const { data } = await api.get('/projects/', {
        headers: { Authorization: `Token ${token}` }
    });
    // Here you could map/add derived properties like apps_count
    return data.map((p: any) => ({
        ...p,
        apps_count: p.apps?.length || 0,
        testimonials_count: p.testimonials?.length || 0,
    }));
};

const Dashboard = () => {
    const { token, user } = useAuth();
    const { data: projects, isLoading, isError, error } = useQuery<Project[], Error>({
        queryKey: ['projects'],
        queryFn: () => fetchProjects(token),
        enabled: !!token, // Only run the query if the token exists
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome back, {user?.username || 'Developer'}!
                    </h1>
                    <Link
                        to="/create-project"
                        className="flex items-center px-4 py-2 font-semibold text-white bg-fusion-pink rounded-lg hover:bg-opacity-90 transition-all shadow-sm"
                    >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Create New Project
                    </Link>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center py-10">
                        <Loader className="animate-spin h-8 w-8 text-ion-blue" />
                        <p className="ml-4 text-gray-600">Loading your projects...</p>
                    </div>
                )}

                {isError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                        <div className="flex">
                            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
                            <div>
                                <p className="font-bold">Error loading projects</p>
                                <p>{error.message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {!isLoading && !isError && projects && projects.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h2>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Created on: {new Date(project.created_at).toLocaleDateString()}
                                    </p>
                                    <div className="flex space-x-4 text-sm text-gray-600">
                                        <span>{project.apps_count} App(s)</span>
                                        <span>{project.testimonials_count} Testimonial(s)</span>
                                    </div>
                                </div>
                                <Link to={`/project/${project.id}`} className="block bg-gray-50 px-6 py-4 text-ion-blue font-semibold hover:bg-gray-100 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <span>Manage Project</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
                
                {!isLoading && !isError && projects?.length === 0 && (
                     <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your dashboard is ready!</h2>
                        <p className="text-gray-500 mb-6">Start by creating your first project to upload an app and collect feedback.</p>
                        <Link
                            to="/create-project"
                            className="inline-flex items-center px-6 py-3 font-semibold text-white bg-ion-blue rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                        >
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Create Your First Project
                        </Link>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
