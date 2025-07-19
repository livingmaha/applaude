import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/PrivateRoute';
import { SuperuserRoute } from '@/components/auth/SuperuserRoute';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Loader2 } from 'lucide-react';

// Lazily load page components for better performance
const LandingPage = lazy(() => import('@/pages/LandingPage').then(module => ({ default: module.LandingPage })));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const SignUpPage = lazy(() => import('@/pages/auth/SignUpPage').then(module => ({ default: module.SignUpPage })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage').then(module => ({ default: module.ProjectDetailPage })));
const CreateProjectPage = lazy(() => import('@/pages/CreateProjectPage').then(module => ({ default: module.CreateProjectPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));
const BlogDashboard = lazy(() => import('@/pages/admin/BlogDashboard').then(module => ({ default: module.BlogDashboard })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(module => ({ default: module.AboutPage })));
const ApiPage = lazy(() => import('@/pages/ApiPage').then(module => ({ default: module.ApiPage })));
const BlogPage = lazy(() => import('@/pages/BlogPage').then(module => ({ default: module.BlogPage })));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage').then(module => ({ default: module.BlogPostPage })));
const DataPrivacyPage = lazy(() => import('@/pages/DataPrivacyPage').then(module => ({ default: module.DataPrivacyPage })));
const FAQPage = lazy(() => import('@/pages/FAQPage').then(module => ({ default: module.FAQPage })));
const PreviewPage = lazy(() => import('@/pages/PreviewPage').then(module => ({ default: module.PreviewPage })));
const ProjectAnalyticsPage = lazy(() => import('@/pages/ProjectAnalyticsPage').then(module => ({ default: module.ProjectAnalyticsPage })));
const SupportPage = lazy(() => import('@/pages/SupportPage').then(module => ({ default: module.SupportPage })));
const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage').then(module => ({ default: module.TermsOfServicePage })));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage').then(module => ({ default: module.PrivacyPolicyPage })));
const SubmitTestimonialPage = lazy(() => import('@/components/core/SubmitTestimonialPage').then(module => ({ default: module.SubmitTestimonialPage })));
const UpgradeSubscriptionPage = lazy(() => import('@/pages/UpgradeSubscriptionPage').then(module => ({ default: module.UpgradeSubscriptionPage })));


// Fallback component for Suspense
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <Loader2 className="h-16 w-16 animate-spin text-ion-blue" />
  </div>
);

export const AppRoutes = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/api" element={<ApiPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
              <Route path="/privacy" element={<DataPrivacyPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/upgrade" element={<UpgradeSubscriptionPage />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/project/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
              <Route path="/project/:id/preview" element={<ProtectedRoute><PreviewPage /></ProtectedRoute>} />
              <Route path="/project/:id/analytics" element={<ProtectedRoute><ProjectAnalyticsPage /></ProtectedRoute>} />
              <Route path="/create-project" element={<ProtectedRoute><CreateProjectPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/submit-testimonial/:projectId" element={<ProtectedRoute><SubmitTestimonialPage /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/blog" element={<SuperuserRoute><BlogDashboard /></SuperuserRoute>} />

              {/* 404 Not Found Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
};
