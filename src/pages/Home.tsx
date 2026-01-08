import React from 'react';
import { useNavigate } from 'react-router-dom';

const examModules: Array<{
  id: string;
  route: string;
  title: string;
  description: string;
  gradient: string;
  icon: React.ReactNode;
}> = [
  {
    id: 'abdome',
    route: '/abdome-modern',
    title: 'Ultrassonografia Abdominal Total',
    description: 'Fígado, vesícula, vias biliares, pâncreas, baço, rins e retroperitônio',
    gradient: 'from-indigo-500 to-indigo-600',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
      </svg>
    )
  }
];

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
              Ver landing
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-8">
          <h2 className="text-lg font-semibold">Exames Disponíveis</h2>
          <p className="text-sm text-muted-foreground">Selecione uma modalidade para iniciar o laudo</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {examModules.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <p className="text-lg">Migrando exames para nova arquitetura...</p>
              <p className="text-sm mt-2">Os módulos serão adicionados conforme validados</p>
            </div>
          ) : (
            examModules.map((exam) => (
              <button
                key={exam.id}
                onClick={() => navigate(exam.route)}
                className="text-left group rounded-xl border border-border bg-card/60 hover:bg-card hover:border-primary/30 transition-all shadow-sm overflow-hidden"
              >
                <div className="p-5 flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exam.gradient} text-white flex items-center justify-center shadow`}>
                    {exam.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{exam.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{exam.description}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;
