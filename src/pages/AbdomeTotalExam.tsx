import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Sidebar from '@/components/Sidebar';
import OrganSection from '@/components/OrganSection';
import ReportCanvas from '@/components/ReportCanvas';
import SelectedFindingsPanel from '@/components/SelectedFindingsPanel';
import { organs } from '@/data/organs';
import { SelectedFinding, ReportData, FindingInstance, type AIProvider } from '@/types/report';
import { Finding } from '@/data/organs';
import { generateReport } from '@/services/reportGenerator';
import { generateGeminiClinicalImpression } from '@/services/geminiClient';
import { geminiStreamService } from '@/services/geminiStreamService';
import { openaiStreamService } from '@/services/openaiStreamService';
import { toast } from 'sonner';
import { CaretLeft, CaretRight, House } from '@phosphor-icons/react';

function AbdomeTotalExam() {
  const navigate = useNavigate();
  const [selectedOrgan, setSelectedOrgan] = useState('');
  const [selectedFindings, setSelectedFindings] = useState<SelectedFinding[]>([]);
  const [normalOrgans, setNormalOrgans] = useState<string[]>([]);
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiImpression, setAiImpression] = useState('');
  const [currentAiModel, setCurrentAiModel] = useState<'gemini' | 'openai'>('gemini');
  const [aiError, setAiError] = useState<string | null>(null);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const organPanelRef = useRef<HTMLDivElement>(null);
  const aiDebounceRef = useRef<number | null>(null);
  const aiAbortRef = useRef<AbortController | null>(null);

  // Handle click outside to minimize organ panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        organPanelRef.current &&
        !organPanelRef.current.contains(event.target as Node) &&
        selectedOrgan &&
        !isPanelMinimized
      ) {
        // Check if click is on a Radix UI portal (dropdowns, selects, etc)
        const target = event.target as HTMLElement;
        const isRadixPortal = target.closest('[data-radix-portal]') ||
                             target.closest('[role="listbox"]') ||
                             target.closest('[role="option"]') ||
                             target.closest('[data-radix-select-content]') ||
                             target.closest('[data-radix-dropdown-menu-content]');

        if (isRadixPortal) {
          return; // Don't minimize if clicking on a portal element
        }

        // Check if click is not on sidebar or findings panel
        const sidebar = document.querySelector('[data-sidebar]');
        const findingsPanel = document.querySelector('[data-findings-panel]');
        if (
          (!sidebar || !sidebar.contains(event.target as Node)) &&
          (!findingsPanel || !findingsPanel.contains(event.target as Node))
        ) {
          setIsPanelMinimized(true);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedOrgan, isPanelMinimized]);

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
    finding: Finding,
    severity?: string,
    instances?: FindingInstance[]
  ) => {
    setSelectedFindings(currentFindings => {
      if (checked) {
        // Update existing finding or add new one
        const existingIndex = currentFindings.findIndex(f => f.findingId === findingId);
        if (existingIndex >= 0) {
          // Update existing
          const updated = [...currentFindings];
          updated[existingIndex] = {
            ...updated[existingIndex],
            severity,
            instances
          };
          return updated;
        } else {
          // Add new
          const newFinding: SelectedFinding = {
            organId,
            categoryId,
            findingId,
            finding,
            severity,
            instances
          };
          return [...currentFindings, newFinding];
        }
      } else {
        return currentFindings.filter(f => f.findingId !== findingId);
      }
    });

    if (checked) {
      setNormalOrgans(currentNormal =>
        currentNormal.filter(id => id !== organId)
      );
    }
  };

  const handleNormalChange = (organId: string, isNormal: boolean) => {
    if (isNormal) {
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
      setNormalOrgans(currentNormal =>
        currentNormal.filter(id => id !== organId)
      );
    }
  };

  const handleGenerateReport = async (
    data: ReportData,
    options: { model: AIProvider }
  ) => {
    setIsGenerating(true);
    try {
      const provider = options?.model ?? 'gemini';
      setCurrentAiModel(provider as 'gemini' | 'openai');
      setGeneratedReport(''); // Clear previous report

      if (provider === 'openai') {
        // Use OpenAI streaming service
        if (!openaiStreamService.isConfigured()) {
          toast.error('OpenAI API não está configurada. Configure VITE_OPENAI_API_KEY.');
          setIsGenerating(false);
          return;
        }

        let fullReport = '';
        await openaiStreamService.generateFullReportStream(
          {
            examType: 'Ultrassonografia Abdominal Total',
            selectedFindings: data.selectedFindings,
            normalOrgans: data.normalOrgans,
            organsCatalog: organs
          },
          {
            onChunk: (text) => {
              fullReport += text;
              setGeneratedReport(fullReport);
            },
            onComplete: (finalText) => {
              setGeneratedReport(finalText);
              toast.success('Relatório gerado com sucesso pelo gpt-5-nano!');
            },
            onError: (error) => {
              console.error('Erro no OpenAI:', error);
              toast.error('Erro ao gerar relatório com OpenAI.');
            }
          }
        );
      } else {
        // Use Gemini streaming service
        if (!geminiStreamService.isConfigured()) {
          // Fallback to non-streaming Gemini
          const report = await generateReport(data, {
            organsList: organs,
            provider
          });
          setGeneratedReport(report);
          toast.success('Relatório gerado com sucesso!');
        } else {
          let fullReport = '';
          await geminiStreamService.generateFullReportStream(
            {
              examType: 'Ultrassonografia Abdominal Total',
              selectedFindings: data.selectedFindings,
              normalOrgans: data.normalOrgans,
              organsCatalog: organs
            },
            {
              onChunk: (text) => {
                fullReport += text;
                setGeneratedReport(fullReport);
              },
              onComplete: (finalText) => {
                setGeneratedReport(finalText);
                toast.success('Relatório gerado com sucesso pelo Gemini!');
              },
              onError: (error) => {
                console.error('Erro no Gemini:', error);
                toast.error('Erro ao gerar relatório com Gemini.');
              }
          }
          );
        }
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (aiDebounceRef.current) {
      window.clearTimeout(aiDebounceRef.current);
      aiDebounceRef.current = null;
    }

    if (aiAbortRef.current) {
      aiAbortRef.current.abort();
      aiAbortRef.current = null;
    }

    if (selectedFindings.length === 0) {
      setAiImpression('');
      setAiError(null);
      setIsAiProcessing(false);
      return;
    }

    setIsAiProcessing(true);
    setAiError(null);

    const controller = new AbortController();
    aiAbortRef.current = controller;

    aiDebounceRef.current = window.setTimeout(async () => {
      try {
        // Use streaming service for AI impression
        if (geminiStreamService.isConfigured()) {
          let impression = '';
          await geminiStreamService.generateClinicalImpressionStream(
            {
              examType: 'Ultrassonografia Abdominal Total',
              selectedFindings,
              normalOrgans,
              organsCatalog: organs
            },
            {
              onChunk: (text) => {
                impression += text;
                setAiImpression(impression);
              },
              onComplete: (finalText) => {
                setAiImpression(finalText);
                setAiError(null);
              },
              onError: (error) => {
                if (error.message.includes('abort')) return;
                setAiImpression('');
                setAiError(error.message);
              }
            }
          );
        } else {
          // Fallback to non-streaming
          const result = await generateGeminiClinicalImpression(
            {
              examType: 'Ultrassonografia Abdominal Total',
              selectedFindings,
              normalOrgans,
              organsCatalog: organs
            },
            { signal: controller.signal }
          );
          setAiImpression(result);
          setAiError(null);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        console.error('Falha ao consultar o Gemini 2.5 Pro:', error);
        setAiImpression('');
        setAiError(
          error instanceof Error
            ? error.message
            : 'Não foi possível obter a impressão diagnóstica sugerida pelo Gemini.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsAiProcessing(false);
        }
      }
    }, 600);

    return () => {
      if (aiDebounceRef.current) {
        window.clearTimeout(aiDebounceRef.current);
        aiDebounceRef.current = null;
      }
      controller.abort();
      aiAbortRef.current = null;
    };
  }, [selectedFindings, normalOrgans]);

  const currentOrgan = organs.find(organ => organ.id === selectedOrgan);
  const currentOrganFindings = selectedFindings.filter(f => f.organId === selectedOrgan);
  const isCurrentOrganNormal = normalOrgans.includes(selectedOrgan);

  return (
    <div className="flex h-screen bg-background">
      {/* Dark Sidebar - Now narrower */}
      <div data-sidebar style={{ backgroundColor: 'var(--sidebar-background)' }} className="w-52 border-r border-border/20">
        <div className="p-4 border-b border-border/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-semibold text-sm">US</span>
            </div>
            <div>
              <h1 style={{ color: 'var(--sidebar-foreground)' }} className="text-lg font-semibold">
                VERTEX
              </h1>
              <p style={{ color: 'var(--sidebar-foreground)' }} className="text-sm opacity-70">
                Ultrassonografia abdominal
              </p>
            </div>
          </div>

          {/* Home button */}
          <button
            onClick={() => navigate('/')}
            className="w-full mb-2 px-3 py-2 flex items-center gap-2 text-sm rounded-md hover:bg-accent/10 transition-colors"
            style={{ color: 'var(--sidebar-foreground)' }}
          >
            <House size={16} />
            <span>Voltar ao Início</span>
          </button>
        </div>

        <Sidebar
          selectedOrgan={selectedOrgan}
          onOrganSelect={handleOrganSelect}
          selectedFindings={selectedFindings}
          normalOrgans={normalOrgans}
          organsList={organs}
        />
      </div>

      {/* Main Content Area with Report Canvas and Floating Panel */}
      <div className="flex-1 relative overflow-hidden bg-gray-50">
        <div className="h-full flex items-center justify-center gap-8 p-8 overflow-y-auto">
          {/* Report Canvas - Centered */}
          <div className="bg-white shadow-lg rounded-lg" style={{ width: '210mm', minHeight: '297mm' }}>
            <ReportCanvas
              selectedFindings={selectedFindings}
              normalOrgans={normalOrgans}
              generatedReport={generatedReport}
              isGenerating={isGenerating}
              aiImpression={aiImpression}
              aiError={aiError}
              isAiLoading={isAiProcessing}
              organsList={organs}
              currentAiModel={currentAiModel}
            />
          </div>

          {/* Selected Findings Panel - Floating on the right */}
          <SelectedFindingsPanel
            selectedFindings={selectedFindings}
            normalOrgans={normalOrgans}
            organsList={organs}
            onGenerateReport={handleGenerateReport}
            isGenerating={isGenerating}
            className="self-center"
          />
        </div>

        {/* Floating Organ Section */}
        {currentOrgan && (
          <div
            ref={organPanelRef}
            className={`absolute top-6 left-6 bg-card border border-border rounded-lg shadow-2xl z-10 backdrop-blur-sm transition-all duration-300 ${
              isPanelMinimized ? 'w-12' : 'w-80'
            } max-h-[calc(100vh-120px)]`}
          >
            {isPanelMinimized ? (
              <div
                onClick={() => setIsPanelMinimized(false)}
                className="p-3 flex flex-col items-center cursor-pointer hover:bg-muted/50 transition-colors h-full rounded-lg"
                title="Expandir painel"
              >
                <div className="mb-2 p-2">
                  <CaretRight size={16} />
                </div>
                <div className="writing-mode-vertical text-xs font-medium text-muted-foreground">
                  {currentOrgan.name}
                </div>
              </div>
            ) : (
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

      <Toaster />
    </div>
  );
}

export default AbdomeTotalExam;