// Gemini AI Integration
import type { SelectedFinding } from '@/types/report';

// Use proxy local para evitar CORS
// Proxy configurado em vite.config.ts: /api/gemini -> https://ultrassom.ai:8177/geminiCall
const GEMINI_API_ENDPOINT =
  import.meta.env.VITE_GEMINI_API_URL || '/api/gemini';
const GEMINI_MODEL =
  import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-pro';

/**
 * Gera impressão clínica usando Gemini AI
 */
export async function generateGeminiClinicalImpression(
  data: {
    examType?: string;
    selectedFindings: SelectedFinding[];
    normalOrgans: string[];
    organsCatalog?: any[];
  },
  options: { signal?: AbortSignal } = {}
): Promise<string> {
  try {
    // Construir o prompt
    const prompt = buildPrompt(data);
    const result = await callGeminiEndpoint(prompt, options.signal);
    return result;
  } catch (error) {
    if (options.signal?.aborted) {
      throw new Error('Operação cancelada');
    }
    console.error('Erro ao chamar Gemini API:', error);
    throw error; // Propagar o erro ao invés de retornar fallback
  }
}

/**
 * Constrói o prompt para o Gemini com detalhes completos
 */
function buildPrompt(data: {
  examType?: string;
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  organsCatalog?: any[];
}): string {
  let prompt = `Você é um radiologista experiente especializado em ultrassonografia no Brasil.

Gere uma IMPRESSÃO DIAGNÓSTICA profissional e concisa para o seguinte exame de ${data.examType || 'Ultrassonografia'}:

`;

  // Adicionar achados patológicos com detalhes completos
  if (data.selectedFindings.length > 0) {
    prompt += 'ACHADOS PATOLÓGICOS:\n';

    data.selectedFindings.forEach(finding => {
      // Criar nome do achado com severidade
      let findingHeader = `- ${finding.finding.name}`;
      if (finding.severity) {
        findingHeader += ` (Severidade: ${finding.severity})`;
      }
      prompt += findingHeader + '\n';

      // Adicionar detalhes das instâncias (lesões/achados múltiplos)
      if (finding.instances && finding.instances.length > 0) {
        finding.instances.forEach((instance, idx) => {
          prompt += `  Lesão ${idx + 1}:\n`;

          // Tamanho/Dimensão
          if (instance.measurements?.size) {
            prompt += `    • Tamanho: ${instance.measurements.size}\n`;
          }

          // Localização anatômica
          if (instance.measurements?.location) {
            prompt += `    • Localização: ${instance.measurements.location}\n`;
          }

          // Segmento hepático (específico para fígado)
          if (instance.measurements?.segment) {
            prompt += `    • Segmento: ${instance.measurements.segment}\n`;
          }

          // Quantidade (para cálculos, etc)
          if (instance.measurements?.quantity) {
            prompt += `    • Quantidade: ${instance.measurements.quantity}\n`;
          }

          // Descrição adicional
          if (instance.measurements?.description) {
            prompt += `    • Descrição: ${instance.measurements.description}\n`;
          }

          // Campos específicos de Doppler de Carótidas
          if (instance.measurements?.vps) {
            prompt += `    • VPS: ${instance.measurements.vps} cm/s\n`;
          }
          if (instance.measurements?.vdf) {
            prompt += `    • VDF: ${instance.measurements.vdf} cm/s\n`;
          }
          if (instance.measurements?.ratioICA_CCA) {
            prompt += `    • Razão ICA/CCA: ${instance.measurements.ratioICA_CCA}\n`;
          }
          if (instance.measurements?.ratioICA_ICA) {
            prompt += `    • Razão ICA/ICA contralateral: ${instance.measurements.ratioICA_ICA}\n`;
          }
          if (instance.measurements?.emi) {
            prompt += `    • EMI: ${instance.measurements.emi} mm\n`;
          }
          if (instance.measurements?.plaqueEchogenicity) {
            prompt += `    • Ecogenicidade da placa: ${instance.measurements.plaqueEchogenicity}\n`;
          }
          if (instance.measurements?.plaqueComposition) {
            prompt += `    • Composição da placa: ${instance.measurements.plaqueComposition}\n`;
          }
          if (instance.measurements?.plaqueSurface) {
            prompt += `    • Superfície da placa: ${instance.measurements.plaqueSurface}\n`;
          }
          if (instance.measurements?.vertebralFlowPattern) {
            prompt += `    • Padrão de fluxo vertebral: ${instance.measurements.vertebralFlowPattern}\n`;
          }
          if (instance.measurements?.subclavianSteal) {
            prompt += `    • Roubo da subclávia: ${instance.measurements.subclavianSteal}\n`;
          }
        });
      } else if (finding.measurements) {
        // Se não há instâncias detalhadas, usar as medidas do finding
        if (finding.measurements.size) {
          prompt += `  Tamanho: ${finding.measurements.size}\n`;
        }
        if (finding.measurements.location) {
          prompt += `  Localização: ${finding.measurements.location}\n`;
        }
        if (finding.measurements.segment) {
          prompt += `  Segmento: ${finding.measurements.segment}\n`;
        }
      }

      // Adicionar detalhes textuais se disponíveis
      if (finding.details) {
        prompt += `  Detalhes: ${finding.details}\n`;
      }

      prompt += '\n';
    });
    prompt += '\n';
  }

  // Adicionar órgãos normais com seus nomes completos do catálogo
  if (data.normalOrgans.length > 0) {
    prompt += 'ÓRGÃOS NORMAIS (sem alterações):\n';

    data.normalOrgans.forEach(organId => {
      // Se temos o catálogo, usar o nome completo
      const organName = data.organsCatalog?.find(org => org.id === organId)?.name || organId;
      prompt += `- ${organName}\n`;
    });
    prompt += '\n';
  }

  prompt += `
INSTRUÇÕES:
1. Gere APENAS a impressão diagnóstica, sem incluir descrição dos achados
2. Use terminologia médica apropriada em português brasileiro
3. Seja conciso mas completo
4. Inclua correlações clínicas quando relevante
5. Se houver achados significativos, mencione necessidade de acompanhamento quando apropriado
6. Use classificações padronizadas (BI-RADS, TI-RADS, etc) quando aplicável
7. NÃO inclua cabeçalho ou título, apenas o texto da impressão
8. Estruture a resposta em parágrafos claros e bem organizados
`;

  return prompt;
}

/**
 * Gera impressão local sem IA (fallback)
 */
function generateLocalImpression(
  findings: SelectedFinding[],
  normalOrgans: string[]
): string {
  if (findings.length === 0 && normalOrgans.length > 0) {
    return "Exame ultrassonográfico dentro dos limites da normalidade. Órgãos avaliados sem alterações estruturais significativas.";
  }

  if (findings.length > 0) {
    const pathologicalFindings = findings.filter(f => !f.isNormal);

    if (pathologicalFindings.length === 0) {
      return "Exame sem alterações patológicas significativas.";
    }

    let impression = "Achados ultrassonográficos:\n";
    pathologicalFindings.forEach(finding => {
      impression += `- ${finding.finding.name}`;
      if (finding.severity) {
        impression += ` (${finding.severity})`;
      }
      impression += '\n';
    });
    impression += "\nCorrelacionar com dados clínicos e laboratoriais.";
    return impression;
  }

  return "Exame ultrassonográfico realizado conforme protocolo.";
}

/**
 * Testa a conexão com a API do Gemini
 */
export async function testGeminiConnection(): Promise<boolean> {
  try {
    const text = await callGeminiEndpoint('Teste de conexão. Responda apenas: OK');
    return Boolean(text);
  } catch (error) {
    console.error('❌ Falha ao conectar com Gemini:', error);
    return false;
  }
}

// Default model for Gemini
export const DEFAULT_GEMINI_MODEL = GEMINI_MODEL;

/**
 * Create a Gemini report request payload
 */
export function createGeminiReportRequest(
  data: any,
  options: any
): string {
  // Build the prompt
  const prompt = buildPrompt({
    examType: options.promptTemplate?.examTitle || 'Ultrassonografia',
    selectedFindings: data.selectedFindings,
    normalOrgans: data.normalOrgans,
    organsCatalog: options.organsList
  });

  return prompt;
}

/**
 * Request Gemini content generation
 */
export async function requestGeminiContent(prompt: string): Promise<{ text: string }> {
  const text = await callGeminiEndpoint(prompt);
  return { text };
}

export default {
  generateGeminiClinicalImpression,
  testGeminiConnection,
  createGeminiReportRequest,
  requestGeminiContent,
  DEFAULT_GEMINI_MODEL
};

function createRequestUrl(): string {
  try {
    if (GEMINI_API_ENDPOINT.startsWith('http')) {
      return GEMINI_API_ENDPOINT;
    }
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    return new URL(GEMINI_API_ENDPOINT, base).toString();
  } catch (error) {
    console.error('Configuração inválida para GEMINI_API_ENDPOINT:', error);
    throw new Error('Endpoint do Gemini inválido. Verifique VITE_GEMINI_API_URL.');
  }
}

async function callGeminiEndpoint(text: string, signal?: AbortSignal, modelId?: string): Promise<string> {
  const requestUrl = createRequestUrl();
  const requestId = Math.random().toString(36).substring(7); // ID único para rastreamento
  const requestSize = text.length;
  const startTime = Date.now();
  const model = modelId || GEMINI_MODEL;

  // Log da requisição iniciada
  console.log(`[Gemini ${requestId}] Iniciando request`, {
    url: requestUrl,
    bodySize: `${(requestSize / 1024).toFixed(2)} KB`,
    model: model,
    timestamp: new Date().toISOString()
  });

  // Criar AbortController com timeout de 30 segundos
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn(`[Gemini ${requestId}] Timeout acionado após 30 segundos`);
    controller.abort();
  }, 30000);

  // Usar AbortSignal fornecido ou criar um novo
  const finalSignal = signal || controller.signal;

  try {
    // Payload compatible with backend endpoint
    // text: conteúdo do exame
    // model: nome do modelo a usar
    // prompt: NÃO enviar - deixar backend usar system_prompt padrão
    const payload = {
      text,
      model: model || GEMINI_MODEL
    };

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: finalSignal
    });

    clearTimeout(timeoutId);

    const elapsedTime = Date.now() - startTime;

    if (!response.ok) {
      const errorMessage = await response.text().catch(() => '');
      console.error(`[Gemini ${requestId}] Erro na resposta`, {
        status: response.status,
        statusText: response.statusText,
        errorSize: `${(errorMessage.length / 1024).toFixed(2)} KB`,
        elapsedTime: `${elapsedTime}ms`
      });
      throw new Error(`Gemini API Error: ${response.status} ${response.statusText}. ${errorMessage}`);
    }

    if (!response.body) {
      const fallback = await response.text();
      clearTimeout(timeoutId);
      console.log(`[Gemini ${requestId}] Resposta sem streaming`, {
        responseSize: `${(fallback.length / 1024).toFixed(2)} KB`,
        elapsedTime: `${elapsedTime}ms`
      });
      return fallback.trim();
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';
    let chunkCount = 0;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        result += chunk;
        chunkCount++;
      }
    }

    // Flush final do decoder
    const finalChunk = decoder.decode();
    if (finalChunk) {
      result += finalChunk;
    }

    const finalElapsedTime = Date.now() - startTime;
    console.log(`[Gemini ${requestId}] Request completado com sucesso`, {
      responseSize: `${(result.length / 1024).toFixed(2)} KB`,
      chunksReceived: chunkCount,
      elapsedTime: `${finalElapsedTime}ms`,
      averageChunkSize: `${((result.length / chunkCount) / 1024).toFixed(2)} KB`
    });

    return result.trim();
  } catch (error: any) {
    clearTimeout(timeoutId);
    const elapsedTime = Date.now() - startTime;

    // Verificar se foi cancelado por timeout
    if (error.name === 'AbortError') {
      console.error(`[Gemini ${requestId}] Request foi abortado`, {
        reason: finalSignal.aborted ? 'Signal abortado' : 'Timeout',
        elapsedTime: `${elapsedTime}ms`
      });
      throw new Error('Operação cancelada - timeout de 30 segundos excedido. O servidor pode estar indisponível.');
    }

    // Erro geral
    console.error(`[Gemini ${requestId}] Erro ao chamar endpoint`, {
      error: error instanceof Error ? error.message : String(error),
      elapsedTime: `${elapsedTime}ms`,
      timestamp: new Date().toISOString()
    });

    throw error;
  }
}

/**
 * Chama o endpoint Gemini com streaming e callback progressivo
 * @param text Conteúdo a ser enviado
 * @param onChunk Callback chamado a cada chunk recebido com o texto acumulado
 * @param signal AbortSignal para cancelamento
 * @returns Promise com o texto completo
 */
export async function callGeminiWithStreaming(
  text: string,
  onChunk?: (accumulatedText: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const requestUrl = createRequestUrl();
  const requestId = Math.random().toString(36).substring(7);
  const startTime = Date.now();

  console.log(`[Gemini Streaming ${requestId}] Iniciando streaming`, {
    url: requestUrl,
    bodySize: `${(text.length / 1024).toFixed(2)} KB`,
    timestamp: new Date().toISOString()
  });

  // Criar AbortController com timeout de 60 segundos para streaming
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.warn(`[Gemini Streaming ${requestId}] Timeout de streaming acionado após 60 segundos`);
    controller.abort();
  }, 60000);

  const finalSignal = signal || controller.signal;

  try {
    // Payload compatible with backend endpoint
    const payload = {
      text,
      model: GEMINI_MODEL
      // NÃO enviar 'prompt' - deixar backend usar system_prompt padrão
    };

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: finalSignal
    });

    if (!response.ok) {
      const message = await response.text().catch(() => '');
      clearTimeout(timeoutId);
      console.error(`[Gemini Streaming ${requestId}] Erro na resposta`, {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Gemini API Error: ${response.status} ${message}`);
    }

    if (!response.body) {
      clearTimeout(timeoutId);
      const fallback = await response.text();
      console.log(`[Gemini Streaming ${requestId}] Fallback sem streaming`);
      onChunk?.(fallback.trim());
      return fallback.trim();
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';
    let chunkCount = 0;

    try {
      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          result += chunk;
          chunkCount++;

          // Chamar callback com texto acumulado
          if (onChunk) {
            console.log(`[Gemini Streaming ${requestId}] Chunk ${chunkCount} recebido - ${result.length} caracteres acumulados`);
            onChunk(result);
          }
        }
      }

      // Flush final do decoder
      const finalChunk = decoder.decode();
      if (finalChunk) {
        result += finalChunk;
        if (onChunk) {
          onChunk(result);
        }
      }

      clearTimeout(timeoutId);
      const elapsedTime = Date.now() - startTime;
      console.log(`[Gemini Streaming ${requestId}] Streaming completado`, {
        totalSize: `${(result.length / 1024).toFixed(2)} KB`,
        totalChunks: chunkCount,
        elapsedTime: `${elapsedTime}ms`
      });

      return result.trim();
    } catch (error) {
      clearTimeout(timeoutId);
      if (finalSignal.aborted) {
        console.error(`[Gemini Streaming ${requestId}] Streaming cancelado`);
        throw new Error('Operação cancelada');
      }
      throw error;
    }
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      console.error(`[Gemini Streaming ${requestId}] AbortError - timeout ou cancelamento`);
      throw new Error('Operação cancelada - timeout excedido');
    }

    console.error(`[Gemini Streaming ${requestId}] Erro`, {
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}
