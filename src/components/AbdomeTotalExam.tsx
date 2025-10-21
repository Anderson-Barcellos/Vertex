import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import OrganSection from '@/components/OrganSection';
import ReportCanvas from '@/components/ReportCanvas';
import { organs } from '@/data/organs';
import { SelectedFinding, ReportData, type AIProvider } from '@/types/report';
import { Finding } from '@/data/organs';
import { generateReport } from '@/services/reportGenerator';
import { geminiStreamService } from '@/services/geminiStreamService';
import { toast } from 'sonner';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

function AbdomeTotalExam() {
  const navigate = useNavigate();
  const [selectedOrgan, setSelectedOrgan] = useState('figado');
  const [selectedFindings, setSelectedFindings] = useState<SelectedFinding[]>([]);
  const [normalOrgans, setNormalOrgans] = useState<string[]>([]);
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);

  const handleOrganSelect = (organId: string) => {
    if (selectedOrgan === organId) {
      // Toggle minimized state if same organ is selected
      setIsPanelMinimized(!isPanelMinimized);
    } else {
      // Select new organ and ensure panel is expanded
      setSelectedOrgan(organId);
      setIsPanelMinimized(false);
    }
  };

  const handleFindingChange = (
    organId: string,
    categoryId: string,
    findingId: string,
    checked: boolean,
    finding: Finding
  ) => {
    setSelectedFindings(currentFindings => {
      if (checked) {
        // Add finding
        const newFinding: SelectedFinding = {
          organId,
          categoryId,
          findingId,
          finding
        };
        return [...currentFindings, newFinding];
      } else {
        // Remove finding
        return currentFindings.filter(f => f.findingId !== findingId);
      }
    });

    // Remove organ from normal list if findings are selected
    if (checked) {
      setNormalOrgans(currentNormal =>
        currentNormal.filter(id => id !== organId)
      );
    }
  };

  const handleNormalChange = (organId: string, isNormal: boolean) => {
    if (isNormal) {
      // Add to normal organs and remove any findings for this organ
      setNormalOrgans(currentNormal => {
        if (!currentNormal.includes(organId)) {
          return [...currentNormal, organId];
        }
        return currentNormal;
      });

      setSelectedFindings(currentFindings =>
        currentFindings.filter(f => f.organId !== organId)
      );
    } else {
      // Remove from normal organs
      setNormalOrgans(currentNormal =>
        currentNormal.filter(id => id !== organId)
      );
    }
  };

  const handleGenerateReport = async (
    data: ReportData,
    options: { model: AIProvider; specificModel: string }
  ) => {
    setIsGenerating(true);
    setGeneratedReport(''); // Limpar relatório anterior

    try {
      const provider = options?.model ?? 'gemini';
      const specificModel = options?.specificModel ?? 'gemini-2.0-flash-exp';

      console.log('[AbdomeTotalExam] Gerando relatório com:', {
        provider,
        specificModel,
        findingsCount: data.selectedFindings.length,
        normalOrgansCount: data.normalOrgans.length
      });

      if (provider === 'openai') {
        toast.info(
          `Gerando laudo com ${specificModel}...`
        );
      } else {
        toast.info(
          `Gerando laudo com ${specificModel}...`
        );
      }

      // Usar streaming para gerar relatório em tempo real
      // Armazenar modelo no sessionStorage para ser usado pelo serviço
      sessionStorage.setItem('selectedAIModel', specificModel);

      await geminiStreamService.generateFullReportStream(
        {
          examType: 'Ultrassonografia de Abdome Total',
          selectedFindings: data.selectedFindings,
          normalOrgans: data.normalOrgans,
          organsCatalog: organs
        },
        {
          onChunk: (accumulatedText: string) => {
            // O serviço já passa o texto acumulado
            setGeneratedReport(accumulatedText);
          },
          onComplete: (fullText: string) => {
            setGeneratedReport(fullText);
            setIsGenerating(false);
            toast.success('Relatório gerado com sucesso!');
          },
          onError: (error: Error) => {
            console.error('Error generating report:', error);
            setIsGenerating(false);
            toast.error('Erro ao gerar relatório. Tente novamente.');

            // Fallback para geração básica sem streaming
            generateReport(data, {
              organsList: organs,
              provider
            }).then(report => {
              setGeneratedReport(report);
              toast.success('Relatório gerado (modo fallback)');
            }).catch(fallbackError => {
              console.error('Fallback também falhou:', fallbackError);
            });
          }
        }
      );
    } catch (error) {
      console.error('Error generating report:', error);
      setIsGenerating(false);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    }
  };

  const currentOrgan = organs.find(organ => organ.id === selectedOrgan);
  const currentOrganFindings = selectedFindings.filter(f => f.organId === selectedOrgan);
  const isCurrentOrganNormal = normalOrgans.includes(selectedOrgan);

  return (
    <div className="flex h-screen bg-background">
      {/* Botão Voltar */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 gap-2"
        onClick={() => navigate('/')}
      >
        <Home className="w-4 h-4" />
        Início
      </Button>

      {/* Dark Sidebar - Reduzida */}
      <div style={{ backgroundColor: 'var(--sidebar-background)' }} className="w-64 border-r border-border/20">
        <div className="p-4 border-b border-border/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-semibold text-sm">US</span>
            </div>
            <div>
              <h1 style={{ color: 'var(--sidebar-foreground)' }} className="text-lg font-semibold">
                Sistema de Laudos
              </h1>
              <p style={{ color: 'var(--sidebar-foreground)' }} className="text-sm opacity-70">
                Ultrassonografia inteligente
              </p>
            </div>
          </div>
        </div>

        <Sidebar
          selectedOrgan={selectedOrgan}
          onOrganSelect={handleOrganSelect}
          selectedFindings={selectedFindings}
          normalOrgans={normalOrgans}
          organsList={organs}
        />
      </div>

      <div className="flex-1 relative">
        {/* Report Canvas - Full background */}
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-card">
          <ReportCanvas
            selectedFindings={selectedFindings}
            normalOrgans={normalOrgans}
            generatedReport={generatedReport}
            isGenerating={isGenerating}
            organsList={organs}
          />
        </div>

        {/* Floating Organ Section */}
        {currentOrgan && (
          <div className={`absolute top-6 left-6 bg-card border border-border rounded-lg shadow-2xl z-10 backdrop-blur-sm transition-all duration-300 ${isPanelMinimized ? 'w-12' : 'w-80'
            } max-h-[calc(100vh-120px)]`}>
            {isPanelMinimized ? (
              /* Minimized state */
              <div className="p-3 flex flex-col items-center">
                <button
                  onClick={() => setIsPanelMinimized(false)}
                  className="mb-2 p-2 hover:bg-muted rounded-md transition-colors"
                  title="Expandir painel"
                >
                  <CaretRight size={16} />
                </button>
                <div className="writing-mode-vertical text-xs font-medium text-muted-foreground">
                  {currentOrgan.name}
                </div>
              </div>
            ) : (
              /* Expanded state */
              <div className="h-full">
                <div className="absolute top-2 right-2 z-20">
                  <button
                    onClick={() => setIsPanelMinimized(true)}
                    className="p-1 hover:bg-muted rounded-md transition-colors"
                    title="Minimizar painel"
                  >
                    <CaretLeft size={16} />
                  </button>
                </div>
                <OrganSection
                  organ={currentOrgan}
                  selectedFindings={currentOrganFindings}
                  onFindingChange={handleFindingChange}
                  onNormalChange={handleNormalChange}
                  isNormal={isCurrentOrganNormal}
                />
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

export default AbdomeTotalExam;