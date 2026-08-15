import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import AppLayout from './components/layout/AppLayout';
import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ResumeCreatePage from './pages/ResumeCreatePage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';
import FactLockPage from './pages/FactLockPage';
import SourceFactsPage from './pages/SourceFactsPage';
import JobAnalysisPage from './pages/JobAnalysisPage';
import ResumeTailorPage from './pages/ResumeTailorPage';
import VersionsPage from './pages/VersionsPage';
import AtsRealityCheckPage from './pages/AtsRealityCheckPage';
import ReviewAndExportPage from './pages/ReviewAndExportPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Marketing & Auth Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected App Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Resume Workflows */}
              <Route path="/resumes/new" element={<ResumeCreatePage />} />
              <Route path="/resumes/:id" element={<ResumeBuilderPage />} />
              <Route path="/resumes/:id/fact-lock" element={<FactLockPage />} />
              <Route path="/resumes/:id/facts" element={<SourceFactsPage />} />
              <Route path="/resumes/:id/job-analysis" element={<JobAnalysisPage />} />
              <Route path="/resumes/:id/tailor" element={<ResumeTailorPage />} />
              <Route path="/resumes/:id/versions" element={<VersionsPage />} />
              <Route path="/resumes/:id/ats-check" element={<AtsRealityCheckPage />} />
              <Route path="/resumes/:id/review" element={<ReviewAndExportPage />} />
            </Route>

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
