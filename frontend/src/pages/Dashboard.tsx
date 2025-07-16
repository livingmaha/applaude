import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { PlusCircle, Loader2 } from 'lucide-react';

import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProjectList from '../components/projects/ProjectList';
import NewProjectModal from '../components/projects/NewProjectModal';

interface Project {
    id: number;
    name: string;
    website_url: string;
    app_type: 'iOS' | 'Android';
    status: string;
    status_message: string;
}

const DashboardPage = () => {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects/');
                setProjects(response.data);
            } catch (error) {
                toast.error('Failed to fetch projects. Please try again.');
                console.error("Project fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleProjectCreated = (newProject: Project) => {
        setProjects(prevProjects => [newProject, ...prevProjects]);
        navigate(`/project/${newProject.id}`);
    };


    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header />

            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {t('welcome_back', { email: user?.email })}
                    </h1>
                    <Button onClick={handleLogout} variant="secondary">
                        {t('logout')}
                    </Button>
                </div>

                <Card>
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2 sm:mb-0">{t('my_projects')}</h2>
                             <Button onClick={() => setIsModalOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" /> {t('new_project')}
                            </Button>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader2 className="animate-spin h-8 w-8 text-ion-blue" />
                            </div>
                        ) : projects.length > 0 ? (
                            <ProjectList projects={projects} />
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-500">{t('no_projects')}</p>
                                <Button onClick={() => setIsModalOpen(true)} className="mt-4">
                                    <PlusCircle className="mr-2 h-4 w-4" /> {t('new_project')}
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>
            </main>

            <NewProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={handleProjectCreated}
            />

            <Footer />
        </div>
    );
};

export default DashboardPage;
