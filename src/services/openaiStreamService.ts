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

### CRITÉRIOS NASCET DE ESTENOSE CAROTÍDEA
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

### VALORES DE REFERÊNCIA EMI
- **Normal:** < 0.9 mm (adultos < 40 anos) | < 1.0 mm (adultos > 40 anos)
- **Espessamento:** 1.0-1.2 mm
- **Placa aterosclerótica:** > 1.2 mm

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

    // Construir payload no formato esperado pelo backend Python
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
      max_completion_tokens: 2000,
      stream: true
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
