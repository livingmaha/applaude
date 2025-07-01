
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../services/api';
import Card from '../components/ui/Card';
import paymentService from '../services/paymentService';
import { Loader2, CheckCircle, XCircle, BarChart2, MessageSquareText } from 'lucide-react'; // Import new icons

interface ProjectDetails {
    id: number;
    name: string;
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
    enable_ux_survey?: boolean; // New field
    ux_survey_questions?: any[]; // New field
    enable_pmf_survey?: boolean; // New field
    pmf_survey_questions?: any[]; // New field
    app_ratings_summary?: any; // New field
    user_feedback_summary?: any; // New field
    survey_response_analytics?: any; // New field
}

const ProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showSurveyConfig, setShowSurveyConfig] = useState(false); // State to toggle survey config

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                const response = await apiClient.get(`/projects/${id}/`);
                setProject(response.data);
            } catch (err) {
                setError('Failed to fetch project details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();

        // Polling logic for status updates
        const interval = setInterval(() => {
            // Only poll if the project is in a pending or generation state
            if (project && (project.status.includes('PENDING') || project.status.includes('GENERATION') || project.status.includes('UPDATE'))) {
                apiClient.get(`/projects/${id}/`).then(response => {
                    setProject(response.data);
                }).catch(err => {
                    console.error("Error polling project status:", err);
                });
            }
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [id, project?.status]); // Re-run effect if ID or project status changes to adjust polling

    const handleMonetization = async () => {
        if (!project) return;
        try {
            const paymentData = await paymentService.initializePayment(project.id);
            // Redirect user to Paystack's checkout page
            window.location.href = paymentData.authorization_url;
        } catch (error) {
            console.error("Failed to start payment process:", error);
            alert("Could not initiate payment. Please try again later.");
        }
    };

    const handleSurveyToggle = async (surveyType: 'ux' | 'pmf') => {
        if (!project) return;
        const fieldName = surveyType === 'ux' ? 'enable_ux_survey' : 'enable_pmf_survey';
        const newStatus = !(project as any)[fieldName]; // Toggle current status

        try {
            await apiClient.patch(`/projects/${project.id}/`, {
                [fieldName]: newStatus
            });
            setProject(prev => prev ? { ...prev, [fieldName]: newStatus } : null);
            alert(`${surveyType.toUpperCase()} Survey ${newStatus ? 'enabled' : 'disabled'}! The Code Generation Agent will incorporate this in the next app update.`);
        } catch (err) {
            setError(`Failed to update ${surveyType} survey status.`);
            console.error(err);
        }
    };

    const renderStatusIcon = (status: string) => {
        if (status.includes('PENDING') || status.includes('GENERATION') || status.includes('UPDATE')) {
            return <Loader2 size={18} className="inline-block ml-2 animate-spin text-ion-blue" />;
        } else if (status.includes('COMPLETE') || status.includes('COMPLETED')) {
            return <CheckCircle size={18} className="inline-block ml-2 text-green-500" />;
        } else if (status.includes('FAILED')) {
            return <XCircle size={18} className="inline-block ml-2 text-red-500" />;
        }
        return null;
    };

    if (loading) return <div className="text-center p-10 text-soft-white">Loading Project...</div>;
    if (error) return <div className="text-center p-10 text-solar-orange">{error}</div>;
    if (!project) return <div className="text-center p-10 text-soft-white">Project not found.</div>;

    const isUpdating = project.status.includes('PENDING') || project.status.includes('GENERATION') || project.status.includes('UPDATE');


    return (
        <div className="min-h-screen bg-quantum-black text-soft-white p-8">
            <Link to="/dashboard" className="text-ion-blue hover:underline mb-8 block animate-fade-in">&larr; Back to Dashboard</Link>
            
            <h1 className="text-4xl font-bold mb-2 animate-slide-in-right">{project.name}</h1>
            <p className="text-lg text-gray-400 mb-4">
                Status: <span className="font-semibold text-solar-orange">
                    {project.status_message || project.status}
                    {renderStatusIcon(project.status)}
                </span>
            </p>
            <p className="mb-8 animate-fade-in">Source URL: <a href={project.source_url} target="_blank" rel="noopener noreferrer" className="text-ion-blue hover:underline">{project.source_url}</a></p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 animate-fade-in">
                    <h2 className="text-2xl font-bold mb-4">AI Market Analysis: User Persona</h2>
                    {project.user_persona_document ? (
                        <pre className="whitespace-pre-wrap font-sans text-gray-300 text-sm">{project.user_persona_document}</pre>
                    ) : (
                        <p className="text-gray-400">AI analysis is pending...</p>
                    )}
                </Card>
                <Card className="p-6 animate-fade-in delay-100">
                    <h2 className="text-2xl font-bold mb-4">AI Design Analysis: Brand Palette</h2>
                    {project.brand_palette ? (
                        <div className="space-y-3">
                            {Object.entries(project.brand_palette).map(([name, color]) => (
                                <div key={name} className="flex items-center justify-between">
                                    <span className="capitalize">{name.replace(/_/g, ' ')}</span>
                                    <div className="flex items-center gap-2">
                                        <span>{color}</span>
                                        <div className="w-6 h-6 rounded border border-gray-500" style={{ backgroundColor: color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">AI analysis is pending...</p>
                    )}
                </Card>
            </div>

            {/* Monetization Section */}
            {project.status === 'DESIGN_COMPLETE' && (
                 <Card className="mt-8 p-6 animate-fade-in delay-200">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Ready for Launch?</h2>
                            <p className="text-gray-400">Generate and download your mobile application.</p>
                        </div>
                        <button
                            onClick={handleMonetization}
                            className="mt-4 md:mt-0 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-fusion-pink to-solar-orange text-white font-bold rounded-lg hover:scale-105 transition-transform"
                        >
                            Generate App ($50.00)
                        </button>
                    </div>
                </Card>
            )}

            {/* New: Survey and Feedback Section */}
            {(project.status === 'COMPLETED' || project.status === 'SURVEY_ACTIVE' || project.status === 'FEEDBACK_ANALYSIS') && (
                <Card className="mt-8 p-6 animate-fade-in delay-300">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">User Feedback & Analytics</h2>
                        <button
                            onClick={() => setShowSurveyConfig(!showSurveyConfig)}
                            className="mt-4 md:mt-0 px-6 py-2 bg-ion-blue text-white font-bold rounded-lg hover:bg-opacity-90 transition-all"
                        >
                            {showSurveyConfig ? 'Hide Settings' : 'Manage Surveys'}
                        </button>
                    </div>

                    {showSurveyConfig && (
                        <div className="mt-4 border-t border-gray-700 pt-4">
                            <h3 className="text-xl font-semibold mb-3">Survey Configuration</h3>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="ux_survey" className="text-gray-300">Enable UX Survey</label>
                                <input
                                    type="checkbox"
                                    id="ux_survey"
                                    checked={project.enable_ux_survey || false}
                                    onChange={() => handleSurveyToggle('ux')}
                                    className="form-checkbox h-5 w-5 text-ion-blue rounded border-gray-600"
                                />
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <label htmlFor="pmf_survey" className="text-gray-300">Enable Product Market Fit Survey</label>
                                <input
                                    type="checkbox"
                                    id="pmf_survey"
                                    checked={project.enable_pmf_survey || false}
                                    onChange={() => handleSurveyToggle('pmf')}
                                    className="form-checkbox h-5 w-5 text-ion-blue rounded border-gray-600"
                                />
                            </div>
                            <p className="text-sm text-gray-500">Enabling a survey will trigger the Code Generation Agent to update your app with the survey feature and a pop-up button. Users will be able to dismiss it.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="p-4 bg-black bg-opacity-30 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2 flex items-center"><BarChart2 size={20} className="mr-2" /> App Ratings</h3>
                            {project.app_ratings_summary ? (
                                <div className="space-y-1">
                                    {Object.entries(project.app_ratings_summary).map(([rating, count]) => (
                                        <p key={rating} className="text-gray-300">{rating} Stars: {count}</p>
                                    ))}
                                    {/* Placeholder for visual rating distribution (e.g., a simple bar chart library would go here) */}
                                </div>
                            ) : (
                                <p className="text-gray-400">No ratings collected yet.</p>
                            )}
                        </div>
                        <div className="p-4 bg-black bg-opacity-30 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2 flex items-center"><MessageSquareText size={20} className="mr-2" /> User Feedback</h3>
                            {project.user_feedback_summary ? (
                                <p className="text-gray-300 whitespace-pre-wrap">{project.user_feedback_summary}</p>
                            ) : (
                                <p className="text-gray-400">No textual feedback collected yet.</p>
                            )}
                        </div>
                        {/* More analytics and feedback tracking can go here */}
                         <div className="p-4 bg-black bg-opacity-30 rounded-lg col-span-full">
                            <h3 className="text-xl font-semibold mb-2 flex items-center"><BarChart2 size={20} className="mr-2" /> Survey Response Analytics</h3>
                            {project.survey_response_analytics ? (
                                <div>
                                    <p className="text-gray-300">Total Survey Responses: {project.survey_response_analytics.totalResponses || 0}</p>
                                    <p className="text-gray-300">Avg UX Score: {project.survey_response_analytics.avgUxScore?.toFixed(1) || 'N/A'}</p>
                                    <p className="text-gray-300">NPS Score: {project.survey_response_analytics.npsScore || 'N/A'}</p>
                                    <h4 className="font-medium mt-3">Feature Prioritization insights:</h4>
                                    {project.survey_response_analytics.featureRequests && Object.entries(project.survey_response_analytics.featureRequests).map(([feature, percentage]) => (
                                        <p key={feature} className="text-gray-300">"{feature}": {(percentage as number).toFixed(1)}% users requested ({
                                            (percentage as number) > 70 ? 'Build Urgently!' : 
                                            (percentage as number) > 50 ? 'Build Now!' : 'Consider Later'
                                        })</p>
                                    ))}
                                     <h4 className="font-medium mt-3">Survey Display Behavior:</h4>
                                    <p className="text-gray-300">Impressions: {project.survey_response_analytics.impressions || 0}</p>
                                    <p className="text-gray-300">Clicked Survey: {project.survey_response_analytics.clicked || 0}</p>
                                    <p className="text-gray-300">Dismissed Survey: {project.survey_response_analytics.dismissed || 0}</p>
                                    <p className="text-gray-300">Completed Survey: {project.survey_response_analytics.completed || 0}</p>
                                    {/* This is where a charting library would render visual graphs */}
                                </div>
                            ) : (
                                <p className="text-gray-400">No survey response analytics yet.</p>
                            )}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ProjectDetailPage;
