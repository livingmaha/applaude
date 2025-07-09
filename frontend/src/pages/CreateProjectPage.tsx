import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { useTranslation } from 'react-i18next';

const CreateProjectPage = () => {
    const [name, setName] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [appType, setAppType] = useState('ANDROID');
    const [supportedLanguages, setSupportedLanguages] = useState<string[]>(['en']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const allLanguages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'zh', name: 'Chinese' },
        { code: 'hi', name: 'Hindi' },
        { code: 'ar', name: 'Arabic' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ru', name: 'Russian' },
        { code: 'ja', name: 'Japanese' },
        { code: 'de', name: 'German' },
    ];

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setSupportedLanguages(selectedOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.post('/projects/', {
                name: name,
                source_url: sourceUrl,
                app_type: appType,
                supported_languages: supportedLanguages,
            });
            // On success, navigate to the new build and preview page
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
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">App Languages</label>
                        <select
                            multiple
                            value={supportedLanguages}
                            onChange={handleLanguageChange}
                            className="w-full h-32 bg-gray-700 bg-opacity-30 text-soft-white p-3 rounded-lg focus:border-ion-blue focus:ring-0 focus:outline-none"
                        >
                            {allLanguages.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.name}</option>
                            ))}
                        </select>
                    </div>
                    
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
