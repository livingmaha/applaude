import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';
import { PlusCircle } from 'lucide-react';
import Card from '../components/ui/Card';

// Define the type for a project object
interface Project {
  id: number;
  name: string;
  status: string;
  app_type: string;
  created_at: string;
  status_message?: string; // Add status_message to Project interface
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

  return (
    <div className="min-h-screen text-soft-white bg-quantum-black p-8">
      <header className="flex justify-between items-center mb-12 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-soft-white">Your Dashboard</h1>
          {user && <p className="text-ion-blue">Welcome back, {user.email}</p>}
        </div>
        <button 
          onClick={handleLogout}
          className="px-6 py-2 bg-solar-orange text-black font-bold rounded-lg hover:bg-opacity-90 transition-all"
        >
          Logout
        </button>
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
                    <Link to={`/projects/${project.id}`} key={project.id} className="block">
                        <Card className="p-6 h-full flex flex-col justify-between animate-fade-in transform transition-transform duration-300 ease-in-out">
                            <div>
                                <h3 className="text-xl font-bold text-ion-blue mb-2">{project.name}</h3>
                                <p className="text-sm text-gray-400 mb-4">Platform: {project.app_type}</p>
                            </div>
                            <div className="mt-auto">
                                <span className="text-xs font-semibold px-3 py-1 bg-gray-700 rounded-full">
                                    {project.status_message || project.status}
                                </span>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
