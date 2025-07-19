import axiosInstance from '@/lib/axios';

interface Project {
  id: string;
  name: string;
  description: string;
}

export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await axiosInstance.get('/projects/');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw error;
  }
};

export const createProject = async (projectData: {
  name: string;
  description: string;
}): Promise<Project> => {
  try {
    const response = await axiosInstance.post('/projects/', projectData);
    return response.data;
  } catch (error) {
    console.error('Failed to create project:', error);
    throw error;
  }
};
