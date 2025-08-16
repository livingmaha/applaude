import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Import components directly for critical routes to avoid loading issues
import LandingPage from '@/pages/LandingPage';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Lazy load non-critical pages
import { lazy } from 'react';
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignUpPage = lazy(() => import('@/pages/auth/SignUpPage'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'));
const CreateProjectPage = lazy(() => import('@/pages/CreateProjectPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ApiPage = lazy(() => import('@/pages/ApiPage'));
const BlogPage = lazy(() => import('@/pages/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'));
const FAQPage = lazy(() => import('@/pages/FAQPage'));
const PreviewPage = lazy(() => import('@/pages/PreviewPage'));
const ProjectAnalyticsPage = lazy(() => import('@/pages/ProjectAnalyticsPage'));
const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const SubmitTestimonialPage = lazy(() => import('@/components/core/SubmitTestimonialPage'));

// Import route guards
import PrivateRoute from '@/components/auth/PrivateRoute';

// Fallback component for Suspense
const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
  </div>
);

export const AppRoutes = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Landing page - no header/footer wrapper for custom design */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth pages - no header/footer */}
          <Route path="/login" element={
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          } />
          <Route path="/signup" element={
            <Suspense fallback={<PageLoader />}>
              <SignUpPage />
            </Suspense>
          } />
          
          {/* Pages with header/footer */}
          <Route path="/*" element={
            <>
              <Header />
              <main className="flex-grow">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/api" element={<ApiPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:id" element={<BlogPostPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/terms" element={<TermsOfServicePage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/project/:id" element={<PrivateRoute><ProjectDetailPage /></PrivateRoute>} />
                    <Route path="/project/:id/preview" element={<PrivateRoute><PreviewPage /></PrivateRoute>} />
                    <Route path="/project/:id/analytics" element={<PrivateRoute><ProjectAnalyticsPage /></PrivateRoute>} />
                    <Route path="/create-project" element={<PrivateRoute><CreateProjectPage /></PrivateRoute>} />
                    <Route path="/submit-testimonial/:projectId" element={<PrivateRoute><SubmitTestimonialPage /></PrivateRoute>} />

                    {/* 404 Not Found Route */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};