import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import apiClient from '@/services/api';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => void;
  setTokens: (access: string, refresh: string) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      setTokens: (access, refresh) => {
        set({ accessToken: access, refreshToken: refresh });
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      },
      login: async (access, refresh) => {
        get().setTokens(access, refresh);
        await get().initializeAuth();
      },
      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
        delete apiClient.defaults.headers.common['Authorization'];
      },
      initializeAuth: async () => {
        const { accessToken } = get();
        if (accessToken) {
          try {
            const { data } = await apiClient.get('/api/v1/users/profile/');
            set({ user: data, isAuthenticated: true, isLoading: false });
          } catch (error) {
            console.error("Failed to initialize auth", error);
            get().logout();
          }
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      onRehydrate: (state) => {
        if (state.accessToken) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${state.accessToken}`;
        }
      }
    }
  )
);

// Initialize auth state on application load
useAuthStore.getState().initializeAuth();
