// Claude AI Integration Service
import type { SelectedFinding, FindingInstance } from '@/types/report';

// Type definition for AI models
export type AIModel = 'claude-3-opus' | 'claude-3-sonnet' | 'gpt-4' | 'local';

// Claude API Configuration
const CLAUDE_API_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_VERSION = '2023-06-01';

// Model mapping
const CLAUDE_MODELS = {
  'claude-3-opus': 'claude-3-opus-20240229',
  'claude-3-sonnet': 'claude-3-5-sonnet-20241022',
  'gpt-4': 'gpt-4', // Fallback, não usado com Claude
  'local': 'local' // Sem API
} as const;

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeRequest {
  model: string;
  messages: ClaudeMessage[];
  max_tokens: number;
  temperature?: number;
  system?: string;
}

interface ClaudeResponse {
  content: Array<{
    text: string;
    type: 'text';
  }>;
  id: string;
  model: string;
  role: 'assistant';
  stop_reason: string;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Gera impressão clínica usando Claude AI
 */
export async function generateClaudeClinicalImpression(
  findings: SelectedFinding[],
  normalOrgans: string[],
  model: AIModel = 'claude-3-opus',
  signal?: AbortSignal
): Promise<string> {
  // Se for modo local, retorna texto básico
  if (model === 'local') {
    return generateLocalImpression(findings, normalOrgans);
  }

  // Verificar se temos API key (seria configurada via variável de ambiente)
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY || '';

  if (!apiKey) {
    console.warn('Claude API key não configurada. Usando geração local.');
    return generateLocalImpression(findings, normalOrgans);
  }

  try {
    const systemPrompt = createSystemPrompt();
    const userMessage = createUserMessage(findings, normalOrgans);

    const request: ClaudeRequest = {
      model: CLAUDE_MODELS[model as keyof typeof CLAUDE_MODELS],
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ],
      system: systemPrompt,
      max_tokens: 2000,
      temperature: 0.3 // Baixa temperatura para respostas mais consistentes
    };

    const response = await fetch(CLAUDE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': CLAUDE_API_VERSION
      },
      body: JSON.stringify(request),
      signal
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data: ClaudeResponse = await response.json();
    return data.content[0]?.text || generateLocalImpression(findings, normalOrgans);

  } catch (error) {
    if (signal?.aborted) {
      throw new Error('Requisição cancelada');
    }
    console.error('Erro ao chamar Claude API:', error);
    return generateLocalImpression(findings, normalOrgans);
  }
}

/**
 * Cria o prompt do sistema para Claude
 */
function createSystemPrompt(): string {
  return `Você é um radiologista experiente especializado em ultrassonografia diagnóstica no Brasil.

Suas responsabilidades:
1. Gerar impressões diagnósticas precisas e profissionais em português brasileiro
2. Seguir as diretrizes do Colégio Brasileiro de Radiologia (CBR)
3. Usar terminologia médica padronizada
4. Fornecer correlações clínicas quando relevante
5. Manter tom objetivo e profissional

Formato de resposta:
- Inicie com achados principais se houver alterações
- Use "Exame dentro dos limites da normalidade" quando apropriado
- Para achados patológicos, descreva localização, características e significado clínico
- Termine com recomendações quando aplicável
- Use classificações padronizadas (BI-RADS, TI-RADS, etc.) quando apropriado`;
}

/**
 * Cria a mensagem do usuário para Claude
 */
function createUserMessage(findings: SelectedFinding[], normalOrgans: string[]): string {
  let message = 'Gere uma impressão diagnóstica para o seguinte exame ultrassonográfico:\n\n';

  if (findings.length > 0) {
    message += 'ACHADOS PATOLÓGICOS:\n';
    findings.forEach(finding => {
      if (!finding.isNormal) {
        message += `- ${finding.finding.name}`;
        if (finding.severity) {
          message += ` (${finding.severity})`;
        }
        if (finding.instances && finding.instances.length > 0) {
          message += `:\n`;
          finding.instances.forEach((instance, idx) => {
            message += `  ${idx + 1}. `;
            if (instance.measurements.size) {
              message += `Medidas: ${instance.measurements.size}; `;
            }
            if (instance.measurements.location) {
              message += `Localização: ${instance.measurements.location}; `;
            }
            message += '\n';
          });
        } else {
          message += '\n';
        }
      }
    });
    message += '\n';
  }

  if (normalOrgans.length > 0) {
    message += 'ÓRGÃOS NORMAIS:\n';
    normalOrgans.forEach(organ => {
      message += `- ${organ}\n`;
    });
  }

  message += '\nPor favor, forneça uma impressão diagnóstica concisa e profissional.';

  return message;
}

/**
 * Gera impressão local sem IA
 */
function generateLocalImpression(
  findings: SelectedFinding[],
  normalOrgans: string[]
): string {
  if (findings.length === 0 && normalOrgans.length > 0) {
    return 'Exame ultrassonográfico dentro dos limites da normalidade. Órgãos avaliados sem alterações estruturais significativas.';
  }

  if (findings.length > 0) {
    const pathologicalFindings = findings.filter(f => !f.isNormal);
    if (pathologicalFindings.length === 0) {
      return 'Exame sem alterações patológicas significativas.';
    }

    let impression = 'Achados ultrassonográficos:\n';
    pathologicalFindings.forEach(finding => {
      impression += `- ${finding.finding.name}`;
      if (finding.severity) {
        impression += ` (${finding.severity})`;
      }
      impression += '\n';
    });
    impression += '\nCorrelacionar com dados clínicos e laboratoriais.';
    return impression;
  }

  return 'Exame ultrassonográfico realizado conforme protocolo.';
}

/**
 * Integração com o gerador de relatórios
 */
export async function generateReportWithClaude(
  data: any,
  model: AIModel = 'claude-3-opus'
): Promise<string> {
  // Esta função seria expandida para gerar o relatório completo
  // Por enquanto, retorna um template básico

  const impression = await generateClaudeClinicalImpression(
    data.selectedFindings || [],
    data.normalOrgans || [],
    model
  );

  return `# Relatório de Ultrassonografia

## Técnica
Exame realizado com transdutor convexo multifrequencial, em modo bidimensional e Doppler colorido.

## Achados
${data.selectedFindings?.length > 0
  ? data.selectedFindings.map((f: SelectedFinding) =>
      `- ${f.finding.name}${f.severity ? ` (${f.severity})` : ''}`
    ).join('\n')
  : 'Órgãos avaliados dentro dos padrões de normalidade.'
}

## Impressão Diagnóstica
${impression}

---
*Relatório gerado com auxílio de IA (${model === 'claude-3-opus' ? 'Claude 3 Opus' : 'Claude 3 Sonnet'})*`;
}

export default {
  generateClaudeClinicalImpression,
  generateReportWithClaude
};