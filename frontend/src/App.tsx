import { Toaster } from 'sonner';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Core Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import Dashboard from '@/pages/Dashboard';
import CreateProjectPage from '@/pages/CreateProjectPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Auth & Routing
import PrivateRoute from '@/components/auth/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Private Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-project"
              element={
                <PrivateRoute>
                  <CreateProjectPage />
                </PrivateRoute>
              }
            />
             <Route
              path="/project/:projectId"
              element={
                <PrivateRoute>
                  <ProjectDetailPage />
                </PrivateRoute>
              }
            />

            {/* Catch-all Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster richColors position="top-right" />
      </div>
    </Router>
  );
}

export default App;
