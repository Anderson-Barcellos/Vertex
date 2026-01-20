import type { SelectedFinding } from '@/types/report';

const FIELD_LABELS: Record<string, string> = {
  size: 'Tamanho',
  location: 'Localização',
  segment: 'Segmento',
  vps: 'VPS',
  vdf: 'VDF',
  ratioICA_CCA: 'Razão ICA/CCA',
  ratioICA_ICA: 'Razão ICA/ICA contralateral',
  ratio_aci_acc: 'Razão ACI/ACC',
  nascetGrade: 'Grau NASCET',
  nascet_grade: 'Grau NASCET',
  stenosis_percent: 'Estenose estimada',
  extension: 'Extensão longitudinal',
  diameter: 'Diâmetro',
  emi: 'EMI',
  emi_value: 'EMI',
  emi_classification: 'Classificação EMI',
  emiClassification: 'Classificação EMI',
  echogenicity: 'Ecogenicidade',
  plaqueEchogenicity: 'Ecogenicidade da placa',
  composition: 'Composição',
  plaqueComposition: 'Composição da placa',
  surface: 'Superfície',
  plaqueSurface: 'Superfície da placa',
  risk: 'Estratificação de risco',
  plaqueRisk: 'Risco plaquetário',
  flow_pattern: 'Padrão de fluxo',
  vertebralFlowPattern: 'Fluxo vertebral',
  subclavian_steal: 'Roubo da subclávia',
  subclavianSteal: 'Roubo da subclávia',
  ir: 'Índice de Resistividade (IR)',
  description: 'Observações',
  texto: 'Observações',
  
  quadrant: 'Quadrante',
  depth: 'Profundidade',
  distanceFromNipple: 'Distância do mamilo',
  clockPosition: 'Posição horária',
  shape: 'Forma',
  margins: 'Margens',
  orientation: 'Orientação',
  posteriorFeatures: 'Acústica posterior',
  vascularization: 'Vascularização',
  vascularPattern: 'Padrão vascular',
  peakVelocity: 'Velocidade de pico',
  pulsatilityIndex: 'IP',
  resistivityIndex: 'IR',
  mobility: 'Mobilidade',
  elastographyScore: 'Elastografia',
  strainRatio: 'Strain ratio',
  biradsCategory: 'BI-RADS',
  calcificationMorphology: 'Calcificações (morfologia)',
  calcificationDistribution: 'Calcificações (distribuição)',
  internalContent: 'Conteúdo interno',
  wallThickness: 'Espessura parede',
  surroundingEdema: 'Edema',
  implantType: 'Tipo implante',
  ruptureType: 'Tipo ruptura',
  bakerGrade: 'Baker',
  corticalThickness: 'Espessura cortical',
  hilusPresence: 'Hilo',
  morphology: 'Morfologia',
  axillaryLevel: 'Nível axilar',
  
  visibilidade: 'Visibilidade',
  manobra: 'Manobra realizada',
  ostio: 'Óstio',
  saco: 'Saco herniário',
  conteudo: 'Conteúdo',
  redutibilidade: 'Redutibilidade',
  distancia: 'Distância inter-retos',
  nivel: 'Nível',
  local: 'Local da cicatriz',
  lado: 'Lado',
  
  'localizacao-lipoma': 'Localização',
  'ecogenicidade-lipoma': 'Ecogenicidade',
  'contornos-lipoma': 'Contornos',
  'localizacao-endo': 'Localização',
  'ecogenicidade-endo': 'Ecogenicidade',
  'vascularizacao-endo': 'Vascularização',
  'sintomas-ciclicos': 'Dor cíclica',
  'localizacao-seroma': 'Localização',
  'conteudo-seroma': 'Conteúdo',
  'tempo-pos-op': 'Tempo pós-operatório',
  'localizacao-hematoma': 'Localização',
  'fase-hematoma': 'Fase',
  'causa-hematoma': 'Causa',
  'localizacao-abscesso': 'Localização',
  'conteudo-abscesso': 'Conteúdo',
  'parede-abscesso': 'Parede',
  'localizacao-nodulo': 'Localização',
  'ecogenicidade-nodulo': 'Ecogenicidade',
  'vascularizacao-nodulo': 'Vascularização',
  'mobilidade-nodulo': 'Mobilidade',
  'localizacao-tela': 'Localização',
  'aspecto-tela': 'Aspecto',
  'localizacao-comp': 'Localização',
  'tipo-comp': 'Tipo de complicação',
  colecao: 'Coleção associada',
  
  refluxo_tempo: 'Tempo de refluxo',
  manobra_realizada: 'Manobra realizada',
  calibre: 'Calibre',
  extensao: 'Extensão',
  localizacao: 'Localização',
  ceap: 'Classificação CEAP',
  trombo_aspecto: 'Aspecto do trombo',
  compressibilidade: 'Compressibilidade',
  fluxo: 'Fluxo',
  
  itb_repouso: 'ITB repouso',
  itb_pos_exercicio: 'ITB pós-exercício',
  tempo_recuperacao: 'Tempo recuperação',
  classificacao_itb: 'Classificação ITB',
  morfologia_aneurisma: 'Morfologia',
  trombo_mural: 'Trombo mural',
  extensao_aneurisma: 'Extensão',
};

function formatFieldName(key: string): string {
  return key
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const REDUNDANT_FIELDS = new Set([
  'measurement',  // Remove duplicação quando há campos específicos
  'emi',  // Remove duplicação - mantém apenas emi_value
  'emiValue',
  'emi_classification',  // Remove duplicação - campo já processado
  'emiClassification',
  'nascet',
  'ratio',
  'plaqueEchogenicity',
  'plaqueComposition',
  'plaqueSurface',
  'vertebralFlowPattern',
  'flowPattern',
]);

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

          Object.entries(measurements).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '' && !REDUNDANT_FIELDS.has(key)) {
              const label = FIELD_LABELS[key] || formatFieldName(key);
              segments.push(`${label}: ${value}`);
            }
          });

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
