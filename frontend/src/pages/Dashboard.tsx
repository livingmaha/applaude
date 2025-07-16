import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import { Project } from '../types';
import { Plus, BarChart2, CheckCircle, Clock } from 'lucide-react';

const DashboardPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            if (!authContext?.isAuthenticated) return;
            try {
                const response = await apiClient.get('/projects/');
                setProjects(response.data);
            } catch (err: any) {
                setError('Failed to load your projects. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [authContext?.isAuthenticated]);

    const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
    const inProgressProjects = projects.length - completedProjects;

    const getStatusChip = (status: string) => {
        const statusMap: { [key: string]: { text: string, color: string } } = {
            'PENDING': { text: 'Pending', color: 'bg-yellow-200 text-yellow-800' },
            'COMPLETED': { text: 'Completed', color: 'bg-green-200 text-green-800' },
            'FAILED': { text: 'Failed', color: 'bg-red-200 text-red-800' },
        };
        const { text, color } = statusMap[status] || { text: status.replace(/_/g, ' '), color: 'bg-gray-200 text-gray-800' };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${color}`}>{text}</span>;
    };

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            <Header />
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Welcome, {authContext?.user?.username || 'User'}!</h1>
                    <Link to="/create-project" className="flex items-center gap-2 px-4 py-2 bg-fusion-pink text-white font-bold rounded-lg hover:bg-opacity-90 transition-all">
                        <Plus size={20} />
                        New Project
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Card className="p-6 flex items-center gap-4 bg-white">
                        <BarChart2 size={40} className="text-ion-blue" />
                        <div>
                            <p className="text-gray-500">Total Projects</p>
                            <p className="text-3xl font-bold">{projects.length}</p>
                        </div>
                    </Card>
                     <Card className="p-6 flex items-center gap-4 bg-white">
                        <CheckCircle size={40} className="text-green-500" />
                        <div>
                            <p className="text-gray-500">Completed</p>
                            <p className="text-3xl font-bold">{completedProjects}</p>
                        </div>
                    </Card>
                     <Card className="p-6 flex items-center gap-4 bg-white">
                        <Clock size={40} className="text-yellow-500" />
                        <div>
                            <p className="text-gray-500">In Progress</p>
                            <p className="text-3xl font-bold">{inProgressProjects}</p>
                        </div>
                    </Card>
                </div>

                <Card className="p-8 bg-white">
                    <h2 className="text-2xl font-bold mb-6">Your Projects</h2>
                    {loading ? (
                        <p>Loading projects...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : projects.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {projects.map((project) => (
                                        <tr key={project.id} onClick={() => navigate(`/project/${project.id}`)} className="hover:bg-gray-100 cursor-pointer">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{project.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.app_type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(project.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusChip(project.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 mb-4">You haven't created any projects yet.</p>
                            <Link to="/create-project" className="text-ion-blue font-bold hover:underline">Start your first project</Link>
                        </div>
                    )}
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default DashboardPage;
