import React from 'react';
import { useNavigate } from 'react-router-dom';

const examModules = [
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
  },
  {
    id: 'carotid',
    route: '/carotid-modern',
    title: 'Ecodoppler de Carótidas',
    description: 'VPS, VDF, NASCET, EMI e caracterização de placas',
    gradient: 'from-purple-500 to-fuchsia-600',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.79-3 4s1.343 4 3 4 3-1.79 3-4-1.343-4-3-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h4m12 0h4" />
      </svg>
    )
  },
  {
    id: 'thyroid',
    route: '/thyroid-modern',
    title: 'Ultrassonografia de Tireoide',
    description: 'Nódulos, TI-RADS ACR e linfonodos cervicais',
    gradient: 'from-teal-500 to-cyan-600',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    )
  },
  {
    id: 'breast',
    route: '/breast-exam',
    title: 'Ultrassonografia Mamária',
    description: 'Nódulos, cistos, BI-RADS 5ª edição',
    gradient: 'from-pink-500 to-rose-600',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="8" />
      </svg>
    )
  },
  {
    id: 'arterial',
    route: '/arterial-modern',
    title: 'Ecodoppler Arterial MMII',
    description: 'ITB, estenoses, oclusões e padrões de onda',
    gradient: 'from-red-500 to-orange-600',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    id: 'venous',
    route: '/venous-modern',
    title: 'Ecodoppler Venoso MMII',
    description: 'TVP, refluxo, varizes e mapeamento',
    gradient: 'from-blue-500 to-sky-600',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    )
  },
  {
    id: 'abdominal-vessels',
    route: '/abdominal-vessels-modern',
    title: 'Ecodoppler de Vasos Abdominais',
    description: 'Aorta, renais, mesentéricas e tronco celíaco',
    gradient: 'from-amber-500 to-yellow-600',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  },
  {
    id: 'abdominal-wall',
    route: '/abdominal-wall-modern',
    title: 'Ultrassonografia de Parede Abdominal',
    description: 'Hérnias, diástase e lesões de partes moles',
    gradient: 'from-emerald-500 to-green-600',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
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
          {examModules.map((exam) => (
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
          ))}
        </section>
      </main>
    </div>
  );
}

export default Home;
