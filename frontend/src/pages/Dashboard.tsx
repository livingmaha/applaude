import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';
import { PlusCircle, User, Copy } from 'lucide-react';
import Card from '../components/ui/Card';

// Define the type for a project object
interface Project {
  id: number;
  name: string;
  status: string;
  app_type: string;
  created_at: string;
  status_message?: string;
  deployment_platform?: string;
}

const Dashboard = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    if (!authContext) throw new Error("Dashboard must be within an AuthProvider");
    const { user, logout } = authContext;

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await apiClient.get('/projects/');
                setProjects(response.data);
            } catch (err) {
                setError('Failed to fetch projects.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const installationInstructions = `
1. Copy the link displayed above.
2. Send the link to your mobile phone device.
3. Click on the link (the app will start to download).
4. When the download finishes, open the mobile app to install.
    `;

    return (
        <div className="min-h-screen text-soft-white bg-quantum-black p-8">
            <header className="flex justify-between items-center mb-12 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-soft-white">Your Dashboard</h1>
                    {user && <p className="text-ion-blue">Welcome back, {user.email}</p>}
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/profile" className="p-2 rounded-full hover:bg-gray-700 transition-colors" title="My Profile">
                        <User size={22} />
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-solar-orange text-black font-bold rounded-lg hover:bg-opacity-90 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </header>

          <main>
        <div className="flex justify-between items-center mb-6 animate-slide-in-right">
            <h2 className="text-2xl font-semibold">My Projects</h2>
            <Link to="/projects/create" className="flex items-center gap-2 px-4 py-2 bg-fusion-pink text-white font-bold rounded-lg hover:bg-opacity-90 transition-all">
                <PlusCircle size={20} />
                New Project
            </Link>
        </div>

        {loading && <p>Loading projects...</p>}
        {error && <p className="text-solar-orange">{error}</p>}
        
        {!loading && projects.length === 0 ? (
            <Card className="p-8 text-center animate-fade-in">
                <p className="text-gray-400">You haven't created any projects yet. Click 'New Project' to begin.</p>
            </Card>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <Card key={project.id} className="p-6 h-full flex flex-col justify-between animate-fade-in transform transition-transform duration-300 ease-in-out">
                        <Link to={`/projects/${project.id}`} className="block">
                            <div>
                                <h3 className="text-xl font-bold text-ion-blue mb-2">{project.name}</h3>
                                <p className="text-sm text-gray-400 mb-4">Platform: {project.app_type}</p>
                            </div>
                            <div className="mt-auto">
                                <span className="text-xs font-semibold px-3 py-1 bg-gray-700 rounded-full">
                                    {project.status_message || project.status}
                                </span>
                            </div>
                        </Link>
                        {project.deployment_platform === 'Applause' && project.status === 'COMPLETED' && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <h4 className="text-lg font-bold mb-2">Your App is Ready!</h4>
                                <div className="flex items-center gap-2 mb-2">
                                    <a href={`https://cdn.applause.ai/apps/${project.id}/app.apk`} target="_blank" rel="noreferrer" className="text-ion-blue hover:underline truncate">https://cdn.applause.ai/apps/{project.id}/app.apk</a>
                                    <button onClick={() => handleCopy(`https://cdn.applause.ai/apps/${project.id}/app.apk`)} className="p-1 hover:bg-gray-700 rounded"><Copy size={16} /></button>
                                </div>
                                <div className="text-sm text-gray-400 mb-2 whitespace-pre-wrap">{installationInstructions}</div>
                                <button onClick={() => handleCopy(installationInstructions)} className="flex items-center gap-2 text-sm text-ion-blue hover:underline"><Copy size={14}/> Copy Instructions</button>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
