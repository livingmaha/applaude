import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useTranslation } from 'react-i18next';
import { FileText, Type } from 'lucide-react';

const CreateProjectPage = () => {
    const [creationMode, setCreationMode] = useState<'form' | 'zero_touch'>('form');
    const [name, setName] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [appType, setAppType] = useState('ANDROID');
    const [initialPrompt, setInitialPrompt] = useState('');
    const [requirementsDocument, setRequirementsDocument] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setRequirementsDocument(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData();
        if (creationMode === 'form') {
            formData.append('name', name);
            formData.append('source_url', sourceUrl);
            formData.append('app_type', appType);
        } else {
            formData.append('name', `App from prompt: ${initialPrompt.substring(0, 20)}...`);
            formData.append('initial_prompt', initialPrompt);
            if (requirementsDocument) {
                formData.append('requirements_document', requirementsDocument);
            }
             formData.append('app_type', 'BOTH'); // Default for zero-touch
        }


        try {
            const response = await apiClient.post('/projects/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate(`/projects/${response.data.id}/preview`);
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
                <h2 className="text-3xl font-bold text-center text-soft-white mb-8">{t('new_project')}</h2>

                <div className="flex justify-center mb-6 border border-gray-700 rounded-lg p-1">
                    <button onClick={() => setCreationMode('form')} className={`w-1/2 py-2 rounded-md transition-all ${creationMode === 'form' ? 'bg-ion-blue text-black' : 'text-gray-300'}`}>
                        Guided Form
                    </button>
                    <button onClick={() => setCreationMode('zero_touch')} className={`w-1/2 py-2 rounded-md transition-all ${creationMode === 'zero_touch' ? 'bg-ion-blue text-black' : 'text-gray-300'}`}>
                        Zero-Touch AI
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {creationMode === 'form' ? (
                        <>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-300">{t('project_name')}</label>
                                <Input type="text" placeholder="e.g., My Awesome App" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-300">{t('website_url')}</label>
                                <Input type="url" placeholder="https://example.com" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-300">{t('target_platform')}</label>
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
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Describe your app in plain English</label>
                                <textarea
                                    value={initialPrompt}
                                    onChange={(e) => setInitialPrompt(e.target.value)}
                                    placeholder="e.g., 'Build me a mobile app for my e-commerce store that sells vintage clothing. It should have a product catalog and a simple checkout.'"
                                    className="w-full h-40 bg-gray-700 bg-opacity-30 text-soft-white p-3 rounded-lg focus:border-ion-blue focus:ring-0 focus:outline-none"
                                    required
                                ></textarea>
                            </div>
                             <div>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Upload a requirements document (optional)</label>
                                <Input type="file" onChange={handleFileChange} icon={<FileText size={18} />} />
                            </div>
                        </>
                    )}

                    {error && <p className="text-solar-orange text-sm">{error}</p>}

                    <button type="submit" disabled={loading} className="w-full bg-fusion-pink text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 disabled:bg-opacity-50">
                        {loading ? 'Analyzing...' : t('start_analysis')}
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default CreateProjectPage;
