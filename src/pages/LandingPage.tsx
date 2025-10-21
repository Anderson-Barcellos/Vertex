import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Baby,
  Heart,
  Activity,
  Users,
  Scan,
  FileText,
  Brain,
  Gauge,
  ClipboardCheck,
  ShieldCheck,
  Workflow,
  BookOpenCheck,
  Headset,
  CloudCog
} from 'lucide-react';

const examTypes = [
  {
    id: 'abdome-total',
    name: 'Abdome Total',
    description: 'Avaliação completa dos órgãos abdominais',
    icon: Stethoscope,
    available: true,
    route: '/exam/abdome-total',
    color: 'bg-blue-500'
  },
  {
    id: 'carotid',
    name: 'Ecodoppler de Carótidas e Vertebrais',
    description: 'Avaliação doppler das artérias carótidas e vertebrais',
    icon: Activity,
    available: true,
    route: '/carotid-exam',
    color: 'bg-purple-500'
  },
  {
    id: 'mamas',
    name: 'Mamas',
    description: 'Ultrassonografia mamária com BI-RADS',
    icon: Heart,
    available: true,
    route: '/exam/mamas',
    color: 'bg-pink-500'
  },
  {
    id: 'obstetrico',
    name: 'Obstétrico',
    description: 'Acompanhamento gestacional e fetal',
    icon: Baby,
    available: false,
    route: '/exam/obstetrico',
    color: 'bg-cyan-500'
  },
  {
    id: 'cardiaco',
    name: 'Cardíaco',
    description: 'Ecocardiograma e análise cardíaca',
    icon: Heart,
    available: false,
    route: '/exam/cardiaco',
    color: 'bg-red-500'
  },
  {
    id: 'vascular',
    name: 'Vascular',
    description: 'Doppler vascular e análise de fluxo',
    icon: Activity,
    available: false,
    route: '/exam/vascular',
    color: 'bg-purple-500'
  },
  {
    id: 'ginecologico',
    name: 'Ginecológico',
    description: 'Transvaginal e pélvico',
    icon: Users,
    available: false,
    route: '/exam/ginecologico',
    color: 'bg-teal-500'
  },
  {
    id: 'tireoide',
    name: 'Tireoide',
    description: 'Avaliação da glândula tireoide',
    icon: Scan,
    available: false,
    route: '/exam/tireoide',
    color: 'bg-green-500'
  },
  {
    id: 'musculoesqueletico',
    name: 'Musculoesquelético',
    description: 'Articulações e tecidos moles',
    icon: FileText,
    available: false,
    route: '/exam/musculoesqueletico',
    color: 'bg-orange-500'
  },
  {
    id: 'neurologico',
    name: 'Neurológico',
    description: 'Doppler transcraniano',
    icon: Brain,
    available: false,
    route: '/exam/neurologico',
    color: 'bg-indigo-500'
  }
];

const featureHighlights = [
  {
    title: 'Assistente de IA Clínica',
    description: 'Integração nativa com Gemini 2.5 Pro e OpenAI para enriquecer descrições com linguagem médica adequada.',
    points: [
      'Prompt otimizado para laudos brasileiros',
      'Geração instantânea com feedback visual',
      'Correções editáveis em tempo real'
    ],
    icon: Brain,
    accent: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    title: 'Resumo dinâmico do exame',
    description: 'Painéis laterais indicam cobertura do exame, achados recentes e órgãos normais com indicador de progresso.',
    points: [
      'Cobertura percentual por órgão',
      'Histórico dos últimos achados',
      'Alertas para seções pendentes'
    ],
    icon: Gauge,
    accent: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    title: 'Templates validados',
    description: 'Modelos construídos com especialistas e alinhados aos protocolos de 2025 do CBR para ultrassonografia.',
    points: [
      'Terminologia padronizada',
      'Campos guiados por severidade e medidas',
      'Estrutura de laudo pronta para impressão'
    ],
    icon: ClipboardCheck,
    accent: 'text-violet-500',
    bg: 'bg-violet-500/10'
  },
  {
    title: 'Segurança e governança',
    description: 'Controle granular de acesso, histórico de versões e exportação compatível com prontuário eletrônico.',
    points: [
      'Backup automático de relatórios',
      'Controle de revisões por usuário',
      'Exportação estruturada em PDF (roadmap)'
    ],
    icon: ShieldCheck,
    accent: 'text-amber-500',
    bg: 'bg-amber-500/10'
  }
];

const workflowSteps = [
  {
    step: 'Etapa 01',
    title: 'Configure a modalidade',
    description: 'Selecione o protocolo do exame, personalize preferências e ative o assistente de IA desejado.'
  },
  {
    step: 'Etapa 02',
    title: 'Documente os achados',
    description: 'Navegue por órgãos, registre severidade, medidas e contexto clínico com formulários inteligentes.'
  },
  {
    step: 'Etapa 03',
    title: 'Revise o resumo dinâmico',
    description: 'Acompanhe o painel lateral para validar cobertura, achar inconsistências e ajustar a narrativa.'
  },
  {
    step: 'Etapa 04',
    title: 'Gere e compartilhe o laudo',
    description: 'Combine achados normais e patológicos em um texto final pronto para assinatura e envio.'
  }
];

const supportResources = [
  {
    title: 'Biblioteca de achados',
    description: 'Base terminológica completa com descrições, severidades e opções de mensuração validadas.',
    metrics: '120+ achados catalogados',
    icon: BookOpenCheck,
    accent: 'text-sky-500',
    bg: 'bg-sky-500/10'
  },
  {
    title: 'Suporte especializado',
    description: 'Equipe médica e técnica disponível para onboarding, treinamentos e implantação assistida.',
    metrics: 'SLA médio < 24h úteis',
    icon: Headset,
    accent: 'text-rose-500',
    bg: 'bg-rose-500/10'
  },
  {
    title: 'Integrações & APIs',
    description: 'Conectores para PACS, HL7 e exportação estruturada via SDK em evolução contínua.',
    metrics: 'SDK Beta + Webhooks',
    icon: CloudCog,
    accent: 'text-indigo-500',
    bg: 'bg-indigo-500/10'
  }
];

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-background">
      {/* Dark Sidebar - Mantendo o mesmo estilo */}
      <div style={{ backgroundColor: 'var(--sidebar-background)' }} className="w-64 border-r border-border/20">
        <div className="p-4 border-b border-border/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-semibold text-sm">US</span>
            </div>
            <div>
              <h1 style={{ color: 'var(--sidebar-foreground)' }} className="text-lg font-semibold">
                VERTEX US
              </h1>
              <p style={{ color: 'var(--sidebar-foreground)' }} className="text-sm opacity-70">
                Ultrassonografia inteligente
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <h3 style={{ color: 'var(--sidebar-foreground)' }} className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">
                Recursos
              </h3>
              <ul className="space-y-2">
                <li style={{ color: 'var(--sidebar-foreground)' }} className="text-sm opacity-80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  Geração com IA
                </li>
                <li style={{ color: 'var(--sidebar-foreground)' }} className="text-sm opacity-80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  Templates profissionais
                </li>
                <li style={{ color: 'var(--sidebar-foreground)' }} className="text-sm opacity-80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  Exportação em PDF
                </li>
                <li style={{ color: 'var(--sidebar-foreground)' }} className="text-sm opacity-80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                  Banco de achados
                </li>
              </ul>
            </div>

            <div>
              <h3 style={{ color: 'var(--sidebar-foreground)' }} className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">
                Estatísticas
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span style={{ color: 'var(--sidebar-foreground)' }} className="text-xs opacity-70">Modalidades</span>
                    <span style={{ color: 'var(--sidebar-foreground)' }} className="text-xs font-semibold">9</span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: '33.3%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span style={{ color: 'var(--sidebar-foreground)' }} className="text-xs opacity-70">Disponíveis</span>
                    <span style={{ color: 'var(--sidebar-foreground)' }} className="text-xs font-semibold">3</span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '33.3%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/20">
          <p style={{ color: 'var(--sidebar-foreground)' }} className="text-xs opacity-50 text-center">
            © 2025 UltraReport
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-card">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Selecione o Tipo de Exame
            </h1>
            <p className="text-lg text-muted-foreground">
              Escolha a modalidade de ultrassonografia para gerar o laudo especializado
            </p>
          </div>

          {/* Exam Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {examTypes.map((exam) => {
              const Icon = exam.icon;
              return (
                <div
                  key={exam.id}
                  className={`relative group ${
                    exam.available
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed opacity-60'
                  }`}
                  onClick={() => exam.available && navigate(exam.route)}
                >
                  <div className={`bg-background border border-border rounded-lg p-6 transition-all duration-300 ${
                    exam.available
                      ? 'hover:shadow-xl hover:scale-105 hover:border-accent'
                      : ''
                  }`}>
                    {/* Icon */}
                    <div className={`w-12 h-12 ${exam.color} rounded-lg flex items-center justify-center mb-4 ${
                      exam.available ? 'opacity-100' : 'opacity-50'
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold mb-2">
                      {exam.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {exam.description}
                    </p>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        exam.available
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {exam.available ? 'Disponível' : 'Em breve'}
                      </span>
                      {exam.available && (
                        <span className="text-accent text-sm font-medium group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      )}
                    </div>

                    {/* Coming Soon Overlay */}
                    {!exam.available && (
                      <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-muted-foreground bg-background px-3 py-1 rounded-full border border-border">
                          Em desenvolvimento
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="mt-12 bg-accent/5 border border-accent/20 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-3">
              💡 Sobre o Sistema
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              O UltraReport é um sistema avançado de geração de laudos ultrassonográficos que utiliza
              inteligência artificial para agilizar e padronizar o processo de documentação médica.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-500">✓</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Rápido</h4>
                  <p className="text-xs text-muted-foreground">
                    Gere laudos completos em segundos
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-500">✓</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Preciso</h4>
                  <p className="text-xs text-muted-foreground">
                    Templates validados por especialistas
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-500">✓</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Inteligente</h4>
                  <p className="text-xs text-muted-foreground">
                    IA para sugestões contextuais
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Resources */}
          <div className="mt-12 space-y-10">
            <section className="bg-background border border-border/40 rounded-xl p-8 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">Recursos avançados</p>
                  <h2 className="text-2xl font-bold">Ferramentas clínicas prontas para produção</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Combine inteligência artificial, banco de achados e painéis interativos para acelerar a rotina de laudos sem abrir mão da qualidade técnica.
                  </p>
                </div>
                <div className="text-sm text-muted-foreground md:w-1/3">
                  Atualizações semanais com validação de especialistas e suporte dedicado para instituições e clínicas.
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {featureHighlights.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="relative rounded-lg border border-border/40 bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full ${feature.bg}`}>
                        <Icon className={`h-5 w-5 ${feature.accent}`} />
                      </div>
                      <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {feature.points.map((point) => (
                          <li key={point} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 bg-accent/10 border border-accent/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Workflow className="h-6 w-6 text-accent" />
                  <div>
                    <p className="text-xs uppercase font-semibold tracking-wide text-accent">Fluxo assistido</p>
                    <h2 className="text-xl font-semibold">Workflow médico otimizado</h2>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Do cadastro ao relatório final, cada etapa foi desenhada para garantir precisão, padronização e velocidade no atendimento.
                </p>
              </div>
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {workflowSteps.map((step) => (
                  <div
                    key={step.title}
                    className="border border-border/40 rounded-lg p-5 bg-card shadow-sm hover:border-accent/40 transition-colors"
                  >
                    <span className="text-xs font-semibold text-accent uppercase tracking-wide">{step.step}</span>
                    <h3 className="text-lg font-semibold mt-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-card border border-border/40 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">Suporte &amp; Evolução</p>
                  <h2 className="text-xl font-semibold">Mais do que um gerador de laudos</h2>
                </div>
                <p className="text-sm text-muted-foreground md:w-1/2">
                  Recursos complementares garantem adoção rápida, treinamento contínuo e integração com o ecossistema clínico da sua instituição.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {supportResources.map((resource) => {
                  const Icon = resource.icon;
                  return (
                    <div key={resource.title} className="rounded-lg border border-border/40 bg-background p-5 flex flex-col gap-3">
                      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${resource.bg}`}>
                        <Icon className={`h-4 w-4 ${resource.accent}`} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wide">
                        {resource.metrics}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="border border-dashed border-accent/50 rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-accent/5">
              <div>
                <h3 className="text-lg font-semibold">Pronto para elevar os laudos da sua clínica?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Acesse a documentação técnica completa ou fale com nossa equipe para ativar recursos avançados e personalizações.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/exam/abdome-total')}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                >
                  Começar agora
                </button>
                <a
                  href="https://github.com/Anderson-Barcellos/Turing/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 text-sm font-medium rounded-md border border-accent/60 text-accent hover:bg-accent/10 transition-colors"
                >
                  Solicitar demo
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;