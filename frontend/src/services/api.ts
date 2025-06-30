// File: /frontend/src/services/api.ts
import axios from 'axios';

// The base URL for our Django backend API
// When you run the Django server, this is its default address.
const API_URL = 'http://127.0.0.1:8000/api/';

// Create an instance of axios with default settings
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We can add an interceptor here later to automatically
// attach the auth token to every request.

export default apiClient;
