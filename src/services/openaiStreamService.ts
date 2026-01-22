// OpenAI Streaming Integration via backend proxy
import type { SelectedFinding } from '@/types/report';
import { buildReportPrompt } from './promptBuilder';
import { AI_MODELS } from '@/components/shared/AIModelSelector';

// Types for streaming
export interface StreamCallbacks {
  onChunk?: (text: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

// Use proxy local para evitar CORS
const OPENAI_API_ENDPOINT =
  import.meta.env.VITE_OPENAI_API_URL || '/api/openai';
export const OPENAI_MODEL =
  import.meta.env.VITE_OPENAI_MODEL || 'gpt-5.2';

interface ModelInfo {
  modelId: string;
  reasoning?: 'none' | 'low' | 'medium' | 'high';
}

function getSelectedOpenAIModel(): ModelInfo {
  try {
    const fromSession = typeof window !== 'undefined' ? sessionStorage.getItem('selectedAIModel') : null;
    const selectedId = fromSession || OPENAI_MODEL;
    
    const modelConfig = AI_MODELS.openai.find(m => m.id === selectedId);
    
    let actualModelId = selectedId;
    if (selectedId === 'gpt-5.2-instant' || selectedId === 'gpt-5.2-medium') {
      actualModelId = 'gpt-5.2';
    }
    
    return {
      modelId: actualModelId,
      reasoning: modelConfig?.reasoning
    };
  } catch {
    return { modelId: OPENAI_MODEL };
  }
}

/**
 * Classe para gerenciar streaming do OpenAI via backend
 */
export class OpenAIStreamService {
  isConfigured(): boolean {
    return Boolean(OPENAI_API_ENDPOINT);
  }

  hasExplicitConfig(): boolean {
    return Boolean(import.meta.env.VITE_OPENAI_API_URL);
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
    callbacks: StreamCallbacks
  ): Promise<void> {
    try {
      const prompt = buildReportPrompt(data);
      await this.streamFromBackend(prompt, callbacks);
    } catch (error) {
      console.error('Erro no streaming OpenAI:', error);
      callbacks.onError?.(error as Error);
    }
  }

  /**
   * Gera relatório completo com streaming
   */
  async generateFullReportStream(
    data: {
      examType?: string;
      selectedFindings: SelectedFinding[];
      normalOrgans: string[];
      organsCatalog?: any[];
      specializedPrompt?: string;  // Accept specialized prompt
    },
    callbacks: StreamCallbacks
  ): Promise<void> {
    try {
      const prompt = buildReportPrompt(data);
      await this.streamFromBackend(prompt, callbacks, data.specializedPrompt);
    } catch (error) {
      console.error('Erro ao gerar relatório completo:', error);
      callbacks.onError?.(error as Error);
    }
  }

  /**
   * Faz streaming do backend OpenAI
   */
  private async streamFromBackend(
    prompt: string,
    callbacks: StreamCallbacks,
    specializedPrompt?: string
  ): Promise<void> {
    const requestUrl = createRequestUrl();
    const { modelId, reasoning } = getSelectedOpenAIModel();

    const payload: Record<string, unknown> = {
      model: modelId,
      input: [
        {
          role: 'user',
          content: prompt
        }
      ],
      ...(specializedPrompt && { system_prompt: specializedPrompt })  // Send specialized prompt if provided
    };
    
    if (reasoning) {
      payload.reasoning = reasoning;
    }

    if (import.meta.env.DEV) {
      console.log('[OpenAI] modelo:', modelId, reasoning ? `(reasoning: ${reasoning})` : '');
    }

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });


    if (!response.ok) {
      const message = await response.text().catch(() => '');
      console.error('[OpenAIStreamService] Error response:', message);
      throw new Error(`OpenAI backend error: ${response.status} ${message}`);
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
      const { modelId } = getSelectedOpenAIModel();
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelId,
          messages: [
            { role: 'user', content: 'Teste de conexão. Responda apenas: OK' }
          ],
          max_completion_tokens: 10,
          stream: false
        })
      });
      return response.ok;
    } catch (error) {
      console.error('❌ Erro ao testar conexão:', error);
      return false;
    }
  }
}

// Singleton instance
export const openaiStreamService = new OpenAIStreamService();

function createRequestUrl(): string {
  try {
    if (OPENAI_API_ENDPOINT.startsWith('http')) {
      return OPENAI_API_ENDPOINT;
    }
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    return new URL(OPENAI_API_ENDPOINT, base).toString();
  } catch (error) {
    throw new Error(`Endpoint do OpenAI inválido (${OPENAI_API_ENDPOINT}): ${String(error)}`);
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
        callbacks.onChunk?.(fullText);
      }
    }
  }

  fullText += decoder.decode();
  return fullText.trim();
}

// Check API endpoint on load (development only)
if (import.meta.env.DEV) {
  console.log('✅ OpenAI Stream Service configurado para:', OPENAI_API_ENDPOINT);
}
