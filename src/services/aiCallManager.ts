// AI Call Manager - Prevents duplicate calls and manages AI processing state
import type { SelectedFinding } from '@/types/report';

export type AIStatus = 'idle' | 'loading' | 'streaming' | 'completed' | 'error';
export type AICallType = 'impression' | 'fullReport';
export type AIProvider = 'gemini' | 'openai';

export interface AICallData {
  examType: string;
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  organsCatalog?: any[];
}

export interface AIStreamCallbacks {
  onChunk?: (text: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: AIStatus) => void;
}

interface ActiveCall {
  id: string;
  type: AICallType;
  provider: AIProvider;
  controller: AbortController;
  promise: Promise<void>;
  timestamp: number;
}

/**
 * Singleton class to manage AI calls and prevent duplicates
 */
export class AICallManager {
  private static instance: AICallManager;
  private activeCalls: Map<string, ActiveCall> = new Map();
  private callHistory: Map<string, number> = new Map();
  private currentStatus: AIStatus = 'idle';
  private statusCallbacks: Set<(status: AIStatus) => void> = new Set();

  // Debounce settings
  private readonly DEBOUNCE_DELAY = 600; // ms
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  /**
   * Subscribe to status changes
   */
  public onStatusChange(callback: (status: AIStatus) => void): () => void {
    this.statusCallbacks.add(callback);
    return () => this.statusCallbacks.delete(callback);
  }

  /**
   * Update status and notify all subscribers
   */
  private updateStatus(status: AIStatus): void {
    if (this.currentStatus !== status) {
      this.currentStatus = status;
      this.statusCallbacks.forEach(callback => {
        try {
          callback(status);
        } catch (error) {
          console.error('Error in status callback:', error);
        }
      });
    }
  }

  /**
   * Get current status
   */
  public getStatus(): AIStatus {
    return this.currentStatus;
  }

  static getInstance(): AICallManager {
    if (!AICallManager.instance) {
      AICallManager.instance = new AICallManager();
    }
    return AICallManager.instance;
  }

  /**
   * Generate a unique call ID based on the data and call type
   */
  private generateCallId(type: AICallType, data: AICallData, provider: AIProvider): string {
    const dataHash = JSON.stringify({
      type,
      provider,
      examType: data.examType,
      findings: data.selectedFindings.map(f => ({
        organId: f.organId,
        findingId: f.finding.id,
        severity: f.severity,
        instances: f.instances?.map(i => i.measurements)
      })),
      normalOrgans: data.normalOrgans.sort()
    });

    // Simple hash function for the data
    let hash = 0;
    for (let i = 0; i < dataHash.length; i++) {
      const char = dataHash.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return `${type}-${provider}-${Math.abs(hash).toString(36)}`;
  }

  /**
   * Check if there's an active call for the same data
   */
  private hasActiveCall(callId: string): boolean {
    const activeCall = this.activeCalls.get(callId);
    if (!activeCall) return false;

    // Check if the call is still valid (not older than 30 seconds)
    const isStale = Date.now() - activeCall.timestamp > 30000;
    if (isStale) {
      this.cancelCall(callId);
      return false;
    }

    return true;
  }

  /**
   * Cancel an active call
   */
  public cancelCall(callId: string): void {
    const activeCall = this.activeCalls.get(callId);
    if (activeCall) {
      activeCall.controller.abort();
      this.activeCalls.delete(callId);
    }

    // Clear any pending debounce timer
    const timer = this.debounceTimers.get(callId);
    if (timer) {
      clearTimeout(timer);
      this.debounceTimers.delete(callId);
    }

    // Update status if no more active calls
    if (this.activeCalls.size === 0) {
      this.updateStatus('idle');
    }
  }

  /**
   * Cancel all active calls
   */
  public cancelAllCalls(): void {
    for (const callId of this.activeCalls.keys()) {
      this.cancelCall(callId);
    }
    this.updateStatus('idle');
  }

  /**
   * Cancel calls of a specific type
   */
  public cancelCallsOfType(type: AICallType): void {
    for (const [callId, activeCall] of this.activeCalls.entries()) {
      if (activeCall.type === type) {
        this.cancelCall(callId);
      }
    }
  }

  /**
   * Make an AI call with duplicate prevention and debouncing
   */
  public async makeCall(
    type: AICallType,
    provider: AIProvider,
    data: AICallData,
    aiService: any, // Gemini or OpenAI service
    callbacks: AIStreamCallbacks
  ): Promise<void> {
    const callId = this.generateCallId(type, data, provider);

    // Cancel existing call of the same type if it exists
    this.cancelCallsOfType(type);

    // Check for recent duplicate calls (within last 2 seconds)
    const lastCallTime = this.callHistory.get(callId);
    if (lastCallTime && Date.now() - lastCallTime < 2000) {
      console.log(`Ignoring duplicate AI call: ${callId}`);
      return;
    }

    // Clear any existing debounce timer for this call
    const existingTimer = this.debounceTimers.get(callId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Update status to loading
    this.updateStatus('loading');

    // Set up debounced call
    const timer = setTimeout(async () => {
      try {
        await this.executeCall(callId, type, provider, data, aiService, callbacks);
      } catch (error) {
        console.error('Error in debounced AI call:', error);
        this.updateStatus('error');
        callbacks.onError?.(error as Error);
      } finally {
        this.debounceTimers.delete(callId);
      }
    }, this.DEBOUNCE_DELAY);

    this.debounceTimers.set(callId, timer);
  }

  /**
   * Execute the actual AI call
   */
  private async executeCall(
    callId: string,
    type: AICallType,
    provider: AIProvider,
    data: AICallData,
    aiService: any,
    callbacks: AIStreamCallbacks
  ): Promise<void> {
    // Check if there's already an active call
    if (this.hasActiveCall(callId)) {
      console.log(`Call already in progress: ${callId}`);
      return;
    }

    const controller = new AbortController();
    const timestamp = Date.now();

    // Update status to streaming when call starts
    this.updateStatus('streaming');

    // Enhanced callbacks with abort checking and status management
    const enhancedCallbacks: AIStreamCallbacks = {
      onChunk: (text: string) => {
        if (!controller.signal.aborted) {
          callbacks.onChunk?.(text);
        }
      },
      onComplete: (fullText: string) => {
        this.activeCalls.delete(callId);
        if (!controller.signal.aborted) {
          this.updateStatus('completed');
          callbacks.onComplete?.(fullText);
        }
      },
      onError: (error: Error) => {
        this.activeCalls.delete(callId);
        if (!controller.signal.aborted) {
          this.updateStatus('error');
          callbacks.onError?.(error);
        }
      }
    };

    // Create the promise for the AI call
    let promise: Promise<void>;

    if (type === 'impression') {
      promise = aiService.generateClinicalImpressionStream(data, enhancedCallbacks);
    } else {
      promise = aiService.generateFullReportStream(data, enhancedCallbacks);
    }

    // Register the active call
    const activeCall: ActiveCall = {
      id: callId,
      type,
      provider,
      controller,
      promise,
      timestamp
    };

    this.activeCalls.set(callId, activeCall);
    this.callHistory.set(callId, timestamp);

    try {
      await promise;
    } catch (error) {
      this.activeCalls.delete(callId);
      if (!controller.signal.aborted) {
        throw error;
      }
    }
  }

  /**
   * Get active calls count
   */
  public getActiveCallsCount(): number {
    return this.activeCalls.size;
  }

  /**
   * Get active calls by type
   */
  public getActiveCallsByType(type: AICallType): ActiveCall[] {
    return Array.from(this.activeCalls.values()).filter(call => call.type === type);
  }

  /**
   * Check if there are any active calls
   */
  public hasActiveCalls(): boolean {
    return this.activeCalls.size > 0;
  }

  /**
   * Clean up old call history entries (older than 1 hour)
   */
  public cleanupHistory(): void {
    const oneHourAgo = Date.now() - 3600000;
    for (const [callId, timestamp] of this.callHistory.entries()) {
      if (timestamp < oneHourAgo) {
        this.callHistory.delete(callId);
      }
    }
  }

  /**
   * Get debug information
   */
  public getDebugInfo(): {
    activeCalls: number;
    callHistory: number;
    debounceTimers: number;
  } {
    return {
      activeCalls: this.activeCalls.size,
      callHistory: this.callHistory.size,
      debounceTimers: this.debounceTimers.size
    };
  }
}

// Export singleton instance
export const aiCallManager = AICallManager.getInstance();

// Cleanup old history every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    aiCallManager.cleanupHistory();
  }, 600000);

  // Additional cleanup on window beforeunload
  window.addEventListener('beforeunload', () => {
    aiCallManager.cancelAllCalls();
  });
}