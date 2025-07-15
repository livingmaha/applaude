import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { AuthContext } from '../contexts/AuthContext';
import { ChevronDown } from 'lucide-react';


interface Project {
  id: number;
  name: string;
}


const AnalyticsChatAgent = () => (
    <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Applause Prime Analytics</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-700">"Your active users are up 15% this week! This is likely due to your recent marketing campaign. Keep up the great work."</p>
        </div>
    </div>
);

const ProjectSelector: React.FC<{ currentProjectId: string; userProjects: Project[] }> = ({ currentProjectId, userProjects }) => {
    const navigate = useNavigate();

    const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newProjectId = event.target.value;
        navigate(`/projects/${newProjectId}/analytics`);
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


const ProjectAnalyticsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const fetchAnalyticsAndProjects = async () => {
            if (!id || !authContext?.user) return;
            setLoading(true);
            try {
                // Fetch analytics for the current project
                const analyticsResponse = await apiClient.get(`/analytics/${id}/`);
                setData(analyticsResponse.data);

                // Fetch all projects for the user to populate the dropdown
                const projectsResponse = await apiClient.get('/projects/');
                setProjects(projectsResponse.data);

            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsAndProjects();
    }, [id, authContext?.user]);

    const handleDownloadPdf = () => {
        // PDF generation logic would go here
        alert('Downloading PDF report...');
    };

    if (loading) return <div>Loading analytics...</div>;

    const currentProjectName = projects.find(p => p.id === parseInt(id || ''))?.name || 'Project';

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Analytics: {currentProjectName}</h1>
                {projects.length > 1 && id && (
                    <ProjectSelector currentProjectId={id} userProjects={projects} />
                )}
            </div>
            <Card>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="active_users" fill="#00E5FF" />
                        <Bar dataKey="downloads" fill="#FF007A" />
                    </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-end">
                    <Button onClick={handleDownloadPdf}>Download as PDF</Button>
                </div>
            </Card>
            <AnalyticsChatAgent />
        </div>
    );
};

export default ProjectAnalyticsPage;
