import React from 'react';
import { useNavigate } from 'react-router-dom';
import '@/styles/modern-design.css';

export function LandingPageModern() {
  const navigate = useNavigate();

  return (
    <div className="modern-layout min-h-screen flex items-center justify-center p-4">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
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
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Abdome Total */}
          <div
            onClick={() => navigate('/abdome-modern')}
            className="glass-panel p-8 cursor-pointer group relative overflow-hidden"
          >
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-3xl font-bold text-white mb-3">
                Abdome Total
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Ultrassonografia abdominal completa com painel flutuante de achados e geração automática de laudos com IA
              </p>

              {/* Stats */}
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

              {/* CTA */}
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
            onClick={() => navigate('/carotid-modern')}
            className="glass-panel p-8 cursor-pointer group relative overflow-hidden"
          >
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-3xl font-bold text-white mb-3">
                Ecodoppler Carótidas
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Doppler vascular com campos específicos (VPS, VDF, NASCET, EMI) e análise detalhada de placas
              </p>

              {/* Stats */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 glass-card">
                  <div className="text-2xl font-bold text-purple-400">6+</div>
                  <div className="text-xs text-gray-400">Territórios</div>
                </div>
                <div className="flex-1 glass-card">
                  <div className="text-2xl font-bold text-pink-400">30+</div>
                  <div className="text-xs text-gray-400">Parâmetros</div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center text-purple-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span>Acessar módulo</span>
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Breast Ultrasound Card - Segunda Linha */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Ultrassom de Mama */}
          <div
            onClick={() => navigate('/mammography-modern')}
            className="glass-panel p-8 cursor-pointer group relative overflow-hidden"
          >
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-3xl font-bold text-white mb-3">
                Ultrassom de Mama
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Avaliação mamária completa com BI-RADS, análise de nódulos, cistos e alterações parenquimatosas
              </p>

              {/* Stats */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 glass-card">
                  <div className="text-2xl font-bold text-pink-400">BI-RADS</div>
                  <div className="text-xs text-gray-400">Classificação</div>
                </div>
                <div className="flex-1 glass-card">
                  <div className="text-2xl font-bold text-rose-400">40+</div>
                  <div className="text-xs text-gray-400">Achados</div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center text-pink-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span>Acessar módulo</span>
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Ecodoppler de Tireóide */}
          <div
            onClick={() => navigate('/thyroid-modern')}
            className="glass-panel p-8 cursor-pointer group relative overflow-hidden"
          >
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-3xl font-bold text-white mb-3">
                Ecodoppler de Tireóide
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Avaliação tireoidiana com TI-RADS automático, Doppler colorido e análise de linfonodos cervicais
              </p>

              {/* Stats */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 glass-card">
                  <div className="text-2xl font-bold text-emerald-400">TI-RADS</div>
                  <div className="text-xs text-gray-400">ACR 2017</div>
                </div>
                <div className="flex-1 glass-card">
                  <div className="text-2xl font-bold text-teal-400">4+</div>
                  <div className="text-xs text-gray-400">Estruturas</div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center text-emerald-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                <span>Acessar módulo</span>
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

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
