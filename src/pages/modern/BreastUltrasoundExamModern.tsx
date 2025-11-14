/**
 * Vertex V2 - Breast Ultrasound Exam (MODERN DESIGN)
 * Layout moderno para Ultrassom de Mamas com classificação BI-RADS
 *
 * @author Vertex Team
 * @date 2025-11-13
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { ArrowLeft } from '@phosphor-icons/react';

// Imports originais
import Sidebar from '@/components/original/Sidebar';
import ReportCanvas from '@/components/original/ReportCanvas';
import type { AIStatus } from '@/components/original/ReportCanvas';
import SelectedFindingsPanel from '@/components/original/SelectedFindingsPanel';
import ExamStatisticsPanel from '@/components/original/ExamStatisticsPanel';
import BreastUltrasoundFindingDetails from '@/components/original/BreastUltrasoundFindingDetails';
import { breastUltrasoundOrgans } from '@/data/breastUltrasoundOrgans';
import { SelectedFinding, ReportData, FindingInstance, type AIProvider, type AIGenerationStats } from '@/types/report';
import { Finding } from '@/data/organs';
import { generateReport } from '@/services/reportGenerator';
import { geminiStreamService, GEMINI_MODEL } from '@/services/geminiStreamService';
import { openaiStreamService, OPENAI_MODEL } from '@/services/openaiStreamService';
import { unifiedAIService } from '@/services/unifiedAIService';
import ModernExamLayout from '@/layouts/ModernExamLayout';
import FloatingOrganPanelModern from '@/components/shared/FloatingOrganPanelModern';
import QuickTemplatesPanel from '@/components/shared/QuickTemplatesPanel';
import { buildSpecializedPrompt } from '@/services/promptBuilder';
import { estimateCostUsd, estimateTokensFromText } from '@/utils/aiMetrics';
import { buildBreastReport, buildBreastImpression } from '@/services/breastReportBuilder';

function BreastUltrasoundExamModern() {
  const navigate = useNavigate();
  const [selectedOrgan, setSelectedOrgan] = useState('');
  const [selectedFindings, setSelectedFindings] = useState<SelectedFinding[]>([]);
  const [normalOrgans, setNormalOrgans] = useState<string[]>([]);
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiImpression, setAiImpression] = useState('');
  const [currentAiModel, setCurrentAiModel] = useState<'gemini' | 'openai'>('gemini');
  const [currentModelId, setCurrentModelId] = useState<string>(GEMINI_MODEL);
  const [useAiRefinement, setUseAiRefinement] = useState(false); // Novo: controla se usa IA ou não
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const [aiGenerationStats, setAiGenerationStats] = useState<AIGenerationStats | null>(null);
  const statusUnsubscribeRef = useRef<(() => void) | null>(null);

  // Outside click e guardas de dropdown agora são tratados pelo FloatingOrganPanelModern.

  // Dropdown guard é tratado dentro do FloatingOrganPanelModern (hooks compartilhados)
  const getComponentFileName = (): string => {
    const fullPath = import.meta.url;
    const fileName = fullPath.split('/').pop() || '';
    return fileName;
  };

  // Uso no componente:
  const CURRENT_FILE = getComponentFileName();
  const examType = CURRENT_FILE.split('.')[0];
  console.log('[🔎]:', CURRENT_FILE); // "MammographyExamModern.tsx"
  console.log('[✅]:', examType);      // "MammographyExam"

  const handleOrganSelect = (organId: string) => {
    if (selectedOrgan === organId) {
      setIsPanelMinimized(!isPanelMinimized);
    } else {
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
        const existingIndex = currentFindings.findIndex(f => f.findingId === findingId);
        if (existingIndex >= 0) {
          const updated = [...currentFindings];
          updated[existingIndex] = {
            ...updated[existingIndex],
            severity,
            instances
          };
          return updated;
        } else {
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
    options: { model: AIProvider; specificModel: string }
  ) => {
    setIsGenerating(true);
    try {
      const provider = options?.model ?? 'gemini';
      setCurrentAiModel(provider as 'gemini' | 'openai');
      setGeneratedReport('');
      // Persistir o modelo específico selecionado para consumo pelos services
      if (options?.specificModel) {
        try { sessionStorage.setItem('selectedAIModel', options.specificModel); } catch {}
        setCurrentModelId(options.specificModel);
      } else {
        // fallback para defaults
        setCurrentModelId(provider === 'openai' ? OPENAI_MODEL : GEMINI_MODEL);
      }
      // Métricas
      const startedAt = Date.now();
      const promptText = buildSpecializedPrompt({
        examType: 'Ultrassonografia Mamária (BI-RADS)',
        selectedFindings: data.selectedFindings,
        normalOrgans: data.normalOrgans,
        organsCatalog: breastUltrasoundOrgans
      });
      const promptTokenEstimate = estimateTokensFromText(promptText);
      let chunkCount = 0;
      let outputChars = 0;

      if (provider === 'openai') {
        if (!openaiStreamService.isConfigured()) {
          toast.error('OpenAI API não está configurada.');
          setIsGenerating(false);
          return;
        }

        await openaiStreamService.generateFullReportStream(
          {
            examType: 'Ultrassonografia Mamária (BI-RADS)',
            selectedFindings: data.selectedFindings,
            normalOrgans: data.normalOrgans,
            organsCatalog: breastUltrasoundOrgans
          },
          {
            onChunk: (accumulated) => {
              setGeneratedReport(accumulated);
              chunkCount += 1;
              outputChars = accumulated.length;
            },
            onComplete: (finalText) => {
              setGeneratedReport(finalText);
              toast.success('Relatório gerado com sucesso!');
              const finishedAt = Date.now();
              const completionTokens = estimateTokensFromText(finalText);
              setAiGenerationStats({
                provider: 'openai',
                model: OPENAI_MODEL,
                status: 'completed',
                promptTokens: promptTokenEstimate,
                completionTokens,
                totalTokens: promptTokenEstimate + completionTokens,
                estimatedCostUsd: estimateCostUsd('openai', promptTokenEstimate, completionTokens),
                startedAt,
                finishedAt,
                durationMs: finishedAt - startedAt,
                chunkCount,
                inputChars: promptText.length,
                outputChars
              });
            },
            onError: (error) => {
              console.error('Erro no OpenAI:', error);
              toast.error('Erro ao gerar relatório.');
              const finishedAt = Date.now();
              setAiGenerationStats({
                provider: 'openai',
                model: OPENAI_MODEL,
                status: 'error',
                promptTokens: promptTokenEstimate,
                startedAt,
                finishedAt,
                durationMs: finishedAt - startedAt,
                chunkCount,
                inputChars: promptText.length,
                outputChars,
                errorMessage: error?.message || 'Erro desconhecido'
              });
            }
          }
        );
      } else {
        if (!geminiStreamService.isConfigured()) {
          const report = await generateReport(data, {
            organsList: breastUltrasoundOrgans,
            provider
          });
          setGeneratedReport(report);
          toast.success('Relatório gerado!');
          // Fallback offline - estimar saída
          const finishedAt = Date.now();
          const completionTokens = estimateTokensFromText(report);
          setAiGenerationStats({
            provider: 'gemini',
            model: GEMINI_MODEL,
            status: 'completed',
            promptTokens: promptTokenEstimate,
            completionTokens,
            totalTokens: promptTokenEstimate + completionTokens,
            estimatedCostUsd: estimateCostUsd('gemini', promptTokenEstimate, completionTokens),
            startedAt,
            finishedAt,
            durationMs: finishedAt - startedAt,
            chunkCount,
            inputChars: promptText.length,
            outputChars: report.length
          });
        } else {
          await geminiStreamService.generateFullReportStream(
            {
              examType: 'Ultrassonografia Mamária (BI-RADS)',
              selectedFindings: data.selectedFindings,
              normalOrgans: data.normalOrgans,
              organsCatalog: breastUltrasoundOrgans
            },
            {
              onChunk: (accumulatedText) => {
                setGeneratedReport(accumulatedText);
                chunkCount += 1;
                // Como vem acumulado, vamos considerar apenas o delta do último comprimento
                outputChars = accumulatedText.length;
              },
              onComplete: (finalText) => {
                setGeneratedReport(finalText);
                toast.success('Relatório gerado!');
                const finishedAt = Date.now();
                const completionTokens = estimateTokensFromText(finalText);
                setAiGenerationStats({
                  provider: 'gemini',
                  model: GEMINI_MODEL,
                  status: 'completed',
                  promptTokens: promptTokenEstimate,
                  completionTokens,
                  totalTokens: promptTokenEstimate + completionTokens,
                  estimatedCostUsd: estimateCostUsd('gemini', promptTokenEstimate, completionTokens),
                  startedAt,
                  finishedAt,
                  durationMs: finishedAt - startedAt,
                  chunkCount,
                  inputChars: promptText.length,
                  outputChars
                });
              },
              onError: async (error) => {
                console.error('Erro no Gemini:', error);
                try {
                  const fallback = await generateReport(
                    {
                      selectedFindings: data.selectedFindings,
                      normalOrgans: data.normalOrgans,
                      additionalNotes: ''
                    },
                    { organsList: breastUltrasoundOrgans, provider }
                  );
                  setGeneratedReport(fallback);
                  toast.error('Falha no endpoint de IA. Exibindo laudo básico.');
                  const finishedAt = Date.now();
                  const completionTokens = estimateTokensFromText(fallback);
                  setAiGenerationStats({
                    provider: 'gemini',
                    model: GEMINI_MODEL,
                    status: 'error',
                    promptTokens: promptTokenEstimate,
                    completionTokens,
                    totalTokens: promptTokenEstimate + completionTokens,
                    estimatedCostUsd: estimateCostUsd('gemini', promptTokenEstimate, completionTokens),
                    startedAt,
                    finishedAt,
                    durationMs: finishedAt - startedAt,
                    chunkCount,
                    inputChars: promptText.length,
                    outputChars: fallback.length,
                    errorMessage: error?.message || 'Erro desconhecido'
                  });
                } catch (fallbackErr) {
                  console.error('Falha no fallback:', fallbackErr);
                  toast.error('Erro ao gerar relatório.');
                  const finishedAt = Date.now();
                  setAiGenerationStats({
                    provider: 'gemini',
                    model: GEMINI_MODEL,
                    status: 'error',
                    promptTokens: promptTokenEstimate,
                    startedAt,
                    finishedAt,
                    durationMs: finishedAt - startedAt,
                    chunkCount,
                    inputChars: promptText.length,
                    outputChars,
                    errorMessage: String(fallbackErr)
                  });
                }
              }
            }
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
      if (status === 'error') {
        setAiError('Erro ao consultar a IA');
      } else {
        setAiError(null);
      }
    });

    // Métricas
    const startedAt = Date.now();
    const promptText = buildSpecializedPrompt({
      examType: 'Ultrassonografia Mamária (BI-RADS)',
      selectedFindings,
      normalOrgans,
      organsCatalog: breastUltrasoundOrgans
    });
    const promptTokenEstimate = estimateTokensFromText(promptText);
    let chunkCount = 0;
    let accumulatedText = '';
    unifiedAIService.generateClinicalImpression(
      {
        examType: 'Ultrassonografia Mamária (BI-RADS)',
        selectedFindings,
        normalOrgans,
        organsCatalog: breastUltrasoundOrgans
      },
      {
        onChunk: (text) => {
          accumulatedText += text;
          setAiImpression(accumulatedText);
          chunkCount += 1;
        },
        onComplete: (finalText) => {
          setAiImpression(finalText);
          setAiError(null);
          const finishedAt = Date.now();
          const completionTokens = estimateTokensFromText(finalText);
          setAiGenerationStats({
            provider: currentAiModel,
            model: currentAiModel === 'openai' ? OPENAI_MODEL : GEMINI_MODEL,
            status: 'completed',
            promptTokens: promptTokenEstimate,
            completionTokens,
            totalTokens: promptTokenEstimate + completionTokens,
            estimatedCostUsd: estimateCostUsd(currentAiModel, promptTokenEstimate, completionTokens),
            startedAt,
            finishedAt,
            durationMs: finishedAt - startedAt,
            chunkCount,
            inputChars: promptText.length,
            outputChars: finalText.length
          });
        },
        onError: (error) => {
          setAiImpression('');
          setAiError(error.message || 'Erro desconhecido');
          const finishedAt = Date.now();
          setAiGenerationStats({
            provider: currentAiModel,
            model: currentAiModel === 'openai' ? OPENAI_MODEL : GEMINI_MODEL,
            status: 'error',
            promptTokens: promptTokenEstimate,
            startedAt,
            finishedAt,
            durationMs: finishedAt - startedAt,
            chunkCount,
            inputChars: promptText.length,
            outputChars: 0,
            errorMessage: error?.message || 'Erro desconhecido'
          });
        }
      }
    ).catch((error) => {
      console.error('AI failed:', error);
      setAiError('Falha na geração');
    });
  }, [selectedFindings, normalOrgans, currentAiModel, isAiProcessing]);

  /**
   * ⚡ GERAÇÃO INSTANTÂNEA DE LAUDO (SEM IA)
   * Atualiza o laudo automaticamente sempre que há mudanças nos achados
   */
  useEffect(() => {
    // Gera laudo completo instantaneamente
    const report = buildBreastReport(selectedFindings, normalOrgans, breastUltrasoundOrgans);
    setGeneratedReport(report);

    // Gera impressão clínica resumida
    const impression = buildBreastImpression(selectedFindings, normalOrgans);
    setAiImpression(impression);
  }, [selectedFindings, normalOrgans]);

  /**
   * 🤖 REFINAMENTO COM IA (OPCIONAL)
   * Apenas se o usuário explicitamente solicitar refinamento
   */
  useEffect(() => {
    if (!useAiRefinement) return;

    const timer = setTimeout(() => {
      if (selectedFindings.length > 0 || normalOrgans.length > 0) {
        generateAIImpression();
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (statusUnsubscribeRef.current && useAiRefinement) {
        statusUnsubscribeRef.current();
        statusUnsubscribeRef.current = null;
      }
      if (useAiRefinement) {
        unifiedAIService.cancelClinicalImpression();
      }
    };
  }, [selectedFindings, normalOrgans, currentAiModel, useAiRefinement, generateAIImpression]);

  useEffect(() => {
    return () => {
      if (statusUnsubscribeRef.current) {
        statusUnsubscribeRef.current();
        statusUnsubscribeRef.current = null;
      }
      unifiedAIService.cleanup();
    };
  }, []);

  const currentOrgan = breastUltrasoundOrgans.find(organ => organ.id === selectedOrgan);
  const currentOrganFindings = selectedFindings.filter(f => f.organId === selectedOrgan);
  const isCurrentOrganNormal = normalOrgans.includes(selectedOrgan);

  /**
   * Aplica um template rápido
   */
  const handleApplyTemplate = (template: {
    name: string;
    normalOrgans: string[];
    findings: SelectedFinding[];
    reportText: string;
  }) => {
    setNormalOrgans(template.normalOrgans);
    setSelectedFindings(template.findings);
    setGeneratedReport(template.reportText);
    toast.success(`Template "${template.name}" aplicado!`);
  };

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
                <h1 className="text-xl font-bold text-white">Ultrassom de Mamas</h1>
                <p className="text-xs text-gray-400">BI-RADS 2013/2023</p>
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
            organsList={breastUltrasoundOrgans}
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
              organsList={breastUltrasoundOrgans}
              currentAiModel={currentAiModel}
              currentModelId={currentModelId}
              onGenerateAI={generateAIImpression}
              autoGenerateAI={useAiRefinement}
              onToggleAutoGenerate={setUseAiRefinement}
            />
          </div>
        )}
        panels={(
          <div className="space-y-4">
            <QuickTemplatesPanel onApplyTemplate={handleApplyTemplate} />
            <SelectedFindingsPanel
              className="glass-panel flex-1"
              selectedFindings={selectedFindings}
              normalOrgans={normalOrgans}
              organsList={breastUltrasoundOrgans}
              onGenerateReport={handleGenerateReport}
              isGenerating={isGenerating}
              expandToContent
            />
          </div>
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
              leftCss={'calc(25% + 1.5rem)'}
              widthExpanded={'24rem'}
              maxHeight={'80vh'}
              FindingDetailsComponent={BreastUltrasoundFindingDetails}
            />
          ) : null
        )}
      />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default BreastUltrasoundExamModern;
