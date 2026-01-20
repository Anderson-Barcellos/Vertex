import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { SelectedFinding, ReportData, type AIProvider } from '@/types/report';
import { organs as defaultOrgans, type Organ } from '@/data/organs';
import { FileText, Lightning, CaretDown } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

// Model configurations
const GEMINI_MODELS = [
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', description: 'Preview, reasoning adaptativo' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Estável, 1M ctx' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Rápido e capaz' }
];

const OPENAI_MODELS = [
  { id: 'gpt-5', name: 'GPT-5', description: 'Flagship (reasoning: none)' },
  { id: 'gpt-4.1', name: 'GPT-4.1', description: 'Coding otimizado, 1M ctx' },
  { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', description: 'Rápido e econômico' }
];

const CLAUDE_MODELS = [
  { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', description: 'Melhor relação custo-benefício' },
  { id: 'claude-opus-4-5', name: 'Claude Opus 4.5', description: 'Máximo desempenho' }
];

interface SelectedFindingsPanelProps {
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  organsList?: Organ[];
  onGenerateReport: (data: ReportData, options: { model: AIProvider; specificModel: string }) => Promise<void>;
  isGenerating?: boolean;
  className?: string;
  expandToContent?: boolean;
  onModelChange?: (model: AIProvider, specificModel: string) => void;
}

export default function SelectedFindingsPanel({
  selectedFindings,
  normalOrgans,
  organsList = defaultOrgans,
  onGenerateReport,
  isGenerating = false,
  className,
  expandToContent = false,
  onModelChange
}: SelectedFindingsPanelProps) {
  const [selectedModel, setSelectedModel] = useState<AIProvider>('claude');
  const [selectedGeminiModel, setSelectedGeminiModel] = useState(GEMINI_MODELS[0].id);
  const [selectedOpenAIModel, setSelectedOpenAIModel] = useState(OPENAI_MODELS[0].id);
  const [selectedClaudeModel, setSelectedClaudeModel] = useState(CLAUDE_MODELS[0].id);

  useEffect(() => {
    const specificModel = selectedModel === 'gemini' 
      ? selectedGeminiModel 
      : selectedModel === 'openai' 
        ? selectedOpenAIModel 
        : selectedClaudeModel;
    onModelChange?.(selectedModel, specificModel);
  }, [selectedModel, selectedGeminiModel, selectedOpenAIModel, onModelChange]);
  const [activeMenu, setActiveMenu] = useState<'gemini' | 'openai' | 'claude' | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const geminiMenuRef = useRef<HTMLDivElement>(null);
  const openaiMenuRef = useRef<HTMLDivElement>(null);
  const claudeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      const isInsideGemini = geminiMenuRef.current?.contains(target as Node) ?? false;
      const isInsideOpenAI = openaiMenuRef.current?.contains(target as Node) ?? false;
      const isInsideClaude = claudeMenuRef.current?.contains(target as Node) ?? false;

      if (!isInsideGemini && !isInsideOpenAI && !isInsideClaude) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('click', handleOutsideClick, true);
    return () => document.removeEventListener('click', handleOutsideClick, true);
  }, []);

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
    if (selectedFindings.length === 0 && normalOrgans.length === 0) {
      setIsShaking(true);
      toast.warning('Adicione achados ou marque órgãos como normais primeiro', { duration: 3000 });
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    const reportData: ReportData = {
      selectedFindings,
      normalOrgans,
      additionalNotes: ''
    };

    const specificModel = selectedModel === 'gemini' 
      ? selectedGeminiModel 
      : selectedModel === 'openai' 
        ? selectedOpenAIModel 
        : selectedClaudeModel;

    onGenerateReport(reportData, {
      model: selectedModel,
      specificModel
    });
  };

  // Calculate dynamic height based on content
  const hasContent = selectedFindings.length > 0 || normalOrgans.length > 0;
  const itemCount = selectedFindings.length + (normalOrgans.length > 0 ? 1 : 0);
  const dynamicMaxHeight = hasContent
    ? `min(calc(100vh - 8rem), ${Math.max(400, Math.min(700, 300 + itemCount * 40))}px)`
    : '400px';

  const panelStyle = expandToContent
    ? undefined
    : {
        maxHeight: dynamicMaxHeight,
        minHeight: hasContent ? '300px' : '250px'
      };

  return (
    <section
      aria-labelledby="achados-titulo"
      className={cn(
        "w-56 md:w-64 lg:w-72 xl:w-80 bg-sidebar-background/95 backdrop-blur-sm rounded-xl shadow-xl border border-border/20 flex flex-col transition-all duration-300",
        className
      )}
      style={panelStyle}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/20 bg-sidebar-background rounded-t-xl">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-sidebar-foreground" />
            <h2 id="achados-titulo" className="text-sm font-semibold text-sidebar-foreground">
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

      {/* Content */}
      <div className={cn("flex-1 p-4", !expandToContent && "overflow-y-auto")}>
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

                        {/* Show instances - resumo apenas */}
                        {finding.instances && finding.instances.length > 0 && (
                          <div className="pl-3 mt-1 space-y-1">
                            {finding.instances.map((instance, idx) => {
                              const measurements = instance.measurements as Record<string, string | undefined>;
                              const summaryFields: Record<string, string> = {
                                lado: 'Lado',
                                nascetGrade: 'NASCET',
                                nascet: 'NASCET',
                                emi_value: 'EMI',
                                size: 'Tamanho',
                                location: 'Localização',
                                texto: 'Obs'
                              };
                              const skipFields = new Set([
                                'vps', 'vdf', 'ratio', 'ratioICA_CCA', 'ratio_aci_acc',
                                'spectralBroadening', 'calculatedGrade', 'calculatedConfidence',
                                'emi', 'emiValue', 'emiClassification', 'emi_classification',
                                'measurement', 'echogenicity', 'plaqueEchogenicity',
                                'composition', 'plaqueComposition', 'surface', 'plaqueSurface',
                                'risk', 'plaqueRisk', 'grayWeale'
                              ]);
                              const renderedKeys = new Set<string>();
                              const entries = Object.entries(measurements).filter(([key, value]) => {
                                if (!value || value.toString().trim() === '') return false;
                                if (renderedKeys.has(key)) return false;
                                if (skipFields.has(key)) return false;
                                renderedKeys.add(key);
                                return true;
                              });

                              if (entries.length === 0) return null;

                              return (
                                <div key={instance.id} className="bg-sidebar-muted/30 rounded px-2 py-1 border border-sidebar-muted/50">
                                  <div className="text-[10px] text-sidebar-foreground opacity-90 flex flex-wrap gap-x-2">
                                    {entries.map(([key, value]) => {
                                      const label = summaryFields[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                                      return (
                                        <span key={key}>{label}: {value}</span>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
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
      <div className="p-4 border-t border-border/20 bg-sidebar-background space-y-3 relative rounded-b-xl">
        {/* AI Model Selection with Dropdowns */}
        <div>
          <h3 className="text-xs font-medium mb-2 text-sidebar-foreground opacity-70">
            Modelo de IA:
          </h3>
          <div className="flex flex-col gap-1.5">
            {/* Gemini Button with Dropdown */}
            <div className="flex-1 relative z-[55]" ref={geminiMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedModel('gemini');
                  setActiveMenu('gemini');
                }}
                className={cn(
                  "w-full px-3 py-1.5 text-xs rounded-md font-medium transition-all flex items-center justify-between gap-1",
                  selectedModel === 'gemini'
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-sidebar-muted text-sidebar-foreground opacity-70 border border-white/10 hover:opacity-100"
                )}
              >
                <span className="truncate">
                  {GEMINI_MODELS.find(m => m.id === selectedGeminiModel)?.name || 'Gemini'}
                </span>
                <CaretDown size={12} className={cn("transition-transform", activeMenu === 'gemini' && "rotate-180")} />
              </button>

              {/* Gemini Dropdown */}
              {activeMenu === 'gemini' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-full left-0 right-0 mb-1 bg-sidebar-background border border-border/20 rounded-md shadow-lg overflow-hidden z-[60]"
                  data-custom-dropdown="open">
                  {GEMINI_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedGeminiModel(model.id);
                        setSelectedModel('gemini');
                        setActiveMenu(null);
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-xs hover:bg-sidebar-muted transition-colors",
                        selectedGeminiModel === model.id && "bg-accent/10"
                      )}
                    >
                      <div className="font-medium text-sidebar-foreground">{model.name}</div>
                      <div className="text-[10px] text-sidebar-foreground opacity-60">{model.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* OpenAI Button with Dropdown */}
            <div className="flex-1 relative z-[55]" ref={openaiMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedModel('openai');
                  setActiveMenu('openai');
                }}
                className={cn(
                  "w-full px-3 py-1.5 text-xs rounded-md font-medium transition-all flex items-center justify-between gap-1",
                  selectedModel === 'openai'
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-sidebar-muted text-sidebar-foreground opacity-70 border border-white/10 hover:opacity-100"
                )}
              >
                <span className="truncate">
                  {OPENAI_MODELS.find(m => m.id === selectedOpenAIModel)?.name || 'OpenAI'}
                </span>
                <CaretDown size={12} className={cn("transition-transform", activeMenu === 'openai' && "rotate-180")} />
              </button>

              {/* OpenAI Dropdown */}
              {activeMenu === 'openai' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-full left-0 right-0 mb-1 bg-sidebar-background border border-border/20 rounded-md shadow-lg overflow-hidden z-[60]"
                  data-custom-dropdown="open">
                  {OPENAI_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedOpenAIModel(model.id);
                        setSelectedModel('openai');
                        setActiveMenu(null);
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-xs hover:bg-sidebar-muted transition-colors",
                        selectedOpenAIModel === model.id && "bg-accent/10"
                      )}
                    >
                      <div className="font-medium text-sidebar-foreground">{model.name}</div>
                      <div className="text-[10px] text-sidebar-foreground opacity-60">{model.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Claude Button with Dropdown */}
            <div className="flex-1 relative z-[55]" ref={claudeMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedModel('claude');
                  setActiveMenu('claude');
                }}
                className={cn(
                  "w-full px-3 py-1.5 text-xs rounded-md font-medium transition-all flex items-center justify-between gap-1",
                  selectedModel === 'claude'
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-sidebar-muted text-sidebar-foreground opacity-70 border border-white/10 hover:opacity-100"
                )}
              >
                <span className="truncate">
                  {CLAUDE_MODELS.find(m => m.id === selectedClaudeModel)?.name || 'Claude'}
                </span>
                <CaretDown size={12} className={cn("transition-transform", activeMenu === 'claude' && "rotate-180")} />
              </button>

              {/* Claude Dropdown */}
              {activeMenu === 'claude' && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-full left-0 right-0 mb-1 bg-sidebar-background border border-border/20 rounded-md shadow-lg overflow-hidden z-[60]"
                  data-custom-dropdown="open">
                  {CLAUDE_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedClaudeModel(model.id);
                        setSelectedModel('claude');
                        setActiveMenu(null);
                      }}
                      className={cn(
                        "w-full px-3 py-2 text-left text-xs hover:bg-sidebar-muted transition-colors",
                        selectedClaudeModel === model.id && "bg-accent/10"
                      )}
                    >
                      <div className="font-medium text-sidebar-foreground">{model.name}</div>
                      <div className="text-[10px] text-sidebar-foreground opacity-60">{model.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generate Report Button */}
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className={cn(
            "w-full py-2.5 bg-accent text-accent-foreground text-sm font-medium rounded-md hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md",
            isShaking && "animate-shake"
          )}
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
    </section>
  );
}
