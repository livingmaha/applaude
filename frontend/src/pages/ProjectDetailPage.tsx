
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import api from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import StatusPill from '../components/ui/StatusPill';
import { ArrowLeft, Download } from 'lucide-react';
import Button from '../components/ui/Button';


interface Project {
    id: number;
    name: string;
    website_url: string;
    app_type: 'iOS' | 'Android';
    status: string;
    status_message: string;
    user_persona: string;
    design_palette: any;
    generated_code_path: string;
    qa_report: string;
}

const ProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get(`/projects/${id}/`);
                setProject(response.data);
            } catch (error) {
                toast.error('Failed to fetch project details.');
                console.error("Project detail fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();

        // Set up polling to get status updates
        const intervalId = setInterval(fetchProject, 5000); // Poll every 5 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);

    }, [id]);


    const CodeRenderer = ({ node, inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || '');
        const codeContent = String(children).replace(/\n$/, '');

        // Extract filename from a comment in the first line
        const firstLine = codeContent.split('\n')[0];
        const fileMatch = /\/\/\s*File:\s*(\S+)/.exec(firstLine) || /#\s*File:\s*(\S+)/.exec(firstLine);
        const fileName = fileMatch ? fileMatch[1] : null;


        if (!inline && match) {
            return (
                <div className="my-4 rounded-lg overflow-hidden bg-[#1E1E1E]">
                    {fileName && (
                         <div className="bg-gray-700 text-white text-sm px-4 py-2 font-mono">
                            {fileName}
                        </div>
                    )}
                    <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                    >
                        {fileName ? codeContent.substring(firstLine.length + 1) : codeContent}
                    </SyntaxHighlighter>
                </div>
            );
        }
        return <code className={className} {...props}>{children}</code>;
    };


    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!project) {
        return <div className="text-center py-10">Project not found.</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                <Link to="/dashboard" className="inline-flex items-center text-ion-blue hover:underline mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>

                <Card className="mb-6">
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start">
                            <div className="mb-4 sm:mb-0">
                                <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
                                <a href={project.website_url} target="_blank" rel="noopener noreferrer" className="text-ion-blue hover:underline">
                                    {project.website_url}
                                </a>
                            </div>
                            <div className="flex items-center space-x-4">
                               <span className="font-semibold">{project.app_type}</span>
                               <StatusPill status={project.status} />
                            </div>
                        </div>
                         {project.status_message && (
                            <div className="mt-4 p-4 bg-blue-50 border-l-4 border-ion-blue rounded-r-lg">
                                <p className="text-sm text-blue-800">{project.status_message}</p>
                            </div>
                        )}
                    </div>
                </Card>

                {project.status === 'COMPLETED' && project.generated_code_path && (
                    <Card className="mb-6 bg-green-50">
                        <div className="p-6 text-center">
                            <h2 className="text-2xl font-semibold text-green-800 mb-4">Deployment Successful!</h2>
                            <p className="text-green-700 mb-6">Your application is live and the code is ready for download.</p>
                            <a href={project.generated_code_path} download>
                                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                                    <Download className="mr-2 h-5 w-5" />
                                    Download App Source Code
                                </Button>
                            </a>
                        </div>
                    </Card>
                )}


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">User Persona</h2>
                             <ReactMarkdown className="prose max-w-none">
                                {project.user_persona || "Analysis pending..."}
                            </ReactMarkdown>
                        </div>
                    </Card>
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Design Palette</h2>
                            {project.design_palette ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {Object.entries(project.design_palette).map(([key, value]) => (
                                        <div key={key}>
                                            <div className="w-full h-16 rounded-lg mb-2" style={{ backgroundColor: value as string }}></div>
                                            <p className="text-center font-semibold capitalize">{key.replace('_', ' ')}</p>
                                            <p className="text-center text-sm text-gray-500">{value as string}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Design pending...</p>
                            )}
                        </div>
                    </Card>
                </div>


                {project.qa_report && (
                    <Card className="mt-6">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">QA Report</h2>
                             <ReactMarkdown className="prose max-w-none">
                                {project.qa_report}
                            </ReactMarkdown>
                        </div>
                    </Card>
                )}


                {project.generated_code_path && project.status !== 'COMPLETED' && (
                     <Card className="mt-6">
                        <div className="p-6">
                             <h2 className="text-xl font-semibold mb-4 text-gray-700">Generated Code</h2>
                             <ReactMarkdown components={{ code: CodeRenderer }}>
                                {project.generated_code_path}
                            </ReactMarkdown>
                        </div>
                    </Card>
                )}

            </main>

            <Footer />
        </div>
    );
};

export default ProjectDetailPage;
