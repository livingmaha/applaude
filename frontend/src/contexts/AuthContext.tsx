// File: frontend/src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../services/api';

interface AuthContextType {
  token: string | null;
  user: { email: string; userId: number; username?: string } | null;
  isAuthenticated: boolean;
  isSubscribed: boolean; // New field for subscription status
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  // Potentially add a function to update subscription status
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<{ email: string; userId: number; username?: string } | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false); // Initialize subscription status

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken) {
      setToken(storedToken);
      apiClient.defaults.headers.common['Authorization'] = `Token ${storedToken}`;
      // In a real app, you'd fetch user's subscription status from backend here
      // For now, we'll simulate it or assume it's part of user data on login
    }
    if(storedUser){
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Simulate subscription status based on parsedUser or a separate call
        // For demonstration, let's assume `is_premium_subscribed` is part of user object if present
        if (parsedUser.is_premium_subscribed !== undefined) {
            setIsSubscribed(parsedUser.is_premium_subscribed);
        } else {
            // Default to false or fetch from API
            setIsSubscribed(false); 
        }

      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        localStorage.removeItem('user'); // Clear corrupted data
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.post('/users/token/', { email, password });
    const { token: responseToken, user_id: userId, email: userEmail, is_premium_subscribed } = response.data; // Assume backend returns subscription status
    const username = response.data.username || userEmail.split('@')[0]; 
    
    localStorage.setItem('token', responseToken);
    const userData = { email: userEmail, userId, username, is_premium_subscribed }; // Store subscription in user data
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(responseToken);
    setUser(userData);
    setIsSubscribed(is_premium_subscribed || false); // Update subscription state

    apiClient.defaults.headers.common['Authorization'] = `Token ${responseToken}`;
  };

  const signup = async (username: string, email: string, password: string) => {
    const response = await apiClient.post('/users/create/', { username, email, password });
    console.log("Signup successful:", response.data);
    // After signup, you might want to automatically log them in or redirect to login page.
    // No direct login here, just success confirmation.
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsSubscribed(false); // Reset subscription status on logout
    delete apiClient.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, isSubscribed, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
