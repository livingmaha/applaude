// frontend/src/App.tsx
import { Toaster } from 'sonner';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './contexts/AuthContext';

// Layouts & Core Pages
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import Dashboard from '@/pages/Dashboard';
import CreateProjectPage from '@/pages/CreateProjectPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import NotFoundPage from '@/pages/NotFoundPage';
import BlogDashboard from './pages/admin/BlogDashboard';

// Auth & Routing
import PrivateRoute from '@/components/auth/PrivateRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-100 text-gray-900">
            <Header />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Private Routes */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/create-project" element={<PrivateRoute><CreateProjectPage /></PrivateRoute>} />
                <Route path="/project/:projectId" element={<PrivateRoute><ProjectDetailPage /></PrivateRoute>} />

                {/* Admin Routes */}
                <Route path="/admin/blog" element={<PrivateRoute adminOnly={true}><BlogDashboard /></PrivateRoute>} />

                {/* Catch-all Not Found Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <Toaster richColors position="top-right" />
          </div>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
