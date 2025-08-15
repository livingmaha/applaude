import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import './index.css';
import { useAuthStore } from './stores/useAuth.ts';
import './i18n';

// Initialize auth state on application load with error handling
try {
  useAuthStore.getState().initializeAuth();
} catch (error) {
  console.error('Failed to initialize auth:', error);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
