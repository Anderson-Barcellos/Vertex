import { organs } from '@/data/organs';

import { ABDOMEN_TOTAL_TEMPLATE } from '@/data/reportTemplates';
import type {
  ReportData,
  ReportGenerationOptions,
  GeminiPromptTemplate,
  AIProvider,
  SelectedFinding
} from '@/types/report';
import type { Organ } from '@/data/organs';
import {
  createGeminiReportRequest,
  requestGeminiContent,
  DEFAULT_GEMINI_MODEL
} from './geminiClient';

export async function generateReport(
  data: ReportData,
  options: ReportGenerationOptions = {}
): Promise<string> {
  // Validar dados de entrada
  if (!data) {
    throw new Error('Dados do relatório não fornecidos');
  }

  const hasFindings = data.selectedFindings && data.selectedFindings.length > 0;
  const hasNormalOrgans = data.normalOrgans && data.normalOrgans.length > 0;

  if (!hasFindings && !hasNormalOrgans) {
    throw new Error('Nenhum achado ou órgão normal foi selecionado. Por favor, selecione pelo menos um achado ou marque órgãos como normais.');
  }

  const organsList = options.organsList ?? organs;
  const promptTemplate = options.promptTemplate ?? ABDOMEN_TOTAL_TEMPLATE;
  const provider: AIProvider = options.provider ?? 'gemini';
  const resolvedModel = provider === 'gemini'
    ? options.model ?? DEFAULT_GEMINI_MODEL
    : DEFAULT_GEMINI_MODEL;

  if (provider !== 'gemini') {
    console.info(
      `[reportGenerator] Provedor %s ainda não está integrado. Utilizando fluxo Gemini como fallback.`,
      provider
    );
  }

  try {
    // Log de debug antes de gerar o prompt
    console.log('[reportGenerator] Iniciando geração de relatório com:', {
      provider,
      model: resolvedModel,
      findingsCount: data.selectedFindings?.length || 0,
      normalOrgansCount: data.normalOrgans?.length || 0,
      timestamp: new Date().toISOString()
    });

    const promptText = createGeminiReportRequest(data, {
      model: resolvedModel,
      organsList,
      promptTemplate
    });

    // Log do tamanho do prompt
    console.log('[reportGenerator] Prompt criado com', promptText.length, 'caracteres');

    const { text } = await requestGeminiContent(promptText);

    console.log('[reportGenerator] Relatório gerado com sucesso -', text.length, 'caracteres na resposta');

    return text;
  } catch (error) {
    console.error('[reportGenerator] Erro ao gerar relatório:', {
      error: error instanceof Error ? error.message : String(error),
      data: {
        findingsCount: data.selectedFindings?.length,
        normalOrgansCount: data.normalOrgans?.length
      },
      timestamp: new Date().toISOString()
    });

    // Retornar relatório básico como fallback
    const basicReport = generateBasicReport(data, organsList, promptTemplate);
    console.log('[reportGenerator] Usando fallback com relatório básico');
    return basicReport;
  }
}

function generateBasicReport(
  data: ReportData,
  organsList: Organ[],
  template: GeminiPromptTemplate
): string {
  const { selectedFindings, normalOrgans, additionalNotes } = data;

  let report = '';

  // Header
  report += `# ${template.examTitle}\n\n`;
  report += '## Descrição Técnica:\n\n';
  report += `${template.technicalDescription}\n\n`;
  report += `## ${template.findingsTitle}:\n\n`;

  // Group findings by organ
  const groupedFindings = selectedFindings.reduce((acc, finding) => {
    if (!acc[finding.organId]) {
      acc[finding.organId] = [];
    }
    acc[finding.organId].push(finding);
    return acc;
  }, {} as Record<string, SelectedFinding[]>);

  const organMap = organsList.reduce<Record<string, Organ>>((acc, organ) => {
    acc[organ.id] = organ;
    return acc;
  }, {});

  // Generate report for each organ
  organsList.forEach(organ => {
    const organFindings = groupedFindings[organ.id] || [];
    const isNormal = normalOrgans.includes(organ.id);

    if (organFindings.length > 0 || isNormal) {
      report += `**${organ.name}:** `;

      if (isNormal || organFindings.length === 0) {
        report += organ.normalDescription;
      } else {
        // Add findings descriptions with details
        const findingDescriptions = organFindings.map(f => {
          let desc = f.finding.name;

          if (f.severity) {
            desc += ` (${f.severity})`;
          }

          // Add instance details
          if (f.instances && f.instances.length > 0) {
            const instanceDetails = f.instances.map((inst) => {
              const m = inst.measurements;
              const parts: string[] = [];

              if (m.size) parts.push(`tamanho ${m.size}`);
              if (m.segment) parts.push(`segmento ${m.segment}`);
              if (m.location) parts.push(`localização ${m.location}`);
              if (m.vps) parts.push(`VPS ${m.vps}`);
              if (m.vdf) parts.push(`VDF ${m.vdf}`);
              if (m.ratioICA_CCA || m.ratio) parts.push(`razão ICA/CCA ${m.ratioICA_CCA || m.ratio}`);
              if (m.nascetGrade || m.nascet) parts.push(`grau NASCET ${m.nascetGrade || m.nascet}`);
              if (m.emi || m.emiValue) parts.push(`EMI ${m.emi || m.emiValue} mm`);
              if (m.emiClassification) parts.push(`classificação EMI ${m.emiClassification}`);
              if (m.plaqueEchogenicity || m.echogenicity) parts.push(`ecogenicidade ${m.plaqueEchogenicity || m.echogenicity}`);
              if (m.plaqueComposition || m.composition) parts.push(`composição ${m.plaqueComposition || m.composition}`);
              if (m.plaqueSurface || m.surface) parts.push(`superfície ${m.plaqueSurface || m.surface}`);
              if (m.plaqueRisk || m.risk) parts.push(String(m.plaqueRisk || m.risk));
              if (m.vertebralFlowPattern || m.flowPattern) parts.push(`padrão de fluxo ${m.vertebralFlowPattern || m.flowPattern}`);
              if (m.subclavianSteal) parts.push(`roubo da subclávia ${m.subclavianSteal}`);
              if (m.vertebralVelocity) parts.push(`velocidade ${m.vertebralVelocity}`);
              if (m.vertebralIR) parts.push(`IR ${m.vertebralIR}`);
              if (m.description) parts.push(m.description);

              return parts.join(', ');
            }).filter(Boolean).join('; ');

            if (instanceDetails) {
              desc += ` - ${instanceDetails}`;
            }
          }

          return desc;
        });

        report += `apresenta ${findingDescriptions.join(', ')}.`;
      }

      report += '\n\n';
    }
  });

  // Impression
  report += `## ${template.impressionTitle}:\n\n`;

  if (selectedFindings.length === 0) {
    report += template.normalImpression;
  } else {
    const organNames = [...new Set(selectedFindings.map(f =>
      organMap[f.organId]?.name
    ))].filter(Boolean);

    if (organNames.length > 0) {
      report += `${template.abnormalImpressionIntro} ${organNames.join(', ')}.`;
    } else {
      report += `${template.abnormalImpressionIntro} conforme descrito acima.`;
    }

    if (template.abnormalImpressionSuffix && normalOrgans.length > 0) {
      report += template.abnormalImpressionSuffix;
    }

    if (normalOrgans.length > 0) {
      report += ` Demais estruturas avaliadas dentro da normalidade.`;
    }
  }

  if (additionalNotes) {
    report += '\n\n**Observações:** ' + additionalNotes;
  }

  return report;
}
