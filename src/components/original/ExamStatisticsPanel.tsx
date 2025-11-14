import React, { useMemo } from 'react';
import type { AIGenerationStats, AIProvider } from '@/types/report';
import { Lightning, Timer, Coins, ChartLineUp } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { formatCost, formatDuration } from '@/utils/aiMetrics';

interface ExamStatisticsPanelProps {
  className?: string;
  stats?: AIGenerationStats | null;
  isGenerating?: boolean;
  currentProvider?: AIProvider;
  currentModel?: string;
}

const providerLabel: Record<AIProvider, string> = {
  openai: 'OpenAI',
  gemini: 'Gemini'
};

const statusChip = (status: AIGenerationStats['status'], isGenerating?: boolean) => {
  const effectiveStatus = isGenerating ? 'running' : status;
  switch (effectiveStatus) {
    case 'running':
      return { label: 'Gerando…', className: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/40' };
    case 'completed':
      return { label: 'Pronto', className: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/40' };
    case 'error':
      return { label: 'Erro', className: 'bg-rose-500/10 text-rose-400 border border-rose-500/40' };
    default:
      return { label: 'Ocioso', className: 'bg-slate-500/10 text-slate-300 border border-slate-500/30' };
  }
};

const numberFormatter = new Intl.NumberFormat('pt-BR');

export default function ExamStatisticsPanel({
  className,
  stats,
  isGenerating,
  currentProvider = 'gemini',
  currentModel
}: ExamStatisticsPanelProps) {
  const resolvedProvider = stats?.provider ?? currentProvider;
  const modelName = stats?.model ?? currentModel ?? (resolvedProvider === 'openai' ? 'GPT' : 'Gemini');
  const resolvedStatus = stats?.status ?? 'idle';
  const chip = useMemo(() => statusChip(resolvedStatus, isGenerating), [resolvedStatus, isGenerating]);

  const promptTokens = stats?.promptTokens ?? 0;
  const completionTokens = stats?.completionTokens ?? 0;
  const totalTokens = stats?.totalTokens ?? (promptTokens + completionTokens || undefined);
  const estimatedCost = stats?.estimatedCostUsd;
  const durationLabel = isGenerating ? 'streaming…' : formatDuration(stats?.durationMs);
  const finishedAt = stats?.finishedAt
    ? new Date(stats.finishedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : '—';
  const chunkLabel = stats?.chunkCount ? `${stats.chunkCount} pacotes` : '—';
  const outputCharsLabel = stats?.outputChars ? `${numberFormatter.format(stats.outputChars)} chars` : '—';

  return (
    <section
      aria-labelledby="estatisticas-ia"
      className={cn(
        'w-56 md:w-64 lg:w-72 xl:w-80 bg-sidebar-background/95 backdrop-blur-sm rounded-xl shadow-xl border border-border/20 overflow-hidden transition-all duration-300',
        className
      )}
    >
      <div className="p-4 border-b border-border/20 bg-sidebar-background">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sidebar-foreground">
              <Lightning size={18} />
              <h2 id="estatisticas-ia" className="text-sm font-semibold">Estatísticas da IA</h2>
            </div>
            <p className="mt-1 text-[11px] text-sidebar-foreground/70">
              Último run: {finishedAt}
            </p>
          </div>
          <span className={cn('px-2 py-0.5 text-[11px] rounded-full font-semibold uppercase tracking-wider', chip.className)}>
            {chip.label}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
          <div className="flex items-center justify-between text-xs text-sidebar-foreground/80">
            <span>Modelo</span>
            <span>{providerLabel[resolvedProvider]}</span>
          </div>
          <p className="mt-1 text-base font-semibold text-sidebar-foreground">{modelName}</p>
        </div>

        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
          <div className="flex items-center justify-between text-xs text-sidebar-foreground/70">
            <span>Tokens (in/out)</span>
            <ChartLineUp size={16} className="text-sidebar-accent" />
          </div>
          <p className="mt-1 text-sm text-sidebar-foreground">
            {promptTokens ? numberFormatter.format(promptTokens) : '—'}
            <span className="opacity-60"> / </span>
            {completionTokens ? numberFormatter.format(completionTokens) : '—'}
          </p>
          <p className="text-[11px] text-sidebar-foreground/60">Total: {totalTokens ? numberFormatter.format(totalTokens) : '—'} tokens</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/5">
            <div>
              <p className="text-xs text-sidebar-foreground/70">Custo estimado</p>
              <p className="text-lg font-semibold text-sidebar-foreground">{formatCost(estimatedCost)}</p>
            </div>
            <Coins size={20} className="text-amber-300" />
          </div>
          <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/5">
            <div>
              <p className="text-xs text-sidebar-foreground/70">Tempo de geração</p>
              <p className="text-lg font-semibold text-sidebar-foreground">{durationLabel}</p>
            </div>
            <Timer size={20} className="text-sky-300" />
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-3 border border-white/5">
          <p className="text-xs text-sidebar-foreground/70">Fluxo</p>
          <div className="mt-2 flex items-center justify-between text-sm text-sidebar-foreground">
            <span>{chunkLabel}</span>
            <span>{outputCharsLabel}</span>
          </div>
          {stats?.errorMessage && (
            <p className="mt-2 text-[11px] text-rose-400">{stats.errorMessage}</p>
          )}
        </div>
      </div>
    </section>
  );
}
