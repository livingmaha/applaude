import axios from 'axios';
import type { AxiosError } from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Import useAuthStore dynamically to avoid circular dependencies
    const { useAuthStore } = await import('@/stores/useAuth');
    
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/token/refresh/`, {
            refresh: refreshToken,
          });
          const { access, refresh } = data;
          useAuthStore.getState().setTokens(access, refresh);
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          return axios(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      } else {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
