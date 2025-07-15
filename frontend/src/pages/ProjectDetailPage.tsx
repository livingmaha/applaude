import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../services/api';
import Card from '../components/ui/Card';
import { Loader2, CheckCircle, XCircle, BarChart2, MessageSquareText, Download, Upload, SlidersHorizontal, ChevronDown, Github } from 'lucide-react';
import AppSimulator from '../components/core/AppSimulator';
import { AuthContext } from '../contexts/AuthContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Switch } from '../components/ui/Switch';

interface Project {
    id: number;
    name: string;
}

interface ProjectDetails extends Project {
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
    status_message?: string;
    enable_ux_survey: boolean;
    enable_pmf_survey: boolean;
    app_ratings_summary?: any;
    user_feedback_summary?: any;
    survey_response_analytics?: any;
}

const ProjectSelector: React.FC<{ currentProjectId: string; userProjects: Project[] }> = ({ currentProjectId, userProjects }) => {
    const navigate = useNavigate();

    const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newProjectId = event.target.value;
        navigate(`/projects/${newProjectId}`);
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

const ProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("ProjectDetailPage must be used within an AuthProvider");
    }
    const { openPaymentConversation } = authContext;
    const [isPushingToGithub, setIsPushingToGithub] = useState(false);
    const [githubError, setGithubError] = useState('');

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch details for the current project
                const projectDetailsPromise = apiClient.get(`/projects/${id}/`);
                // Fetch the list of all projects for the dropdown
                const allProjectsPromise = apiClient.get('/projects/');

                const [detailsResponse, projectsResponse] = await Promise.all([projectDetailsPromise, allProjectsPromise]);

                setProject(detailsResponse.data);
                setAllProjects(projectsResponse.data);

            } catch (err) {
                setError('Failed to fetch project details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (searchParams.get('payment') === 'success') {
            navigate('/dashboard', { replace: true });
        } else {
            fetchProjectData();
            const interval = setInterval(() => {
                // Only poll the current project details, not the full list
                if (id) {
                    apiClient.get(`/projects/${id}/`).then(res => setProject(res.data)).catch(console.error);
                }
            }, 5000); 
            return () => clearInterval(interval);
        }
    }, [id, searchParams, navigate]);

    const handleSurveyToggle = async (surveyType: 'ux' | 'pmf') => {
        if (!project) return;
        const fieldName = surveyType === 'ux' ? 'enable_ux_survey' : 'enable_pmf_survey';
        const newStatus = !project[fieldName];

        try {
            const response = await apiClient.patch(`/projects/${project.id}/`, { [fieldName]: newStatus });
            setProject(response.data);
        } catch (err) {
            setError(`Failed to update ${surveyType} survey status.`);
            console.error(err);
        }
    };

    const renderStatusIcon = (status: string) => {
        if (status.includes('PENDING') || status.includes('GENERATION') || status.includes('UPDATE')) {
            return <Loader2 size={18} className="inline-block ml-2 animate-spin text-ion-blue" />;
        } else if (status.includes('COMPLETE')) {
            return <CheckCircle size={18} className="inline-block ml-2 text-green-500" />;
        } else if (status.includes('FAILED')) {
            return <XCircle size={18} className="inline-block ml-2 text-red-500" />;
        }
        return null;
    };

    const handlePushToGithub = async () => {
        if (!project) return;
        setIsPushingToGithub(true);
        setGithubError('');

        try {
            const response = await apiClient.post(`/projects/${project.id}/push-to-github/`);
            alert(`Successfully pushed to GitHub! Repo URL: ${response.data.repo_url}`);
        } catch (err: any) {
            setGithubError(err.response?.data?.error || 'Failed to push to GitHub.');
        } finally {
            setIsPushingToGithub(false);
        }
    };

    const handleDownloadCode = async () => {
        if (!project) return;
        try {
            const response = await apiClient.get(`/projects/${project.id}/download-code/`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${project.name}_codebase.zip`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (err) {
            setError('Failed to download codebase.');
            console.error(err);
        }
    };

    if (loading) return <div className="text-center p-10 text-white">Loading Project...</div>;
    if (error) return <div className="text-center p-10 text-solar-orange">{error}</div>;
    if (!project) return <div className="text-center p-10 text-white">Project not found.</div>;

    const isGenerationComplete = project.status.includes('COMPLETE');
    const chartData = project.app_ratings_summary ? Object.keys(project.app_ratings_summary).map(key => ({ name: `${key} Stars`, value: project.app_ratings_summary[key] })) : [];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
            <Link to="/dashboard" className="text-ion-blue hover:underline mb-4 block animate-fade-in">&larr; Back to Dashboard</Link>
            
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold animate-slide-in-right">{project.name}</h1>
                {allProjects.length > 1 && id && (
                    <ProjectSelector currentProjectId={id} userProjects={allProjects} />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <p className="text-lg text-gray-400 mb-4">
                            Status: <span className="font-semibold text-solar-orange">
                                {project.status_message || project.status}
                                {renderStatusIcon(project.status)}
                            </span>
                        </p>
                        <p className="mb-8 animate-fade-in">Source URL: <a href={project.source_url} target="_blank" rel="noopener noreferrer" className="text-ion-blue hover:underline">{project.source_url}</a></p>
                    </div>

                    <Card className="p-6 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-4">AI Market Analysis: User Persona</h2>
                        <pre className="whitespace-pre-wrap font-sans text-gray-300 text-sm max-h-60 overflow-y-auto">{project.user_persona_document || "AI analysis is pending..."}</pre>
                    </Card>

                    {isGenerationComplete && (
                        <Card className="p-6 animate-fade-in">
                            <h2 className="text-2xl font-bold mb-4">User Feedback & Analytics</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 bg-black bg-opacity-30 rounded-lg">
                                    <h3 className="text-xl font-semibold mb-2 flex items-center"><BarChart2 size={20} className="mr-2" /> App Ratings</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                                {chartData.map((_entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="p-4 bg-black bg-opacity-30 rounded-lg">
                                    <h3 className="text-xl font-semibold mb-2 flex items-center"><MessageSquareText size={20} className="mr-2" /> User Feedback Summary</h3>
                                    <pre className="whitespace-pre-wrap font-sans text-gray-300 text-sm max-h-60 overflow-y-auto">{project.user_feedback_summary || "No textual feedback collected yet."}</pre>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <Card className="p-4 sticky top-8">
                        <h2 className="text-2xl font-bold mb-4 text-center">App Simulator</h2>
                        <AppSimulator palette={project.brand_palette}>
                            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                                {isGenerationComplete ? (
                                    <>
                                        <h3 className="font-bold text-lg mb-2" style={{ color: project.brand_palette?.text_dark }}>Welcome to {project.name}</h3>
                                        <p className="text-sm mb-4" style={{ color: project.brand_palette?.text_dark }}>This is an interactive preview.</p>
                                        <button className="px-4 py-2 rounded-lg text-white font-bold" style={{ backgroundColor: project.brand_palette?.primary }}>
                                            Get Started
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <Loader2 className="animate-spin text-4xl mb-4" style={{ color: project.brand_palette?.primary }} />
                                        <p className="font-semibold" style={{ color: project.brand_palette?.text_dark }}>Generating your app...</p>
                                    </div>
                                )}
                            </div>
                        </AppSimulator>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4 flex items-center"><SlidersHorizontal size={22} className="mr-2" /> Feedback Engine</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label htmlFor="ux-survey-toggle" className="font-semibold text-gray-300">Enable UX Survey</label>
                                <Switch
                                    id="ux-survey-toggle"
                                    checked={project.enable_ux_survey}
                                    onCheckedChange={() => handleSurveyToggle('ux')}
                                />
                            </div>
                             <div className="flex items-center justify-between">
                                <label htmlFor="pmf-survey-toggle" className="font-semibold text-gray-300">Enable Product-Market Fit Survey</label>
                                <Switch
                                    id="pmf-survey-toggle"
                                    checked={project.enable_pmf_survey}
                                    onCheckedChange={() => handleSurveyToggle('pmf')}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Deployment</h2>
                        <div className="space-y-4">
                            <button
                                onClick={() => openPaymentConversation(project.id)}
                                disabled={!isGenerationComplete}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-ion-blue text-black font-bold rounded-lg hover:bg-opacity-90 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                <Upload size={20} /> Deploy to App Store
                            </button>
                            <button
                                onClick={handleDownloadCode}
                                disabled={!isGenerationComplete}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-fusion-pink text-white font-bold rounded-lg hover:bg-opacity-90 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
                                >
                                <Download size={20} /> Download Code
                            </button>
                            <button
                                onClick={handlePushToGithub}
                                disabled={!isGenerationComplete || isPushingToGithub}
                                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-opacity-90 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                <Github size={20} /> {isPushingToGithub ? 'Pushing...' : 'Push to GitHub'}
                            </button>
                            {githubError && <p className="text-solar-orange text-sm text-center">{githubError}</p>}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage;
