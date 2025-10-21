// OpenAI Streaming Integration via backend proxy
import type { SelectedFinding } from '@/types/report';

// Types for streaming
export interface StreamCallbacks {
  onChunk?: (text: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

// Use proxy local para evitar CORS
const OPENAI_API_ENDPOINT =
  import.meta.env.VITE_OPENAI_API_URL || '/api/openai';
const OPENAI_MODEL =
  import.meta.env.VITE_OPENAI_MODEL || 'gpt-4';

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
    const prompt = this.buildPrompt(data);
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
    const prompt = this.buildPrompt(data);
    await this.streamFromBackend(prompt, callbacks);
  }

  /**
   * Constrói o prompt baseado nos achados
   */
  private buildPrompt(data: {
    examType?: string;
    selectedFindings: SelectedFinding[];
    normalOrgans: string[];
    organsCatalog?: any[];
  }): string {
    let prompt = `Gere um laudo de ${data.examType || 'Ultrassonografia Abdominal'} baseado nos seguintes achados:\n\n`;

    // Adicionar achados patológicos
    if (data.selectedFindings.length > 0) {
      prompt += 'ACHADOS PATOLÓGICOS:\n';

      data.selectedFindings.forEach(finding => {
        const organName = data.organsCatalog?.find(o => o.id === finding.organId)?.name || finding.organId;
        prompt += `\n**${organName}:**\n`;
        prompt += `- ${finding.finding.name}`;

        if (finding.severity) {
          prompt += ` (${finding.severity})`;
        }

        if (finding.instances && finding.instances.length > 0) {
          prompt += '\n  Detalhes:\n';
          finding.instances.forEach((instance, idx) => {
            prompt += `  ${idx + 1}. `;

            // Campos padrão
            if (instance.measurements.size) {
              prompt += `Tamanho: ${instance.measurements.size}`;
            }
            if (instance.measurements.location) {
              prompt += ` | Localização: ${instance.measurements.location}`;
            }
            if (instance.measurements.segment) {
              prompt += ` | Segmento: ${instance.measurements.segment}`;
            }

            // Campos específicos de Doppler de Carótidas
            if (instance.measurements.vps) {
              prompt += ` | VPS: ${instance.measurements.vps} cm/s`;
            }
            if (instance.measurements.vdf) {
              prompt += ` | VDF: ${instance.measurements.vdf} cm/s`;
            }
            if (instance.measurements.ratioICA_CCA) {
              prompt += ` | Razão ICA/CCA: ${instance.measurements.ratioICA_CCA}`;
            }
            if (instance.measurements.ratioICA_ICA) {
              prompt += ` | Razão ICA/ICA contralateral: ${instance.measurements.ratioICA_ICA}`;
            }
            if (instance.measurements.emi) {
              prompt += ` | EMI: ${instance.measurements.emi} mm`;
            }
            if (instance.measurements.plaqueEchogenicity) {
              prompt += ` | Ecogenicidade da placa: ${instance.measurements.plaqueEchogenicity}`;
            }
            if (instance.measurements.plaqueComposition) {
              prompt += ` | Composição da placa: ${instance.measurements.plaqueComposition}`;
            }
            if (instance.measurements.plaqueSurface) {
              prompt += ` | Superfície da placa: ${instance.measurements.plaqueSurface}`;
            }
            if (instance.measurements.vertebralFlowPattern) {
              prompt += ` | Padrão de fluxo vertebral: ${instance.measurements.vertebralFlowPattern}`;
            }
            if (instance.measurements.subclavianSteal) {
              prompt += ` | Roubo da subclávia: ${instance.measurements.subclavianSteal}`;
            }

            prompt += '\n';
          });
        }
        prompt += '\n';
      });
    }

    // Adicionar órgãos normais
    if (data.normalOrgans.length > 0) {
      prompt += '\nÓRGÃOS NORMAIS:\n';
      data.normalOrgans.forEach(organId => {
        const organName = data.organsCatalog?.find(o => o.id === organId)?.name || organId;
        prompt += `- ${organName}\n`;
      });
    }

    return prompt;
  }

  /**
   * Faz streaming do backend OpenAI
   */
  private async streamFromBackend(
    prompt: string,
    callbacks: StreamCallbacks
  ): Promise<void> {
    const requestUrl = createRequestUrl();

    // Construir payload no formato esperado pelo backend
    const payload = {
      model: OPENAI_MODEL,
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
      max_tokens: 2000,
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
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [
            { role: 'user', content: 'Teste de conexão. Responda apenas: OK' }
          ],
          max_tokens: 10,
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
  let fullText = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      callbacks.onChunk?.(chunk);
    }
  } finally {
    reader.releaseLock();
  }

  return fullText;
}

// Check API endpoint on load (development only)
if (import.meta.env.DEV) {
  console.log('✅ OpenAI Stream Service configurado para:', OPENAI_API_ENDPOINT);
}
