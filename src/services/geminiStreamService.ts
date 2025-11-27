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

// System instruction for the AI (incorporated into prompt text)
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
 * Classe para gerenciar streaming do Gemini via backend
 */
export class GeminiStreamService {
  /**
   * Verifica se a API está configurada
   */
  isConfigured(): boolean {
    return Boolean(GEMINI_API_ENDPOINT);
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
      const prompt = appendSystemInstruction(buildReportPrompt(data));
      await this.streamFromBackend(prompt, callbacks);
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
    },
    callbacks: StreamCallbacks
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

      const enrichedPrompt = appendSystemInstruction(prompt);
      await this.streamFromBackend(enrichedPrompt, callbacks);
    } catch (error) {
      console.error('Erro ao gerar relatório completo:', error);
      callbacks.onError?.(error as Error);
    }
  }

  private async streamFromBackend(
    prompt: string,
    callbacks: StreamCallbacks
  ): Promise<void> {
    const requestUrl = createRequestUrl('');

    // Obter modelo selecionado do sessionStorage
    const selectedModel = sessionStorage.getItem('selectedAIModel') || GEMINI_MODEL;

    console.log('[GeminiStreamService] Usando modelo:', selectedModel);

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: prompt,
        model: selectedModel
        // NÃO enviar 'prompt' - deixar backend usar seu system_prompt padrão
      })
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

function appendSystemInstruction(prompt: string): string {
  return `${SYSTEM_INSTRUCTION}\n\n${prompt}`;
}
