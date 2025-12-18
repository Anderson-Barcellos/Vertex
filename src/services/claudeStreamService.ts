import type { SelectedFinding } from '@/types/report';
import { buildReportPrompt } from './promptBuilder';

export interface StreamCallbacks {
  onChunk?: (text: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

const CLAUDE_API_ENDPOINT =
  import.meta.env.VITE_CLAUDE_API_URL || '/api/claude';
export const CLAUDE_MODEL =
  import.meta.env.VITE_CLAUDE_MODEL || 'claude-sonnet-4-5';

function getSelectedClaudeModel(): string {
  try {
    const fromSession = typeof window !== 'undefined' ? sessionStorage.getItem('selectedAIModel') : null;
    return fromSession || CLAUDE_MODEL;
  } catch {
    return CLAUDE_MODEL;
  }
}

export class ClaudeStreamService {
  isConfigured(): boolean {
    return Boolean(CLAUDE_API_ENDPOINT);
  }

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
      console.error('Erro no streaming Claude:', error);
      callbacks.onError?.(error as Error);
    }
  }

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

  private async streamFromBackend(
    prompt: string,
    callbacks: StreamCallbacks
  ): Promise<void> {
    const requestUrl = createRequestUrl();
    const selectedModel = getSelectedClaudeModel();

    const payload = {
      model: selectedModel,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000
    };

    console.log('[ClaudeStreamService] Usando modelo:', selectedModel);
    console.log('[ClaudeStreamService] Request URL:', requestUrl);

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const message = await response.text().catch(() => '');
      console.error('[ClaudeStreamService] Error response:', message);
      throw new Error(`Claude backend error: ${response.status} ${message}`);
    }

    const fullText = await readStream(response, callbacks);
    callbacks.onComplete?.(fullText);
  }

  async testConnection(): Promise<boolean> {
    try {
      const url = createRequestUrl();
      const selectedModel = getSelectedClaudeModel();
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'user', content: 'Teste de conexão. Responda apenas: OK' }
          ],
          max_tokens: 10
        })
      });
      return response.ok;
    } catch (error) {
      console.error('❌ Erro ao testar conexão:', error);
      return false;
    }
  }
}

export const claudeStreamService = new ClaudeStreamService();

function createRequestUrl(): string {
  try {
    if (CLAUDE_API_ENDPOINT.startsWith('http')) {
      return CLAUDE_API_ENDPOINT;
    }
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    return new URL(CLAUDE_API_ENDPOINT, base).toString();
  } catch (error) {
    throw new Error(`Endpoint do Claude inválido (${CLAUDE_API_ENDPOINT}): ${String(error)}`);
  }
}

async function readStream(
  response: Response,
  callbacks: StreamCallbacks
): Promise<string> {
  if (!response.body) {
    const text = await response.text();
    return text.trim();
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

if (import.meta.env.DEV) {
  console.log('✅ Claude Stream Service configurado para:', CLAUDE_API_ENDPOINT);
}
