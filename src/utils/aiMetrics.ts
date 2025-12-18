import type { AIProvider } from '@/types/report';

const parseCost = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const COST_TABLE: Record<AIProvider, { inputPer1K: number; outputPer1K: number }> = {
  openai: {
    inputPer1K: parseCost(import.meta.env.VITE_OPENAI_INPUT_COST_PER_1K, 0.005),
    outputPer1K: parseCost(import.meta.env.VITE_OPENAI_OUTPUT_COST_PER_1K, 0.015)
  },
  gemini: {
    inputPer1K: parseCost(import.meta.env.VITE_GEMINI_INPUT_COST_PER_1K, 0.007),
    outputPer1K: parseCost(import.meta.env.VITE_GEMINI_OUTPUT_COST_PER_1K, 0.021)
  },
  claude: {
    inputPer1K: parseCost(import.meta.env.VITE_CLAUDE_INPUT_COST_PER_1K, 0.003),
    outputPer1K: parseCost(import.meta.env.VITE_CLAUDE_OUTPUT_COST_PER_1K, 0.015)
  }
};

/**
 * Estima tokens a partir do comprimento do texto usando média de 4 caracteres/token.
 * Não é perfeito, mas dá uma noção rápida mesmo sem retorno oficial do provedor.
 */
export const estimateTokensFromText = (text: string | undefined | null): number => {
  if (!text) return 0;
  const normalized = text.trim();
  if (!normalized) return 0;
  return Math.max(1, Math.ceil(normalized.length / 4));
};

export const estimateCostUsd = (
  provider: AIProvider,
  promptTokens: number,
  completionTokens: number
): number => {
  const cost = COST_TABLE[provider];
  const promptCost = (promptTokens / 1000) * cost.inputPer1K;
  const completionCost = (completionTokens / 1000) * cost.outputPer1K;
  return Number((promptCost + completionCost).toFixed(4));
};

export const formatDuration = (durationMs?: number): string => {
  if (!durationMs || durationMs <= 0) return '—';
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (minutes === 0) return `${remainder}s`;
  return `${minutes}m ${remainder.toString().padStart(2, '0')}s`;
};

export const formatCost = (value?: number): string => {
  if (value === undefined || Number.isNaN(value)) return '—';
  if (value < 0.01) return `$${value.toFixed(3)}`;
  return `$${value.toFixed(2)}`;
};
