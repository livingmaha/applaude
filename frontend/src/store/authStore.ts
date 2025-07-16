import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../services/api';
import { User } from '../types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: true,

            login: async (token: string) => {
                set({ accessToken: token, isLoading: true });
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const { data } = await apiClient.get('/users/me/');
                    set({ user: data, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    console.error("Failed to fetch user profile", error);
                    get().logout(); // Logout if fetching user fails
                }
            },

            logout: () => {
                delete apiClient.defaults.headers.common['Authorization'];
                set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
            },
            
            checkAuth: async () => {
                const token = get().accessToken;
                if (token) {
                    await get().login(token);
                } else {
                    set({ isLoading: false });
                }
            }
        }),
        {
            name: 'auth-storage', // name of the item in the storage (must be unique)
            getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
        }
    )
);

// Initialize auth check on app load
useAuthStore.getState().checkAuth();
