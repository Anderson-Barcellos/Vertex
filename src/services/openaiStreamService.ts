// OpenAI Streaming Integration via backend proxy
import type { SelectedFinding } from '@/types/report';
import { buildReportPrompt } from './promptBuilder';

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
  import.meta.env.VITE_OPENAI_MODEL || 'gpt-5';

function getSelectedOpenAIModel(): string {
  try {
    const fromSession = typeof window !== 'undefined' ? sessionStorage.getItem('selectedAIModel') : null;
    return fromSession || OPENAI_MODEL;
  } catch {
    return OPENAI_MODEL;
  }
}

/**
 * Classe para gerenciar streaming do OpenAI via backend
 */
export class OpenAIStreamService {
  /**
   * Verifica se a API está configurada
   */
  isConfigured(): boolean {
    return Boolean(OPENAI_API_ENDPOINT);
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
    },
    callbacks: StreamCallbacks
  ): Promise<void> {
    try {
      const prompt = buildReportPrompt(data);
      await this.streamFromBackend(prompt, callbacks);
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
    callbacks: StreamCallbacks
  ): Promise<void> {
    const requestUrl = createRequestUrl();
    const selectedModel = getSelectedOpenAIModel();

    const payload = {
      model: selectedModel,
      input: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };

    console.log('[OpenAIStreamService] Usando modelo:', selectedModel);
    console.log('[OpenAIStreamService] Request URL:', requestUrl);
    console.log('[OpenAIStreamService] Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log('[OpenAIStreamService] Response status:', response.status);
    console.log('[OpenAIStreamService] Response OK?:', response.ok);
    console.log('[OpenAIStreamService] Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('[OpenAIStreamService] Response body exists?:', !!response.body);
    console.log('[OpenAIStreamService] Response bodyUsed?:', response.bodyUsed);

    if (!response.ok) {
      const message = await response.text().catch(() => '');
      console.error('[OpenAIStreamService] Error response:', message);
      throw new Error(`OpenAI backend error: ${response.status} ${message}`);
    }

    // Clone response pra debug sem consumir o body
    const clonedResponse = response.clone();
    
    // Tentar ler os primeiros bytes pra debug
    try {
      const reader = clonedResponse.body?.getReader();
      if (reader) {
        const { value, done } = await reader.read();
        if (!done && value) {
          const decoder = new TextDecoder();
          const preview = decoder.decode(value.slice(0, 200));
          console.log('[OpenAIStreamService] Preview dos primeiros bytes:', preview);
        } else {
          console.log('[OpenAIStreamService] Stream vazio ou já concluído');
        }
        reader.releaseLock();
      }
    } catch (e) {
      console.error('[OpenAIStreamService] Erro ao ler preview:', e);
    }

    const fullText = await readStream(response, callbacks);
    console.log('[OpenAIStreamService] fullText recebido, length:', fullText.length);
    console.log('[OpenAIStreamService] fullText preview:', fullText.substring(0, 200));
    callbacks.onComplete?.(fullText);
  }

  /**
   * Teste de conexão
   */
  async testConnection(): Promise<boolean> {
    try {
      const url = createRequestUrl();
      const selectedModel = getSelectedOpenAIModel();
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
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
  console.log('[OpenAI readStream] Iniciando leitura do stream');
  console.log('[OpenAI readStream] Content-Type:', response.headers.get('content-type'));
  
  if (!response.body) {
    console.log('[OpenAI readStream] Sem body, lendo como texto');
    const text = await response.text();
    console.log('[OpenAI readStream] Texto recebido:', text.substring(0, 100));
    return text.trim();
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let chunkCount = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      console.log('[OpenAI readStream] Stream concluído. Total chunks:', chunkCount, 'Total chars:', fullText.length);
      break;
    }
    if (value) {
      chunkCount++;
      const chunk = decoder.decode(value, { stream: true });
      console.log(`[OpenAI readStream] Chunk ${chunkCount}:`, chunk.substring(0, 50));
      if (chunk) {
        fullText += chunk;
        // Passa o texto ACUMULADO, não apenas o chunk
        callbacks.onChunk?.(fullText);
      }
    }
  }

  fullText += decoder.decode();
  console.log('[OpenAI readStream] Texto final length:', fullText.length);
  return fullText.trim();
}

// Check API endpoint on load (development only)
if (import.meta.env.DEV) {
  console.log('✅ OpenAI Stream Service configurado para:', OPENAI_API_ENDPOINT);
}
