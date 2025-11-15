import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 bg-card/40 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">US</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">VERTEX</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Plataforma de laudos</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 text-sm rounded-md border border-border hover:bg-accent/20 transition-colors"
              onClick={() => navigate('/landing')}
            >
              Ver landing moderna
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-8">
          <h2 className="text-lg font-semibold">Exames</h2>
          <p className="text-sm text-muted-foreground">Escolhe um módulo para iniciar</p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          {/* Abdome Total */}
          <button
            onClick={() => navigate('/exam/abdome-total')}
            className="text-left group rounded-xl border border-border bg-card/60 hover:bg-card transition-colors shadow-sm overflow-hidden"
          >
            <div className="p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base">Ultrassonografia Abdominal Total</h3>
                <p className="text-sm text-muted-foreground mt-1">Painel de achados, laudo estruturado e IA integrada</p>
                <div className="mt-3 flex gap-2 text-xs text-muted-foreground">
                  <span className="rounded-md border border-border px-2 py-0.5">V2</span>
                  <span className="rounded-md border border-border px-2 py-0.5">Portal flutuante</span>
                </div>
              </div>
            </div>
          </button>

          {/* Carótidas */}
          <button
            onClick={() => navigate('/exam/carotid')}
            className="text-left group rounded-xl border border-border bg-card/60 hover:bg-card transition-colors shadow-sm overflow-hidden"
          >
            <div className="p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white flex items-center justify-center shadow">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.79-3 4s1.343 4 3 4 3-1.79 3-4-1.343-4-3-4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h4m12 0h4M12 2v4m0 12v4" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base">Ecodoppler Carótidas</h3>
                <p className="text-sm text-muted-foreground mt-1">VPS, VDF, NASCET, EMI e placas</p>
                <div className="mt-3 flex gap-2 text-xs text-muted-foreground">
                  <span className="rounded-md border border-border px-2 py-0.5">V2</span>
                  <span className="rounded-md border border-border px-2 py-0.5">Inspector dockável</span>
                </div>
              </div>
            </div>
          </button>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-medium mb-3 text-muted-foreground">Acesso rápido</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/abdome-modern')}
              className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent/20"
            >
              Abdome (layout moderno)
            </button>
            <button
              onClick={() => navigate('/carotid-modern')}
              className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent/20"
            >
              Carótidas (layout moderno)
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;

