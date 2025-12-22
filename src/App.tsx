import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import LandingPageModern from './pages/v2/LandingPageModern';
import Home from './pages/Home';
import { AbdomeTotalExam, CarotidExam, ThyroidExam } from './pages/modern/exams';
import BreastExamModern from './pages/modern/BreastExamModern';
import VenousExamModern from './pages/modern/VenousExamModern';
import ArterialExamModern from './pages/modern/ArterialExamModern';
import AbdominalVesselsExamModern from './pages/modern/AbdominalVesselsExamModern';
import AbdominalWallExamModern from './pages/modern/AbdominalWallExamModern';
import ResolutionGuard from './components/ResolutionGuard';

function App() {
  return (
    <AuthProvider>
      <ResolutionGuard>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><LandingPageModern /></ProtectedRoute>} />
            <Route path="/old-home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/abdome-modern" element={<ProtectedRoute><AbdomeTotalExam /></ProtectedRoute>} />
            <Route path="/carotid-modern" element={<ProtectedRoute><CarotidExam /></ProtectedRoute>} />
            <Route path="/thyroid-modern" element={<ProtectedRoute><ThyroidExam /></ProtectedRoute>} />
            <Route path="/breast-exam" element={<ProtectedRoute><BreastExamModern /></ProtectedRoute>} />
            <Route path="/venous-modern" element={<ProtectedRoute><VenousExamModern /></ProtectedRoute>} />
            <Route path="/arterial-modern" element={<ProtectedRoute><ArterialExamModern /></ProtectedRoute>} />
            <Route path="/abdominal-vessels-modern" element={<ProtectedRoute><AbdominalVesselsExamModern /></ProtectedRoute>} />
            <Route path="/abdominal-wall-modern" element={<ProtectedRoute><AbdominalWallExamModern /></ProtectedRoute>} />
          </Routes>
        </Router>
      </ResolutionGuard>
    </AuthProvider>
  );
}

export default App;
