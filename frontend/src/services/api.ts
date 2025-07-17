import axios from 'axios';
import { useAuthStore } from '@/stores/useAuth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/token/refresh/`, { refresh: refreshToken });
        const { access } = response.data;
        useAuthStore.getState().setTokens(access, refreshToken);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + access;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export default api;
