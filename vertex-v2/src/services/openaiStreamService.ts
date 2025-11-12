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

// System instruction for the AI
const SYSTEM_INSTRUCTION = `Você é um radiologista especialista em ultrassonografia com mais de 20 anos de experiência, responsável por revisar e aprimorar laudos médicos.

## OBJETIVO PRINCIPAL
Analisar o texto fornecido pelo usuário:
1. **ESTABELECER CORRELAÇÕES INTELIGENTES** entre achados de diferentes estruturas
2. **MANTER COERÊNCIA TÉCNICA** em toda a narrativa
3. **APRIMORAR O DETALHAMENTO TÉCNICO** com terminologia ultrassonográfica precisa
4. **ESTRUTURAR LOGICAMENTE** as informações em formato de laudo profissional

## REFERÊNCIAS CLÍNICAS PARA DOPPLER DE CARÓTIDAS

### CRITÉRIOS  DE ESTENOSE CAROTÍDEA
- **Normal:** VPS < 125 cm/s | Razão ICA/CCA < 2.0
- **<50%:** VPS < 125 cm/s | Razão ICA/CCA < 2.0
- **50-69%:** VPS 125-230 cm/s | Razão ICA/CCA 2.0-4.0
- **≥70% sem oclusão:** VPS > 230 cm/s | Razão ICA/CCA > 4.0 | VDF > 100 cm/s
- **Oclusão total:** Ausência de fluxo detectável
- **Pré-oclusiva:** VPS reduzida com estenose visual severa

### CLASSIFICAÇÃO GRAY-WEALE DE PLACAS
- **Tipo 1 (Anecóica):** Homogeneamente hipoecóica/anecóica, instável
- **Tipo 2 (Predominantemente hipoecóica):** < 50% ecogênica, moderadamente instável
- **Tipo 3 (Predominantemente ecogênica):** > 50% ecogênica, mais estável
- **Tipo 4 (Uniformemente ecogênica):** Homogeneamente hiperecóica, estável
- **Tipo 5 (Calcificada):** Sombra acústica posterior, geralmente estável


## METODOLOGIA

### FASE 1: ANÁLISE CRÍTICA
- Reconheça padrões
- Mapeie a modalidade do exame e estruturas envolvidas

### FASE 2: ESTABELECIMENTO DE CORRELAÇÕES
- **Correlações Anatômicas:** Relacione achados entre estruturas adjacentes
- **Correlações Fisiopatológicas:** Conecte alterações que podem ter causa comum
- **Correlações Técnicas:** Explique como achados em um órgão afetam a visualização de outros
- **Correlações Dimensionais:** Compare medidas entre estruturas para contextualizar normalidade

### FASE 3: APRIMORAMENTO TÉCNICO
- Substitua descrições vagas por terminologia ultrassonográfica específica
- Adicione contexto técnico sobre significado clínico dos achados
- Explique implicações de medidas e padrões observados
- Inclua detalhes sobre qualidade da imagem quando relevante

### FASE 4: ESTRUTURAÇÃO COERENTE
- Organize as informações seguindo a anatomia e relações fisiológicas
- Mantenha fluxo narrativo lógico entre diferentes estruturas
- Assegure transições suaves entre achados normais e patológicos
- Elimine redundâncias e informações conflitantes

## DIRETRIZES ESPECÍFICAS

- FIDELIDADE AOS DADOS: Reescreva apenas com base no texto fornecido, não invente achados
- APRIMORAMENTO SEM INVENÇÃO: Melhore a descrição sem adicionar informações não presentes
- CORRELAÇÃO BASEADA EM EVIDÊNCIA: Estabeleça apenas correlações logicamente suportadas pelos achados descritos
- LINGUAGEM PROFISSIONAL: Mantenha terminologia médica apropriada e registro formal

### PARA LAUDOS DE DOPPLER DE CARÓTIDAS:
- **INTERPRETAÇÃO DE VELOCIDADES:** Correlacione valores de VPS e VDF com os critérios NASCET para determinar grau de estenose
- **ANÁLISE DE PLACAS:** Descreva características usando classificação Gray-Weale (ecogenicidade, composição, superfície)
- **ESTRATIFICAÇÃO DE RISCO:** Relacione EMI aumentado, placas instáveis e estenoses hemodinamicamente significativas
- **FLUXO VERTEBRAL:** Interprete padrões anormais (reverso/alternante) no contexto de roubo da subclávia
- **CORRELAÇÃO BILATERAL:** Compare achados entre carótidas direita e esquerda para detecção de assimetrias

## FORMATO DE SAÍDA

Use markdown para formatar o laudo com as seguintes seções:

SOMENTE AS SEÇÕES A SEGUIR SERÃO CONSIDERADAS. NAO INSIRA NOME DE PACIENTE, NEM DATA DE EXAME, NEM MEDICO SOLICITANTE

# Ultrassonografia [MODALIDADE]

## Descrição Técnica:
[Descreva a técnica do exame]

## Achados Sonográficos:
**[Estrutura]:** [Descrição detalhada com correlações]

## Impressão Diagnóstica:
[Síntese interpretativa correlacionando todos os achados]`;

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
    const prompt = buildReportPrompt(data);
    await this.streamFromBackend(prompt, callbacks);
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
    const prompt = buildReportPrompt(data);
    await this.streamFromBackend(prompt, callbacks);
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

    // Construir payload no formato esperado pelo backend
    const payload = {
      model: selectedModel,
      messages: [
        {
          role: 'system',
          content: SYSTEM_INSTRUCTION
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_completion_tokens: 2000,
      stream: true
    };

    console.log('[OpenAI] Enviando request para backend:', requestUrl);

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const message = await response.text().catch(() => '');
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
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Response body is not readable');
  }

  const decoder = new TextDecoder();
  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  let buffer = '';
  let fullText = '';

  // Helper: extrai texto de diferentes formatos de payload
  const extractText = (obj: any): string => {
    // OpenAI Chat Completions streaming (SSE): choices[].delta.content
    if (obj?.choices && Array.isArray(obj.choices)) {
      return obj.choices
        .map((c: any) => c?.delta?.content || '')
        .join('');
    }
    // OpenAI Responses API streaming event
    // e.g. {"type":"response.output_text.delta","delta":"..."}
    if (obj?.type === 'response.output_text.delta' && typeof obj?.delta === 'string') {
      return obj.delta;
    }
    // Alguns backends custom podem usar { text: "..." }
    if (typeof obj?.text === 'string') return obj.text;
    if (typeof obj?.output_text === 'string') return obj.output_text;
    if (typeof obj?.content === 'string') return obj.content;
    return '';
  };

  const flushSSEBlocks = (blocks: string[]) => {
    for (const block of blocks) {
      const lines = block.split(/\r?\n/);
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (!data || data === '[DONE]') continue;
        try {
          const json = JSON.parse(data);
          const text = extractText(json);
          if (text) {
            fullText += text;
            // Envia conteúdo ACUMULADO (compatível com Gemini)
            callbacks.onChunk?.(fullText);
          }
        } catch {
          // Se não for JSON válido, trata como texto direto
          fullText += data;
          callbacks.onChunk?.(fullText);
        }
      }
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });

      // text/event-stream ou ndjson/jsonlines
      if (contentType.includes('text/event-stream')) {
        buffer += chunk;
        const parts = buffer.split(/\n\n/); // SSE eventos separados por linha em branco
        buffer = parts.pop() || '';
        flushSSEBlocks(parts);
        continue;
      }

      if (contentType.includes('ndjson') || contentType.includes('jsonlines')) {
        buffer += chunk;
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const json = JSON.parse(line);
            const text = extractText(json);
            if (text) {
              fullText += text;
              callbacks.onChunk?.(fullText);
            }
          } catch {
            // linha não JSON — repassa bruto
            fullText += line;
            callbacks.onChunk?.(fullText);
          }
        }
        continue;
      }

      // Fallback: texto plano (sem envelope)
      fullText += chunk;
      callbacks.onChunk?.(fullText);
    }
  } finally {
    reader.releaseLock();
  }

  // Processa resquício de buffer (SSE/NDJSON)
  if (buffer && (contentType.includes('text/event-stream') || contentType.includes('ndjson') || contentType.includes('jsonlines'))) {
    if (contentType.includes('text/event-stream')) {
      flushSSEBlocks([buffer]);
    } else {
      try {
        const json = JSON.parse(buffer);
        const text = extractText(json);
        if (text) {
          fullText += text;
          callbacks.onChunk?.(fullText);
        }
      } catch {
        fullText += buffer;
        callbacks.onChunk?.(fullText);
      }
    }
  }

  return fullText;
}

// Check API endpoint on load (development only)
if (import.meta.env.DEV) {
  console.log('✅ OpenAI Stream Service configurado para:', OPENAI_API_ENDPOINT);
}
