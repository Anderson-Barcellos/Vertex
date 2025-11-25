import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { ArrowLeft } from '@phosphor-icons/react';

import Sidebar from '@/components/original/Sidebar';
import ReportCanvas from '@/components/original/ReportCanvas';
import type { AIStatus } from '@/components/original/ReportCanvas';
import SelectedFindingsPanel from '@/components/original/SelectedFindingsPanel';
import ExamStatisticsPanel from '@/components/original/ExamStatisticsPanel';

import ModernExamLayout from '@/layouts/ModernExamLayout';
import FloatingOrganPanelModern from '@/components/shared/FloatingOrganPanelModern';

import type { SelectedFinding, ReportData, FindingInstance, AIProvider, AIGenerationStats } from '@/types/report';
import type { Finding } from '@/data/organs';

import { abdominalWallOrgans } from '@/data/abdominalWallOrgans';

import { generateReport } from '@/services/reportGenerator';
import { geminiStreamService, GEMINI_MODEL } from '@/services/geminiStreamService';
import { openaiStreamService, OPENAI_MODEL } from '@/services/openaiStreamService';
import { unifiedAIService } from '@/services/unifiedAIService';
import { buildSpecializedPrompt } from '@/services/promptBuilder';
import { estimateCostUsd, estimateTokensFromText } from '@/utils/aiMetrics';

export default function AbdominalWallExamModern() {
  const navigate = useNavigate();

  const [selectedOrgan, setSelectedOrgan] = useState('');
  const [selectedFindings, setSelectedFindings] = useState<SelectedFinding[]>([]);
  const [normalOrgans, setNormalOrgans] = useState<string[]>([]);
  const [generatedReport, setGeneratedReport] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiImpression, setAiImpression] = useState('');
  const [currentAiModel, setCurrentAiModel] = useState<'gemini' | 'openai'>('gemini');
  const [currentModelId, setCurrentModelId] = useState<string>(GEMINI_MODEL);
  const [autoGenerateAI, setAutoGenerateAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<AIStatus>('idle');
  const [aiGenerationStats, setAiGenerationStats] = useState<AIGenerationStats | null>(null);

  const [isPanelMinimized, setIsPanelMinimized] = useState(false);
  const statusUnsubscribeRef = useRef<(() => void) | null>(null);

  const EXAM_TYPE = 'Ultrassonografia de Parede Abdominal';

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
          return [...currentFindings, {
            organId,
            categoryId,
            findingId,
            finding,
            severity,
            instances
          }];
        }
      } else {
        return currentFindings.filter(f => f.findingId !== findingId);
      }
    });

    if (checked) {
      setNormalOrgans(current => current.filter(id => id !== organId));
    }
  };

  const handleNormalChange = (organId: string, isNormal: boolean) => {
    if (isNormal) {
      setNormalOrgans(current => {
        if (!current.includes(organId)) {
          return [...current, organId];
        }
        return current;
      });
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
      setCurrentAiModel(provider as 'gemini' | 'openai');
      setGeneratedReport('');

      if (options?.specificModel) {
        try { sessionStorage.setItem('selectedAIModel', options.specificModel); } catch {}
        setCurrentModelId(options.specificModel);
      } else {
        setCurrentModelId(provider === 'openai' ? OPENAI_MODEL : GEMINI_MODEL);
      }

      const startedAt = Date.now();
      const promptText = buildSpecializedPrompt({
        examType: EXAM_TYPE,
        selectedFindings: data.selectedFindings,
        normalOrgans: data.normalOrgans,
        organsCatalog: abdominalWallOrgans
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
            examType: EXAM_TYPE,
            selectedFindings: data.selectedFindings,
            normalOrgans: data.normalOrgans,
            organsCatalog: abdominalWallOrgans
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
            organsList: abdominalWallOrgans,
            provider
          });
          setGeneratedReport(report);
          toast.success('Relatório gerado!');
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
              examType: EXAM_TYPE,
              selectedFindings: data.selectedFindings,
              normalOrgans: data.normalOrgans,
              organsCatalog: abdominalWallOrgans
            },
            {
              onChunk: (accumulatedText) => {
                setGeneratedReport(accumulatedText);
                chunkCount += 1;
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
                    { organsList: abdominalWallOrgans, provider }
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

    let accumulatedText = '';
    unifiedAIService.generateClinicalImpression(
      {
        examType: EXAM_TYPE,
        selectedFindings,
        normalOrgans,
        organsCatalog: abdominalWallOrgans
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
      console.error('AI failed:', error);
      setAiError('Falha na geração');
    });
  }, [selectedFindings, normalOrgans, currentAiModel, isAiProcessing]);

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

  const currentOrgan = abdominalWallOrgans.find(organ => organ.id === selectedOrgan);
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
                <h1 className="text-xl font-bold text-white">Ultrassom de Parede Abdominal</h1>
                <p className="text-xs text-gray-400">Hérnias, Diástase, Coleções e Lesões de Partes Moles</p>
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
            organsList={abdominalWallOrgans}
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
              organsList={abdominalWallOrgans}
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
              organsList={abdominalWallOrgans}
              onGenerateReport={handleGenerateReport}
              isGenerating={isGenerating}
              expandToContent
            />
            <ExamStatisticsPanel
              className="glass-panel"
              stats={aiGenerationStats}
              isGenerating={isGenerating}
              currentProvider={currentAiModel === 'gemini' ? 'gemini' : 'openai'}
              currentModel={currentModelId}
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
              leftCss={'calc(25% + 1.5rem)'}
              widthExpanded={'24rem'}
              maxHeight={'80vh'}
            />
          ) : null
        )}
      />
      <Toaster position="top-right" richColors />
    </>
  );
}
