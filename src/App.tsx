import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageModern from './pages/v2/LandingPageModern';
import Home from './pages/Home';
import AbdomeTotalExamModern from './pages/modern/AbdomeTotalExamModern';
import CarotidExamModern from './pages/modern/CarotidExamModern';
import BreastExamModern from './pages/modern/BreastExamModern';
import ThyroidEchodopplerModern from './pages/modern/ThyroidEchodopplerModern';
import VenousExamModern from './pages/modern/VenousExamModern';
import ArterialExamModern from './pages/modern/ArterialExamModern';
import ResolutionGuard from './components/ResolutionGuard';

function App() {
  return (
    <ResolutionGuard>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPageModern />} />
          <Route path="/old-home" element={<Home />} />
          <Route path="/abdome-modern" element={<AbdomeTotalExamModern />} />
          <Route path="/carotid-modern" element={<CarotidExamModern />} />
          <Route path="/thyroid-modern" element={<ThyroidEchodopplerModern />} />
          <Route path="/breast-exam" element={<BreastExamModern />} />
          <Route path="/venous-modern" element={<VenousExamModern />} />
          <Route path="/arterial-modern" element={<ArterialExamModern />} />
        </Routes>
      </Router>
    </ResolutionGuard>
  );
}

export default App;
