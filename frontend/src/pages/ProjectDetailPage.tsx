import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { project, loading, error, fetchProject, connectWebSocket } = useProjectStore();

    useEffect(() => {
        if (id) {
            fetchProject(id);
            connectWebSocket(id);
        }
    }, [id, fetchProject, connectWebSocket]);

    if (loading) {
        return <Skeleton count={5} />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>{project?.name}</h1>
            <p>{project?.status}</p>
        </div>
    );
};

export default ProjectDetailPage;
