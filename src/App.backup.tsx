import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LandingPage from '@/components/LandingPage';
import AbdomeTotalExam from '@/components/AbdomeTotalExam';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Rota principal - Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Rotas dos exames */}
          <Route path="/exame/abdome-total" element={<AbdomeTotalExam />} />

          {/* Futuras modalidades - por enquanto redirecionam para landing */}
          <Route path="/exame/obstetrico" element={<ComingSoon modalidade="Obstétrico" />} />
          <Route path="/exame/cardiaco" element={<ComingSoon modalidade="Ecocardiograma" />} />
          <Route path="/exame/vascular" element={<ComingSoon modalidade="Vascular" />} />
          <Route path="/exame/tireoide" element={<ComingSoon modalidade="Tireoide" />} />
          <Route path="/exame/renal" element={<ComingSoon modalidade="Rins e Vias Urinárias" />} />
          <Route path="/exame/musculoesqueletico" element={<ComingSoon modalidade="Musculoesquelético" />} />
          <Route path="/exame/ocular" element={<ComingSoon modalidade="Ocular" />} />

          {/* Rota padrão - redireciona para landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

// Componente temporário para modalidades em desenvolvimento
const ComingSoon: React.FC<{ modalidade: string }> = ({ modalidade }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">🚧 Em Desenvolvimento</h1>
        <p className="text-xl text-muted-foreground mb-8">
          A modalidade <strong>{modalidade}</strong> estará disponível em breve!
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Voltar ao Início
        </a>
      </div>
    </div>
  );
};

export default App;