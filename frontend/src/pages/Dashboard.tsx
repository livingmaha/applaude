import { useQuery } from '@tanstack/react-query';
import { getProjects } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { data: projects, isLoading, isError, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <Button asChild>
          <Link to="/create-project">Create New Project</Link>
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 mt-1" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
          <p>Error loading projects: {error instanceof Error ? error.message : 'An unknown error occurred'}</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects && projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <Button variant="outline" asChild>
                  <Link to={`/project/${project.id}`}>View Details</Link>
                </Button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">You haven't created any projects yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
