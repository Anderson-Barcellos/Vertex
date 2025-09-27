// Unified AI Service - Provides consistent interface for both Gemini and OpenAI
import { geminiStreamService } from './geminiStreamService';
import { openaiStreamService } from './openaiStreamService';
import { aiCallManager, type AICallData, type AIStreamCallbacks, type AIProvider } from './aiCallManager';
import type { SelectedFinding } from '@/types/report';

export type AIModel = 'gemini' | 'openai';

export interface AIStatus {
  isProcessing: boolean;
  isStreaming: boolean;
  isComplete: boolean;
  hasError: boolean;
  errorMessage?: string;
  currentModel?: AIModel;
  activeCallsCount: number;
}

export interface AICallOptions {
  signal?: AbortSignal;
  timeout?: number;
}

export interface EnhancedAICallbacks extends AIStreamCallbacks {
  onStatusChange?: (status: AIStatus) => void;
}

/**
 * Unified AI Service that manages both Gemini and OpenAI integrations
 */
export class UnifiedAIService {
  private currentModel: AIModel = 'gemini';
  private currentStatus: AIStatus = {
    isProcessing: false,
    isStreaming: false,
    isComplete: false,
    hasError: false,
    activeCallsCount: 0
  };

  private statusCallbacks: Set<(status: AIStatus) => void> = new Set();

  constructor() {
    // Set initial model based on availability
    this.detectBestAvailableModel();
  }

  /**
   * Detect the best available AI model
   */
  private detectBestAvailableModel(): void {
    if (geminiStreamService.isConfigured()) {
      this.currentModel = 'gemini';
    } else if (openaiStreamService.isConfigured()) {
      this.currentModel = 'openai';
    } else {
      console.warn('No AI services are configured');
    }
  }

  /**
   * Set the current AI model
   */
  public setModel(model: AIModel): void {
    const service = this.getService(model);
    if (!service?.isConfigured()) {
      throw new Error(`AI model ${model} is not configured`);
    }
    this.currentModel = model;
    this.updateStatus({ currentModel: model });
  }

  /**
   * Get the current AI model
   */
  public getCurrentModel(): AIModel {
    return this.currentModel;
  }

  /**
   * Check if any AI service is available
   */
  public isAvailable(): boolean {
    return geminiStreamService.isConfigured() || openaiStreamService.isConfigured();
  }

  /**
   * Get list of available models
   */
  public getAvailableModels(): AIModel[] {
    const models: AIModel[] = [];
    if (geminiStreamService.isConfigured()) models.push('gemini');
    if (openaiStreamService.isConfigured()) models.push('openai');
    return models;
  }

  /**
   * Get the service for a specific model
   */
  private getService(model: AIModel) {
    switch (model) {
      case 'gemini':
        return geminiStreamService;
      case 'openai':
        return openaiStreamService;
      default:
        throw new Error(`Unknown AI model: ${model}`);
    }
  }

  /**
   * Subscribe to status changes
   */
  public onStatusChange(callback: (status: AIStatus) => void): () => void {
    this.statusCallbacks.add(callback);
    // Send current status immediately
    callback(this.currentStatus);

    // Return unsubscribe function
    return () => {
      this.statusCallbacks.delete(callback);
    };
  }

  /**
   * Update status and notify subscribers
   */
  private updateStatus(updates: Partial<AIStatus>): void {
    this.currentStatus = {
      ...this.currentStatus,
      ...updates,
      activeCallsCount: aiCallManager.getActiveCallsCount()
    };

    for (const callback of this.statusCallbacks) {
      callback(this.currentStatus);
    }
  }

  /**
   * Generate clinical impression with streaming
   */
  public async generateClinicalImpression(
    data: {
      examType?: string;
      selectedFindings: SelectedFinding[];
      normalOrgans: string[];
      organsCatalog?: any[];
    },
    callbacks: EnhancedAICallbacks,
    options: AICallOptions = {}
  ): Promise<void> {
    const service = this.getService(this.currentModel);
    if (!service?.isConfigured()) {
      const error = new Error(`AI model ${this.currentModel} is not configured`);
      this.updateStatus({
        hasError: true,
        errorMessage: error.message,
        isProcessing: false
      });
      callbacks.onError?.(error);
      return;
    }

    // Update status to processing
    this.updateStatus({
      isProcessing: true,
      isStreaming: false,
      isComplete: false,
      hasError: false,
      errorMessage: undefined
    });

    const aiCallData: AICallData = {
      examType: data.examType || 'Ultrassonografia Abdominal Total',
      selectedFindings: data.selectedFindings,
      normalOrgans: data.normalOrgans,
      organsCatalog: data.organsCatalog
    };

    const enhancedCallbacks: AIStreamCallbacks = {
      onChunk: (text: string) => {
        if (!options.signal?.aborted) {
          this.updateStatus({ isStreaming: true });
          callbacks.onChunk?.(text);
        }
      },
      onComplete: (fullText: string) => {
        if (!options.signal?.aborted) {
          this.updateStatus({
            isProcessing: false,
            isStreaming: false,
            isComplete: true,
            hasError: false
          });
          callbacks.onComplete?.(fullText);
        }
      },
      onError: (error: Error) => {
        if (!options.signal?.aborted) {
          this.updateStatus({
            isProcessing: false,
            isStreaming: false,
            isComplete: false,
            hasError: true,
            errorMessage: error.message
          });
          callbacks.onError?.(error);
        }
      }
    };

    try {
      await aiCallManager.makeCall(
        'impression',
        this.currentModel,
        aiCallData,
        service,
        enhancedCallbacks
      );
    } catch (error) {
      if (!options.signal?.aborted) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        this.updateStatus({
          isProcessing: false,
          isStreaming: false,
          hasError: true,
          errorMessage: errorMsg
        });
        callbacks.onError?.(error as Error);
      }
    }
  }

  /**
   * Generate full report with streaming
   */
  public async generateFullReport(
    data: {
      patientName?: string;
      patientAge?: string;
      examDate?: string;
      examType?: string;
      selectedFindings: SelectedFinding[];
      normalOrgans: string[];
      organsCatalog?: any[];
    },
    callbacks: EnhancedAICallbacks,
    options: AICallOptions = {}
  ): Promise<void> {
    const service = this.getService(this.currentModel);
    if (!service?.isConfigured()) {
      const error = new Error(`AI model ${this.currentModel} is not configured`);
      this.updateStatus({
        hasError: true,
        errorMessage: error.message,
        isProcessing: false
      });
      callbacks.onError?.(error);
      return;
    }

    // Update status to processing
    this.updateStatus({
      isProcessing: true,
      isStreaming: false,
      isComplete: false,
      hasError: false,
      errorMessage: undefined
    });

    const aiCallData: AICallData = {
      examType: data.examType || 'Ultrassonografia Abdominal Total',
      selectedFindings: data.selectedFindings,
      normalOrgans: data.normalOrgans,
      organsCatalog: data.organsCatalog
    };

    const enhancedCallbacks: AIStreamCallbacks = {
      onChunk: (text: string) => {
        if (!options.signal?.aborted) {
          this.updateStatus({ isStreaming: true });
          callbacks.onChunk?.(text);
        }
      },
      onComplete: (fullText: string) => {
        if (!options.signal?.aborted) {
          this.updateStatus({
            isProcessing: false,
            isStreaming: false,
            isComplete: true,
            hasError: false
          });
          callbacks.onComplete?.(fullText);
        }
      },
      onError: (error: Error) => {
        if (!options.signal?.aborted) {
          this.updateStatus({
            isProcessing: false,
            isStreaming: false,
            isComplete: false,
            hasError: true,
            errorMessage: error.message
          });
          callbacks.onError?.(error);
        }
      }
    };

    try {
      await aiCallManager.makeCall(
        'fullReport',
        this.currentModel,
        aiCallData,
        service,
        enhancedCallbacks
      );
    } catch (error) {
      if (!options.signal?.aborted) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        this.updateStatus({
          isProcessing: false,
          isStreaming: false,
          hasError: true,
          errorMessage: errorMsg
        });
        callbacks.onError?.(error as Error);
      }
    }
  }

  /**
   * Cancel all active calls
   */
  public cancelAllCalls(): void {
    aiCallManager.cancelAllCalls();
    this.updateStatus({
      isProcessing: false,
      isStreaming: false,
      isComplete: false,
      hasError: false,
      errorMessage: undefined
    });
  }

  /**
   * Cancel calls of a specific type
   */
  public cancelImpressionCalls(): void {
    aiCallManager.cancelCallsOfType('impression');
  }

  // Alias for backward compatibility
  public cancelClinicalImpression(): void {
    this.cancelImpressionCalls();
  }

  public cancelReportCalls(): void {
    aiCallManager.cancelCallsOfType('fullReport');
  }

  /**
   * Cleanup all resources
   */
  public cleanup(): void {
    this.cancelAllCalls();
    this.statusCallbacks.clear();
  }

  /**
   * Get current status
   */
  public getStatus(): AIStatus {
    return { ...this.currentStatus };
  }

  /**
   * Test connection for current model
   */
  public async testConnection(): Promise<boolean> {
    const service = this.getService(this.currentModel);
    if (!service?.isConfigured()) {
      return false;
    }

    try {
      return await service.testConnection();
    } catch (error) {
      console.error(`Connection test failed for ${this.currentModel}:`, error);
      return false;
    }
  }

  /**
   * Get debug information
   */
  public getDebugInfo(): {
    currentModel: AIModel;
    status: AIStatus;
    availableModels: AIModel[];
    callManagerInfo: any;
  } {
    return {
      currentModel: this.currentModel,
      status: this.currentStatus,
      availableModels: this.getAvailableModels(),
      callManagerInfo: aiCallManager.getDebugInfo()
    };
  }
}

// Export singleton instance
export const unifiedAIService = new UnifiedAIService();

// Development logging
if (import.meta.env.DEV) {
  const availableModels = unifiedAIService.getAvailableModels();
  if (availableModels.length > 0) {
    console.log(`✅ Unified AI Service configured with: ${availableModels.join(', ')}`);
    console.log(`📡 Current model: ${unifiedAIService.getCurrentModel()}`);
  } else {
    console.warn('⚠️ No AI models are configured');
  }
}