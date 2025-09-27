import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { SelectedFinding, ReportData, type AIProvider } from '@/types/report';
import { organs as defaultOrgans, type Organ } from '@/data/organs';
import { FileText, Lightning } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface SelectedFindingsPanelProps {
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  organsList?: Organ[];
  onGenerateReport: (data: ReportData, options: { model: AIProvider }) => Promise<void>;
  isGenerating?: boolean;
  className?: string;
}

export default function SelectedFindingsPanel({
  selectedFindings,
  normalOrgans,
  organsList = defaultOrgans,
  onGenerateReport,
  isGenerating = false,
  className
}: SelectedFindingsPanelProps) {
  const [selectedModel, setSelectedModel] = useState<AIProvider>('gemini');

  const groupedFindings = useMemo(() => {
    return selectedFindings.reduce((acc, finding) => {
      if (!acc[finding.organId]) {
        acc[finding.organId] = [];
      }
      acc[finding.organId].push(finding);
      return acc;
    }, {} as Record<string, SelectedFinding[]>);
  }, [selectedFindings]);

  const organMap = useMemo(() => {
    return organsList.reduce<Record<string, Organ>>((acc, organ) => {
      acc[organ.id] = organ;
      return acc;
    }, {});
  }, [organsList]);

  const uniqueNormalOrgans = useMemo(() => new Set(normalOrgans), [normalOrgans]);
  const uniqueOrgansWithFindings = useMemo(
    () => new Set(Object.keys(groupedFindings)),
    [groupedFindings]
  );

  const coveragePercentage = organsList.length > 0
    ? Math.min(
        100,
        Math.round(
          ((uniqueNormalOrgans.size + uniqueOrgansWithFindings.size) / organsList.length) * 100
        )
      )
    : 0;

  const handleGenerateReport = () => {
    const reportData: ReportData = {
      selectedFindings,
      normalOrgans,
      additionalNotes: ''
    };
    onGenerateReport(reportData, { model: selectedModel });
  };

  // Calculate dynamic height based on content
  const hasContent = selectedFindings.length > 0 || normalOrgans.length > 0;
  const itemCount = selectedFindings.length + (normalOrgans.length > 0 ? 1 : 0);
  const dynamicMaxHeight = hasContent
    ? `min(calc(100vh - 8rem), ${Math.max(400, Math.min(700, 300 + itemCount * 40))}px)`
    : '400px';

  return (
    <div
      className={cn(
        "w-80 bg-sidebar-background/95 backdrop-blur-sm rounded-xl shadow-xl border border-border/20 flex flex-col overflow-hidden transition-all duration-300",
        className
      )}
      style={{
        maxHeight: dynamicMaxHeight,
        minHeight: hasContent ? '300px' : '250px'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/20 bg-sidebar-background">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-sidebar-foreground" />
            <h2 className="text-sm font-semibold text-sidebar-foreground">
              Achados Selecionados
            </h2>
          </div>
          <Badge
            variant="secondary"
            className="text-[10px] px-2 py-0.5 bg-sidebar-muted text-sidebar-foreground"
          >
            {selectedFindings.length} registro{selectedFindings.length === 1 ? '' : 's'}
          </Badge>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-sidebar-foreground opacity-70">
              Órgãos cobertos
            </span>
            <span className="text-sidebar-foreground font-medium">
              {uniqueOrgansWithFindings.size + uniqueNormalOrgans.size}/{organsList.length}
            </span>
          </div>
          <div className="h-1.5 bg-sidebar-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${coveragePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.keys(groupedFindings).length === 0 && normalOrgans.length === 0 ? (
          <p className="text-xs text-sidebar-foreground opacity-60 text-center py-8">
            Nenhum achado selecionado
          </p>
        ) : (
          <div className="space-y-3">
            {/* Pathological findings */}
            {Object.entries(groupedFindings).map(([organId, findings]) => {
              const organ = organMap[organId];
              return (
                <div key={organId} className="space-y-1.5">
                  <h4 className="font-medium text-xs text-sidebar-accent">
                    {organ?.name}
                  </h4>
                  <div className="space-y-1 pl-2">
                    {findings.map((finding) => (
                      <div key={finding.findingId} className="finding-item finding-item-new">
                        <div className="flex items-start gap-1">
                          <span className="text-xs text-sidebar-foreground opacity-90">
                            {finding.finding.name}
                          </span>
                          {finding.severity && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1 py-0 h-3.5 bg-sidebar-muted text-sidebar-foreground"
                            >
                              {finding.severity}
                            </Badge>
                          )}
                        </div>

                        {/* Show instances */}
                        {finding.instances && finding.instances.length > 0 && (
                          <div className="pl-3 mt-1 space-y-1">
                            {finding.instances.map((instance, idx) => (
                              <div key={instance.id} className="bg-sidebar-muted/30 rounded px-2 py-1.5 border border-sidebar-muted/50">
                                <div className="text-[11px] font-semibold text-sidebar-accent flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-sidebar-accent rounded-full"></span>
                                  Lesão {idx + 1}
                                </div>
                                <div className="text-[10px] text-sidebar-foreground opacity-90 space-y-0.5 mt-1 pl-2.5">
                                  {instance.measurements.size && (
                                    <div>• Tamanho: {instance.measurements.size}</div>
                                  )}
                                  {instance.measurements.location && (
                                    <div>• Localização: {instance.measurements.location}</div>
                                  )}
                                  {instance.measurements.segment && (
                                    <div>• Segmento: {instance.measurements.segment}</div>
                                  )}
                                  {instance.measurements.additionalInfo && (
                                    <div>• Obs: {instance.measurements.additionalInfo}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Normal organs */}
            {normalOrgans.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="font-medium text-xs text-green-500">
                  Órgãos Normais
                </h4>
                <div className="flex flex-wrap gap-1 pl-2">
                  {normalOrgans.map((organId) => {
                    const organ = organMap[organId];
                    return (
                      <Badge
                        key={organId}
                        variant="outline"
                        className="text-[10px] px-2 py-0.5 border-green-500/30 text-sidebar-foreground"
                      >
                        {organ?.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer - AI Model Selection and Generate Button */}
      <div className="p-4 border-t border-border/20 bg-sidebar-background space-y-3">
        {/* AI Model Selection */}
        <div>
          <h3 className="text-xs font-medium mb-2 text-sidebar-foreground opacity-70">
            Modelo de IA:
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedModel('gemini')}
              className={cn(
                "flex-1 px-3 py-1.5 text-xs rounded-md font-medium transition-all",
                selectedModel === 'gemini'
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-sidebar-muted text-sidebar-foreground opacity-70 border border-white/10 hover:opacity-100"
              )}
            >
              Gemini 2.5
            </button>
            <button
              onClick={() => setSelectedModel('openai')}
              className={cn(
                "flex-1 px-3 py-1.5 text-xs rounded-md font-medium transition-all",
                selectedModel === 'openai'
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-sidebar-muted text-sidebar-foreground opacity-70 border border-white/10 hover:opacity-100"
              )}
            >
              OpenAI
            </button>
          </div>
        </div>

        {/* Generate Report Button */}
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating || (selectedFindings.length === 0 && normalOrgans.length === 0)}
          className="w-full py-2.5 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-accent-foreground/20 border-t-accent-foreground rounded-full animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <Lightning size={16} />
              Gerar Laudo
            </>
          )}
        </button>
      </div>
    </div>
  );
}