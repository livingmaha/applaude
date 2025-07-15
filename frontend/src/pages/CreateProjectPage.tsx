import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import { Loader2, UploadCloud, Link as LinkIcon, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/Alert';

type AppType = 'ANDROID' | 'IOS' | 'BOTH';
type CreateMode = 'url' | 'zero-touch';

const CreateProjectPage = () => {
    const [createMode, setCreateMode] = useState<CreateMode>('url');
    const [projectName, setProjectName] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [appType, setAppType] = useState<AppType>('ANDROID');
    const [initialPrompt, setInitialPrompt] = useState('');
    const [requirementsDocument, setRequirementsDocument] = useState<File | null>(null);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setRequirementsDocument(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        // Use FormData to handle file uploads
        const formData = new FormData();
        formData.append('name', projectName);
        formData.append('app_type', appType);

        if (createMode === 'url') {
            if (!sourceUrl) {
                setError('Source URL is required for this creation method.');
                setLoading(false);
                return;
            }
            formData.append('source_url', sourceUrl);
        } else { // zero-touch
            if (!initialPrompt && !requirementsDocument) {
                setError('Please provide either an initial prompt or a requirements document.');
                setLoading(false);
                return;
            }
            if (initialPrompt) {
                formData.append('initial_prompt', initialPrompt);
            }
            if (requirementsDocument) {
                formData.append('requirements_document', requirementsDocument);
            }
        }


        try {
            const response = await apiClient.post('/projects/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const newProject = response.data;
            // Navigate to the new project's detail page
            navigate(`/projects/${newProject.id}`);
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || 'An unexpected error occurred. Please try again.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderFormContent = () => {
        if (createMode === 'url') {
            return (
                <div className="space-y-4 animate-fade-in">
                    <div>
                        <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-300 mb-1">
                            Source URL
                        </label>
                        <input
                            type="url"
                            id="sourceUrl"
                            value={sourceUrl}
                            onChange={(e) => setSourceUrl(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-ion-blue"
                            placeholder="https://github.com/example/repo"
                            required
                        />
                    </div>
                </div>
            );
        }

        if (createMode === 'zero-touch') {
            return (
                <div className="space-y-6 animate-fade-in">
                    <div>
                        <label htmlFor="initialPrompt" className="block text-sm font-medium text-gray-300 mb-1">
                            Initial Prompt
                        </label>
                        <textarea
                            id="initialPrompt"
                            value={initialPrompt}
                            onChange={(e) => setInitialPrompt(e.target.value)}
                            rows={5}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-ion-blue"
                            placeholder="Describe your app idea. What problem does it solve? Who is it for? What are the key features?"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                           Or Upload a Requirements Document
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <FileText className="mx-auto h-12 w-12 text-gray-500" />
                                <div className="flex text-sm text-gray-400">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-gray-900 rounded-md font-medium text-ion-blue hover:text-ion-blue-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-ion-blue"
                                    >
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT up to 10MB</p>
                                {requirementsDocument && <p className="text-sm text-green-400 mt-2">{requirementsDocument.name}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (!authContext?.isAuthenticated) {
        return (
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
                <p className="text-solar-orange">Please log in to create a project.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <Card className="p-8">
                    <h1 className="text-3xl font-bold text-center text-white mb-2">Create a New Project</h1>
                    <p className="text-center text-gray-400 mb-8">Let's build something extraordinary. Choose your creation method.</p>

                    <div className="mb-6">
                        <div className="flex border-b border-gray-700">
                            <button
                                onClick={() => setCreateMode('url')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${createMode === 'url' ? 'text-ion-blue border-b-2 border-ion-blue' : 'text-gray-400 hover:text-white'}`}
                            >
                                <LinkIcon className="inline-block w-5 h-5 mr-2" />
                                Clone from URL
                            </button>
                            <button
                                onClick={() => setCreateMode('zero-touch')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${createMode === 'zero-touch' ? 'text-ion-blue border-b-2 border-ion-blue' : 'text-gray-400 hover:text-white'}`}
                            >
                                <UploadCloud className="inline-block w-5 h-5 mr-2" />
                                Zero-Touch
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                             <Alert variant="destructive">
                                <AlertTitle>Creation Failed</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-1">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    id="projectName"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-ion-blue"
                                    placeholder="My Awesome App"
                                    required
                                />
                            </div>
                           
                            {renderFormContent()}

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Target Platform</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {(['ANDROID', 'IOS', 'BOTH'] as AppType[]).map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setAppType(type)}
                                            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                                                appType === type
                                                    ? 'bg-ion-blue text-black ring-2 ring-ion-blue'
                                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-fusion-pink text-white font-bold rounded-lg hover:bg-opacity-90 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" />
                                    <span>Creating Project...</span>
                                </>
                            ) : (
                                'Start Building'
                            )}
                        </button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default CreateProjectPage;
