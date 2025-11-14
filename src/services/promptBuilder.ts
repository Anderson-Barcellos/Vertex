import type { SelectedFinding } from '@/types/report';

export interface ReportPromptPayload {
  examType?: string;
  selectedFindings: SelectedFinding[];
  normalOrgans: string[];
  organsCatalog?: Array<{ id: string; name: string }>;
}

const FALLBACK_EXAM = 'Ultrassonografia Abdominal';

/**
 * Templates especializados por tipo de exame
 */
const EXAM_TEMPLATES = {
  'Ultrassonografia Mamária (BI-RADS)': {
    systemInstruction: `Você é um radiologista especialista em ultrassonografia mamária com 20+ anos de experiência. 
    Sua especialidade é interpretar achados ultrassonográficos mamários conforme as diretrizes BI-RADS 2013/2023.

    ## DIRETRIZES ESPECÍFICAS:
    - Use terminologia BI-RADS oficial em todas as descrições
    - Para nódulos sólidos, sempre descreva: forma, margens, orientação, ecogenicidade, características posteriores
    - Correlacione achados de elastografia e Doppler quando disponíveis
    - Mencione posição horária (clock position) para facilitar localização
    - Para lesões BI-RADS 4 ou 5, sempre mencione necessidade de investigação histológica
    - Correlacione achados bilaterais quando relevante
    - Use nomenclatura anatômica correta (quadrantes, prolongamento axilar, região retroareolar)`,
    
    conclusionTemplate: `
    ## CONCLUSÃO:
    - Sumarizar achados mais significativos
    - Classificação BI-RADS final por mama
    - Recomendações específicas (controle, biópsia, etc.)
    - Correlação clínica quando indicada`,

    formatting: {
      sections: ['TÉCNICA', 'MAMA DIREITA', 'MAMA ESQUERDA', 'LINFONODOS AXILARES', 'CONCLUSÃO'],
      emphasizeFindings: true,
      includeRecommendations: true
    }
  },

  'Ultrassonografia Abdominal': {
    systemInstruction: `Você é um radiologista especialista em ultrassonografia abdominal.
    Descreva os achados de forma sistemática, órgão por órgão, usando terminologia médica precisa.`,
    
    conclusionTemplate: `
    ## CONCLUSÃO:
    - Sumarizar principais achados
    - Correlação clínica quando indicada
    - Recomendações de seguimento se necessário`,

    formatting: {
      sections: ['FÍGADO', 'VESÍCULA BILIAR', 'VIAS BILIARES', 'PÂNCREAS', 'BAÇO', 'RINS', 'BEXIGA', 'AORTA'],
      emphasizeFindings: false,
      includeRecommendations: false
    }
  },

  'Ecodoppler de Carótidas': {
    systemInstruction: `Você é um radiologista especialista em Doppler vascular.
    Use critérios NASCET para graduação de estenoses. Sempre correlacione achados morfológicos com dados hemodinâmicos.
    Descreva placas ateroscleróticas conforme classificação de Gray-Weale.`,

    conclusionTemplate: `
    ## CONCLUSÃO:
    - Grau de estenose bilateral (critérios NASCET)
    - Caracterização das placas e risco embólico
    - Recomendações de seguimento`,

    formatting: {
      sections: ['CARÓTIDA COMUM DIREITA', 'CARÓTIDA INTERNA DIREITA', 'CARÓTIDA EXTERNA DIREITA', 
                'CARÓTIDA COMUM ESQUERDA', 'CARÓTIDA INTERNA ESQUERDA', 'CARÓTIDA EXTERNA ESQUERDA', 'VERTEBRAIS'],
      emphasizeFindings: true,
      includeRecommendations: true
    }
  }
};

const resolveOrganName = (
  organId: string,
  catalog?: ReportPromptPayload['organsCatalog']
): string => {
  if (!catalog || catalog.length === 0) return organId;
  return catalog.find((organ) => organ.id === organId)?.name ?? organId;
};

/**
 * Constrói prompt especializado baseado no tipo de exame
 */
export function buildSpecializedPrompt(data: ReportPromptPayload): string {
  const { examType } = data;
  const template = EXAM_TEMPLATES[examType as keyof typeof EXAM_TEMPLATES];
  
  if (!template) {
    return buildReportPrompt(data);
  }

  let prompt = `${template.systemInstruction}\n\n`;
  prompt += `Gere um laudo de ${examType} profissional e detalhado baseado nos seguintes achados:\n\n`;
  prompt += buildClinicalFindings(data);
  prompt += `\n${template.conclusionTemplate}\n\n`;
  
  if (template.formatting.emphasizeFindings) {
    prompt += `## INSTRUÇÕES ESPECÍFICAS:\n`;
    prompt += `- Use formatação markdown para destacar achados importantes\n`;
    prompt += `- Para cada lesão significativa, sempre mencione localização precisa\n`;
    prompt += `- Organize o texto por estruturas anatômicas\n`;
  }

  if (template.formatting.includeRecommendations) {
    prompt += `- Inclua recomendações específicas de seguimento\n`;
    prompt += `- Mencione necessidade de correlação clínica quando apropriado\n`;
  }

  return prompt;
}

/**
 * Função original mantida para compatibilidade
 */
export function buildReportPrompt(data: ReportPromptPayload): string {
  const { examType, selectedFindings, normalOrgans, organsCatalog } = data;
  let prompt = `Gere um laudo de ${examType || FALLBACK_EXAM} baseado nos seguintes achados:\n\n`;
  prompt += buildClinicalFindings(data);
  return prompt;
}

/**
 * Constrói seção de achados clínicos (reutilizada pelas duas funções)
 */
function buildClinicalFindings(data: ReportPromptPayload): string {
  const { selectedFindings, normalOrgans, organsCatalog } = data;
  let content = '';

  if (selectedFindings.length > 0) {
    content += 'ACHADOS PATOLÓGICOS:\n';

    selectedFindings.forEach((finding) => {
      const organName = resolveOrganName(finding.organId, organsCatalog);
      content += `\n**${organName}:**\n`;
      content += `- ${finding.finding.name}`;

      if (finding.severity) {
        content += ` (${finding.severity})`;
      }

      if (finding.instances && finding.instances.length > 0) {
        content += '\n  Detalhes:\n';
        finding.instances.forEach((instance, idx) => {
          content += `  ${idx + 1}. `;

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

          // BI-RADS specific fields (Breast Ultrasound)
          if (measurements.quadrant) segments.push(`Quadrante: ${measurements.quadrant}`);
          if (measurements.depth) segments.push(`Profundidade: ${measurements.depth}`);
          if (measurements.distanceFromNipple) segments.push(`Distância do mamilo: ${measurements.distanceFromNipple}`);
          if (measurements.clockPosition) segments.push(`Posição: ${measurements.clockPosition}`);
          if (measurements.shape) segments.push(`Forma: ${measurements.shape}`);
          if (measurements.margins) segments.push(`Margens: ${measurements.margins}`);
          if (measurements.orientation) segments.push(`Orientação: ${measurements.orientation}`);
          if (measurements.echogenicity) segments.push(`Ecogenicidade: ${measurements.echogenicity}`);
          if (measurements.posteriorFeatures) segments.push(`Acústica posterior: ${measurements.posteriorFeatures}`);
          if (measurements.vascularization) segments.push(`Vascularização: ${measurements.vascularization}`);
          if (measurements.vascularPattern) segments.push(`Padrão vascular: ${measurements.vascularPattern}`);
          if (measurements.peakVelocity) segments.push(`Velocidade de pico: ${measurements.peakVelocity}`);
          if (measurements.pulsatilityIndex) segments.push(`IP: ${measurements.pulsatilityIndex}`);
          if (measurements.resistivityIndex) segments.push(`IR: ${measurements.resistivityIndex}`);
          if (measurements.mobility) segments.push(`Mobilidade: ${measurements.mobility}`);
          if (measurements.elastographyScore) segments.push(`Elastografia: ${measurements.elastographyScore}`);
          if (measurements.strainRatio) segments.push(`Strain ratio: ${measurements.strainRatio}`);
          if (measurements.biradsCategory) segments.push(`BI-RADS: ${measurements.biradsCategory}`);
          if (measurements.composition) segments.push(`Composição: ${measurements.composition}`);
          if (measurements.calcificationMorphology) segments.push(`Calcificações (morfologia): ${measurements.calcificationMorphology}`);
          if (measurements.calcificationDistribution) segments.push(`Calcificações (distribuição): ${measurements.calcificationDistribution}`);
          
          // Specific findings fields
          if (measurements.internalContent) segments.push(`Conteúdo: ${measurements.internalContent}`);
          if (measurements.wallThickness) segments.push(`Espessura parede: ${measurements.wallThickness}`);
          if (measurements.surroundingEdema) segments.push(`Edema: ${measurements.surroundingEdema}`);
          if (measurements.implantType) segments.push(`Tipo implante: ${measurements.implantType}`);
          if (measurements.ruptureType) segments.push(`Tipo ruptura: ${measurements.ruptureType}`);
          if (measurements.bakerGrade) segments.push(`Baker: ${measurements.bakerGrade}`);
          if (measurements.corticalThickness) segments.push(`Espessura cortical: ${measurements.corticalThickness}`);
          if (measurements.hilusPresence) segments.push(`Hilo: ${measurements.hilusPresence}`);
          if (measurements.morphology) segments.push(`Morfologia: ${measurements.morphology}`);
          if (measurements.axillaryLevel) segments.push(`Nível: ${measurements.axillaryLevel}`);

          if (segments.length === 0) {
            content += 'Sem medidas adicionais informadas.';
          } else {
            content += segments.join(' | ');
          }

          content += '\n';
        });
      }
      content += '\n';
    });
  }

  if (normalOrgans.length > 0) {
    content += '\nÓRGÃOS NORMAIS:\n';
    normalOrgans.forEach((organId) => {
      const organName = resolveOrganName(organId, organsCatalog);
      content += `- ${organName}\n`;
    });
  }

  return content;
}
