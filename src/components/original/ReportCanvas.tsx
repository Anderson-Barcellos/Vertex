import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { SelectedFinding } from '@/types/report';
import { organs as defaultOrgans, type Organ } from '@/data/organs';
import MarkdownRenderer from '@/components/MarkdownRenderer';

import { FileText, Download, CopySimple, Robot, Lightning } from '@phosphor-icons/react';

import { toast } from 'sonner';

export type AIStatus = 'idle' | 'loading' | 'streaming' | 'completed' | 'error';

interface ReportCanvasProps {
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  generatedReport?: string;
  isGenerating?: boolean;
  organsList?: Organ[];

  aiImpression?: string;
  aiError?: string | null;
  isAiLoading?: boolean;
  aiStatus?: AIStatus;
  currentAiModel?: 'gemini' | 'openai';
  currentModelId?: string;

  // Controles manuais de IA
  onGenerateAI?: () => void;
  autoGenerateAI?: boolean;
  onToggleAutoGenerate?: (value: boolean) => void;
}

export default function ReportCanvas({
  selectedFindings,
  normalOrgans,
  generatedReport,
  isGenerating = false,

  organsList = defaultOrgans,
  aiImpression,
  aiError,
  isAiLoading = false,
  aiStatus = 'idle',
  currentAiModel = 'gemini',
  currentModelId,

  onGenerateAI,
  autoGenerateAI = false,
  onToggleAutoGenerate
}: ReportCanvasProps) {

  const copyToClipboard = () => {
    if (generatedReport) {
      navigator.clipboard.writeText(generatedReport);
      toast.success('Relatório copiado para a área de transferência');
    }
  };


  const copyAiImpression = () => {
    if (aiImpression) {
      navigator.clipboard.writeText(aiImpression);
      toast.success('Impressão da IA copiada');
    }
  };

  // Enhanced status indicator component
  const renderAIStatusIndicator = () => {
    switch (aiStatus) {
      case 'loading':
        return (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span>Preparando consulta à IA...</span>
          </div>
        );
      case 'streaming':
        return (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <div className="w-4 h-4 relative">
              <div className="w-full h-full bg-green-600 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-300 rounded-full m-auto animate-ping"></div>
            </div>
            <span>IA gerando resposta...</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span>Análise completa</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <span>Erro na análise</span>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <article className="flex flex-col h-full">
      {/* Header */}
      <header className="p-5 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Laudo Médico</h2>
          </div>
          {generatedReport && (
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white border-green-600"
              size="sm"
            >
              <Download size={16} />
              Copiar Laudo
            </Button>
          )}
        </div>
      </header>

      {/* Main Report Area - Paper on desk visual */}
      <section className="flex-1 p-6 bg-slate-100 overflow-y-auto overflow-x-hidden">
        {/* Report Container */}
        <div className="w-full max-w-5xl mx-auto space-y-4">
            {/* Enhanced AI Suggestion Panel with Status Indicators */}
            {(aiImpression || aiError || aiStatus !== 'idle') && (
              <div className="bg-white/80 border border-primary/20 rounded-lg p-4 shadow-sm w-full">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/70">
                        {currentModelId || (currentAiModel === 'openai' ? 'OpenAI' : 'Gemini')}
                      </p>
                      {renderAIStatusIndicator()}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Impressão diagnóstica sugerida
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Toggle para geração automática */}
                    <div className="flex items-center gap-2 pr-3 border-r border-gray-200">
                      <label htmlFor="auto-generate" className="flex items-center gap-1.5 cursor-pointer">
                        <Lightning size={14} className={autoGenerateAI ? "text-yellow-500" : "text-gray-400"} />
                        <span className="text-xs text-gray-600">Auto</span>
                      </label>
                      <Switch
                        id="auto-generate"
                        checked={autoGenerateAI}
                        onCheckedChange={onToggleAutoGenerate}
                        className="scale-75"
                      />
                    </div>

                    {/* Botão para gerar manualmente */}
                    {!aiImpression && !isAiLoading && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={onGenerateAI}
                        className="h-8 text-xs bg-primary hover:bg-primary/90"
                      >
                        <Robot size={14} />
                        <span className="ml-1">Gerar IA</span>
                      </Button>
                    )}

                    {/* Botão para copiar quando completo */}
                    {aiImpression && aiStatus === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyAiImpression}
                        className="h-8 text-xs bg-green-500 hover:bg-green-600 text-white border-green-600"
                      >
                        <CopySimple size={14} />
                        <span className="ml-1">Copiar</span>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  {aiStatus === 'loading' ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-700 rounded-full animate-spin"></div>
                        Preparando consulta à {currentAiModel === 'openai' ? 'GPT-5.1 Chat Latest' : 'Gemini 2.5 Pro'}...
                      </div>
                    </div>
                  ) : aiStatus === 'streaming' ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                        <div className="w-4 h-4 relative">
                          <div className="w-full h-full bg-green-600 rounded-full animate-pulse"></div>
                          <div className="absolute inset-0 w-2 h-2 bg-green-300 rounded-full m-auto animate-ping"></div>
                        </div>
                        IA gerando análise em tempo real...
                      </div>
                      {aiImpression && (
                        <pre className="whitespace-pre-wrap text-xs leading-relaxed font-sans text-foreground/90 bg-white/70 border border-border rounded-md p-3">
                          {aiImpression}
                          <span className="inline-block w-2 h-3 bg-green-600 animate-pulse ml-1">|</span>
                        </pre>
                      )}
                    </div>
                  ) : aiError || aiStatus === 'error' ? (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-xs text-red-700 font-medium flex items-center gap-2">
                        <span className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">!</span>
                        {aiError || 'Erro ao consultar a IA'}
                      </p>
                    </div>
                  ) : aiImpression ? (
                    <div className="bg-white/70 border border-border rounded-md p-3">
                      <pre className="whitespace-pre-wrap text-xs leading-relaxed font-sans text-foreground/90">
                        {aiImpression}
                      </pre>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Robot size={24} className="text-gray-400" />
                        <p className="text-xs text-muted-foreground text-center">
                          {autoGenerateAI
                            ? "A IA gerará uma impressão diagnóstica quando você adicionar achados"
                            : "Clique em 'Gerar IA' para criar uma impressão diagnóstica"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="report-content">
              {generatedReport ? (
                <>
                  {/* Header com indicador de streaming */}
                  {isGenerating && (
                    <div className="mb-4 pb-3 border-b border-dashed border-blue-300 bg-blue-50/50 -mx-6 -mt-6 px-6 pt-4 rounded-t-lg sm:-mx-8 sm:-mt-8 sm:px-8">
                      <div className="flex items-center gap-3 text-sm text-blue-700">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 relative">
                            <div className="w-full h-full bg-blue-600 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 w-2 h-2 bg-blue-300 rounded-full m-auto animate-ping"></div>
                          </div>
                          <span className="font-medium">Gerando relatório em tempo real...</span>
                        </div>
                        <div className="flex-1 h-1 bg-blue-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Conteúdo do relatório com markdown */}
                  <div className="relative">
                    <MarkdownRenderer
                      content={generatedReport}
                      isStreaming={isGenerating}
                      className="fluid-prose prose max-w-none"
                    />

                    {/* Cursor piscante no final durante streaming */}
                    {isGenerating && (
                      <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-1 align-middle"></span>
                    )}
                  </div>
                </>
              ) : isGenerating ? (
                <div className="space-y-4">
                  {/* Mini indicador no topo */}
                  <div className="flex items-center gap-3 pb-3 border-b border-dashed border-blue-300">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <div className="w-4 h-4 relative">
                        <div className="w-full h-full bg-blue-600 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-2 h-2 bg-blue-300 rounded-full m-auto animate-ping"></div>
                      </div>
                      <span className="font-medium">Iniciando geração do relatório...</span>
                    </div>
                  </div>

                  {/* Placeholder para o conteúdo que está vindo */}
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
                      <FileText size={36} className="text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-500 text-base font-medium">
                        O laudo aparecerá aqui após ser gerado
                      </p>
                      <p className="text-gray-400 text-sm">
                        Use o botão "Gerar Laudo" na barra lateral
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span>Aguardando geração</span>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
      </section>
    </article>
  );
}
