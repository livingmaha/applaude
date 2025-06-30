// File: /frontend/src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../services/api';

interface AuthContextType {
  token: string | null;
  user: { email: string; userId: number } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<{ email: string; userId: number } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken) {
      setToken(storedToken);
      apiClient.defaults.headers.common['Authorization'] = `Token ${storedToken}`;
    }
    if(storedUser){
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.post('/users/token/', { email, password });
    const { token: responseToken, user_id: userId, email: userEmail } = response.data;
    
    localStorage.setItem('token', responseToken);
    const userData = { email: userEmail, userId };
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(responseToken);
    setUser(userData);

    apiClient.defaults.headers.common['Authorization'] = `Token ${responseToken}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
