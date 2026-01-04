import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import LandingPageModern from './pages/v2/LandingPageModern';
import Home from './pages/Home';
import {
  AbdomeTotalExam,
  CarotidExam,
  ThyroidExam,
  ArterialExam,
  VenousExam,
  AbdominalWallExam,
  AbdominalVesselsExam,
  BreastExam
} from './pages/modern/exams';
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
            <Route path="/breast-exam" element={<ProtectedRoute><BreastExam /></ProtectedRoute>} />
            <Route path="/venous-modern" element={<ProtectedRoute><VenousExam /></ProtectedRoute>} />
            <Route path="/arterial-modern" element={<ProtectedRoute><ArterialExam /></ProtectedRoute>} />
            <Route path="/abdominal-vessels-modern" element={<ProtectedRoute><AbdominalVesselsExam /></ProtectedRoute>} />
            <Route path="/abdominal-wall-modern" element={<ProtectedRoute><AbdominalWallExam /></ProtectedRoute>} />
          </Routes>
        </Router>
      </ResolutionGuard>
    </AuthProvider>
  );
}

export default App;
