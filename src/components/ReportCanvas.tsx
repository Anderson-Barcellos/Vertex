import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { SelectedFinding } from '@/types/report';
import { organs as defaultOrgans, type Organ } from '@/data/organs';
import MarkdownRenderer from '@/components/MarkdownRenderer';

import { FileText, Download, CopySimple } from '@phosphor-icons/react';

import { toast } from 'sonner';

interface ReportCanvasProps {
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  generatedReport?: string;
  isGenerating?: boolean;
  organsList?: Organ[];

  aiImpression?: string;
  aiError?: string | null;
  isAiLoading?: boolean;
  currentAiModel?: 'gemini' | 'openai';
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
  currentAiModel = 'gemini'
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


  const uniqueOrgansWithFindings = useMemo(
    () => new Set(selectedFindings.map(finding => finding.organId)),
    [selectedFindings]
  );

  const uniqueNormalOrgans = useMemo(() => new Set(normalOrgans), [normalOrgans]);
  const coverage = organsList.length > 0
    ? Math.min(
        100,
        Math.round(
          ((uniqueOrgansWithFindings.size + uniqueNormalOrgans.size) / organsList.length) * 100
        )
      )
    : 0;

  const highlightCards = [
    {
      label: 'Achados registrados',
      value: selectedFindings.length,
      description: 'Total de alterações documentadas até o momento.'
    },
    {
      label: 'Órgãos com achados',
      value: uniqueOrgansWithFindings.size,
      description: 'Estruturas com alterações relevantes.'
    },
    {
      label: 'Órgãos normais',
      value: uniqueNormalOrgans.size,
      description: 'Órgãos com documentação de normalidade.'
    },
    {
      label: 'Cobertura do exame',
      value: `${coverage}%`,
      description: 'Proporção das estruturas avaliadas neste exame.'
    }
  ];


  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Laudo Médico</h2>
          </div>
          {generatedReport && (
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
              size="sm"
            >
              <Download size={16} />
              Copiar Laudo
            </Button>
          )}
        </div>
      </div>

      {/* Main Report Area - Now full width */}
      <div className="flex-1 p-4 bg-muted/30 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-4">

          {/* Gemini AI Suggestion */}
          {(aiImpression || aiError || isAiLoading) && (
            <div className="bg-white/80 border border-primary/20 rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/70">
                    {currentAiModel === 'openai' ? 'GPT-5 Nano' : 'Gemini 2.5 Pro'}
                  </p>
                  <h3 className="text-sm font-semibold text-foreground">
                    Impressão diagnóstica sugerida
                  </h3>
                </div>
                {aiImpression && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyAiImpression}
                    className="h-8 text-xs"
                  >
                    <CopySimple size={14} />
                    <span className="ml-1">Copiar</span>
                  </Button>
                )}
              </div>

              <div className="mt-3">
                {isAiLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin"></div>
                    Consultando Gemini para análise clínica...
                  </div>
                ) : aiError ? (
                  <p className="text-xs text-destructive font-medium">{aiError}</p>
                ) : aiImpression ? (
                  <pre className="mt-2 whitespace-pre-wrap text-xs leading-relaxed font-sans text-foreground/90 bg-white/70 border border-border rounded-md p-3">
                    {aiImpression}
                  </pre>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Nenhuma impressão automatizada disponível até o momento.
                  </p>
                )}
              </div>
            </div>
          )}


          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {highlightCards.map(card => (
              <div
                key={card.label}
                className="bg-white/70 border border-border rounded-lg p-4 shadow-sm backdrop-blur"
              >
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {card.label}
                </p>
                <p className="text-2xl font-semibold text-foreground mt-1">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-2 leading-snug">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* A4-like Report Container */}
          <div
            className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden"
            style={{
              minHeight: '700px',
              aspectRatio: '210/297',
              maxWidth: '750px',
              margin: '0 auto'
            }}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground">Gerando relatório com IA...</p>
                </div>
              </div>
            ) : generatedReport ? (
              <div className="p-6">
                <MarkdownRenderer
                  content={generatedReport}
                  isStreaming={isGenerating}
                  className="prose prose-sm max-w-none"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-base font-medium">
                    O laudo aparecerá aqui após ser gerado.
                  </p>
                  <p className="text-gray-400 text-sm">
                    Use o botão "Gerar Laudo" na barra lateral
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}