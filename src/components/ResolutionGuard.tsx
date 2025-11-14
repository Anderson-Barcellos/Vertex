import { useState, useEffect, ReactNode } from 'react';

interface ResolutionGuardProps {
  children: ReactNode;
}

const MIN_WIDTH = 1280;
const MIN_HEIGHT = 800;

export default function ResolutionGuard({ children }: ResolutionGuardProps) {
  const [isCompatible, setIsCompatible] = useState(true);
  const [currentResolution, setCurrentResolution] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Função para verificar resolução
    const checkResolution = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setCurrentResolution({ width, height });
      setIsCompatible(width >= MIN_WIDTH && height >= MIN_HEIGHT);
    };

    // Verificação inicial
    checkResolution();

    // Listener para mudanças de resolução (debounced)
    let timeoutId: NodeJS.Timeout;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkResolution, 300);
    };

    window.addEventListener('resize', debouncedCheck);

    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedCheck);
      clearTimeout(timeoutId);
    };
  }, []);

  // Se compatível, renderiza normalmente
  if (isCompatible) {
    return <>{children}</>;
  }

  // Tela de incompatibilidade futurista
  return (
    <div className="resolution-guard">
      <div className="resolution-guard-content">
        {/* Logo animado */}
        <div className="resolution-guard-logo">
          <div className="logo-glow">
            <span className="logo-text">US</span>
          </div>
        </div>

        {/* Título */}
        <h1 className="resolution-guard-title">
          Resolução Incompatível
        </h1>

        {/* Descrição */}
        <div className="resolution-guard-description">
          <p className="text-lg mb-4">
            Esta aplicação requer no mínimo:
          </p>

          <div className="resolution-badge">
            <svg
              className="resolution-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span className="resolution-value">
              {MIN_WIDTH} × {MIN_HEIGHT} pixels
            </span>
          </div>

          <div className="resolution-current">
            <p className="text-sm opacity-70">
              Sua resolução atual:
            </p>
            <p className="text-xl font-bold text-red-400">
              {currentResolution.width} × {currentResolution.height} pixels
            </p>
          </div>

          {/* Instruções */}
          <div className="resolution-instructions">
            <div className="instruction-item">
              <span className="instruction-icon">📐</span>
              <span>Aumente o tamanho da janela do navegador</span>
            </div>
            <div className="instruction-item">
              <span className="instruction-icon">🖥️</span>
              <span>Use um monitor com resolução maior</span>
            </div>
            <div className="instruction-item">
              <span className="instruction-icon">🔍</span>
              <span>Ajuste o zoom do navegador para 100%</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="resolution-guard-footer">
          <p className="text-xs opacity-50">
            Vertex US • Sistema de Laudos Ultrassonográficos
          </p>
        </div>
      </div>

      {/* Orbs de fundo animados */}
      <div className="animated-orb orb-1"></div>
      <div className="animated-orb orb-2"></div>
      <div className="animated-orb orb-3"></div>
    </div>
  );
}
