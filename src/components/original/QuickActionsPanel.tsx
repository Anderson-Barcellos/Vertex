import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, ArrowCounterClockwise, Copy, Robot, Timer, Lightning } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { AIProvider } from '@/types/report';

interface QuickActionsPanelProps {
  className?: string;
  organsList: Array<{ id: string; name: string }>;
  selectedFindingsCount: number;
  normalOrgansCount: number;
  generatedReport: string;
  isGenerating: boolean;
  currentAiModel: AIProvider;
  currentModelId: string;
  onSetAllNormal: () => void;
  onResetExam: () => void;
}

const providerConfig: Record<AIProvider, { label: string; color: string }> = {
  gemini: { label: 'Gemini', color: 'text-blue-400' },
  openai: { label: 'OpenAI', color: 'text-emerald-400' },
  claude: { label: 'Claude', color: 'text-orange-400' }
};

export default function QuickActionsPanel({
  className,
  organsList,
  selectedFindingsCount,
  normalOrgansCount,
  generatedReport,
  isGenerating,
  currentAiModel,
  currentModelId,
  onSetAllNormal,
  onResetExam
}: QuickActionsPanelProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lastGenerationTime, setLastGenerationTime] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isGenerating) {
      startTimeRef.current = Date.now();
      setElapsedTime(0);
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 100) / 10);
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (startTimeRef.current && elapsedTime > 0) {
        setLastGenerationTime(elapsedTime);
      }
      startTimeRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isGenerating]);

  const handleCopyReport = async () => {
    if (!generatedReport) {
      toast.error('Nenhum laudo para copiar');
      return;
    }
    try {
      await navigator.clipboard.writeText(generatedReport);
      toast.success('Laudo copiado!');
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  const handleSetAllNormal = () => {
    onSetAllNormal();
    toast.success('Todos órgãos marcados como normais');
  };

  const handleResetExam = () => {
    onResetExam();
    setLastGenerationTime(null);
    toast.success('Exame resetado');
  };

  const totalOrgans = organsList.length;
  const evaluatedOrgans = normalOrgansCount + (selectedFindingsCount > 0 ? new Set().size : 0);
  const progressPercent = totalOrgans > 0 ? Math.round(((normalOrgansCount + selectedFindingsCount) / totalOrgans) * 100) : 0;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins}m ${secs}s`;
  };

  const providerInfo = providerConfig[currentAiModel];

  return (
    <section
      aria-labelledby="quick-actions"
      className={cn(
        'w-56 md:w-64 lg:w-72 xl:w-80 bg-sidebar-background/95 backdrop-blur-sm rounded-xl shadow-xl border border-border/20 overflow-hidden transition-all duration-300',
        className
      )}
    >
      <div className="p-4 border-b border-border/20 bg-sidebar-background">
        <div className="flex items-center gap-2 text-sidebar-foreground">
          <Lightning size={18} />
          <h2 id="quick-actions" className="text-sm font-semibold">Ações Rápidas</h2>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={handleSetAllNormal}
            disabled={isGenerating}
            className="flex items-center gap-3 w-full px-3 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle size={18} weight="bold" />
            <span>Todos Normais</span>
          </button>

          <button
            onClick={handleResetExam}
            disabled={isGenerating}
            className="flex items-center gap-3 w-full px-3 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowCounterClockwise size={18} weight="bold" />
            <span>Resetar Exame</span>
          </button>

          <button
            onClick={handleCopyReport}
            disabled={!generatedReport || isGenerating}
            className="flex items-center gap-3 w-full px-3 py-2.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-lg text-sky-400 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy size={18} weight="bold" />
            <span>Copiar Laudo</span>
          </button>
        </div>

        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Robot size={18} className={providerInfo.color} />
              <span className="text-xs text-sidebar-foreground/70">Modelo IA</span>
            </div>
            <div className={cn(
              'w-2 h-2 rounded-full',
              isGenerating ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'
            )} />
          </div>
          <p className={cn('mt-1 text-sm font-semibold', providerInfo.color)}>
            {providerInfo.label}
          </p>
          <p className="text-[11px] text-sidebar-foreground/50 truncate">
            {currentModelId}
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Timer size={18} className="text-sky-300" />
            <span className="text-xs text-sidebar-foreground/70">Tempo de Geração</span>
          </div>
          
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <p className="text-lg font-mono font-bold text-yellow-400">
                {formatTime(elapsedTime)}
              </p>
            </div>
          ) : lastGenerationTime ? (
            <p className="text-lg font-mono font-semibold text-sidebar-foreground">
              {formatTime(lastGenerationTime)}
            </p>
          ) : (
            <p className="text-sm text-sidebar-foreground/50">—</p>
          )}
        </div>

        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
          <div className="flex items-center justify-between text-xs text-sidebar-foreground/70 mb-2">
            <span>Progresso</span>
            <span>{selectedFindingsCount} achados · {normalOrgansCount} normais</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-500"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
