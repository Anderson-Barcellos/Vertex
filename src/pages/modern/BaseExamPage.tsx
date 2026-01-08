import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { ArrowLeft } from '@phosphor-icons/react';

import Sidebar from '@/components/original/Sidebar';
import ReportCanvas from '@/components/original/ReportCanvas';
import type { AIStatus } from '@/components/original/ReportCanvas';
import SelectedFindingsPanel from '@/components/original/SelectedFindingsPanel';
import QuickActionsPanel from '@/components/original/QuickActionsPanel';

import ModernExamLayout from '@/layouts/ModernExamLayout';
import FloatingOrganPanelModern from '@/components/shared/FloatingOrganPanelModern';
import FindingDetailsGeneric from '@/components/original/FindingDetailsGeneric';

import type { SelectedFinding, ReportData, FindingInstance, AIProvider, AIGenerationStats } from '@/types/report';
import type { Finding } from '@/data/organs';
import type { ExamConfig } from '@/types/exam';

import { generateReport } from '@/services/reportGenerator';
import { geminiStreamService, GEMINI_MODEL } from '@/services/geminiStreamService';
import { openaiStreamService, OPENAI_MODEL } from '@/services/openaiStreamService';
import { claudeStreamService, CLAUDE_MODEL } from '@/services/claudeStreamService';
import { unifiedAIService } from '@/services/unifiedAIService';
import { buildSpecializedPrompt } from '@/services/promptBuilder';
import { estimateCostUsd, estimateTokensFromText } from '@/utils/aiMetrics';
import { useAutoSave } from '@/hooks/useAutoSave';
import { getMarkableOrgans } from '@/utils/findingAdapters';

interface BaseExamPageProps {
  config: ExamConfig;
}

export default function BaseExamPage({ config }: BaseExamPageProps) {
  const navigate = useNavigate();
  const { organsCatalog, autoSaveKey, examType, title, subtitle, organGroups } = config;
  const FindingDetails = config.FindingDetailsComponent ?? FindingDetailsGeneric;

  const [selectedOrgan, setSelectedOrgan] = useState('');
  const [selectedFindings, setSelectedFindings] = useState<SelectedFinding[]>([]);
  const [normalOrgans, setNormalOrgans] = useState<string[]>([]);
  const [generatedReport, setGeneratedReport] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiImpression, setAiImpression] = useState('');
  const [currentAiModel, setCurrentAiModel] = useState<AIProvider>('gemini');
  const [currentModelId, setCurrentModelId] = useState<string>(GEMINI_MODEL);
  const [autoGenerateAI, setAutoGenerateAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
  const [aiGenerationStats, setAiGenerationStats] = useState<AIGenerationStats | null>(null);

  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const statusUnsubscribeRef = useRef<(() => void) | null>(null);

  const [tempFindingDetails, setTempFindingDetails] = useState<
    Record<string, Record<string, { severity?: string; instances?: FindingInstance[] }>>
  >({});

  useAutoSave(
    autoSaveKey,
    selectedFindings,
    normalOrgans,
    tempFindingDetails,
    (savedState) => {
      setSelectedFindings(savedState.selectedFindings);
      setNormalOrgans(savedState.normalOrgans);
      setTempFindingDetails(savedState.tempFindingDetails);
      toast.info('Rascunho recuperado automaticamente');
    }
  );

  const handleOrganSelect = (organId: string) => {
    if (selectedOrgan === organId) {
      setIsPanelMinimized(!isPanelMinimized);
    } else {
      setSelectedOrgan(organId);
      setIsPanelMinimized(false);
    }
  };

  const handleTempDetailsChange = (
    organId: string,
    findingId: string,
    details: { severity?: string; instances?: FindingInstance[] }
  ) => {
    setTempFindingDetails(prev => ({
      ...prev,
      [organId]: {
        ...prev[organId],
        [findingId]: details
      }
    }));
  };

  const getTempDetails = (organId: string) => {
    return tempFindingDetails[organId] || {};
  };

  const handleSetAllNormal = () => {
    const markableOrgans = getMarkableOrgans(config);
    const organIds = markableOrgans.map(o => o.id);
    setNormalOrgans(organIds);
    setSelectedFindings([]);
  };

  const handleResetExam = () => {
    setSelectedFindings([]);
    setNormalOrgans([]);
    setGeneratedReport('');
    setAiImpression('');
    setAiGenerationStats(null);
    setTempFindingDetails({});
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
        const existingIndex = currentFindings.findIndex(
          f => f.findingId === findingId && f.organId === organId
        );
        if (existingIndex >= 0) {
          const updated = [...currentFindings];
          updated[existingIndex] = {
            ...updated[existingIndex],
            severity,
            instances
          };
          return updated;
        }
        return [...currentFindings, {
          organId,
          categoryId,
          findingId,
          finding,
          severity,
          instances
        }];
      }
      return currentFindings.filter(
        f => !(f.findingId === findingId && f.organId === organId)
      );
    });

    if (checked) {
      setNormalOrgans(current => current.filter(id => id !== organId));
    }
  };

  const handleNormalChange = (organId: string, isNormal: boolean) => {
    if (isNormal) {
      setNormalOrgans(current => (current.includes(organId) ? current : [...current, organId]));
      setSelectedFindings(current => current.filter(f => f.organId !== organId));
    } else {
      setNormalOrgans(current => current.filter(id => id !== organId));
    }
  };

  const handleGenerateReport = async (
    data: ReportData,
    options: { model: AIProvider; specificModel?: string }
  ) => {
    setIsGenerating(true);
    try {
      const provider = options?.model ?? 'gemini';
      setCurrentAiModel(provider);
      setGeneratedReport('');

      if (options?.specificModel) {
        try { sessionStorage.setItem('selectedAIModel', options.specificModel); } catch {}
        setCurrentModelId(options.specificModel);
      } else {
        setCurrentModelId(provider === 'openai' ? OPENAI_MODEL : provider === 'claude' ? CLAUDE_MODEL : GEMINI_MODEL);
      }

      const startedAt = Date.now();
      const promptText = buildSpecializedPrompt({
        examType,
        selectedFindings: data.selectedFindings,
        normalOrgans: data.normalOrgans,
        organsCatalog
      });
      const promptTokenEstimate = estimateTokensFromText(promptText);
      let chunkCount = 0;
      let outputChars = 0;

      const streamCallbacks = {
        onChunk: (accumulated: string) => {
          setGeneratedReport(accumulated);
          chunkCount += 1;
          outputChars = accumulated.length;
        },
        onComplete: (finalText: string) => {
          setGeneratedReport(finalText);
          toast.success('Relatório gerado com sucesso!');
          const finishedAt = Date.now();
          const completionTokens = estimateTokensFromText(finalText);
          setAiGenerationStats({
            provider: provider as AIProvider,
            model: provider === 'openai' ? OPENAI_MODEL : provider === 'claude' ? CLAUDE_MODEL : GEMINI_MODEL,
            status: 'completed',
            promptTokens: promptTokenEstimate,
            completionTokens,
            totalTokens: promptTokenEstimate + completionTokens,
            estimatedCostUsd: estimateCostUsd(provider, promptTokenEstimate, completionTokens),
            startedAt,
            finishedAt,
            durationMs: finishedAt - startedAt,
            chunkCount,
            inputChars: promptText.length,
            outputChars
          });
        },
        onError: async (error: Error) => {
          console.error(`Erro no ${provider}:`, error);
          try {
            const fallback = await generateReport(
              { selectedFindings: data.selectedFindings, normalOrgans: data.normalOrgans, additionalNotes: '' },
              { organsList: organsCatalog, provider }
            );
            setGeneratedReport(fallback);
            toast.error('Falha no endpoint de IA. Exibindo laudo básico.');
          } catch (fallbackErr) {
            console.error('Falha no fallback:', fallbackErr);
            toast.error('Erro ao gerar relatório.');
          }
        }
      };

      if (provider === 'openai') {
        if (!openaiStreamService.isConfigured()) {
          toast.error('OpenAI API não está configurada.');
          setIsGenerating(false);
          return;
        }
        await openaiStreamService.generateFullReportStream(
          { examType, selectedFindings: data.selectedFindings, normalOrgans: data.normalOrgans, organsCatalog },
          streamCallbacks
        );
      } else if (provider === 'claude') {
        if (!claudeStreamService.isConfigured()) {
          toast.error('Claude API não está configurada.');
          setIsGenerating(false);
          return;
        }
        await claudeStreamService.generateFullReportStream(
          { examType, selectedFindings: data.selectedFindings, normalOrgans: data.normalOrgans, organsCatalog },
          streamCallbacks
        );
      } else {
        if (!geminiStreamService.isConfigured()) {
          const report = await generateReport(data, { organsList: organsCatalog, provider });
          setGeneratedReport(report);
          toast.success('Relatório gerado!');
        } else {
          await geminiStreamService.generateFullReportStream(
            { examType, selectedFindings: data.selectedFindings, normalOrgans: data.normalOrgans, organsCatalog },
            streamCallbacks
          );
        }
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Erro ao gerar relatório.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAIImpression = useCallback(() => {
    if (statusUnsubscribeRef.current) {
      statusUnsubscribeRef.current();
      statusUnsubscribeRef.current = null;
    }
    if (!isAiProcessing) {
      unifiedAIService.cancelAllOperations();
    }
    if (selectedFindings.length === 0 && normalOrgans.length === 0) {
      setAiImpression('');
      setAiError('Adicione achados primeiro');
      setIsAiProcessing(false);
      setAiStatus('idle');
      return;
    }
    unifiedAIService.setProvider(currentAiModel);
    statusUnsubscribeRef.current = unifiedAIService.onStatusChange((status) => {
      setAiStatus(status);
      setIsAiProcessing(status === 'loading' || status === 'streaming');
      setAiError(status === 'error' ? 'Erro ao consultar a IA' : null);
    });

    let accumulatedText = '';
    unifiedAIService.generateClinicalImpression(
      { examType, selectedFindings, normalOrgans, organsCatalog },
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
      console.error('AI failed:', error);
      setAiError('Falha na geração');
    });
  }, [selectedFindings, normalOrgans, currentAiModel, isAiProcessing, examType, organsCatalog]);

  useEffect(() => {
    if (!autoGenerateAI) return;
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

  useEffect(() => {
    return () => {
      if (statusUnsubscribeRef.current) {
        statusUnsubscribeRef.current();
        statusUnsubscribeRef.current = null;
      }
      unifiedAIService.cleanup();
    };
  }, []);

  const currentOrgan = organsCatalog.find(organ => organ.id === selectedOrgan);
  const currentOrganFindings = selectedFindings.filter(f => f.organId === selectedOrgan);
  const isCurrentOrganNormal = normalOrgans.includes(selectedOrgan);

  return (
    <>
      <ModernExamLayout
        header={(
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="modern-btn-glass px-4 py-2 flex items-center gap-2">
              <ArrowLeft size={18} />
              <span className="hidden md:inline">Voltar</span>
            </button>
            <div className="flex items-center gap-3">
              <img src="/logo-vertex.svg" alt="Vertex Ultrasound" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-white">{title}</h1>
                <p className="text-xs text-gray-400">{subtitle}</p>
              </div>
            </div>
          </div>
        )}
        sidebar={(
          <Sidebar
            selectedOrgan={selectedOrgan}
            onOrganSelect={handleOrganSelect}
            onNormalChange={handleNormalChange}
            selectedFindings={selectedFindings}
            normalOrgans={normalOrgans}
            organsList={organsCatalog}
            organGroups={organGroups}
            showSummary={false}
          />
        )}
        main={(
          <div className="modern-a4" style={{ transform: 'scale(1)', transformOrigin: 'top center' }}>
            <ReportCanvas
              selectedFindings={selectedFindings}
              normalOrgans={normalOrgans}
              generatedReport={generatedReport}
              isGenerating={isGenerating}
              aiImpression={aiImpression}
              aiError={aiError}
              isAiLoading={isAiProcessing}
              aiStatus={aiStatus}
              organsList={organsCatalog}
              currentAiModel={currentAiModel}
              currentModelId={currentModelId}
              onGenerateAI={generateAIImpression}
              autoGenerateAI={autoGenerateAI}
              onToggleAutoGenerate={setAutoGenerateAI}
            />
          </div>
        )}
        panels={(
          <>
            <SelectedFindingsPanel
              className="glass-panel flex-1"
              selectedFindings={selectedFindings}
              normalOrgans={normalOrgans}
              organsList={organsCatalog}
              onGenerateReport={handleGenerateReport}
              isGenerating={isGenerating}
              expandToContent
              onModelChange={(model, specificModel) => {
                setCurrentAiModel(model as 'gemini' | 'openai');
                setCurrentModelId(specificModel);
              }}
            />
            <QuickActionsPanel
              className="glass-panel"
              organsList={organsCatalog}
              selectedFindingsCount={selectedFindings.length}
              normalOrgansCount={normalOrgans.length}
              generatedReport={generatedReport}
              isGenerating={isGenerating}
              currentAiModel={currentAiModel}
              currentModelId={currentModelId}
              onSetAllNormal={handleSetAllNormal}
              onResetExam={handleResetExam}
            />
          </>
        )}
        floatingPanel={(
          currentOrgan ? (
            <FloatingOrganPanelModern
              organ={currentOrgan}
              selectedFindings={currentOrganFindings}
              isNormal={isCurrentOrganNormal}
              isMinimized={isPanelMinimized}
              onToggleMinimized={setIsPanelMinimized}
              onFindingChange={handleFindingChange}
              onNormalChange={handleNormalChange}
              tempDetails={getTempDetails(currentOrgan.id)}
              onTempDetailsChange={handleTempDetailsChange}
              leftCss={'calc(25% + 1.5rem)'}
              widthExpanded={'24rem'}
              maxHeight={'80vh'}
              FindingDetailsComponent={FindingDetails}
            />
          ) : null
        )}
      />
      <Toaster position="top-right" richColors />
    </>
  );
}
