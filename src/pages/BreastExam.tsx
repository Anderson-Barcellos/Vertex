import { useState, useRef, useEffect } from 'react';
import { Toaster } from 'sonner';
import Sidebar from '@/components/Sidebar';
import OrganSection from '@/components/OrganSection';
import ReportCanvas from '@/components/ReportCanvas';
import SelectedFindingsPanel from '@/components/SelectedFindingsPanel';
import { breastOrgans } from '@/data/breastOrgans';
import { BREAST_ULTRASOUND_TEMPLATE } from '@/data/reportTemplates';
import { SelectedFinding, ReportData, FindingInstance, type AIProvider } from '@/types/report';
import { Finding } from '@/data/organs';
import { generateReport } from '@/services/reportGenerator';
import { generateGeminiClinicalImpression } from '@/services/geminiClient';
import { toast } from 'sonner';
import { CaretRight, CaretDown, House } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export default function BreastExam() {
  const navigate = useNavigate();
  const [selectedOrgan, setSelectedOrgan] = useState('');
  const [selectedFindings, setSelectedFindings] = useState<SelectedFinding[]>([]);
  const [normalOrgans, setNormalOrgans] = useState<string[]>([]);
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const organPanelRef = useRef<HTMLDivElement>(null);
  const [generatedReport, setGeneratedReport] = useState('');

  const [aiImpression, setAiImpression] = useState('');
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const aiDebounceRef = useRef<number | null>(null);
  const aiAbortRef = useRef<AbortController | null>(null);



  const currentOrgan = breastOrgans.find(org => org.id === selectedOrgan);
  const currentOrganFindings = selectedFindings.filter(sf => sf.organId === selectedOrgan);
  const isCurrentOrganNormal = normalOrgans.includes(selectedOrgan);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        organPanelRef.current &&
        !organPanelRef.current.contains(event.target as Node) &&
        selectedOrgan &&
        !isPanelMinimized
      ) {
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
    setSelectedOrgan(organId);
    setIsPanelMinimized(false);
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
    setSelectedFindings(prev => {
      if (checked) {
        const existingIndex = prev.findIndex(
          f => f.organId === organId && f.findingId === findingId
        );

        const newFinding: SelectedFinding = {
          organId,
          categoryId,
          findingId,
          finding,
          severity,
          instances,
          isNormal: finding.isNormal
        };

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            ...newFinding
          };
          return updated;
        }

        return [...prev, newFinding];
      }

      return prev.filter(f => !(f.organId === organId && f.findingId === findingId));
    });

    if (checked) {
      setNormalOrgans(prev => prev.filter(id => id !== organId));
    }
  };

  const handleNormalChange = (organId: string, isNormal: boolean) => {
    const organ = breastOrgans.find(o => o.id === organId);
    if (!organ) return;

    if (isNormal) {
      setNormalOrgans(prev => (prev.includes(organId) ? prev : [...prev, organId]));
      // Remove all findings for this organ
      setSelectedFindings(prev => prev.filter(f => f.organId !== organId));
    } else {
      setNormalOrgans(prev => prev.filter(o => o !== organId));
    }
  };

  const handleGenerateReport = async (
    data: ReportData,
    options: { model: AIProvider }
  ) => {

    setIsGenerating(true);
    try {
      const provider = options?.model ?? 'gemini';

      if (provider === 'openai') {
        toast.info(
          'Integração com modelos OpenAI está em desenvolvimento. Utilizando Gemini 2.5 Pro enquanto finalizamos o suporte.'
        );
      }

      const report = await generateReport(data, {
        organsList: breastOrgans,
        promptTemplate: BREAST_ULTRASOUND_TEMPLATE,
        provider
      });
      toast.success('Relatório gerado com sucesso!');
      setGeneratedReport(report);
    } catch (error) {
      toast.error('Erro ao gerar relatório');
      console.error('Error generating report:', error);
      setGeneratedReport('');
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
        const result = await generateGeminiClinicalImpression(
          {
            examType: 'Ultrassonografia de Mamas e Axilas',
            selectedFindings,
            normalOrgans,
            organsCatalog: breastOrgans
          },
          { signal: controller.signal }
        );
        setAiImpression(result);
        setAiError(null);
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

  return (
    <div className="flex h-screen bg-background">
      <Toaster position="top-right" />

      {/* Dark Sidebar */}
      <div data-sidebar style={{ backgroundColor: 'var(--sidebar-background)' }} className="w-52 border-r border-border/20">
        <div className="p-4 border-b border-border/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-semibold text-sm">US</span>
            </div>
            <div>
              <h1 style={{ color: 'var(--sidebar-foreground)' }} className="text-lg font-semibold">
                Mamas
              </h1>
              <p style={{ color: 'var(--sidebar-muted-foreground)' }} className="text-xs">
                Sistema BI-RADS
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full mb-4 px-3 py-2 text-sm bg-muted/10 hover:bg-muted/20 rounded-md flex items-center gap-2 transition-colors"
            style={{ color: 'var(--sidebar-foreground)' }}
          >
            <House size={16} />
            Voltar ao Menu
          </button>
        </div>
        <Sidebar
          selectedOrgan={selectedOrgan}
          onOrganSelect={handleOrganSelect}
          selectedFindings={selectedFindings}
          normalOrgans={normalOrgans}
          organsList={breastOrgans}
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
              organsList={breastOrgans}
            />
          </div>

          {/* Selected Findings Panel - Floating on the right */}
          <SelectedFindingsPanel
            selectedFindings={selectedFindings}
            normalOrgans={normalOrgans}
            organsList={breastOrgans}
            onGenerateReport={handleGenerateReport}
            isGenerating={isGenerating}
            className="self-center"
          />
        </div>

        {/* Floating Organ Section */}
        {selectedOrgan && currentOrgan && (
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
                    <CaretDown size={16} />
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
