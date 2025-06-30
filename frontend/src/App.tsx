// File: /frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProtectedRoute from './components/core/ProtectedRoute';
import AboutPage from './pages/AboutPage';

// Keep the simple landing page for new visitors
const LandingPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-soft-white bg-quantum-black p-8">
    <img src="/logo_icon.png" alt="Applause Logo" className="w-32 h-32 mb-8" />
    <h1 className="text-5xl font-bold mb-4">Build Your App with AI</h1>
    <p className="text-xl text-gray-400 mb-12">The future of creation is here. Let's get started.</p>
    <div className="space-x-4">
      <Link to="/login" className="px-8 py-3 bg-ion-blue text-black font-bold rounded-lg hover:bg-opacity-90 transition-all">
        Login
      </Link>
      <Link to="/signup" className="px-8 py-3 bg-fusion-pink text-white font-bold rounded-lg hover:bg-opacity-90 transition-all">
        Sign Up
      </Link>
    </div>
  </div>
);


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects/create" element={<CreateProjectPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            {/* The original onboarding conversational flow can be integrated here later */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
