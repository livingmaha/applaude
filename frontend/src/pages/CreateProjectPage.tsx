
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

const CreateProjectPage = () => {
    const [name, setName] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [appType, setAppType] = useState('ANDROID');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await apiClient.post('/projects/', {
                name: name,
                source_url: sourceUrl,
                app_type: appType,
            });
            // On success, navigate back to the dashboard to see the new project
            navigate('/dashboard');
        } catch (err: any) {
            setError('Failed to create project. Please check the details and try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-quantum-black">
            <Card className="w-full max-w-2xl p-8">
                <h2 className="text-3xl font-bold text-center text-soft-white mb-8">Launch a New Project</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">Project Name</label>
                        <Input type="text" placeholder="e.g., My Awesome App" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">Website URL</label>
                        <Input type="url" placeholder="https://example.com" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">Target Platform</label>
                        <select
                            value={appType}
                            onChange={(e) => setAppType(e.target.value)}
                            className="w-full bg-gray-700 bg-opacity-30 text-soft-white p-3 rounded-lg focus:border-ion-blue focus:ring-0 focus:outline-none"
                        >
                            <option value="ANDROID">Android</option>
                            <option value="IOS">iOS</option>
                            <option value="BOTH">Both (Android & iOS)</option>
                        </select>
                    </div>
                    
                    {error && <p className="text-solar-orange text-sm">{error}</p>}

                    <button type="submit" disabled={loading} className="w-full bg-fusion-pink text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 disabled:bg-opacity-50">
                        {loading ? 'Analyzing...' : 'Start AI Analysis'}
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default CreateProjectPage;
