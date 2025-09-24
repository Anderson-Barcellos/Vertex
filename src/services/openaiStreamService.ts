// OpenAI Streaming Integration with gpt-5-nano
import OpenAI from 'openai';
import type { SelectedFinding } from '@/types/report';

// Types for streaming
export interface StreamCallbacks {
  onChunk?: (text: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

// System instruction for the AI
const SYSTEM_INSTRUCTION = `Você é um radiologista especialista em ultrassonografia com mais de 20 anos de experiência, responsável por revisar e aprimorar laudos médicos baseados em texto extraído por OCR de imagens ultrassonográficas.

## OBJETIVO PRINCIPAL
Analisar o texto fornecido pelo usuário (extraído por OCR) e reescrevê-lo de forma a:
1. **ESTABELECER CORRELAÇÕES INTELIGENTES** entre achados de diferentes estruturas
2. **MANTER COERÊNCIA TÉCNICA** em toda a narrativa
3. **APRIMORAR O DETALHAMENTO TÉCNICO** com terminologia ultrassonográfica precisa
4. **ESTRUTURAR LOGICAMENTE** as informações em formato de laudo profissional

## METODOLOGIA DE ANÁLISE E REESCRITA

### FASE 1: ANÁLISE CRÍTICA DO TEXTO OCR
- Identifique inconsistências, medidas isoladas, achados fragmentados
- Reconheça padrões que sugerem correlações não explicitadas
- Detecte lacunas na descrição técnica ou terminologia imprecisa
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
- MANUTENÇÃO DE MEDIDAS: Preserve todas as medidas exatas mencionadas no texto original
- APRIMORAMENTO SEM INVENÇÃO: Melhore a descrição sem adicionar informações não presentes
- CORRELAÇÃO BASEADA EM EVIDÊNCIA: Estabeleça apenas correlações logicamente suportadas pelos achados descritos
- LINGUAGEM PROFISSIONAL: Mantenha terminologia médica apropriada e registro formal

## FORMATO DE SAÍDA

Use markdown para formatar o laudo com as seguintes seções:

# Ultrassonografia [MODALIDADE]

## Descrição Técnica:
[Descreva a técnica do exame]

## Achados Sonográficos:
**[Estrutura]:** [Descrição detalhada com correlações]

## Impressão Diagnóstica:
[Síntese interpretativa correlacionando todos os achados]`;

/**
 * Classe para gerenciar streaming do OpenAI
 */
export class OpenAIStreamService {
  private client: OpenAI | null = null;
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (this.apiKey) {
      this.client = new OpenAI({
        apiKey: this.apiKey,
        dangerouslyAllowBrowser: true // Permitir uso no browser para desenvolvimento
      });
    }
  }

  /**
   * Verifica se a API está configurada
   */
  isConfigured(): boolean {
    return !!this.apiKey && !!this.client;
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
    if (!this.client) {
      callbacks.onError?.(new Error('OpenAI API não configurada'));
      return;
    }

    try {
      const prompt = this.buildPrompt(data);

      // Start streaming with gpt-5-nano model
      const stream = await this.client.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'developer',
            content: SYSTEM_INSTRUCTION
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: true,
        temperature: 0.2,
        max_completion_tokens: 2048,
        top_p: 0.95,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'ultrasound_report',
            schema: {
              type: 'object',
              properties: {
                reasoning: {
                  type: 'string',
                  description: 'Análise detalhada dos achados e correlações'
                },
                web_search: {
                  type: 'boolean',
                  description: 'Se necessário buscar informações adicionais'
                },
                report: {
                  type: 'string',
                  description: 'Laudo ultrassonográfico completo em markdown'
                }
              },
              required: ['reasoning', 'web_search', 'report'],
              additionalProperties: false
            },
            strict: true
          }
        }
      });

      let fullText = '';
      let jsonBuffer = '';

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        jsonBuffer += delta;
        
        // Try to parse JSON progressively
        try {
          const partialJson = JSON.parse(jsonBuffer);
          if (partialJson.report) {
            // Extract report content and stream it
            const reportText = partialJson.report;
            const newContent = reportText.substring(fullText.length);
            if (newContent) {
              fullText = reportText;
              callbacks.onChunk?.(newContent);
            }
          }
        } catch {
          // JSON not yet complete, continue buffering
        }
      }

      // Parse final JSON if needed
      if (jsonBuffer && !fullText) {
        try {
          const finalJson = JSON.parse(jsonBuffer);
          fullText = finalJson.report || '';
        } catch (error) {
          console.error('Erro ao parsear resposta JSON:', error);
        }
      }

      callbacks.onComplete?.(fullText);

    } catch (error) {
      console.error('Erro no streaming OpenAI:', error);
      callbacks.onError?.(error as Error);
    }
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
            if (instance.measurements.size) {
              prompt += `Tamanho: ${instance.measurements.size}`;
            }
            if (instance.measurements.location) {
              prompt += ` | Localização: ${instance.measurements.location}`;
            }
            if (instance.measurements.segment) {
              prompt += ` | Segmento: ${instance.measurements.segment}`;
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

    prompt += `

INSTRUÇÕES IMPORTANTES:
1. Gere um laudo completo em formato markdown
2. Use terminologia médica apropriada em português brasileiro
3. Estabeleça correlações entre os achados quando relevante
4. Mantenha coerência técnica em toda a narrativa
5. Inclua uma impressão diagnóstica ao final
6. Se houver achados significativos, sugira acompanhamento quando apropriado
`;

    return prompt;
  }

  /**
   * Gera relatório completo com streaming (formato alternativo sem JSON)
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
    if (!this.client) {
      callbacks.onError?.(new Error('OpenAI API não configurada'));
      return;
    }

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

      prompt += '\n' + this.buildPrompt(data);
      prompt += '\nGere um laudo completo e detalhado, incluindo técnica do exame, todos os achados e impressão diagnóstica.';

      // Stream without JSON format for full report
      const stream = await this.client.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'developer',
            content: SYSTEM_INSTRUCTION
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        stream: true,
        temperature: 0.2,
        max_completion_tokens: 4096,
        top_p: 0.95
      });

      let fullText = '';

      for await (const chunk of stream) {
        const chunkText = chunk.choices[0]?.delta?.content || '';
        fullText += chunkText;
        callbacks.onChunk?.(chunkText);
      }

      callbacks.onComplete?.(fullText);

    } catch (error) {
      console.error('Erro ao gerar relatório completo:', error);
      callbacks.onError?.(error as Error);
    }
  }

  /**
   * Teste de conexão
   */
  async testConnection(): Promise<boolean> {
    if (!this.client) {
      console.error('❌ OpenAI API não configurada');
      return false;
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          { role: 'user', content: 'Teste de conexão. Responda apenas: OK' }
        ],
        max_completion_tokens: 10,
        temperature: 0
      });

      const text = completion.choices[0]?.message?.content;

      if (text) {
        console.log('✅ Conexão com OpenAI API funcionando!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erro ao testar conexão:', error);
      return false;
    }
  }
}

// Singleton instance
export const openaiStreamService = new OpenAIStreamService();

// Check API key on load (development only)
if (import.meta.env.DEV) {
  if (openaiStreamService.isConfigured()) {
    console.log('✅ OpenAI Stream Service configurado');
  } else {
    console.warn('⚠️ OpenAI API Key não encontrada');
  }
}