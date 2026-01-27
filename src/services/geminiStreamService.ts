// Gemini AI Streaming Integration via backend proxy
import type { SelectedFinding } from '@/types/report';
import { buildReportPrompt } from './promptBuilder';

// Types for streaming
export interface StreamCallbacks {
  onChunk?: (text: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

// Use proxy local para evitar CORS
const GEMINI_API_ENDPOINT =
  import.meta.env.VITE_GEMINI_API_URL || '/api/gemini';
export const GEMINI_MODEL =
  import.meta.env.VITE_GEMINI_MODEL || 'gemini-3-pro-preview';

/**
 * Classe para gerenciar streaming do Gemini via backend
 */
export class GeminiStreamService {
  isConfigured(): boolean {
    return Boolean(GEMINI_API_ENDPOINT);
  }

  hasExplicitConfig(): boolean {
    return Boolean(import.meta.env.VITE_GEMINI_API_URL);
  }

  /**
   * Gera impressão clínica com streaming
   */
  async generateClinicalImpressionStream(
    data: {
      examType?: string;
      selectedFindings: SelectedFinding[];
      normalOrgans: string[];
      organsCatalog?: any[];
    },
    callbacks: StreamCallbacks,
    signal?: AbortSignal
  ): Promise<void> {
    try {
      const prompt = buildReportPrompt(data);
      await this.streamFromBackend(prompt, callbacks, undefined, signal);
    } catch (error) {
      console.error('Erro no streaming Gemini:', error);
      callbacks.onError?.(error as Error);
    }
  }

  /**
   * Gera relatório completo com streaming
   */
  async generateFullReportStream(
    data: {
      patientName?: string;
      patientAge?: string;
      examDate?: string;
      examType?: string;
      selectedFindings: SelectedFinding[];
      normalOrgans: string[];
      organsCatalog?: any[];
      specializedPrompt?: string;  // Accept specialized prompt
    },
    callbacks: StreamCallbacks,
    signal?: AbortSignal
  ): Promise<void> {
    try {
      let prompt = `Gere um LAUDO COMPLETO de ${data.examType || 'Ultrassonografia'} com os seguintes dados:\n\n`;

      if (data.patientName) {
        prompt += `PACIENTE: ${data.patientName}\n`;
      }
      if (data.patientAge) {
        prompt += `IDADE: ${data.patientAge}\n`;
      }
      if (data.examDate) {
        prompt += `DATA: ${data.examDate}\n`;
      }

      prompt += '\n' + buildReportPrompt(data);
      prompt += '\nGere um laudo completo e detalhado, incluindo técnica do exame, todos os achados e impressão diagnóstica.';

      await this.streamFromBackend(prompt, callbacks, data.specializedPrompt, signal);
    } catch (error) {
      console.error('Erro ao gerar relatório completo:', error);
      callbacks.onError?.(error as Error);
    }
  }

  private async streamFromBackend(
    prompt: string,
    callbacks: StreamCallbacks,
    specializedPrompt?: string,
    signal?: AbortSignal
  ): Promise<void> {
    const requestUrl = createRequestUrl('');

    // Obter modelo selecionado do sessionStorage
    const selectedModel = sessionStorage.getItem('selectedAIModel') || GEMINI_MODEL;

    if (import.meta.env.DEV) {
      console.log('[Gemini] modelo:', selectedModel);
    }

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: prompt,
        model: selectedModel,
        ...(specializedPrompt && { system_prompt: specializedPrompt })  // Send specialized prompt if provided
      }),
      signal: signal
    });
    if (!response.ok) {
      const message = await response.text().catch(() => '');
      throw new Error(`Gemini backend error: ${response.status} ${message}`);
    }

    const fullText = await readStream(response, callbacks);
    callbacks.onComplete?.(fullText);
  }

  /**
   * Teste de conexão
   */
  async testConnection(): Promise<boolean> {
    try {
      const url = createRequestUrl();
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'Teste de conexão. Responda apenas: OK' })
      });
      return response.ok;
    } catch (error) {
      console.error('❌ Erro ao testar conexão:', error);
      return false;
    }
  }
}

// Singleton instance
export const geminiStreamService = new GeminiStreamService();

function createRequestUrl(_unused?: string): string {
  try {
    if (GEMINI_API_ENDPOINT.startsWith('http')) {
      return GEMINI_API_ENDPOINT;
    }
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    return new URL(GEMINI_API_ENDPOINT, base).toString();
  } catch (error) {
    throw new Error(`Endpoint do Gemini inválido (${GEMINI_API_ENDPOINT}): ${String(error)}`);
  }
}

async function readStream(
  response: Response,
  callbacks: StreamCallbacks
): Promise<string> {
  if (!response.body) {
    return (await response.text()).trim();
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      const chunk = decoder.decode(value, { stream: true });
      if (chunk) {
        fullText += chunk;
        // Passa o texto ACUMULADO, não apenas o chunk
        callbacks.onChunk?.(fullText);
      }
    }
  }

  fullText += decoder.decode();
  return fullText.trim();
}

