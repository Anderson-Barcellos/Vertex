/**
 * Unified AI Service - Gerencia ambos Gemini e OpenAI de forma unificada
 * Permite troca de provider sem alterar código consumidor
 */

import { geminiStreamService } from './geminiStreamService';
import { openaiStreamService } from './openaiStreamService';
import { claudeStreamService } from './claudeStreamService';
import type { SelectedFinding } from '@/types/report';
import type { AIStatus } from '@/components/original/ReportCanvas';

type AIProvider = 'gemini' | 'openai' | 'claude';

interface StreamCallbacks {
  onChunk?: (text: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

interface ClinicalImpressionData {
  examType?: string;
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  organsCatalog?: any[];
}

/**
 * Serviço unificado para gerenciar chamadas de IA
 */
class UnifiedAIService {
  private currentProvider: AIProvider = 'gemini';
  private statusCallbacks: Set<(status: AIStatus) => void> = new Set();
  private currentAbortController: AbortController | null = null;

  /**
   * Define o provider de IA atual
   */
  setProvider(provider: AIProvider): void {
    this.currentProvider = provider;
  }

  /**
   * Obtém o provider atual
   */
  getProvider(): AIProvider {
    return this.currentProvider;
  }

  /**
   * Registra callback para mudanças de status
   */
  onStatusChange(callback: (status: AIStatus) => void): () => void {
    this.statusCallbacks.add(callback);
    return () => {
      this.statusCallbacks.delete(callback);
    };
  }

  /**
   * Notifica mudança de status
   */
  private notifyStatus(status: AIStatus): void {
    this.statusCallbacks.forEach(callback => callback(status));
  }

  /**
   * Gera impressão clínica com streaming
   */
  async generateClinicalImpression(
    data: ClinicalImpressionData,
    callbacks: StreamCallbacks
  ): Promise<void> {
    try {
      // Cancelar operação anterior se existir
      if (this.currentAbortController) {
        this.currentAbortController.abort();
      }

      this.currentAbortController = new AbortController();
      this.notifyStatus('loading');

      const wrappedCallbacks: StreamCallbacks = {
        onChunk: (text) => {
          this.notifyStatus('streaming');
          callbacks.onChunk?.(text);
        },
        onComplete: (fullText) => {
          this.notifyStatus('completed');
          callbacks.onComplete?.(fullText);
          this.currentAbortController = null;
        },
        onError: (error) => {
          this.notifyStatus('error');
          callbacks.onError?.(error);
          this.currentAbortController = null;
        }
      };

      if (this.currentProvider === 'openai') {
        if (!openaiStreamService.isConfigured()) {
          throw new Error('OpenAI não está configurado. Configure VITE_OPENAI_API_KEY.');
        }
        await openaiStreamService.generateClinicalImpressionStream(data, wrappedCallbacks, this.currentAbortController.signal);
      } else if (this.currentProvider === 'claude') {
        if (!claudeStreamService.isConfigured()) {
          throw new Error('Claude não está configurado. Configure VITE_CLAUDE_API_URL.');
        }
        await claudeStreamService.generateClinicalImpressionStream(data, wrappedCallbacks, this.currentAbortController.signal);
      } else {
        if (!geminiStreamService.isConfigured()) {
          throw new Error('Gemini não está configurado. Configure VITE_GEMINI_API_URL.');
        }
        await geminiStreamService.generateClinicalImpressionStream(data, wrappedCallbacks, this.currentAbortController.signal);
      }
    } catch (error: any) {
      this.notifyStatus('error');
      const errorObj = error instanceof Error ? error : new Error(error?.message || 'Erro ao gerar impressão clínica');
      callbacks.onError?.(errorObj);
    }
  }

  /**
   * Cancela geração de impressão clínica em andamento
   */
  cancelClinicalImpression(): void {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
      this.notifyStatus('idle');
    }
  }

  /**
   * Cancela todas as operações
   */
  cancelAllOperations(): void {
    this.cancelClinicalImpression();
  }

  /**
   * Limpa recursos
   */
  cleanup(): void {
    this.cancelAllOperations();
    this.statusCallbacks.clear();
  }

  /**
   * Verifica se o provider atual está configurado
   */
  isConfigured(): boolean {
    if (this.currentProvider === 'openai') {
      return openaiStreamService.isConfigured();
    }
    if (this.currentProvider === 'claude') {
      return claudeStreamService.isConfigured();
    }
    return geminiStreamService.isConfigured();
  }

  /**
   * Testa conexão com o provider atual
   */
  async testConnection(): Promise<boolean> {
    try {
      if (this.currentProvider === 'openai') {
        return await openaiStreamService.testConnection();
      }
      if (this.currentProvider === 'claude') {
        return await claudeStreamService.testConnection();
      }
      return await geminiStreamService.testConnection();
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      return false;
    }
  }
}

// Singleton instance
export const unifiedAIService = new UnifiedAIService();

export default unifiedAIService;
