import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AbdomeTotalExam from './pages/AbdomeTotalExam';
import BreastExam from './pages/BreastExam';
import CarotidExam from './pages/CarotidExam';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/exam/abdome-total" element={<AbdomeTotalExam />} />
        <Route path="/carotid-exam" element={<CarotidExam />} />
        <Route path="/exam/mamas" element={<BreastExam />} />
      </Routes>
    </Router>
  );
}

export default App;