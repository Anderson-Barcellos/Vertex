import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPageModern from './pages/v2/LandingPageModern';
import Home from './pages/Home';
import AbdomeTotalExamModern from './pages/modern/AbdomeTotalExamModern';
import CarotidExamModern from './pages/modern/CarotidExamModern';
import BreastUltrasoundExamModern from './pages/modern/BreastUltrasoundExamModern';
import BreastExamSimplified from './pages/modern/BreastExamSimplified';
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
          <Route path="/mammography-modern" element={<BreastUltrasoundExamModern />} />
          <Route path="/breast-exam" element={<BreastExamSimplified />} />
        </Routes>
      </Router>
    </ResolutionGuard>
  );
}

export default App;
