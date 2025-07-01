
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../services/api';

interface AuthContextType {
  token: string | null;
  user: { email: string; userId: number; username?: string } | null; // Added username
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>; // Added signup
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<{ email: string; userId: number; username?: string } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken) {
      setToken(storedToken);
      apiClient.defaults.headers.common['Authorization'] = `Token ${storedToken}`;
    }
    if(storedUser){
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        localStorage.removeItem('user'); // Clear corrupted data
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.post('/users/token/', { email, password });
    const { token: responseToken, user_id: userId, email: userEmail } = response.data;
    // Assuming username might be returned by the token endpoint, if applicable
    const username = response.data.username || userEmail.split('@')[0]; 
    
    localStorage.setItem('token', responseToken);
    const userData = { email: userEmail, userId, username };
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(responseToken);
    setUser(userData);

    apiClient.defaults.headers.common['Authorization'] = `Token ${responseToken}`;
  };

  const signup = async (username: string, email: string, password: string) => {
    const response = await apiClient.post('/users/create/', { username, email, password });
    // After successful signup, you might want to automatically log them in
    // or redirect to login page. For now, we just complete the request.
    console.log("Signup successful:", response.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
