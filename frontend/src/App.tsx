import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectPreviewPage from './pages/ProjectPreviewPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SuperuserRoute from './components/auth/SuperuserRoute'; // Import SuperuserRoute

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  return auth.isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Private Routes */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/create-project" element={<PrivateRoute><CreateProjectPage /></PrivateRoute>} />
          <Route path="/projects/:id/preview" element={<PrivateRoute><ProjectPreviewPage /></PrivateRoute>} />
          <Route path="/projects/:id" element={<PrivateRoute><ProjectDetailPage /></PrivateRoute>} />

          {/* Superuser Routes */}
          <Route path="/admin/blog" element={<SuperuserRoute><BlogDashboard /></SuperuserRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
