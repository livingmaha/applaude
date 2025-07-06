import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProtectedRoute from './components/core/ProtectedRoute';
import AboutPage from './pages/AboutPage';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import BuildAndPreviewPage from './pages/BuildAndPreviewPage';
import UpgradeSubscriptionPage from './pages/UpgradeSubscriptionPage'; // Import the new page

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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/projects/create" element={<CreateProjectPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/projects/:id/build" element={<BuildAndPreviewPage />} />
            <Route path="/upgrade" element={<UpgradeSubscriptionPage />} /> {/* Add the new route */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
