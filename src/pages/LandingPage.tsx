import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLastExam } from '@/hooks/useLastExam';
import { useAuth } from '@/contexts/AuthContext';
import '@/styles/modern-design.css';

const examRoutes: Record<string, string> = {
  '/abdome-modern': 'Abdome',
  '/carotid-modern': 'Ecodoppler Carótidas',
  '/ombro-modern': 'Ultrassom de Ombro',
  '/breast-exam': 'Ultrassom de Mama',
  '/arterial-modern': 'Doppler Arterial MMII',
  '/thyroid-modern': 'Ecodoppler de Tireóide',
  '/venous-modern': 'Doppler Venoso MMII',
  '/abdominal-vessels-modern': 'Ecodoppler de Vasos Abdominais',
  '/abdominal-wall-modern': 'US Parede Abdominal',
};


export function LandingPageModern() {
  const navigate = useNavigate();
  const { lastExam, saveLastExam } = useLastExam();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (route: string) => {
    saveLastExam(route, examRoutes[route] || 'Exame');
    navigate(route);
  };

  return (
    <div className="modern-layout min-h-screen flex items-center justify-center p-4">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* User Header */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <span className="text-sm text-slate-400">
          Olá, <span className="text-white font-medium">{user?.name}</span>
        </span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sair
        </button>
      </div>

      <div className="relative z-10 max-w-7xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-up">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full bg-white/5 flex items-center justify-center shadow-2xl ring-1 ring-white/10">
                <img src="/logo-vertex.svg" alt="Vertex Ultrasound" className="w-52 h-52 md:w-60 md:h-60" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
          </h1>



            <p className="text-2xl md:text-3xl mb-4 text-center tracking-wide font-bold capitalize">
              Sistema Profissional de Laudos Ultrassonográficos
            </p>

            <p className="text-gray-400 max-w-2xl mx-auto text-xl">
              Interface moderna  responsiva e com experiência premium
            </p>

        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {/* Abdome Total */}
          <div
            onClick={() => handleNavigate('/abdome-modern')}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigate('/abdome-modern')}
            className="glass-panel p-8 cursor-pointer group relative overflow-hidden stagger-item ripple-container"
            tabIndex={0}
            role="button"
            aria-label="Acessar módulo Abdome"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {lastExam?.route === '/abdome-modern' && (
              <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-bold text-white shadow-lg animate-pulse">
                Continuar
              </div>
            )}

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <h3 className="text-3xl font-bold text-white mb-3">Abdome</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Ultrassonografia abdominal completa com painel flutuante de achados e geração automática de laudos com IA
              </p>

              <div className="flex gap-4 mb-6">
                <div className="flex-1 glass-card">
                  <div className="text-2xl font-bold text-indigo-400">8+</div>
                  <div className="text-xs text-gray-400">Órgãos</div>
                </div>
                <div className="flex-1 glass-card">
                  <div className="text-2xl font-bold text-purple-400">50+</div>
                  <div className="text-xs text-gray-400">Achados</div>
                </div>
              </div>

              <div className="flex items-center text-indigo-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span>Acessar módulo</span>
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Ecodoppler Carótidas */}
          <div
            onClick={() => handleNavigate('/carotid-modern')}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigate('/carotid-modern')}
            className="glass-panel p-8 cursor-pointer group relative overflow-hidden stagger-item ripple-container"
            tabIndex={0}
            role="button"
            aria-label="Acessar módulo Ecodoppler Carótidas"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {lastExam?.route === '/carotid-modern' && (
              <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-bold text-white shadow-lg animate-pulse">
                Continuar
              </div>
            )}

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>

              <h3 className="text-3xl font-bold text-white mb-3">Carótidas</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Ecodoppler de carótidas e vertebrais com calculadora NASCET/ESVS e análise de placas
              </p>

              <div className="flex gap-4 mb-6">
                <div className="flex-1 glass-card">
                  <div className="text-2xl font-bold text-rose-400">8</div>
                  <div className="text-xs text-gray-400">Artérias</div>
                </div>
                <div className="flex-1 glass-card">
                  <div className="text-2xl font-bold text-orange-400">NASCET</div>
                  <div className="text-xs text-gray-400">Critérios</div>
                </div>
              </div>

              <div className="flex items-center text-rose-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span>Acessar módulo</span>
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Ombro */}
          <div
            onClick={() => handleNavigate('/ombro-modern')}
            onKeyDown={(e) => e.key === 'Enter' && handleNavigate('/ombro-modern')}
            className="glass-panel p-8 cursor-pointer group relative overflow-hidden stagger-item ripple-container"
            tabIndex={0}
            role="button"
            aria-label="Acessar módulo Ombro"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {lastExam?.route === '/ombro-modern' && (
              <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-bold text-white shadow-lg animate-pulse">
                Continuar
              </div>
            )}

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              <h3 className="text-3xl font-bold text-white mb-3">Ombro</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Ultrassonografia de ombro com avaliação do manguito rotador, bíceps e bursa
              </p>

              <div className="flex gap-4 mb-6">
                <div className="flex-1 glass-card">
                  <div className="text-2xl font-bold text-cyan-400">7</div>
                  <div className="text-xs text-gray-400">Estruturas</div>
                </div>
                <div className="flex-1 glass-card">
                  <div className="text-2xl font-bold text-teal-400">20+</div>
                  <div className="text-xs text-gray-400">Achados</div>
                </div>
              </div>

              <div className="flex items-center text-cyan-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span>Acessar módulo</span>
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Outros exames: reativar conforme migração */}

        {/* Features Grid */}
        <div className="glass-panel p-8 mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            ✨ Recursos Premium
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                ),
                title: 'Design Moderno',
                desc: 'Glassmorphism e gradientes suaves',
                color: 'indigo'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Performance',
                desc: 'CSS Grid otimizado e animações 60fps',
                color: 'purple'
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Responsivo',
                desc: 'Desktop, tablet e mobile adaptável',
                color: 'emerald'
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card group hover:scale-105 transition-transform">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 flex items-center justify-center mb-4 text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Vertex V2.0.0 • Redesign Completo • localhost:8201</p>
          <p className="mt-2 text-gray-600">Desenvolvido com ❤️ por Claude + Anders</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPageModern;
