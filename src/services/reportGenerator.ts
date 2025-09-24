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
    const requestPayload = createGeminiReportRequest(data, {
      model: resolvedModel,
      organsList,
      promptTemplate
    });
    const { text } = await requestGeminiContent(requestPayload);
    return text;
  } catch (error) {
    console.error('Error generating report with Gemini:', error);
    return generateBasicReport(data, organsList, promptTemplate);
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
              let detail = '';
              if (inst.measurements.size) detail += inst.measurements.size;
              if (inst.measurements.segment) detail += ` no segmento ${inst.measurements.segment}`;
              if (inst.measurements.location) detail += ` em ${inst.measurements.location}`;
              return detail;
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
