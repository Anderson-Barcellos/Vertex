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
  'measurement',
  'nascet',
  'ratio',
  'plaqueEchogenicity',
  'plaqueComposition',
  'plaqueSurface',
  'vertebralFlowPattern',
  'flowPattern',
  'emi',
  'emiValue',
  'emiClassification',
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
  },

  'Ecodoppler Arterial de Membros Inferiores': {
    systemInstruction: `Você é um radiologista vascular especialista em doença arterial periférica.
    
    ## DIRETRIZES ESPECÍFICAS:
    - Sempre mencione os valores de ITB (Índice Tornozelo-Braquial) e sua interpretação
    - Para pacientes diabéticos com artérias calcificadas, valorize o IDB (Índice Dedo-Braquial)
    - Use a classificação de Fontaine para claudicação intermitente
    - Descreva padrão de onda (trifásico, bifásico, monofásico) em cada segmento
    - Para estenoses significativas (>50%), correlacione com velocidades e razão VPS
    - Em oclusões, mencione circulação colateral e reenchimento distal
    - Use a classificação WIfI quando houver lesões tróficas`,

    conclusionTemplate: `
    ## CONCLUSÃO:
    - Valores de ITB bilaterais e classificação
    - Presença e localização de estenoses/oclusões significativas
    - Classificação de Fontaine
    - Recomendações (angiografia, revascularização, tratamento clínico)`,

    formatting: {
      sections: ['ÍNDICES PRESSÓRICOS', 'ARTÉRIAS ILÍACAS', 'ARTÉRIAS FEMORAIS', 'ARTÉRIAS POPLÍTEAS', 
                'ARTÉRIAS TIBIAIS', 'ARTÉRIAS PLANTARES', 'CONCLUSÃO'],
      emphasizeFindings: true,
      includeRecommendations: true
    }
  },

  'Ecodoppler Venoso de Membros Inferiores': {
    systemInstruction: `Você é um radiologista vascular especialista em doença venosa.
    
    ## DIRETRIZES ESPECÍFICAS:
    - Use a classificação CEAP para achados clínicos
    - Para refluxo, sempre mencione tempo de duração (>0.5s = patológico)
    - Descreva compressibilidade venosa em todos os segmentos
    - Para TVP, caracterize: aguda (hipoecóica) vs crônica (hiperecóica, espessamento parietal)
    - Avalie junções safeno-femoral e safeno-poplítea com manobra de Valsalva
    - Mencione diâmetros das safenas quando dilatadas
    - Identifique perfurantes insuficientes e sua localização`,

    conclusionTemplate: `
    ## CONCLUSÃO:
    - Presença ou ausência de TVP
    - Classificação CEAP
    - Refluxo em sistemas superficial, profundo e perfurantes
    - Recomendações (compressão elástica, escleroterapia, cirurgia)`,

    formatting: {
      sections: ['SISTEMA VENOSO PROFUNDO', 'SAFENA MAGNA', 'SAFENA PARVA', 'PERFURANTES', 
                'CLASSIFICAÇÃO CEAP', 'CONCLUSÃO'],
      emphasizeFindings: true,
      includeRecommendations: true
    }
  },

  'Ultrassonografia de Tireoide': {
    systemInstruction: `Você é um radiologista especialista em tireoide e paratireoides.
    
    ## DIRETRIZES ESPECÍFICAS:
    - Use classificação TI-RADS ACR 2017 para todos os nódulos
    - Descreva: composição, ecogenicidade, forma, margens e focos ecogênicos
    - Para nódulos >1cm ou suspeitos, mencione necessidade de PAAF
    - Avalie linfonodos cervicais (níveis I-VII)
    - Em tireoidites, descreva padrão de vascularização (inferno tireoidiano)
    - Correlacione com dados laboratoriais quando disponíveis`,

    conclusionTemplate: `
    ## CONCLUSÃO:
    - Características da glândula (dimensões, ecotextura)
    - Nódulos com classificação TI-RADS individual
    - Linfonodomegalias suspeitas
    - Recomendações (PAAF, seguimento, correlação laboratorial)`,

    formatting: {
      sections: ['LOBO DIREITO', 'ISTMO', 'LOBO ESQUERDO', 'LINFONODOS CERVICAIS', 'CONCLUSÃO'],
      emphasizeFindings: true,
      includeRecommendations: true
    }
  },

  'Ecodoppler de Vasos Abdominais': {
    systemInstruction: `Você é um radiologista vascular especialista em hemodinâmica abdominal.
    
    ## DIRETRIZES ESPECÍFICAS:
    - Para aorta abdominal, sempre mencione diâmetro máximo e presença de aneurisma (>3cm)
    - Avalie artérias renais: VPS >180cm/s sugere estenose >60%
    - Para artérias mesentéricas, valorize VPS em jejum
    - Na hipertensão portal, avalie direção do fluxo portal e colaterais
    - Descreva padrão de onda hepática (trifásico normal vs bifásico/monofásico)
    - Para TIPS, avalie velocidades e gradiente de pressão`,

    conclusionTemplate: `
    ## CONCLUSÃO:
    - Calibre e fluxo da aorta abdominal
    - Patência de artérias viscerais
    - Sistema porta (direção, velocidade, colaterais)
    - Recomendações específicas`,

    formatting: {
      sections: ['AORTA ABDOMINAL', 'ARTÉRIAS RENAIS', 'TRONCO CELÍACO', 'ARTÉRIA MESENTÉRICA SUPERIOR', 
                'SISTEMA PORTA', 'VEIAS HEPÁTICAS', 'CONCLUSÃO'],
      emphasizeFindings: true,
      includeRecommendations: true
    }
  },

  'Ultrassonografia de Parede Abdominal': {
    systemInstruction: `Você é um radiologista especialista em parede abdominal e hérnias.
    
    ## DIRETRIZES ESPECÍFICAS:
    - Para hérnias, descreva: localização, dimensões do defeito, conteúdo, redutibilidade
    - Use manobras dinâmicas (Valsalva) para avaliar hérnias ocultas
    - Em diástase de retos, meça distância inter-retos em 3 níveis
    - Para coleções pós-operatórias, diferencie seroma vs hematoma vs abscesso
    - Identifique telas cirúrgicas e complicações (dobras, migração, infecção)`,

    conclusionTemplate: `
    ## CONCLUSÃO:
    - Presença e caracterização de hérnias
    - Diástase de retos (se presente)
    - Coleções ou complicações pós-operatórias
    - Recomendações cirúrgicas`,

    formatting: {
      sections: ['REGIÃO INGUINAL', 'REGIÃO UMBILICAL', 'LINHA ALBA', 'CICATRIZES CIRÚRGICAS', 'CONCLUSÃO'],
      emphasizeFindings: true,
      includeRecommendations: true
    }
  },

  'Ultrassonografia de Ombro': {
    systemInstruction: `Você é um radiologista musculoesquelético especialista em ombro.
    
    ## DIRETRIZES ESPECÍFICAS:
    - Avalie sistematicamente o manguito rotador: supraespinhal, infraespinhal, subescapular, redondo menor
    - Para roturas, classifique: parcial (bursal/articular/intratendinosa) vs completa
    - Meça gap e retração tendinosa em roturas completas
    - Descreva atrofia muscular e infiltração gordurosa (Goutallier)
    - Avalie tendão bicipital: posição, líquido peritendinoso, subluxação
    - Identifique bursites: subacromial-subdeltoidea, subcoracoidea
    - Teste dinâmico para impacto subacromial
    - Correlacione com manobras clínicas (Jobe, Gerber, Patte)`,

    conclusionTemplate: `
    ## CONCLUSÃO:
    - Integridade do manguito rotador
    - Caracterização de roturas (localização, extensão, retração)
    - Presença de tendinopatias ou bursites
    - Recomendações (fisioterapia, infiltração, RM, cirurgia)`,

    formatting: {
      sections: ['TENDÃO SUPRAESPINHAL', 'TENDÃO INFRAESPINHAL', 'TENDÃO SUBESCAPULAR', 
                'TENDÃO BICIPITAL', 'BURSA SUBACROMIAL', 'ARTICULAÇÃO ACROMIOCLAVICULAR', 'CONCLUSÃO'],
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
