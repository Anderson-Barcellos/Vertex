import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ResolutionGuard from './components/ResolutionGuard';

// Páginas essenciais carregadas normalmente
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';

// Lazy loading para todos os módulos de exame
const AbdomeTotalExam = lazy(() => import('./pages/exams/modules/AbdomeTotalExam'));
const CarotidExam = lazy(() => import('./pages/exams/modules/CarotidExam'));
const ThyroidExam = lazy(() => import('./pages/exams/modules/ThyroidExam'));
const ArterialExam = lazy(() => import('./pages/exams/modules/ArterialExam'));
const VenousExam = lazy(() => import('./pages/exams/modules/VenousExam'));
const AbdominalWallExam = lazy(() => import('./pages/exams/modules/AbdominalWallExam'));
const AbdominalVesselsExam = lazy(() => import('./pages/exams/modules/AbdominalVesselsExam'));
const BreastExam = lazy(() => import('./pages/exams/modules/BreastExam'));
const OmbroExam = lazy(() => import('./pages/exams/modules/OmbroExam'));

// Componente de loading
const ExamLoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-lg">Carregando módulo...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ResolutionGuard>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
            
            {/* Rotas com lazy loading */}
            <Route path="/abdome-modern" element={
              <ProtectedRoute>
                <Suspense fallback={<ExamLoadingScreen />}>
                  <AbdomeTotalExam />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/carotid-modern" element={
              <ProtectedRoute>
                <Suspense fallback={<ExamLoadingScreen />}>
                  <CarotidExam />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/thyroid-modern" element={
              <ProtectedRoute>
                <Suspense fallback={<ExamLoadingScreen />}>
                  <ThyroidExam />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/breast-exam" element={
              <ProtectedRoute>
                <Suspense fallback={<ExamLoadingScreen />}>
                  <BreastExam />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/venous-modern" element={
              <ProtectedRoute>
                <Suspense fallback={<ExamLoadingScreen />}>
                  <VenousExam />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/arterial-modern" element={
              <ProtectedRoute>
                <Suspense fallback={<ExamLoadingScreen />}>
                  <ArterialExam />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/abdominal-vessels-modern" element={
              <ProtectedRoute>
                <Suspense fallback={<ExamLoadingScreen />}>
                  <AbdominalVesselsExam />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/abdominal-wall-modern" element={
              <ProtectedRoute>
                <Suspense fallback={<ExamLoadingScreen />}>
                  <AbdominalWallExam />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/ombro-modern" element={
              <ProtectedRoute>
                <Suspense fallback={<ExamLoadingScreen />}>
                  <OmbroExam />
                </Suspense>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </ResolutionGuard>
    </AuthProvider>
  );
}

export default App;
