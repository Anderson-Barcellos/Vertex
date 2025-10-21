import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Sidebar from '@/components/Sidebar';
import OrganSection from '@/components/OrganSection';
import ReportCanvas from '@/components/ReportCanvas';
import SelectedFindingsPanel from '@/components/SelectedFindingsPanel';
import ExamStatisticsPanel from '@/components/ExamStatisticsPanel';
import CarotidFindingDetails from '@/components/CarotidFindingDetails';
import { carotidOrgans } from '@/data/carotidOrgans';
import { SelectedFinding, ReportData, FindingInstance, type AIProvider } from '@/types/report';
import { Finding } from '@/data/organs';
import { generateReport } from '@/services/reportGenerator';
import { generateGeminiClinicalImpression } from '@/services/geminiClient';
import { geminiStreamService } from '@/services/geminiStreamService';
import { openaiStreamService } from '@/services/openaiStreamService';
import { unifiedAIService } from '@/services/unifiedAIService';
import type { AIStatus } from '@/components/ReportCanvas';
import { toast } from 'sonner';
import { CaretLeft, CaretRight, House } from '@phosphor-icons/react';

function CarotidExam() {
  const navigate = useNavigate();
  const [selectedOrgan, setSelectedOrgan] = useState('');
  const [selectedFindings, setSelectedFindings] = useState<SelectedFinding[]>([]);
  const [normalOrgans, setNormalOrgans] = useState<string[]>([]);
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiImpression, setAiImpression] = useState('');
  const [currentAiModel, setCurrentAiModel] = useState<'gemini' | 'openai'>('gemini');
  const [autoGenerateAI, setAutoGenerateAI] = useState(false); // Controle manual por padrão
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const [isAnyDropdownOpen, setIsAnyDropdownOpen] = useState(false);
  const organPanelRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const findingsPanelRef = useRef<HTMLDivElement>(null);
  const aiDebounceRef = useRef<number | null>(null);
  const aiAbortRef = useRef<AbortController | null>(null);
  const statusUnsubscribeRef = useRef<(() => void) | null>(null);
  const isAiProcessingRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    isAiProcessingRef.current = isAiProcessing;
  }, [isAiProcessing]);

  // Monitor dropdowns state via MutationObserver (more efficient than polling)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const hasOpenDropdown =
        document.querySelector('[data-state="open"]') !== null ||
        document.querySelector('[aria-expanded="true"]') !== null;
      setIsAnyDropdownOpen(hasOpenDropdown);
    });

    // Observe only the organ panel for dropdown changes
    if (organPanelRef.current) {
      observer.observe(organPanelRef.current, {
        attributes: true,
        attributeFilter: ['data-state', 'aria-expanded'],
        subtree: true
      });
    }

    return () => observer.disconnect();
  }, [selectedOrgan]); // Re-observe when organ changes

  // Handle click outside to minimize organ panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't minimize if any dropdown is open
      if (isAnyDropdownOpen) {
        return;
      }

      if (
        organPanelRef.current &&
        !organPanelRef.current.contains(event.target as Node) &&
        selectedOrgan &&
        !isPanelMinimized
      ) {
        // Check if click is on a Radix UI portal (dropdowns, selects, etc)
        const target = event.target as HTMLElement;
        const isRadixPortal = target.closest('[data-radix-portal]') ||
          target.closest('[data-radix-popper-content-wrapper]') ||
          target.closest('[data-state="open"]') ||
          target.closest('[role="listbox"]') ||
          target.closest('[role="option"]') ||
          target.closest('[role="combobox"]') ||
          target.closest('[data-radix-select-content]') ||
          target.closest('[data-radix-select-trigger]') ||
          target.closest('[data-radix-select-viewport]') ||
          target.closest('[data-radix-dropdown-menu-content]') ||
          target.closest('.select-content') ||
          target.closest('.select-trigger');

        if (isRadixPortal) {
          return; // Don't minimize if clicking on a portal element
        }

        // Check if click is not on sidebar or findings panel using refs
        const isClickOnSidebar = sidebarRef.current?.contains(event.target as Node);
        const isClickOnFindingsPanel = findingsPanelRef.current?.contains(event.target as Node);

        if (!isClickOnSidebar && !isClickOnFindingsPanel) {
          setIsPanelMinimized(true);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedOrgan, isPanelMinimized, isAnyDropdownOpen]);

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
            examType: 'Ecodoppler de Carótidas e Vertebrais',
            selectedFindings: data.selectedFindings,
            normalOrgans: data.normalOrgans,
            organsCatalog: carotidOrgans
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
            organsList: carotidOrgans,
            provider
          });
          setGeneratedReport(report);
          toast.success('Relatório gerado com sucesso!');
        } else {
          // Streaming do Gemini com chunks em tempo real
          await geminiStreamService.generateFullReportStream(
            {
              examType: 'Ecodoppler de Carótidas e Vertebrais',
              selectedFindings: data.selectedFindings,
              normalOrgans: data.normalOrgans,
              organsCatalog: carotidOrgans
            },
            {
              onChunk: (accumulatedText) => {
                // O texto já vem acumulado do serviço
                setGeneratedReport(accumulatedText);
              },
              onComplete: (finalText) => {
                setGeneratedReport(finalText);
                toast.success('Relatório gerado com sucesso pelo Gemini 2.5 Pro!');
              },
              onError: async (error) => {
                console.error('Erro no Gemini (streaming):', error);
                // Fallback automático para geração local/não-streaming
                try {
                  const fallback = await generateReport(
                    {
                      selectedFindings: data.selectedFindings,
                      normalOrgans: data.normalOrgans,
                      additionalNotes: ''
                    },
                    { organsList: carotidOrgans, provider }
                  );
                  setGeneratedReport(fallback);
                  toast.error('Falha no endpoint de IA. Exibindo laudo básico.');
                } catch (fallbackErr) {
                  console.error('Falha no fallback local:', fallbackErr);
                  toast.error('Erro ao gerar relatório com Gemini.');
                }
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

  // Função manual para gerar impressão diagnóstica com IA
  const generateAIImpression = useCallback(() => {
    // Cleanup previous operations
    if (statusUnsubscribeRef.current) {
      statusUnsubscribeRef.current();
      statusUnsubscribeRef.current = null;
    }

    // Cancelar operações anteriores apenas se não estiver em andamento
    if (!isAiProcessingRef.current) {
      unifiedAIService.cancelAllOperations();
    }

    // Clear state if no findings
    if (selectedFindings.length === 0 && normalOrgans.length === 0) {
      setAiImpression('');
      setAiError('Adicione achados ou marque órgãos como normais antes de gerar a impressão');
      setIsAiProcessing(false);
      setAiStatus('idle');
      return;
    }

    // Set current AI provider
    unifiedAIService.setProvider(currentAiModel);

    // Subscribe to status changes
    statusUnsubscribeRef.current = unifiedAIService.onStatusChange((status) => {
      setAiStatus(status);
      setIsAiProcessing(status === 'loading' || status === 'streaming');
      if (status === 'error') {
        setAiError('Erro ao consultar a IA');
      } else {
        setAiError(null);
      }
    });

    // Start AI impression generation
    let accumulatedText = '';
    unifiedAIService.generateClinicalImpression(
      {
        examType: 'Ecodoppler de Carótidas e Vertebrais',
        selectedFindings,
        normalOrgans,
        organsCatalog: carotidOrgans
      },
      {
        onChunk: (text) => {
          accumulatedText += text;
          setAiImpression(accumulatedText);
        },
        onComplete: (finalText) => {
          setAiImpression(finalText);
          setAiError(null);
        },
        onError: (error) => {
          setAiImpression('');
          setAiError(error.message || 'Erro desconhecido');
        }
      }
    ).catch((error) => {
      console.error('AI impression generation failed:', error);
      setAiError('Falha na geração da impressão diagnóstica');
    });
  }, [selectedFindings, normalOrgans, currentAiModel]); // Removed isAiProcessing - using ref instead

  // Efeito para geração automática (apenas se ativado)
  useEffect(() => {
    if (!autoGenerateAI) return;

    // Debounce de 2 segundos para evitar múltiplas chamadas
    const timer = setTimeout(() => {
      if (selectedFindings.length > 0 || normalOrgans.length > 0) {
        generateAIImpression();
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (statusUnsubscribeRef.current && autoGenerateAI) {
        statusUnsubscribeRef.current();
        statusUnsubscribeRef.current = null;
      }
      if (autoGenerateAI) {
        unifiedAIService.cancelClinicalImpression();
      }
    };
  }, [selectedFindings, normalOrgans, currentAiModel, autoGenerateAI, generateAIImpression]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (statusUnsubscribeRef.current) {
        statusUnsubscribeRef.current();
        statusUnsubscribeRef.current = null;
      }
      unifiedAIService.cleanup();
    };
  }, []);

  // Memoize expensive calculations
  const currentOrgan = useMemo(
    () => carotidOrgans.find(organ => organ.id === selectedOrgan),
    [selectedOrgan]
  );

  const currentOrganFindings = useMemo(
    () => selectedFindings.filter(f => f.organId === selectedOrgan),
    [selectedFindings, selectedOrgan]
  );

  const isCurrentOrganNormal = useMemo(
    () => normalOrgans.includes(selectedOrgan),
    [normalOrgans, selectedOrgan]
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Dark Sidebar - Now narrower */}
      <aside ref={sidebarRef} data-sidebar style={{ backgroundColor: 'var(--sidebar-background)' }} className="w-52 border-r border-border/20">
        <header className="p-4 border-b border-border/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-semibold text-sm">US</span>
            </div>
            <div>
              <h1 style={{ color: 'var(--sidebar-foreground)' }} className="text-lg font-semibold">
                VERTEX
              </h1>
              <p style={{ color: 'var(--sidebar-foreground)' }} className="text-sm opacity-70">
                Ecodoppler Vascular
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
        </header>

        <Sidebar
          selectedOrgan={selectedOrgan}
          onOrganSelect={handleOrganSelect}
          onNormalChange={handleNormalChange}
          selectedFindings={selectedFindings}
          normalOrgans={normalOrgans}
          organsList={carotidOrgans}
        />
      </aside>

      {/* Main Content Area with Report Canvas and Floating Panel */}
      <main className="flex-1 relative overflow-hidden bg-gray-50 main-content">
        <div className="min-h-full flex items-start justify-center gap-8 p-8 overflow-y-auto">
          {/* Report Canvas - A4 Paper Container */}
          <div className="a4-container my-auto">
            <ReportCanvas
              selectedFindings={selectedFindings}
              normalOrgans={normalOrgans}
              generatedReport={generatedReport}
              isGenerating={isGenerating}
              aiImpression={aiImpression}
              aiError={aiError}
              isAiLoading={isAiProcessing}
              aiStatus={aiStatus}
              organsList={carotidOrgans}
              currentAiModel={currentAiModel}
              onGenerateAI={generateAIImpression}
              autoGenerateAI={autoGenerateAI}
              onToggleAutoGenerate={setAutoGenerateAI}
            />
          </div>

          {/* Panels Container - Sticky positioned to align with A4 top */}
          <div ref={findingsPanelRef} data-findings-panel className="flex flex-col gap-4 sticky top-4 floating-panels">
            {/* Selected Findings Panel */}
            <SelectedFindingsPanel
              selectedFindings={selectedFindings}
              normalOrgans={normalOrgans}
              organsList={carotidOrgans}
              onGenerateReport={handleGenerateReport}
              isGenerating={isGenerating}
            />

            {/* Exam Statistics Panel */}
            <ExamStatisticsPanel
              selectedFindings={selectedFindings}
              normalOrgans={normalOrgans}
              organsList={carotidOrgans}
            />
          </div>
        </div>

        {/* Floating Organ Section */}
        {currentOrgan && (
          <div
            ref={organPanelRef}
            className={`absolute top-6 left-6 bg-card border border-border rounded-lg shadow-2xl organ-section-panel backdrop-blur-sm transition-all duration-300 flex flex-col overflow-hidden ${isPanelMinimized ? 'w-12' : 'w-80'
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
              <div className="h-full flex flex-col overflow-hidden">
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
                  FindingDetailsComponent={CarotidFindingDetails}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          }
        }}
      />
    </div>
  );
}

export default CarotidExam;
