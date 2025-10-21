import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Stethoscope,
  Heart,
  Baby,
  Activity,
  Scan,
  Brain,
  Bone,
  Eye,
  ArrowRight,
  CheckCircle,
  Users,
  Shield,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const modalidades = [
    {
      id: 'abdome-total',
      titulo: 'Abdome Total',
      descricao: 'Avaliação completa dos órgãos abdominais',
      icone: Scan,
      cor: 'bg-blue-500',
      disponivel: true,
      rota: '/exame/abdome-total',
      recursos: ['Fígado', 'Vesícula', 'Pâncreas', 'Rins', 'Baço']
    },
    {
      id: 'obstetrico',
      titulo: 'Obstétrico',
      descricao: 'Acompanhamento gestacional completo',
      icone: Baby,
      cor: 'bg-pink-500',
      disponivel: false,
      rota: '/exame/obstetrico',
      recursos: ['Biometria Fetal', 'Morfológico', 'Doppler', 'Gemelar']
    },
    {
      id: 'cardiaco',
      titulo: 'Ecocardiograma',
      descricao: 'Avaliação estrutural e funcional cardíaca',
      icone: Heart,
      cor: 'bg-red-500',
      disponivel: false,
      rota: '/exame/cardiaco',
      recursos: ['Função Ventricular', 'Valvas', 'Doppler', 'Strain']
    },
    {
      id: 'vascular',
      titulo: 'Vascular',
      descricao: 'Doppler arterial e venoso',
      icone: Activity,
      cor: 'bg-purple-500',
      disponivel: false,
      rota: '/exame/vascular',
      recursos: ['Carótidas', 'MMII', 'MMSS', 'Aorta']
    },
    {
      id: 'tireoide',
      titulo: 'Tireoide',
      descricao: 'Avaliação morfológica e TIRADS',
      icone: Brain,
      cor: 'bg-green-500',
      disponivel: false,
      rota: '/exame/tireoide',
      recursos: ['TIRADS', 'Nódulos', 'Doppler', 'Linfonodos']
    },
    {
      id: 'renal',
      titulo: 'Rins e Vias Urinárias',
      descricao: 'Sistema urinário completo',
      icone: Scan,
      cor: 'bg-teal-500',
      disponivel: false,
      rota: '/exame/renal',
      recursos: ['Rins', 'Ureteres', 'Bexiga', 'Próstata']
    },
    {
      id: 'musculoesqueletico',
      titulo: 'Musculoesquelético',
      descricao: 'Articulações e partes moles',
      icone: Bone,
      cor: 'bg-orange-500',
      disponivel: false,
      rota: '/exame/musculoesqueletico',
      recursos: ['Ombro', 'Joelho', 'Tendões', 'Bursas']
    },
    {
      id: 'ocular',
      titulo: 'Ocular',
      descricao: 'Ultrassom oftalmológico',
      icone: Eye,
      cor: 'bg-indigo-500',
      disponivel: false,
      rota: '/exame/ocular',
      recursos: ['Biometria', 'Retina', 'Vítreo', 'Órbita']
    }
  ];

  const recursos = [
    {
      icone: Zap,
      titulo: 'Geração Rápida',
      descricao: 'Crie laudos completos em minutos com nossa interface intuitiva'
    },
    {
      icone: Shield,
      titulo: 'Seguro e Confiável',
      descricao: 'Dados protegidos com criptografia e conformidade médica'
    },
    {
      icone: Users,
      titulo: 'Feito por Médicos',
      descricao: 'Desenvolvido com expertise de radiologistas brasileiros'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              Plataforma Profissional de Laudos
            </Badge>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              UltraSound Report GE
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Sistema inteligente para geração de laudos ultrassonográficos.
              Otimize seu tempo e mantenha a qualidade profissional em seus relatórios médicos.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/exame/abdome-total')}
                className="gap-2"
              >
                Começar Agora <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                Ver Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recursos Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher nossa plataforma?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {recursos.map((recurso, index) => (
              <Card key={index} className="border-0 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <recurso.icone className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{recurso.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{recurso.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modalidades Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Modalidades de Exame
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha a modalidade de ultrassonografia para gerar laudos especializados.
              Cada módulo foi desenvolvido seguindo as diretrizes médicas mais atuais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modalidades.map((modalidade) => (
              <Card
                key={modalidade.id}
                className={`relative overflow-hidden transition-all duration-300 ${
                  modalidade.disponivel
                    ? 'hover:shadow-lg hover:scale-105 cursor-pointer'
                    : 'opacity-60'
                }`}
                onClick={() => modalidade.disponivel && navigate(modalidade.rota)}
              >
                <div className={`absolute top-0 left-0 w-full h-1 ${modalidade.cor}`} />
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-12 h-12 rounded-lg ${modalidade.cor}/10 flex items-center justify-center`}>
                      <modalidade.icone className={`w-6 h-6 text-white ${modalidade.cor} p-1 rounded`} />
                    </div>
                    {modalidade.disponivel ? (
                      <Badge variant="default" className="bg-green-500">
                        Disponível
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Em breve
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{modalidade.titulo}</CardTitle>
                  <CardDescription>{modalidade.descricao}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Recursos incluídos:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {modalidade.recursos.slice(0, 3).map((recurso, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {recurso}
                        </Badge>
                      ))}
                      {modalidade.recursos.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{modalidade.recursos.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {modalidade.disponivel && (
                    <Button
                      className="w-full mt-4"
                      variant="secondary"
                      size="sm"
                    >
                      Acessar <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para otimizar seus laudos?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de profissionais que já utilizam nossa plataforma
            para gerar laudos precisos e profissionais.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/exame/abdome-total')}
            className="gap-2"
          >
            <Stethoscope className="w-5 h-5" />
            Começar com Abdome Total
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Scan className="w-6 h-6 text-primary" />
              <span className="font-semibold">UltraSound Report GE</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 - Desenvolvido para profissionais de saúde
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm">Termos</Button>
              <Button variant="ghost" size="sm">Privacidade</Button>
              <Button variant="ghost" size="sm">Contato</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;