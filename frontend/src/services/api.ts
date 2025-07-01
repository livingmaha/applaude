import axios from 'axios';

// The base URL for our Django backend API
// Use environment variable for production, with a local fallback.
const API_URL = process.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';

// Create an instance of axios with default settings
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to automatically attach the auth token to every request.
apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient;
