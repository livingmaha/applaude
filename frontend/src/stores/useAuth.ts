import { create } from 'zustand';
import api from '@/services/api';
import { User } from '@/types';

// In-memory storage for the access token
let accessToken: string | null = null;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthStatus: (user: User | null, token: string | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to check auth status
  setAuthStatus: (user, token) => {
    accessToken = token;
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },
  checkAuth: async () => {
    try {
      const { data } = await api.get('/auth/users/me/');
      const { data: tokenData } = await api.post('/auth/token/refresh/', {}); // Assuming refresh token is in HttpOnly cookie
      get().setAuthStatus(data, tokenData.access);
    } catch (error) {
      get().setAuthStatus(null, null);
    }
  },
  logout: async () => {
    try {
      // The backend will handle invalidating the HttpOnly refresh token
      await api.post('/auth/token/logout/', {});
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      get().setAuthStatus(null, null);
    }
  },
}));

// Function to get the current access token for the API interceptor
export const getAccessToken = () => accessToken;
