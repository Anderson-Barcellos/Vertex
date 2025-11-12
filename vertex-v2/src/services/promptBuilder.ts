import type { SelectedFinding } from '@/types/report';

export interface ReportPromptPayload {
  examType?: string;
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  organsCatalog?: Array<{ id: string; name: string }>;
}

const FALLBACK_EXAM = 'Ultrassonografia Abdominal';

const resolveOrganName = (
  organId: string,
  catalog?: ReportPromptPayload['organsCatalog']
): string => {
  if (!catalog || catalog.length === 0) return organId;
  return catalog.find((organ) => organ.id === organId)?.name ?? organId;
};

export function buildReportPrompt(data: ReportPromptPayload): string {
  const { examType, selectedFindings, normalOrgans, organsCatalog } = data;
  let prompt = `Gere um laudo de ${examType || FALLBACK_EXAM} baseado nos seguintes achados:\n\n`;

  if (selectedFindings.length > 0) {
    prompt += 'ACHADOS PATOLÓGICOS:\n';

    selectedFindings.forEach((finding) => {
      const organName = resolveOrganName(finding.organId, organsCatalog);
      prompt += `\n**${organName}:**\n`;
      prompt += `- ${finding.finding.name}`;

      if (finding.severity) {
        prompt += ` (${finding.severity})`;
      }

      if (finding.instances && finding.instances.length > 0) {
        prompt += '\n  Detalhes:\n';
        finding.instances.forEach((instance, idx) => {
          prompt += `  ${idx + 1}. `;

          const measurements = instance.measurements;
          const segments: string[] = [];

          if (measurements.size) segments.push(`Tamanho: ${measurements.size}`);
          if (measurements.location) segments.push(`Localização: ${measurements.location}`);
          if (measurements.segment) segments.push(`Segmento: ${measurements.segment}`);
          if (measurements.vps) segments.push(`VPS: ${measurements.vps} cm/s`);
          if (measurements.vdf) segments.push(`VDF: ${measurements.vdf} cm/s`);
          if (measurements.ratioICA_CCA) segments.push(`Razão ICA/CCA: ${measurements.ratioICA_CCA}`);
          if (measurements.ratioICA_ICA) segments.push(`Razão ICA/ICA contralateral: ${measurements.ratioICA_ICA}`);
          if (measurements.emi) segments.push(`EMI: ${measurements.emi} mm`);
          if (measurements.plaqueEchogenicity) segments.push(`Ecogenicidade da placa: ${measurements.plaqueEchogenicity}`);
          if (measurements.plaqueComposition) segments.push(`Composição da placa: ${measurements.plaqueComposition}`);
          if (measurements.plaqueSurface) segments.push(`Superfície da placa: ${measurements.plaqueSurface}`);
          if (measurements.plaqueRisk) segments.push(`Risco plaquetário: ${measurements.plaqueRisk}`);
          if (measurements.vertebralFlowPattern) segments.push(`Fluxo vertebral: ${measurements.vertebralFlowPattern}`);
          if (measurements.subclavianSteal) segments.push(`Roubo da subclávia: ${measurements.subclavianSteal}`);

          // BI-RADS specific fields (Mammography)
          if (measurements.quadrant) segments.push(`Quadrante: ${measurements.quadrant}`);
          if (measurements.depth) segments.push(`Profundidade: ${measurements.depth}`);
          if (measurements.distanceFromNipple) segments.push(`Distância do mamilo: ${measurements.distanceFromNipple} cm`);
          if (measurements.shape) segments.push(`Forma: ${measurements.shape}`);
          if (measurements.margins) segments.push(`Margens: ${measurements.margins}`);
          if (measurements.orientation) segments.push(`Orientação: ${measurements.orientation}`);
          if (measurements.echogenicity) segments.push(`Ecogenicidade: ${measurements.echogenicity}`);
          if (measurements.posteriorFeatures) segments.push(`Acústica posterior: ${measurements.posteriorFeatures}`);
          if (measurements.vascularization) segments.push(`Vascularização: ${measurements.vascularization}`);
          if (measurements.resistivityIndex) segments.push(`IR: ${measurements.resistivityIndex}`);
          if (measurements.biRadsCategory) segments.push(`BI-RADS: ${measurements.biRadsCategory}`);
          if (measurements.composition) segments.push(`Composição: ${measurements.composition}`);
          if (measurements.calcificationMorphology) segments.push(`Calcificações (morfologia): ${measurements.calcificationMorphology}`);
          if (measurements.calcificationDistribution) segments.push(`Calcificações (distribuição): ${measurements.calcificationDistribution}`);

          if (segments.length === 0) {
            prompt += 'Sem medidas adicionais informadas.';
          } else {
            prompt += segments.join(' | ');
          }

          prompt += '\n';
        });
      }
      prompt += '\n';
    });
  }

  if (normalOrgans.length > 0) {
    prompt += '\nÓRGÃOS NORMAIS:\n';
    normalOrgans.forEach((organId) => {
      const organName = resolveOrganName(organId, organsCatalog);
      prompt += `- ${organName}\n`;
    });
  }

  return prompt;
}
