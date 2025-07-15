import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Mock chat agent component
const AnalyticsChatAgent = () => (
    <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Applause Prime Analytics</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-700">"Your active users are up 15% this week! This is likely due to your recent marketing campaign. Keep up the great work."</p>
        </div>
    </div>
);


const ProjectAnalyticsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get(`/analytics/${id}/`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Failed to fetch analytics data", error);
                setLoading(false);
            });
    }, [id]);

    const handleDownloadPdf = () => {
        // PDF generation logic would go here
        alert('Downloading PDF report...');
    };

    if (loading) return <div>Loading analytics...</div>;

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Analytics Dashboard</h1>
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
