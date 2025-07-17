import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './stores/authStore';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function App() {
  const { accessToken } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <main className="min-h-screen bg-background text-foreground">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Redirect root to login or dashboard */}
            <Route
              path="/"
              element={
                accessToken ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
              }
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard/*" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />

            {/* Add other protected routes here */}
            {/* <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} /> 
            */}

          </Routes>
        </main>
      </Router>
      <Toaster richColors position="top-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
