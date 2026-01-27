import { Organ, OrganCategory, Finding } from './organs';
import {
  PLAQUE_COMPOSITION as COMMON_PLAQUE_COMPOSITION,
  PLAQUE_SURFACE as COMMON_PLAQUE_SURFACE,
  PLAQUE_LOCATION,
  LATERALITY
} from './shared/commonFields';

// ============================================================================
// CONSTANTES - DIRETRIZES ESVS 2023 / IAC 2021 / SRU 2003
// ============================================================================

// Status Sintomático do Paciente (ESVS 2023 - Essencial para indicação)
export const PATIENT_SYMPTOMS = [
  'Assintomático',
  'AIT hemisférico ipsilateral (<6 meses)',
  'AVC isquêmico ipsilateral (<6 meses)',
  'Amaurose fugaz ipsilateral',
  'AIT/AVC >6 meses (considerar assintomático)',
  'Sintomas inespecíficos (tontura, cefaleia)'
];

// GSM (Gray Scale Median) - Vulnerabilidade de Placa
export const PLAQUE_GSM = [
  { value: 'tipo1-ecolucente', label: 'Tipo 1 - Ecolucente (GSM <25) - ALTO RISCO', risk: 'high' },
  { value: 'tipo2-predominante-ecolucente', label: 'Tipo 2 - Predominantemente ecolucente (GSM 25-50)', risk: 'high' },
  { value: 'tipo3-predominante-ecogenica', label: 'Tipo 3 - Predominantemente ecogênica (GSM 50-75)', risk: 'medium' },
  { value: 'tipo4-ecogenica', label: 'Tipo 4 - Ecogênica/Calcificada (GSM >75)', risk: 'low' }
];

// Features de Placa Vulnerável (ESVS 2023)
export const VULNERABLE_PLAQUE_FEATURES = [
  'JBA - Área negra justa-luminal (juxta-luminal black area)',
  'IPN - Neovascularização intraplaca (ao CEUS)',
  'DWA - Áreas brancas discretas (calcificações focais)',
  'Hemorragia intraplaca (hiperecóica focal)',
  'Ulceração >2mm de profundidade',
  'Trombo luminal',
  'Superfície irregular',
  'Progressão rápida (>0.5mm/ano)'
];

// Indicações de Intervenção (ESVS 2023)
export const INTERVENTION_INDICATION = {
  symptomatic: {
    '50-99%': 'Classe I - CEA/CAS recomendado (idealmente <14 dias do evento)',
    '<50%': 'Classe III - Intervenção NÃO recomendada'
  },
  asymptomatic: {
    '>60%': 'Classe IIa - Considerar CEA se expectativa de vida >5 anos e risco cirúrgico <3%',
    '60-99% + high_risk_features': 'Classe I - CEA recomendado se features de alto risco',
    '<60%': 'Classe III - Apenas tratamento clínico otimizado (BMT)'
  }
};

// Features de Alto Risco em Assintomáticos (ESVS 2023)
export const HIGH_RISK_FEATURES_ASYMPTOMATIC = [
  'Progressão de estenose >20% em 6 meses',
  'Estenose contralateral ocluída',
  'Infartos silenciosos ipsilaterais na TC/RM',
  'Placa ecolucente (MEC <25)',
  'Hemorragia intraplaca na RM',
  'Microêmbolos ao DTC (Doppler transcraniano)',
  'Reserva cerebrovascular reduzida',
  'Estenose >80%'
];

// Critérios IAC 2021 (Atualização dos SRU 2003)
export const IAC_2021_CRITERIA = {
  normal: { stenosis: 'Normal', vps: '<125', edv: '<40', ratio: '<2.0' },
  mild: { stenosis: '<50% (leve)', vps: '<125', edv: '<40', ratio: '<2.0', note: 'Placa visível sem aceleração' },
  moderate_50_69: { stenosis: '50-69% (moderada)', vps: '125-230', edv: '40-100', ratio: '2.0-4.0' },
  severe_70_99: { stenosis: '≥70% (grave)', vps: '>230', edv: '>100', ratio: '>4.0' },
  near_occlusion: { stenosis: 'Suboclusão', vps: 'Variável/Baixa', edv: 'Variável', ratio: 'Variável', note: 'Sinal de cordão, fluxo filiforme' },
  occlusion: { stenosis: 'Oclusão', vps: 'Ausente', edv: 'Ausente', ratio: 'N/A' }
};

// Borramento Espectral - Critério adicional
export const SPECTRAL_BROADENING = [
  'Ausente (janela espectral preservada)',
  'Leve (preenchimento parcial da janela)',
  'Moderado (janela quase preenchida)',
  'Acentuado (janela totalmente preenchida)'
];

// Critérios adicionais de estenose
export const ADDITIONAL_STENOSIS_CRITERIA = [
  'Turbulência pós-estenótica',
  'Aliasing ao color Doppler',
  'Mosaico de cores',
  'Jato de alta velocidade focal',
  'Fluxo tardus-parvus distal'
];

// Velocidades e Critérios de Estenose (SRU 2003 + IAC 2021)
export const VELOCITY_THRESHOLDS = {
  VPS_NORMAL: '<125 cm/s',
  VPS_MODERATE: '125-230 cm/s',
  VPS_SEVERE: '>230 cm/s',
  VPS_CRITICAL: '>280 cm/s',
  VPS_POST_SURGERY: '>300 cm/s',
  VDF_MODERATE: '>100 cm/s',
  VDF_SEVERE: '>125 cm/s'
};

export const STENOSIS_RATIO = {
  MILD: 'VPS ACI/ACC ≥2.0',
  MODERATE: 'VPS ACI/ACC ≥4.0',
  SEVERE: 'VPS ACI/ACC >5.0'
};

export const NASCET_CRITERIA = [
  'Normal (sem estenose)',
  '<50% (leve)',
  '50-69% (moderada)',
  '70-89% (grave)',
  '90-99% (crítica)',
  'Suboclusão',
  'Oclusão'
];

// Placas Ateroscleróticas (Classificação Gray-Weale)
export const PLAQUE_ECHOGENICITY = [
  'Hipoecogênica (tipo I)',
  'Predominantemente hipoecogênica (tipo II)',
  'Predominantemente hiperecogênica (tipo III)',
  'Hiperecogênica homogênea (tipo IV)'
];

// Helper para classificação automática Gray-Weale baseada na ecogenicidade
export const getGrayWealeType = (ecogenicity: string, composition?: string): string => {
  const lower = ecogenicity.toLowerCase();
  const compLower = composition?.toLowerCase() || '';
  
  if (lower.includes('tipo i)') || lower.includes('tipo i ')) return 'I';
  if (lower.includes('tipo ii)') || lower.includes('tipo ii ')) return 'II';
  if (lower.includes('tipo iii)') || lower.includes('tipo iii ')) return 'III';
  if (lower.includes('tipo iv)') || lower.includes('tipo iv ')) return 'IV';
  
  const isHypoechoic = lower.includes('hipo') || lower.includes('ecolucente') || lower.includes('lipídica') || lower.includes('lipidica');
  const isHyperechoic = lower.includes('hiper') || lower.includes('ecogênica') || lower.includes('fibrosa');
  const isCalcified = lower.includes('calcif') || compLower.includes('calcif');
  const isHeterogeneous = lower.includes('hetero') || compLower.includes('hetero') || compLower.includes('mista');
  const isHomogeneous = lower.includes('homo') || compLower.includes('homo');
  
  if (isCalcified && isHomogeneous) return 'IV';
  if (isHyperechoic && isHomogeneous) return 'IV';
  if (isHyperechoic && !isHeterogeneous) return 'IV';
  
  if (isHypoechoic && isHomogeneous) return 'I';
  if (isHypoechoic && !isHeterogeneous) return 'I';
  
  if (isHypoechoic && isHeterogeneous) return 'II';
  if (isHyperechoic && isHeterogeneous) return 'III';
  
  if (isHypoechoic) return 'II';
  if (isHyperechoic) return 'III';
  
  return '';
};

export const GRAY_WEALE_DESCRIPTIONS: Record<string, string> = {
  'I': 'Uniformemente ecolucente - ALTO RISCO',
  'II': 'Predominantemente ecolucente - ALTO RISCO',
  'III': 'Predominantemente ecogênica - RISCO MODERADO',
  'IV': 'Uniformemente ecogênica - BAIXO RISCO'
};

export const PLAQUE_COMPOSITION = COMMON_PLAQUE_COMPOSITION;

export const PLAQUE_SURFACE_TYPE = COMMON_PLAQUE_SURFACE;

export const PLAQUE_RISK = [
  'Baixo risco (homogênea, regular)',
  'Alto risco (heterogênea, irregular)',
  'Muito alto risco (ulcerada + fluxo interno)'
];

// EMI (Espessamento Médio-Intimal)
export const EMI_VALUES = [
  'Normal (<0.9 mm)',
  'Limítrofe (0.9-1.0 mm)',
  'Espessado (1.0-1.4 mm)',
  'Muito alterado (>1.4 mm)'
];

// Vertebrais
export const VERTEBRAL_VELOCITY = [
  'Normal (<60 cm/s)',
  'Elevada (60-100 cm/s)',
  'Muito elevada (>100 cm/s)'
];

export const VERTEBRAL_IR = [
  'Normal (0.55-0.75)',
  'Baixo (<0.55)',
  'Elevado (>0.75)'
];

// Valores padrão normais para velocidades
export const DEFAULT_VELOCITIES = {
  CCA_VPS: '60 cm/s',
  CCA_VDF: '20 cm/s',
  ICA_VPS: '80 cm/s',
  ICA_VDF: '25 cm/s',
  ECA_VPS: '70 cm/s',
  ECA_VDF: '18 cm/s',
  VERTEBRAL_VPS: '50 cm/s',
  VERTEBRAL_VDF: '15 cm/s',
  RATIO_ICA_CCA: '1.2'
};

export const FLOW_PATTERN_VERTEBRAL = [
  'Anterógrado (normal)',
  'Bidirecional (roubo parcial)',
  'Reverso (roubo completo)',
  'Ausente'
];

export const SUBCLAVIAN_STEAL = [
  'Ausente',
  'Roubo oculto (sístole variável)',
  'Roubo parcial (fluxo bidirecional)',
  'Roubo completo (fluxo reverso total)'
];

// ============================================================================
// NOVA ESTRUTURA - Segmentos carotídeos para consolidação
// ============================================================================

export const CAROTID_SEGMENTS = [
  'Carótida Comum',
  'Bulbo Carotídeo',
  'Carótida Interna',
  'Carótida Externa'
] as const;

export const ANATOMICAL_ALTERATIONS = [
  'Normal',
  'Kinking (dobra)',
  'Coiling (enrolamento)',
  'Tortuosidade acentuada',
  'Loop arterial'
] as const;

// ============================================================================
// CATEGORIAS DE ACHADOS COMPARTILHADAS
// ============================================================================

// Função helper para criar achados de placas com lado específico
const createPlaqueFindings = (defaultSide?: string): Finding[] => [
  {
    id: `placa-aterosclerotica${defaultSide ? `-${defaultSide.toLowerCase()}` : ''}`,
    name: 'Placa aterosclerótica',
    description: 'Depósito de colesterol na parede arterial',
    hasDetails: true,
    hasMeasurement: true,
    extraFields: [
      ...(defaultSide ? [] : [{
        id: 'lado',
        label: 'Lado',
        type: 'select' as const,
        options: [...LATERALITY]
      }]),
      {
        id: 'segmento',
        label: 'Segmento',
        type: 'select',
        options: [...CAROTID_SEGMENTS]
      },
      {
        id: 'localizacao',
        label: 'Localização específica',
        type: 'select',
        options: ['Proximal', 'Média', 'Distal', 'Bifurcação']
      },
      {
        id: 'echogenicity',
        label: 'Ecogenicidade (Gray-Weale)',
        type: 'select',
        options: PLAQUE_ECHOGENICITY
      },
      {
        id: 'composition',
        label: 'Composição',
        type: 'select',
        options: PLAQUE_COMPOSITION
      },
      {
        id: 'surface',
        label: 'Superfície',
        type: 'select',
        options: PLAQUE_SURFACE_TYPE
      },
      {
        id: 'extension',
        label: 'Extensão longitudinal (mm)',
        type: 'text',
        placeholder: 'Ex: 12'
      },
      {
        id: 'thickness',
        label: 'Espessura máxima (mm)',
        type: 'text',
        placeholder: 'Ex: 2.5'
      },
      {
        id: 'gsm',
        label: 'GSM (Gray Scale Median)',
        type: 'select',
        options: PLAQUE_GSM.map(p => p.label)
      },
      {
        id: 'vulnerable_features',
        label: 'Features de Vulnerabilidade',
        type: 'select',
        options: ['Nenhuma', ...VULNERABLE_PLAQUE_FEATURES]
      },
      {
        id: 'risk',
        label: 'Estratificação de Risco',
        type: 'select',
        options: PLAQUE_RISK
      }
    ]
  },
  {
    id: `placa-ulcerada${defaultSide ? `-${defaultSide.toLowerCase()}` : ''}`,
    name: 'Placa ulcerada',
    description: 'Placa aterosclerótica com ulceração (ALTO RISCO)',
    hasDetails: true,
    hasMeasurement: true,
    extraFields: [
      ...(defaultSide ? [] : [{
        id: 'lado',
        label: 'Lado',
        type: 'select' as const,
        options: [...LATERALITY]
      }]),
      {
        id: 'segmento',
        label: 'Segmento',
        type: 'select',
        options: [...CAROTID_SEGMENTS]
      },
      {
        id: 'ulcer_depth',
        label: 'Profundidade da úlcera (mm)',
        type: 'text',
        placeholder: 'Ex: 3'
      },
      {
        id: 'echogenicity',
        label: 'Ecogenicidade (Gray-Weale)',
        type: 'select',
        options: PLAQUE_ECHOGENICITY
      },
      {
        id: 'composition',
        label: 'Composição',
        type: 'select',
        options: PLAQUE_COMPOSITION
      },
      {
        id: 'extension',
        label: 'Extensão longitudinal (mm)',
        type: 'text',
        placeholder: 'Ex: 15'
      },
      {
        id: 'risk',
        label: 'Estratificação de Risco',
        type: 'select',
        options: ['Muito alto risco (ulcerada)']
      }
    ]
  }
];

// Função helper para criar achados hemodinâmicos
const createHemodynamicFindings = (defaultSide?: string, segmentOptions?: string[]): Finding[] => [
  {
    id: `estenose${defaultSide ? `-${defaultSide.toLowerCase()}` : ''}`,
    name: 'Estenose',
    description: 'Redução luminal arterial',
    hasDetails: true,
    hasMeasurement: true,
    extraFields: [
      ...(defaultSide ? [] : [{
        id: 'lado',
        label: 'Lado',
        type: 'select' as const,
        options: [...LATERALITY]
      }]),
      {
        id: 'segmento',
        label: 'Segmento',
        type: 'select',
        options: segmentOptions || [...CAROTID_SEGMENTS]
      },
      {
        id: 'symptomatic_status',
        label: 'Status Sintomático (ESVS 2023)',
        type: 'select',
        options: PATIENT_SYMPTOMS
      },
      {
        id: 'stenosis_percent',
        label: 'Estenose estimada (%)',
        type: 'text',
        placeholder: 'Ex: 65'
      },
      {
        id: 'vps',
        label: 'VPS (cm/s) - IAC: <125 normal, 125-230 moderada, >230 grave',
        type: 'text',
        placeholder: 'Ex: 250'
      },
      {
        id: 'vdf',
        label: 'VDF (cm/s) - IAC: <40 normal, 40-100 moderada, >100 grave',
        type: 'text',
        placeholder: 'Ex: 120'
      },
      {
        id: 'ratio_aci_acc',
        label: 'Razão VPS ACI/ACC - IAC: <2.0 normal, 2.0-4.0 moderada, >4.0 grave',
        type: 'text',
        placeholder: 'Ex: 4.2'
      },
      {
        id: 'nascet_grade',
        label: 'Grau NASCET',
        type: 'select',
        options: NASCET_CRITERIA
      },
      {
        id: 'spectral_broadening',
        label: 'Borramento Espectral',
        type: 'select',
        options: SPECTRAL_BROADENING
      },
      {
        id: 'intervention_indication',
        label: 'Indicação de Intervenção (ESVS 2023)',
        type: 'select',
        options: [
          'Classe I - CEA/CAS recomendado (sintomático ≥50%)',
          'Classe I - CEA recomendado (assintomático + alto risco)',
          'Classe IIa - Considerar CEA (assintomático >60%)',
          'Classe III - Apenas tratamento clínico (BMT)'
        ]
      }
    ]
  },
  {
    id: `oclusao${defaultSide ? `-${defaultSide.toLowerCase()}` : ''}`,
    name: 'Oclusão',
    description: 'Oclusão completa da artéria',
    hasDetails: true,
    extraFields: [
      ...(defaultSide ? [] : [{
        id: 'lado',
        label: 'Lado',
        type: 'select' as const,
        options: [...LATERALITY]
      }]),
      {
        id: 'segmento',
        label: 'Segmento',
        type: 'select',
        options: segmentOptions || [...CAROTID_SEGMENTS]
      },
      {
        id: 'extension_oclusao',
        label: 'Extensão (mm)',
        type: 'text',
        placeholder: 'Ex: 30'
      },
      {
        id: 'colaterais',
        label: 'Circulação colateral',
        type: 'select',
        options: ['Ausente', 'Presente via ACE', 'Presente via oftálmica', 'Presente via comunicantes']
      }
    ]
  },
  {
    id: `suboclusao${defaultSide ? `-${defaultSide.toLowerCase()}` : ''}`,
    name: 'Suboclusão (near-occlusion)',
    description: 'Estenose crítica com colapso distal',
    hasDetails: true,
    extraFields: [
      ...(defaultSide ? [] : [{
        id: 'lado',
        label: 'Lado',
        type: 'select' as const,
        options: [...LATERALITY]
      }]),
      {
        id: 'segmento',
        label: 'Segmento',
        type: 'select',
        options: segmentOptions || [...CAROTID_SEGMENTS]
      },
      {
        id: 'string_sign',
        label: 'String sign',
        type: 'select',
        options: ['Presente', 'Ausente']
      },
      {
        id: 'distal_collapse',
        label: 'Colapso distal',
        type: 'select',
        options: ['Presente', 'Ausente']
      }
    ]
  }
];

// Função helper para criar achados parietais
const createParietalFindings = (defaultSide?: string): Finding[] => [
  {
    id: `espessamento-medio-intimal${defaultSide ? `-${defaultSide.toLowerCase()}` : ''}`,
    name: 'Espessamento médio-intimal (EMI)',
    description: 'Espessamento da camada íntima-média',
    hasDetails: true,
    hasMeasurement: true,
    extraFields: [
      ...(defaultSide ? [] : [{
        id: 'lado',
        label: 'Lado',
        type: 'select' as const,
        options: [...LATERALITY]
      }]),
      {
        id: 'emi_value',
        label: 'EMI (mm)',
        type: 'text',
        placeholder: 'Ex: 1.2'
      },
      {
        id: 'emi_classification',
        label: 'Classificação EMI',
        type: 'select',
        options: EMI_VALUES
      }
    ]
  },
  {
    id: `disseccao-arterial${defaultSide ? `-${defaultSide.toLowerCase()}` : ''}`,
    name: 'Dissecção arterial',
    description: 'Dissecção da parede arterial',
    hasDetails: true,
    extraFields: [
      ...(defaultSide ? [] : [{
        id: 'lado',
        label: 'Lado',
        type: 'select' as const,
        options: [...LATERALITY]
      }]),
      {
        id: 'segmento',
        label: 'Segmento',
        type: 'select',
        options: [...CAROTID_SEGMENTS]
      },
      {
        id: 'flap_intimal',
        label: 'Flap intimal',
        type: 'select',
        options: ['Visível', 'Não visível']
      },
      {
        id: 'luz_verdadeira',
        label: 'Luz verdadeira',
        type: 'select',
        options: ['Pérvia', 'Comprimida', 'Ocluída']
      },
      {
        id: 'luz_falsa',
        label: 'Luz falsa',
        type: 'select',
        options: ['Trombosada', 'Parcialmente trombosada', 'Pérvia']
      },
      {
        id: 'extension_disseccao',
        label: 'Extensão (mm)',
        type: 'text',
        placeholder: 'Ex: 40'
      }
    ]
  }
];

// Função helper para criar achados anatômicos
const createAnatomicalFindings = (defaultSide?: string): Finding[] => [
  {
    id: `tortuosidade-arterial${defaultSide ? `-${defaultSide.toLowerCase()}` : ''}`,
    name: 'Tortuosidade arterial',
    description: 'Trajeto arterial anômalo',
    hasDetails: true,
    extraFields: [
      ...(defaultSide ? [] : [{
        id: 'lado',
        label: 'Lado',
        type: 'select' as const,
        options: [...LATERALITY]
      }]),
      {
        id: 'segmento',
        label: 'Segmento',
        type: 'select',
        options: [...CAROTID_SEGMENTS]
      },
      {
        id: 'tipo_tortuosidade',
        label: 'Tipo',
        type: 'select',
        options: [...ANATOMICAL_ALTERATIONS]
      },
      {
        id: 'angulacao',
        label: 'Angulação (graus)',
        type: 'text',
        placeholder: 'Ex: 90'
      },
      {
        id: 'repercussao_hemodinamica',
        label: 'Repercussão hemodinâmica',
        type: 'select',
        options: ['Ausente', 'Leve (VPS <125)', 'Moderada (VPS 125-230)', 'Grave (VPS >230)']
      }
    ]
  },
  {
    id: `aneurisma-carotideo${defaultSide ? `-${defaultSide.toLowerCase()}` : ''}`,
    name: 'Aneurisma',
    description: 'Dilatação arterial aneurismática',
    hasDetails: true,
    hasMeasurement: true,
    extraFields: [
      ...(defaultSide ? [] : [{
        id: 'lado',
        label: 'Lado',
        type: 'select' as const,
        options: [...LATERALITY]
      }]),
      {
        id: 'segmento',
        label: 'Segmento',
        type: 'select',
        options: [...CAROTID_SEGMENTS]
      },
      {
        id: 'diametro_maximo',
        label: 'Diâmetro máximo (mm)',
        type: 'text',
        placeholder: 'Ex: 25'
      },
      {
        id: 'colo',
        label: 'Colo (mm)',
        type: 'text',
        placeholder: 'Ex: 8'
      },
      {
        id: 'trombo_mural',
        label: 'Trombo mural',
        type: 'select',
        options: ['Ausente', 'Presente parcial', 'Presente circunferencial']
      },
      {
        id: 'tipo_aneurisma',
        label: 'Tipo',
        type: 'select',
        options: ['Sacular', 'Fusiforme', 'Pseudoaneurisma']
      }
    ]
  },
  {
    id: `hipoplasia-arterial${defaultSide ? `-${defaultSide.toLowerCase()}` : ''}`,
    name: 'Hipoplasia arterial',
    description: 'Calibre arterial reduzido',
    hasDetails: true,
    extraFields: [
      ...(defaultSide ? [] : [{
        id: 'lado',
        label: 'Lado',
        type: 'select' as const,
        options: [...LATERALITY]
      }]),
      {
        id: 'segmento',
        label: 'Segmento',
        type: 'select',
        options: [...CAROTID_SEGMENTS]
      },
      {
        id: 'diametro',
        label: 'Diâmetro (mm)',
        type: 'text',
        placeholder: 'Ex: 3'
      }
    ]
  }
];

// ============================================================================
// AGRUPAMENTO PARA SIDEBAR (ACCORDION)
// ============================================================================

export const carotidOrganGroups = [
  { 
    id: 'carotidas-comuns', 
    name: 'Carótidas Comuns',
    organIds: ['ccd', 'cce'] 
  },
  { 
    id: 'bulbos', 
    name: 'Bulbos Carotídeos',
    organIds: ['bd', 'be'] 
  },
  { 
    id: 'carotidas-internas', 
    name: 'Carótidas Internas',
    organIds: ['cid', 'cie'] 
  },
  { 
    id: 'carotidas-externas', 
    name: 'Carótidas Externas',
    organIds: ['ced', 'cee'] 
  },
  { 
    id: 'vertebrais', 
    name: 'Artérias Vertebrais',
    organIds: ['vd', 've'] 
  }
];

// ============================================================================
// DEFINIÇÃO DOS ÓRGÃOS E ACHADOS - ESTRUTURA HÍBRIDA
// ============================================================================

export const carotidOrgans: Organ[] = [
  // Carótidas Comuns
  {
    id: 'ccd',
    name: 'Artéria Carótida Comum Direita',
    icon: 'artery',
    normalDescription: 'apresenta calibre preservado, paredes regulares e fluxo anterógrado normal. Não foram identificadas placas ateroscleróticas ou estenoses significativas.',
    categories: [
      {
        id: 'placas-ccd',
        name: 'Placas Ateroscleróticas',
        findings: createPlaqueFindings('direito')
      },
      {
        id: 'hemodinamica-ccd',
        name: 'Alterações Hemodinâmicas',
        findings: createHemodynamicFindings('direito', ['Carótida Comum'])
      },
      {
        id: 'parietais-ccd',
        name: 'Alterações Parietais',
        findings: createParietalFindings('direito')
      },
      {
        id: 'anatomicas-ccd',
        name: 'Alterações Anatômicas',
        findings: createAnatomicalFindings('direito')
      }
    ]
  },
  {
    id: 'cce',
    name: 'Artéria Carótida Comum Esquerda',
    icon: 'artery',
    normalDescription: 'apresenta calibre preservado, paredes regulares e fluxo anterógrado normal. Não foram identificadas placas ateroscleróticas ou estenoses significativas.',
    categories: [
      {
        id: 'placas-cce',
        name: 'Placas Ateroscleróticas',
        findings: createPlaqueFindings('esquerdo')
      },
      {
        id: 'hemodinamica-cce',
        name: 'Alterações Hemodinâmicas',
        findings: createHemodynamicFindings('esquerdo', ['Carótida Comum'])
      },
      {
        id: 'parietais-cce',
        name: 'Alterações Parietais',
        findings: createParietalFindings('esquerdo')
      },
      {
        id: 'anatomicas-cce',
        name: 'Alterações Anatômicas',
        findings: createAnatomicalFindings('esquerdo')
      }
    ]
  },
  
  // Bulbos Carotídeos
  {
    id: 'bd',
    name: 'Bulbo Carotídeo Direito',
    icon: 'artery',
    normalDescription: 'apresenta paredes regulares, sem placas ateroscleróticas ou estenoses significativas.',
    categories: [
      {
        id: 'placas-bd',
        name: 'Placas Ateroscleróticas',
        findings: createPlaqueFindings('direito')
      },
      {
        id: 'hemodinamica-bd',
        name: 'Alterações Hemodinâmicas',
        findings: createHemodynamicFindings('direito', ['Bulbo Carotídeo'])
      },
      {
        id: 'parietais-bd',
        name: 'Alterações Parietais',
        findings: createParietalFindings('direito')
      }
    ]
  },
  {
    id: 'be',
    name: 'Bulbo Carotídeo Esquerdo',
    icon: 'artery',
    normalDescription: 'apresenta paredes regulares, sem placas ateroscleróticas ou estenoses significativas.',
    categories: [
      {
        id: 'placas-be',
        name: 'Placas Ateroscleróticas',
        findings: createPlaqueFindings('esquerdo')
      },
      {
        id: 'hemodinamica-be',
        name: 'Alterações Hemodinâmicas',
        findings: createHemodynamicFindings('esquerdo', ['Bulbo Carotídeo'])
      },
      {
        id: 'parietais-be',
        name: 'Alterações Parietais',
        findings: createParietalFindings('esquerdo')
      }
    ]
  },
  
  // Carótidas Internas
  {
    id: 'cid',
    name: 'Artéria Carótida Interna Direita',
    icon: 'artery-internal',
    normalDescription: 'apresenta calibre normal, paredes regulares e fluxo anterógrado preservado. Velocidade de pico sistólico dentro dos limites da normalidade. Não foram identificadas placas ateroscleróticas ou estenoses significativas.',
    categories: [
      {
        id: 'placas-cid',
        name: 'Placas Ateroscleróticas',
        findings: createPlaqueFindings('direito')
      },
      {
        id: 'hemodinamica-cid',
        name: 'Alterações Hemodinâmicas',
        findings: createHemodynamicFindings('direito', ['Carótida Interna'])
      },
      {
        id: 'parietais-cid',
        name: 'Alterações Parietais',
        findings: createParietalFindings('direito')
      },
      {
        id: 'anatomicas-cid',
        name: 'Alterações Anatômicas',
        findings: createAnatomicalFindings('direito')
      }
    ]
  },
  {
    id: 'cie',
    name: 'Artéria Carótida Interna Esquerda',
    icon: 'artery-internal',
    normalDescription: 'apresenta calibre normal, paredes regulares e fluxo anterógrado preservado. Velocidade de pico sistólico dentro dos limites da normalidade. Não foram identificadas placas ateroscleróticas ou estenoses significativas.',
    categories: [
      {
        id: 'placas-cie',
        name: 'Placas Ateroscleróticas',
        findings: createPlaqueFindings('esquerdo')
      },
      {
        id: 'hemodinamica-cie',
        name: 'Alterações Hemodinâmicas',
        findings: createHemodynamicFindings('esquerdo', ['Carótida Interna'])
      },
      {
        id: 'parietais-cie',
        name: 'Alterações Parietais',
        findings: createParietalFindings('esquerdo')
      },
      {
        id: 'anatomicas-cie',
        name: 'Alterações Anatômicas',
        findings: createAnatomicalFindings('esquerdo')
      }
    ]
  },
  
  // Carótidas Externas
  {
    id: 'ced',
    name: 'Artéria Carótida Externa Direita',
    icon: 'artery-external',
    normalDescription: 'apresenta calibre normal, paredes regulares e fluxo anterógrado com padrão de alta resistência. Não foram identificadas placas ateroscleróticas ou estenoses significativas.',
    categories: [
      {
        id: 'placas-ced',
        name: 'Placas Ateroscleróticas',
        findings: createPlaqueFindings('direito')
      },
      {
        id: 'hemodinamica-ced',
        name: 'Alterações Hemodinâmicas',
        findings: createHemodynamicFindings('direito', ['Carótida Externa'])
      }
    ]
  },
  {
    id: 'cee',
    name: 'Artéria Carótida Externa Esquerda',
    icon: 'artery-external',
    normalDescription: 'apresenta calibre normal, paredes regulares e fluxo anterógrado com padrão de alta resistência. Não foram identificadas placas ateroscleróticas ou estenoses significativas.',
    categories: [
      {
        id: 'placas-cee',
        name: 'Placas Ateroscleróticas',
        findings: createPlaqueFindings('esquerdo')
      },
      {
        id: 'hemodinamica-cee',
        name: 'Alterações Hemodinâmicas',
        findings: createHemodynamicFindings('esquerdo', ['Carótida Externa'])
      }
    ]
  },
  
  // Vertebrais
  {
    id: 'vd',
    name: 'Artéria Vertebral Direita',
    icon: 'vertebral',
    normalDescription: 'apresenta calibre normal, fluxo anterógrado com velocidades preservadas (VPS 30-80 cm/s). Não foram identificadas estenoses ou alterações significativas do fluxo.',
    categories: [
      {
        id: 'fluxo-vd',
        name: 'Alterações de Fluxo',
        findings: [
          {
            id: 'estenose-vertebral-d',
            name: 'Estenose',
            description: 'Redução luminal da artéria vertebral',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'segmento_vertebral',
                label: 'Segmento',
                type: 'select',
                options: ['V0 (origem)', 'V1 (pré-foraminal)', 'V2 (foraminal)', 'V3 (atlanto-axial)', 'V4 (intracraniano)']
              },
              {
                id: 'vps',
                label: 'VPS (cm/s)',
                type: 'text',
                placeholder: 'Ex: 120'
              },
              {
                id: 'vps_classification',
                label: 'Classificação VPS',
                type: 'select',
                options: VERTEBRAL_VELOCITY
              },
              {
                id: 'ir',
                label: 'Índice de Resistividade',
                type: 'text',
                placeholder: 'Ex: 0.65'
              },
              {
                id: 'ir_classification',
                label: 'Classificação IR',
                type: 'select',
                options: VERTEBRAL_IR
              },
              {
                id: 'stenosis_percent',
                label: 'Estenose estimada (%)',
                type: 'text',
                placeholder: 'Ex: 60'
              }
            ]
          },
          {
            id: 'sindrome-roubo-subclavia-d',
            name: 'Síndrome do roubo da subclávia',
            description: 'Inversão do fluxo vertebral',
            hasDetails: true,
            extraFields: [
              {
                id: 'flow_pattern',
                label: 'Padrão de Fluxo',
                type: 'select',
                options: FLOW_PATTERN_VERTEBRAL
              },
              {
                id: 'subclavian_steal',
                label: 'Tipo de Roubo',
                type: 'select',
                options: SUBCLAVIAN_STEAL
              },
              {
                id: 'vps',
                label: 'VPS (cm/s)',
                type: 'text',
                placeholder: 'Ex: -40 (negativo = reverso)'
              },
              {
                id: 'manobra_hiperemia',
                label: 'Manobra de hiperemia reativa',
                type: 'select',
                options: ['Não realizada', 'Acentua reversão', 'Sem mudança', 'Normaliza fluxo']
              }
            ]
          },
          {
            id: 'oclusao-vertebral-d',
            name: 'Oclusão',
            description: 'Oclusão completa da artéria vertebral',
            hasDetails: true,
            extraFields: [
              {
                id: 'segmento_vertebral',
                label: 'Segmento',
                type: 'select',
                options: ['V0 (origem)', 'V1 (pré-foraminal)', 'V2 (foraminal)', 'V3 (atlanto-axial)', 'V4 (intracraniano)']
              },
              {
                id: 'colaterais_vertebral',
                label: 'Circulação colateral',
                type: 'select',
                options: ['Via vertebral contralateral', 'Via basilar', 'Via carótidas', 'Não identificada']
              }
            ]
          }
        ]
      },
      {
        id: 'anatomicas-vd',
        name: 'Variações Anatômicas',
        findings: [
          {
            id: 'hipoplasia-vertebral-d',
            name: 'Hipoplasia',
            description: 'Calibre reduzido da artéria vertebral (<2mm)',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'diameter',
                label: 'Diâmetro (mm)',
                type: 'text',
                placeholder: 'Ex: 1.5'
              },
              {
                id: 'fluxo_compensatorio',
                label: 'Fluxo compensatório contralateral',
                type: 'select',
                options: ['Presente', 'Ausente']
              }
            ]
          },
          {
            id: 'aplasia-vertebral-d',
            name: 'Aplasia',
            description: 'Ausência congênita da artéria vertebral',
            hasDetails: true,
            extraFields: [
              {
                id: 'vertebral_dominante',
                label: 'Vertebral contralateral',
                type: 'select',
                options: ['Dominante compensatória', 'Calibre normal', 'Hipoplásica']
              }
            ]
          },
          {
            id: 'dominancia-vertebral-d',
            name: 'Dominância vertebral',
            description: 'Assimetria significativa de calibre',
            hasDetails: true,
            extraFields: [
              {
                id: 'diameter_dominante',
                label: 'Diâmetro dominante (mm)',
                type: 'text',
                placeholder: 'Ex: 4.5'
              },
              {
                id: 'diameter_nao_dominante',
                label: 'Diâmetro contralateral (mm)',
                type: 'text',
                placeholder: 'Ex: 2.0'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 've',
    name: 'Artéria Vertebral Esquerda',
    icon: 'vertebral',
    normalDescription: 'apresenta calibre normal, fluxo anterógrado com velocidades preservadas (VPS 30-80 cm/s). Não foram identificadas estenoses ou alterações significativas do fluxo.',
    categories: [
      {
        id: 'fluxo-ve',
        name: 'Alterações de Fluxo',
        findings: [
          {
            id: 'estenose-vertebral-e',
            name: 'Estenose',
            description: 'Redução luminal da artéria vertebral',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'segmento_vertebral',
                label: 'Segmento',
                type: 'select',
                options: ['V0 (origem)', 'V1 (pré-foraminal)', 'V2 (foraminal)', 'V3 (atlanto-axial)', 'V4 (intracraniano)']
              },
              {
                id: 'vps',
                label: 'VPS (cm/s)',
                type: 'text',
                placeholder: 'Ex: 120'
              },
              {
                id: 'vps_classification',
                label: 'Classificação VPS',
                type: 'select',
                options: VERTEBRAL_VELOCITY
              },
              {
                id: 'ir',
                label: 'Índice de Resistividade',
                type: 'text',
                placeholder: 'Ex: 0.65'
              },
              {
                id: 'ir_classification',
                label: 'Classificação IR',
                type: 'select',
                options: VERTEBRAL_IR
              },
              {
                id: 'stenosis_percent',
                label: 'Estenose estimada (%)',
                type: 'text',
                placeholder: 'Ex: 60'
              }
            ]
          },
          {
            id: 'sindrome-roubo-subclavia-e',
            name: 'Síndrome do roubo da subclávia',
            description: 'Inversão do fluxo vertebral',
            hasDetails: true,
            extraFields: [
              {
                id: 'flow_pattern',
                label: 'Padrão de Fluxo',
                type: 'select',
                options: FLOW_PATTERN_VERTEBRAL
              },
              {
                id: 'subclavian_steal',
                label: 'Tipo de Roubo',
                type: 'select',
                options: SUBCLAVIAN_STEAL
              },
              {
                id: 'vps',
                label: 'VPS (cm/s)',
                type: 'text',
                placeholder: 'Ex: -40 (negativo = reverso)'
              },
              {
                id: 'manobra_hiperemia',
                label: 'Manobra de hiperemia reativa',
                type: 'select',
                options: ['Não realizada', 'Acentua reversão', 'Sem mudança', 'Normaliza fluxo']
              }
            ]
          },
          {
            id: 'oclusao-vertebral-e',
            name: 'Oclusão',
            description: 'Oclusão completa da artéria vertebral',
            hasDetails: true,
            extraFields: [
              {
                id: 'segmento_vertebral',
                label: 'Segmento',
                type: 'select',
                options: ['V0 (origem)', 'V1 (pré-foraminal)', 'V2 (foraminal)', 'V3 (atlanto-axial)', 'V4 (intracraniano)']
              },
              {
                id: 'colaterais_vertebral',
                label: 'Circulação colateral',
                type: 'select',
                options: ['Via vertebral contralateral', 'Via basilar', 'Via carótidas', 'Não identificada']
              }
            ]
          }
        ]
      },
      {
        id: 'anatomicas-ve',
        name: 'Variações Anatômicas',
        findings: [
          {
            id: 'hipoplasia-vertebral-e',
            name: 'Hipoplasia',
            description: 'Calibre reduzido da artéria vertebral (<2mm)',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'diameter',
                label: 'Diâmetro (mm)',
                type: 'text',
                placeholder: 'Ex: 1.5'
              },
              {
                id: 'fluxo_compensatorio',
                label: 'Fluxo compensatório contralateral',
                type: 'select',
                options: ['Presente', 'Ausente']
              }
            ]
          },
          {
            id: 'aplasia-vertebral-e',
            name: 'Aplasia',
            description: 'Ausência congênita da artéria vertebral',
            hasDetails: true,
            extraFields: [
              {
                id: 'vertebral_dominante',
                label: 'Vertebral contralateral',
                type: 'select',
                options: ['Dominante compensatória', 'Calibre normal', 'Hipoplásica']
              }
            ]
          },
          {
            id: 'dominancia-vertebral-e',
            name: 'Dominância vertebral',
            description: 'Assimetria significativa de calibre',
            hasDetails: true,
            extraFields: [
              {
                id: 'diameter_dominante',
                label: 'Diâmetro dominante (mm)',
                type: 'text',
                placeholder: 'Ex: 4.5'
              },
              {
                id: 'diameter_nao_dominante',
                label: 'Diâmetro contralateral (mm)',
                type: 'text',
                placeholder: 'Ex: 2.0'
              }
            ]
          }
        ]
      }
    ]
  },
  
  // Observações
  {
    id: 'observacoes-carotidas',
    name: 'Observações',
    icon: 'notes',
    normalDescription: '',
    hideNormalOption: true,
    categories: [
      {
        id: 'obs-gerais',
        name: 'Observações Gerais',
        findings: [
          {
            id: 'obs-carotidas-texto',
            name: 'Observação Adicional',
            description: 'Informações complementares ao exame',
            hasDetails: true,
            extraFields: [
              { id: 'texto', label: 'Observações', type: 'textarea', placeholder: 'Digite observações adicionais...' }
            ]
          }
        ]
      }
    ]
  }
];

// Localizações específicas para carótidas comuns
export const COMMON_CAROTID_LOCATIONS = [
  { value: 'proximal', label: 'Segmento proximal' },
  { value: 'medio', label: 'Segmento médio' },
  { value: 'distal', label: 'Segmento distal' },
  { value: 'bifurcacao', label: 'Bifurcação carotídea' }
];

// Localizações específicas para carótidas internas
export const INTERNAL_CAROTID_LOCATIONS = [
  { value: 'bulbo', label: 'Bulbo carotídeo' },
  { value: 'cervical-proximal', label: 'Segmento cervical proximal' },
  { value: 'cervical-medio', label: 'Segmento cervical médio' },
  { value: 'cervical-distal', label: 'Segmento cervical distal' }
];

// Localizações específicas para carótidas externas
export const EXTERNAL_CAROTID_LOCATIONS = [
  { value: 'origem', label: 'Origem' },
  { value: 'proximal', label: 'Segmento proximal' },
  { value: 'medio', label: 'Segmento médio' },
  { value: 'distal', label: 'Segmento distal' }
];

// Localizações específicas para vertebrais
export const VERTEBRAL_LOCATIONS = [
  { value: 'v0', label: 'Segmento V0 (origem)' },
  { value: 'v1', label: 'Segmento V1 (pré-foraminal)' },
  { value: 'v2', label: 'Segmento V2 (foraminal)' },
  { value: 'v3', label: 'Segmento V3 (atlanto-axial)' },
  { value: 'v4', label: 'Segmento V4 (intracraniano)' }
];

// ============================================================================
// ALIASES DE COMPATIBILIDADE (para componentes que usam nomes antigos)
// ============================================================================
export const PLAQUE_SURFACE = PLAQUE_SURFACE_TYPE;
export const FLOW_PATTERN = FLOW_PATTERN_VERTEBRAL;

export const STENOSIS_GRADES = [
  { value: 'normal', label: 'Normal (sem estenose)' },
  { value: '<50', label: 'Leve (<50%)' },
  { value: '50-69', label: 'Moderada (50-69%)' },
  { value: '70-89', label: 'Severa (70-89%)' },
  { value: '90-99', label: 'Crítica (90-99%)' },
  { value: 'suboclusiva', label: 'Suboclusiva (99%)' },
  { value: '100', label: 'Oclusão (100%)' }
];

// ============================================================================
// FUNÇÕES CALCULADORAS - ESTENOSE E RISCO
// ============================================================================

export interface StenosisAnalysis {
  grade: string;
  nascet: string;
  nascetRange: string;
  confidence: 'high' | 'medium' | 'low';
  confidenceReason: string;
  interventionRecommendation: string;
  alerts: string[];
  criteriaUsed: string[];
  criteriaCount: number;
}

type StenosisLevel = 'normal' | 'mild' | 'moderate' | 'severe' | 'critical' | 'near_occlusion' | 'occlusion';

const getStenosisLevelFromVPS = (vps: string | number): StenosisLevel => {
  const str = String(vps).toLowerCase();
  if (str === '0' || str.includes('oclus')) return 'occlusion';
  if (str.includes('<125') || str.includes('normal')) return 'normal';
  if (str.includes('125-230') || str.includes('125 a 230') || str.includes('moderada')) return 'moderate';
  if (str.includes('>300') || str.includes('crítica') || str.includes('critica')) return 'critical';
  if (str.includes('>230') || str.includes('severa') || str.includes('grave')) return 'severe';
  const num = parseFloat(str.replace(/[^\d.]/g, ''));
  if (!isNaN(num)) {
    if (num < 125) return 'normal';
    if (num <= 230) return 'moderate';
    if (num <= 300) return 'severe';
    return 'critical';
  }
  return 'normal';
};

const getStenosisLevelFromVDF = (vdf: string | number): StenosisLevel => {
  const str = String(vdf).toLowerCase();
  if (str === '0' || str.includes('oclus')) return 'occlusion';
  if (str.includes('<40') || str.includes('normal')) return 'normal';
  if (str.includes('40-100') || str.includes('40 a 100') || str.includes('moderada')) return 'moderate';
  if (str.includes('>100') || str.includes('severa') || str.includes('grave')) return 'severe';
  const num = parseFloat(str.replace(/[^\d.]/g, ''));
  if (!isNaN(num)) {
    if (num < 40) return 'normal';
    if (num <= 100) return 'moderate';
    return 'severe';
  }
  return 'normal';
};

const getStenosisLevelFromRatio = (ratio: string | number): StenosisLevel => {
  const str = String(ratio).toLowerCase();
  if (str.includes('<2') || str.includes('normal')) return 'normal';
  if (str.includes('2.0-4') || str.includes('2-4') || str.includes('2 a 4') || str.includes('moderada')) return 'moderate';
  if (str.includes('>4') || str.includes('severa') || str.includes('grave')) return 'severe';
  const num = parseFloat(str.replace(/[^\d.]/g, ''));
  if (!isNaN(num)) {
    if (num < 2.0) return 'normal';
    if (num <= 4.0) return 'moderate';
    return 'severe';
  }
  return 'normal';
};

const getStenosisLevelFromBroadening = (broadening: string): StenosisLevel | null => {
  const lower = broadening.toLowerCase();
  if (lower.includes('ausente')) return 'normal';
  if (lower.includes('leve')) return 'normal';
  if (lower.includes('moderado')) return 'moderate';
  if (lower.includes('acentuado')) return 'severe';
  return null;
};

const LEVEL_PRIORITY: Record<StenosisLevel, number> = {
  normal: 0,
  mild: 1,
  moderate: 2,
  severe: 3,
  critical: 4,
  near_occlusion: 5,
  occlusion: 6
};

const LEVEL_TO_NASCET: Record<StenosisLevel, { grade: string; nascet: string; range: string }> = {
  normal: { grade: 'Normal', nascet: '<50%', range: '0-49%' },
  mild: { grade: 'Estenose leve', nascet: '<50%', range: '0-49%' },
  moderate: { grade: 'Estenose moderada', nascet: '50-69%', range: '50-69%' },
  severe: { grade: 'Estenose grave', nascet: '≥70%', range: '70-89%' },
  critical: { grade: 'Estenose crítica', nascet: '>80%', range: '80-99%' },
  near_occlusion: { grade: 'Suboclusão (near-occlusion)', nascet: '99%', range: '99%' },
  occlusion: { grade: 'Oclusão', nascet: '100%', range: '100%' }
};

export const calculateStenosisGrade = (params: {
  vps?: number | string;
  vdf?: number | string;
  ratio?: number | string;
  spectralBroadening?: string;
  symptomatic?: boolean;
  plaqueGSM?: string;
  vulnerableFeatures?: string[];
}): StenosisAnalysis => {
  const alerts: string[] = [];
  const criteriaUsed: string[] = [];
  const levels: StenosisLevel[] = [];

  const { vps, vdf, ratio, spectralBroadening, symptomatic = false, plaqueGSM, vulnerableFeatures = [] } = params;

  if (vps !== undefined && vps !== null && vps !== '') {
    const level = getStenosisLevelFromVPS(vps);
    levels.push(level);
    criteriaUsed.push(`VPS ${vps} → ${LEVEL_TO_NASCET[level].nascet}`);
  }

  if (vdf !== undefined && vdf !== null && vdf !== '') {
    const level = getStenosisLevelFromVDF(vdf);
    levels.push(level);
    criteriaUsed.push(`VDF ${vdf} → ${LEVEL_TO_NASCET[level].nascet}`);
  }

  if (ratio !== undefined && ratio !== null && ratio !== '') {
    const level = getStenosisLevelFromRatio(ratio);
    levels.push(level);
    criteriaUsed.push(`Ratio ${ratio} → ${LEVEL_TO_NASCET[level].nascet}`);
  }

  if (spectralBroadening) {
    const level = getStenosisLevelFromBroadening(spectralBroadening);
    if (level) {
      levels.push(level);
      criteriaUsed.push(`Borramento ${spectralBroadening} → ${LEVEL_TO_NASCET[level].nascet}`);
    }
  }

  if (levels.length === 0) {
    return {
      grade: 'Indeterminado',
      nascet: 'N/A',
      nascetRange: 'N/A',
      confidence: 'low',
      confidenceReason: 'Nenhum critério de velocidade informado',
      interventionRecommendation: 'Preencher VPS, VDF e Ratio para classificação',
      alerts: ['Dados insuficientes para classificação'],
      criteriaUsed: [],
      criteriaCount: 0
    };
  }

  const maxLevel = levels.reduce((max, curr) =>
    LEVEL_PRIORITY[curr] > LEVEL_PRIORITY[max] ? curr : max
  , levels[0]);

  const { grade, nascet, range } = LEVEL_TO_NASCET[maxLevel];

  const levelCounts = levels.reduce((acc, l) => {
    acc[l] = (acc[l] || 0) + 1;
    return acc;
  }, {} as Record<StenosisLevel, number>);

  const maxLevelCount = levelCounts[maxLevel] || 0;
  const totalCriteria = levels.length;

  let confidence: 'high' | 'medium' | 'low';
  let confidenceReason: string;

  if (totalCriteria >= 3 && maxLevelCount >= 2) {
    confidence = 'high';
    confidenceReason = `${totalCriteria} critérios avaliados, ${maxLevelCount} concordantes`;
  } else if (totalCriteria >= 2 && maxLevelCount >= 1) {
    confidence = 'medium';
    confidenceReason = `${totalCriteria} critérios avaliados`;
    if (maxLevelCount < totalCriteria) {
      alerts.push('Critérios parcialmente discordantes - usar critério mais severo');
    }
  } else {
    confidence = 'low';
    confidenceReason = 'Apenas 1 critério avaliado';
    alerts.push('Avaliar VDF e Razão ACI/ACC para maior precisão');
  }

  if (plaqueGSM?.includes('tipo1') || plaqueGSM?.includes('tipo2') || plaqueGSM?.toLowerCase().includes('ecolucente')) {
    alerts.push('Placa vulnerável (ecolucente) - maior risco de eventos');
  }

  if (vulnerableFeatures.length > 0) {
    alerts.push(`Features de vulnerabilidade: ${vulnerableFeatures.length} identificadas`);
  }

  let interventionRecommendation: string;
  const isSevere = LEVEL_PRIORITY[maxLevel] >= LEVEL_PRIORITY['moderate'];
  const isVerySevere = LEVEL_PRIORITY[maxLevel] >= LEVEL_PRIORITY['severe'];

  if (symptomatic) {
    if (isSevere) {
      interventionRecommendation = 'ESVS Classe I: CEA/CAS recomendado (idealmente <14 dias do evento)';
      alerts.push('SINTOMÁTICO ≥50% - Avaliar intervenção urgente');
    } else {
      interventionRecommendation = 'ESVS Classe III: Tratamento clínico otimizado (BMT)';
    }
  } else {
    if (isVerySevere) {
      const hasHighRiskFeatures = vulnerableFeatures.length > 0 ||
        plaqueGSM?.includes('tipo1') || plaqueGSM?.includes('tipo2');

      if (hasHighRiskFeatures) {
        interventionRecommendation = 'ESVS Classe I: CEA recomendado (features de alto risco)';
        alerts.push('ASSINTOMÁTICO com features de alto risco - Considerar CEA');
      } else {
        interventionRecommendation = 'ESVS Classe IIa: Considerar CEA se expectativa >5 anos e risco <3%';
      }
    } else if (isSevere) {
      interventionRecommendation = 'ESVS Classe IIb: CEA pode ser considerado';
    } else {
      interventionRecommendation = 'ESVS Classe III: Tratamento clínico otimizado (BMT)';
    }
  }

  return {
    grade,
    nascet,
    nascetRange: range,
    confidence,
    confidenceReason,
    interventionRecommendation,
    alerts,
    criteriaUsed,
    criteriaCount: totalCriteria
  };
};

export const getGSMRiskLevel = (gsm: string): 'high' | 'medium' | 'low' => {
  const found = PLAQUE_GSM.find(p => gsm.includes(p.value) || gsm.includes(p.label));
  return (found?.risk as 'high' | 'medium' | 'low') || 'medium';
};

export const findMostSevereStenosis = (stenoses: StenosisAnalysis[]): StenosisAnalysis | null => {
  if (stenoses.length === 0) return null;
  
  const nascetPriority: Record<string, number> = {
    '<50%': 1, '50-69%': 2, '≥70%': 3, '>80%': 4, '99%': 5, '100%': 6
  };

  return stenoses.reduce((worst, current) => {
    const worstPriority = nascetPriority[worst.nascet] || 0;
    const currentPriority = nascetPriority[current.nascet] || 0;
    return currentPriority > worstPriority ? current : worst;
  });
};