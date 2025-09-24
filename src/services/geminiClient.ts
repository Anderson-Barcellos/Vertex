// Gemini AI Integration
import type { SelectedFinding } from '@/types/report';

// Gemini API endpoint
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Verifica se a API Key do Gemini está configurada
 */
export function checkGeminiApiKey(): boolean {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('VITE_GEMINI_API_KEY não está configurada no arquivo .env');
    return false;
  }
  console.log('✅ Gemini API Key detectada:', apiKey.substring(0, 10) + '...');
  return true;
}

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
  // Verificar API Key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('Gemini API Key não configurada.');
    throw new Error('Gemini API Key não está configurada. Configure VITE_GEMINI_API_KEY no arquivo .env');
  }

  try {
    // Construir o prompt
    const prompt = buildPrompt(data);

    // Fazer a chamada para a API do Gemini
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH"
          }
        ]
      }),
      signal: options.signal
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Erro na API do Gemini:', error);
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();

    // Extrair o texto da resposta
    if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
      return result.candidates[0].content.parts[0].text;
    }

    // Fallback se não houver resposta válida
    throw new Error('Resposta inválida da API do Gemini');

  } catch (error) {
    if (options.signal?.aborted) {
      throw new Error('Operação cancelada');
    }
    console.error('Erro ao chamar Gemini API:', error);
    throw error; // Propagar o erro ao invés de retornar fallback
  }
}

/**
 * Constrói o prompt para o Gemini
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

  // Adicionar achados patológicos
  if (data.selectedFindings.length > 0) {
    prompt += 'ACHADOS PATOLÓGICOS:\n';
    data.selectedFindings.forEach(finding => {
      prompt += `- ${finding.finding.name}`;

      if (finding.severity) {
        prompt += ` (${finding.severity})`;
      }

      if (finding.instances && finding.instances.length > 0) {
        finding.instances.forEach(instance => {
          if (instance.measurements.size) {
            prompt += ` - Tamanho: ${instance.measurements.size}`;
          }
          if (instance.measurements.location) {
            prompt += ` - Localização: ${instance.measurements.location}`;
          }
        });
      }

      prompt += '\n';
    });
    prompt += '\n';
  }

  // Adicionar órgãos normais
  if (data.normalOrgans.length > 0) {
    prompt += 'ÓRGÃOS NORMAIS:\n';
    data.normalOrgans.forEach(organ => {
      prompt += `- ${organ}\n`;
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
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ VITE_GEMINI_API_KEY não está configurada');
    return false;
  }

  try {
    const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Teste de conexão. Responda apenas: OK"
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 10,
        }
      })
    });

    if (response.ok) {
      console.log('✅ Conexão com Gemini API funcionando!');
      return true;
    } else {
      console.error('❌ Erro na conexão com Gemini:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Falha ao conectar com Gemini:', error);
    return false;
  }
}

// Auto-teste ao carregar o módulo (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  checkGeminiApiKey();
}

// Default model for Gemini
export const DEFAULT_GEMINI_MODEL = 'gemini-pro';

/**
 * Create a Gemini report request payload
 */
export function createGeminiReportRequest(
  data: any,
  options: any
): any {
  // Build the prompt
  const prompt = buildPrompt({
    examType: options.promptTemplate?.examTitle || 'Ultrassonografia',
    selectedFindings: data.selectedFindings,
    normalOrgans: data.normalOrgans,
    organsCatalog: options.organsList
  });

  return {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.3,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  };
}

/**
 * Request Gemini content generation
 */
export async function requestGeminiContent(payload: any): Promise<{ text: string }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Gemini API Key não configurada');
  }

  const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Gemini API Error: ${response.status}`);
  }

  const result = await response.json();

  if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
    return { text: result.candidates[0].content.parts[0].text };
  }

  throw new Error('Invalid Gemini response');
}

export default {
  generateGeminiClinicalImpression,
  testGeminiConnection,
  checkGeminiApiKey,
  createGeminiReportRequest,
  requestGeminiContent,
  DEFAULT_GEMINI_MODEL
};