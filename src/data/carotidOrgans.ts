import { Organ, OrganCategory, Finding } from './organs';

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
  'Placa ecolucente (GSM <25)',
  'Hemorragia intraplaca na RM',
  'Microêmbolos ao DTC (Doppler transcraniano)',
  'Reserva cerebrovascular reduzida',
  'Estenose >80%'
];

// Critérios IAC 2021 (Atualização dos SRU 2003)
export const IAC_2021_CRITERIA = {
  normal: { stenosis: 'Normal', vps: '<125', edv: '<40', ratio: '<2.0' },
  mild: { stenosis: '<50%', vps: '<125', edv: '<40', ratio: '<2.0', note: 'Placa visível sem aceleração' },
  moderate_50_69: { stenosis: '50-69%', vps: '125-230', edv: '40-100', ratio: '2.0-4.0' },
  severe_70_99: { stenosis: '≥70%', vps: '>230', edv: '>100', ratio: '>4.0' },
  near_occlusion: { stenosis: 'Suboclusão', vps: 'Variável/Baixa', edv: 'Variável', ratio: 'Variável', note: 'String sign, fluxo filiforme' },
  occlusion: { stenosis: 'Oclusão', vps: 'Ausente', edv: 'Ausente', ratio: 'N/A' }
};

// Borramento Espectral (Spectral Broadening) - Critério adicional
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
export const getGrayWealeType = (ecogenicity: string): string => {
  const lower = ecogenicity.toLowerCase();
  if (lower.includes('tipo i)') || lower.includes('hipoecogênica (tipo i')) return 'I';
  if (lower.includes('tipo ii)') || lower.includes('hipoecogênica (tipo ii')) return 'II';
  if (lower.includes('tipo iii)') || lower.includes('hiperecogênica (tipo iii')) return 'III';
  if (lower.includes('tipo iv)') || lower.includes('hiperecogênica (tipo iv')) return 'IV';
  return '';
};

export const PLAQUE_COMPOSITION = [
  'Homogênea',
  'Heterogênea',
  'Calcificada',
  'Lipídica',
  'Fibrosa',
  'Mista'
];

export const PLAQUE_SURFACE_TYPE = [
  'Regular',
  'Irregular',
  'Ulcerada'
];

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
// DEFINIÇÃO DOS ÓRGÃOS E ACHADOS
// ============================================================================

export const carotidOrgans: Organ[] = [
  {
    id: 'ccd',
    name: 'Artéria Carótida Comum Direita',
    icon: 'artery',
    normalDescription: 'apresenta calibre preservado, paredes regulares e fluxo anterógrado normal. Não foram identificadas placas ateroscleróticas ou estenoses significativas.',
    categories: [
      {
        id: 'placas-ccd',
        name: 'Placas Ateroscleróticas',
        findings: [
          {
            id: 'placa-ccd',
            name: 'Placa aterosclerótica',
            description: 'Depósito de colesterol na parede arterial',
            hasDetails: true,
            hasMeasurement: true,  // Espessura em mm
            hasLocation: true,  // Proximal, média, distal
            hasSeverity: true,  // Leve, moderada, acentuada
            extraFields: [
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
                label: 'Extensão longitudinal',
                type: 'text',
                placeholder: 'Ex: 12 mm'
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
            id: 'espessamento-imi-ccd',
            name: 'Espessamento médio-intimal',
            description: 'Espessamento da camada íntima-média (EMI)',
            hasDetails: true,
            hasMeasurement: true,  // EMI normal < 1.0mm
            extraFields: [
              {
                id: 'emi_classification',
                label: 'Classificação EMI',
                type: 'select',
                options: EMI_VALUES
              }
            ]
          }
        ]
      },
      {
        id: 'estenose-ccd',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-leve-ccd',
            name: 'Estenose',
            description: 'Redução luminal da artéria carótida comum',
            hasDetails: true,
            hasMeasurement: true,  // Grau de estenose em %
            hasLocation: true,
            hasSeverity: true,  // Leve (<50%), moderada (50-69%), acentuada (≥70%)
            extraFields: [
              {
                id: 'stenosis_percent',
                label: 'Estenose estimada (%)',
                type: 'text',
                placeholder: 'Ex: 45%'
              },
              {
                id: 'vps',
                label: 'VPS (Velocidade Pico Sistólico)',
                type: 'text',
                placeholder: 'Ex: 150 cm/s'
              },
              {
                id: 'vdf',
                label: 'VDF (Velocidade Diastólica Final)',
                type: 'text',
                placeholder: 'Ex: 80 cm/s'
              },
              {
                id: 'nascet_grade',
                label: 'Grau NASCET',
                type: 'select',
                options: NASCET_CRITERIA
              }
            ]
          },
          {
            id: 'oclusao-ccd',
            name: 'Oclusão',
            description: 'Oclusão completa da artéria carótida comum',
            hasDetails: true,
            hasLocation: true
          }
        ]
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
        findings: [
          {
            id: 'placa-cce',
            name: 'Placa aterosclerótica',
            description: 'Depósito de colesterol na parede arterial',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasSeverity: true,
            extraFields: [
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
                label: 'Extensão longitudinal',
                type: 'text',
                placeholder: 'Ex: 12 mm'
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
            id: 'espessamento-imi-cce',
            name: 'Espessamento médio-intimal',
            description: 'Espessamento da camada íntima-média (EMI)',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'emi_classification',
                label: 'Classificação EMI',
                type: 'select',
                options: EMI_VALUES
              }
            ]
          }
        ]
      },
      {
        id: 'estenose-cce',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-leve-cce',
            name: 'Estenose',
            description: 'Redução luminal da artéria carótida comum',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasSeverity: true,
            extraFields: [
              {
                id: 'stenosis_percent',
                label: 'Estenose estimada (%)',
                type: 'text',
                placeholder: 'Ex: 45%'
              },
              {
                id: 'vps',
                label: 'VPS (Velocidade Pico Sistólico)',
                type: 'text',
                placeholder: 'Ex: 150 cm/s'
              },
              {
                id: 'vdf',
                label: 'VDF (Velocidade Diastólica Final)',
                type: 'text',
                placeholder: 'Ex: 80 cm/s'
              },
              {
                id: 'nascet_grade',
                label: 'Grau NASCET',
                type: 'select',
                options: NASCET_CRITERIA
              }
            ]
          },
          {
            id: 'oclusao-cce',
            name: 'Oclusão',
            description: 'Oclusão completa da artéria carótida comum',
            hasDetails: true,
            hasLocation: true
          }
        ]
      }
    ]
  },
  {
    id: 'cid',
    name: 'Artéria Carótida Interna Direita',
    icon: 'artery-internal',
    normalDescription: 'apresenta calibre normal, paredes regulares e fluxo anterógrado preservado. Velocidade de pico sistólico dentro dos limites da normalidade. Não foram identificadas placas ateroscleróticas ou estenoses significativas.',
    categories: [
      {
        id: 'placas-cid',
        name: 'Placas Ateroscleróticas',
        findings: [
          {
            id: 'placa-cid',
            name: 'Placa aterosclerótica',
            description: 'Depósito de colesterol na parede arterial',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasSeverity: true,
            extraFields: [
              {
                id: 'gsm',
                label: 'GSM (Gray Scale Median)',
                type: 'select',
                options: PLAQUE_GSM.map(p => p.label)
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
                label: 'Extensão longitudinal',
                type: 'text',
                placeholder: 'Ex: 12 mm'
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
            id: 'placa-ulcerada-cid',
            name: 'Placa ulcerada',
            description: 'Placa aterosclerótica com ulceração',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
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
                label: 'Extensão longitudinal',
                type: 'text',
                placeholder: 'Ex: 12 mm'
              },
              {
                id: 'risk',
                label: 'Estratificação de Risco',
                type: 'select',
                options: PLAQUE_RISK
              }
            ]
          }
        ]
      },
      {
        id: 'estenose-cid',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-cid',
            name: 'Estenose',
            description: 'Redução luminal da artéria carótida interna',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasSeverity: true,
            extraFields: [
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
                placeholder: 'Ex: 65%'
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
            id: 'oclusao-cid',
            name: 'Oclusão',
            description: 'Oclusão completa da artéria carótida interna',
            hasDetails: true,
            hasLocation: true
          }
        ]
      },
      {
        id: 'outras-cid',
        name: 'Outras Alterações',
        findings: [
          {
            id: 'disseccao-cid',
            name: 'Dissecção arterial',
            description: 'Dissecção da parede arterial',
            hasDetails: true,
            hasLocation: true
          },
          {
            id: 'elongacao-cid',
            name: 'Elongação/tortuosidade',
            description: 'Trajeto arterial tortuoso ou elongado',
            hasDetails: true
          }
        ]
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
        findings: [
          {
            id: 'placa-cie',
            name: 'Placa aterosclerótica',
            description: 'Depósito de colesterol na parede arterial',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasSeverity: true,
            extraFields: [
              {
                id: 'gsm',
                label: 'GSM (Gray Scale Median)',
                type: 'select',
                options: PLAQUE_GSM.map(p => p.label)
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
                label: 'Extensão longitudinal',
                type: 'text',
                placeholder: 'Ex: 12 mm'
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
            id: 'placa-ulcerada-cie',
            name: 'Placa ulcerada',
            description: 'Placa aterosclerótica com ulceração',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
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
                label: 'Extensão longitudinal',
                type: 'text',
                placeholder: 'Ex: 12 mm'
              },
              {
                id: 'risk',
                label: 'Estratificação de Risco',
                type: 'select',
                options: PLAQUE_RISK
              }
            ]
          }
        ]
      },
      {
        id: 'estenose-cie',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-cie',
            name: 'Estenose',
            description: 'Redução luminal da artéria carótida interna',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasSeverity: true,
            extraFields: [
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
                placeholder: 'Ex: 65%'
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
            id: 'oclusao-cie',
            name: 'Oclusão',
            description: 'Oclusão completa da artéria carótida interna',
            hasDetails: true,
            hasLocation: true
          }
        ]
      },
      {
        id: 'outras-cie',
        name: 'Outras Alterações',
        findings: [
          {
            id: 'disseccao-cie',
            name: 'Dissecção arterial',
            description: 'Dissecção da parede arterial',
            hasDetails: true,
            hasLocation: true
          },
          {
            id: 'elongacao-cie',
            name: 'Elongação/tortuosidade',
            description: 'Trajeto arterial tortuoso ou elongado',
            hasDetails: true
          }
        ]
      }
    ]
  },
  {
    id: 'ced',
    name: 'Artéria Carótida Externa Direita',
    icon: 'artery-external',
    normalDescription: 'apresenta calibre normal, paredes regulares e fluxo anterógrado com padrão de alta resistência. Não foram identificadas placas ateroscleróticas ou estenoses significativas.',
    categories: [
      {
        id: 'placas-ced',
        name: 'Placas Ateroscleróticas',
        findings: [
          {
            id: 'placa-ced',
            name: 'Placa aterosclerótica',
            description: 'Depósito de colesterol na parede arterial',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasSeverity: true,
            extraFields: [
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
                label: 'Extensão longitudinal',
                type: 'text',
                placeholder: 'Ex: 12 mm'
              },
              {
                id: 'risk',
                label: 'Estratificação de Risco',
                type: 'select',
                options: PLAQUE_RISK
              }
            ]
          }
        ]
      },
      {
        id: 'estenose-ced',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-ced',
            name: 'Estenose',
            description: 'Redução luminal da artéria carótida externa',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasSeverity: true,
            extraFields: [
              {
                id: 'stenosis_percent',
                label: 'Estenose estimada (%)',
                type: 'text',
                placeholder: 'Ex: 45%'
              },
              {
                id: 'vps',
                label: 'VPS (Velocidade Pico Sistólico)',
                type: 'text',
                placeholder: 'Ex: 150 cm/s'
              },
              {
                id: 'vdf',
                label: 'VDF (Velocidade Diastólica Final)',
                type: 'text',
                placeholder: 'Ex: 80 cm/s'
              }
            ]
          },
          {
            id: 'oclusao-ced',
            name: 'Oclusão',
            description: 'Oclusão completa da artéria carótida externa',
            hasDetails: true,
            hasLocation: true
          }
        ]
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
        findings: [
          {
            id: 'placa-cee',
            name: 'Placa aterosclerótica',
            description: 'Depósito de colesterol na parede arterial',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasSeverity: true,
            extraFields: [
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
                label: 'Extensão longitudinal',
                type: 'text',
                placeholder: 'Ex: 12 mm'
              },
              {
                id: 'risk',
                label: 'Estratificação de Risco',
                type: 'select',
                options: PLAQUE_RISK
              }
            ]
          }
        ]
      },
      {
        id: 'estenose-cee',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-cee',
            name: 'Estenose',
            description: 'Redução luminal da artéria carótida externa',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasSeverity: true,
            extraFields: [
              {
                id: 'stenosis_percent',
                label: 'Estenose estimada (%)',
                type: 'text',
                placeholder: 'Ex: 45%'
              },
              {
                id: 'vps',
                label: 'VPS (Velocidade Pico Sistólico)',
                type: 'text',
                placeholder: 'Ex: 150 cm/s'
              },
              {
                id: 'vdf',
                label: 'VDF (Velocidade Diastólica Final)',
                type: 'text',
                placeholder: 'Ex: 80 cm/s'
              }
            ]
          },
          {
            id: 'oclusao-cee',
            name: 'Oclusão',
            description: 'Oclusão completa da artéria carótida externa',
            hasDetails: true,
            hasLocation: true
          }
        ]
      }
    ]
  },
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
            id: 'estenose-vd',
            name: 'Estenose',
            description: 'Redução luminal da artéria vertebral',
            hasDetails: true,
            hasMeasurement: true,  // VPS aumentada (>100 cm/s)
            hasSeverity: true,
            extraFields: [
              {
                id: 'vps',
                label: 'VPS (Velocidade Pico Sistólico)',
                type: 'select',
                options: VERTEBRAL_VELOCITY
              },
              {
                id: 'ir',
                label: 'Índice de Resistividade (IR)',
                type: 'select',
                options: VERTEBRAL_IR
              }
            ]
          },
          {
            id: 'fluxo-reverso-vd',
            name: 'Fluxo reverso (roubo da subclávia)',
            description: 'Inversão do fluxo sanguíneo',
            hasDetails: true,
            hasMeasurement: true,  // VPS e VDF
            extraFields: [
              {
                id: 'flow_pattern',
                label: 'Padrão de Fluxo',
                type: 'select',
                options: FLOW_PATTERN_VERTEBRAL
              },
              {
                id: 'subclavian_steal',
                label: 'Roubo da Subclávia',
                type: 'select',
                options: SUBCLAVIAN_STEAL
              },
              {
                id: 'vps',
                label: 'VPS (Velocidade Pico Sistólico)',
                type: 'text',
                placeholder: 'Ex: -40 cm/s (negativo = reverso)'
              }
            ]
          },
          {
            id: 'oclusao-vd',
            name: 'Oclusão',
            description: 'Oclusão completa da artéria vertebral',
            hasDetails: true,
            hasLocation: true
          }
        ]
      },
      {
        id: 'anatomicas-vd',
        name: 'Variações Anatômicas',
        findings: [
          {
            id: 'hipoplasia-vd',
            name: 'Hipoplasia',
            description: 'Calibre reduzido da artéria vertebral (<2mm)',
            hasDetails: true,
            hasMeasurement: true,  // Diâmetro em mm
            extraFields: [
              {
                id: 'diameter',
                label: 'Diâmetro (mm)',
                type: 'text',
                placeholder: 'Ex: 1.5 mm'
              }
            ]
          },
          {
            id: 'aplasia-vd',
            name: 'Aplasia',
            description: 'Ausência congênita da artéria vertebral',
            hasDetails: true
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
            id: 'estenose-ve',
            name: 'Estenose',
            description: 'Redução luminal da artéria vertebral',
            hasDetails: true,
            hasMeasurement: true,
            hasSeverity: true,
            extraFields: [
              {
                id: 'vps',
                label: 'VPS (Velocidade Pico Sistólico)',
                type: 'select',
                options: VERTEBRAL_VELOCITY
              },
              {
                id: 'ir',
                label: 'Índice de Resistividade (IR)',
                type: 'select',
                options: VERTEBRAL_IR
              }
            ]
          },
          {
            id: 'fluxo-reverso-ve',
            name: 'Fluxo reverso (roubo da subclávia)',
            description: 'Inversão do fluxo sanguíneo',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'flow_pattern',
                label: 'Padrão de Fluxo',
                type: 'select',
                options: FLOW_PATTERN_VERTEBRAL
              },
              {
                id: 'subclavian_steal',
                label: 'Roubo da Subclávia',
                type: 'select',
                options: SUBCLAVIAN_STEAL
              },
              {
                id: 'vps',
                label: 'VPS (Velocidade Pico Sistólico)',
                type: 'text',
                placeholder: 'Ex: -40 cm/s (negativo = reverso)'
              }
            ]
          },
          {
            id: 'oclusao-ve',
            name: 'Oclusão',
            description: 'Oclusão completa da artéria vertebral',
            hasDetails: true,
            hasLocation: true
          }
        ]
      },
      {
        id: 'anatomicas-ve',
        name: 'Variações Anatômicas',
        findings: [
          {
            id: 'hipoplasia-ve',
            name: 'Hipoplasia',
            description: 'Calibre reduzido da artéria vertebral (<2mm)',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'diameter',
                label: 'Diâmetro (mm)',
                type: 'text',
                placeholder: 'Ex: 1.5 mm'
              }
            ]
          },
          {
            id: 'aplasia-ve',
            name: 'Aplasia',
            description: 'Ausência congênita da artéria vertebral',
            hasDetails: true
          }
        ]
      }
    ]
  },
  {
    id: 'observacoes-carotidas',
    name: 'Observações',
    icon: 'notes',
    normalDescription: '',
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
            hasMeasurement: true,
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

// Graus de estenose (critérios NASCET/ECST)
export const STENOSIS_GRADES = [
  { value: '<50', label: 'Leve (<50%)' },
  { value: '50-69', label: 'Moderada (50-69%)' },
  { value: '70-89', label: 'Severa (70-89%)' },
  { value: '90-99', label: 'Crítica (90-99%)' },
  { value: 'suboclusiva', label: 'Suboclusiva (99%)' },
  { value: '100', label: 'Oclusão (100%)' }
];

// Valores de referência para velocidades (VPS - Velocidade de Pico Sistólico)
export const VPS_REFERENCE = [
  { stenosis: 'Normal', vps: '<125 cm/s', vpsVdf: '<2.0' },
  { stenosis: '<50%', vps: '<125 cm/s', vpsVdf: '<2.0' },
  { stenosis: '50-69%', vps: '125-230 cm/s', vpsVdf: '2.0-4.0' },
  { stenosis: '≥70%', vps: '>230 cm/s', vpsVdf: '>4.0' },
  { stenosis: 'Oclusão', vps: 'Sem fluxo', vpsVdf: 'N/A' }
];

// Características das placas
export const PLAQUE_CHARACTERISTICS = [
  { value: 'homogenea', label: 'Homogênea' },
  { value: 'heterogenea', label: 'Heterogênea' },
  { value: 'calcificada', label: 'Calcificada' },
  { value: 'lipidica', label: 'Lipídica (hipoecóica)' },
  { value: 'fibrosa', label: 'Fibrosa (hiperecóica)' },
  { value: 'ulcerada', label: 'Ulcerada' },
  { value: 'mista', label: 'Mista' }
];

// Superfície das placas
export const PLAQUE_SURFACE = [
  { value: 'lisa', label: 'Lisa' },
  { value: 'irregular', label: 'Irregular' },
  { value: 'ulcerada', label: 'Ulcerada' }
];

// Espessamento médio-intimal (EMI)
export const IMT_VALUES = [
  { range: '<0.9 mm', interpretation: 'Normal' },
  { range: '0.9-1.0 mm', interpretation: 'Limítrofe' },
  { range: '>1.0 mm', interpretation: 'Espessado' },
  { range: '>1.5 mm', interpretation: 'Placa aterosclerótica' }
];

// Padrão de fluxo
export const FLOW_PATTERN = [
  { value: 'anterogrado', label: 'Anterógrado (normal)' },
  { value: 'retrogrado', label: 'Retrógrado (reverso)' },
  { value: 'to-and-fro', label: 'To-and-fro (oscilatório)' },
  { value: 'ausente', label: 'Ausente (oclusão)' }
];

// Índice de resistividade (IR)
export const RESISTIVITY_INDEX = [
  { range: '0.55-0.75', interpretation: 'Normal' },
  { range: '<0.55', interpretation: 'Baixa resistência' },
  { range: '>0.75', interpretation: 'Alta resistência' }
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

const getStenosisLevelFromVPS = (vps: number): StenosisLevel => {
  if (vps === 0) return 'occlusion';
  if (vps < 50) return 'near_occlusion';
  if (vps < 125) return 'mild';
  if (vps <= 230) return 'moderate';
  if (vps <= 280) return 'severe';
  return 'critical';
};

const getStenosisLevelFromVDF = (vdf: number): StenosisLevel => {
  if (vdf === 0) return 'occlusion';
  if (vdf < 40) return 'mild';
  if (vdf <= 100) return 'moderate';
  return 'severe';
};

const getStenosisLevelFromRatio = (ratio: number): StenosisLevel => {
  if (ratio < 2.0) return 'mild';
  if (ratio <= 4.0) return 'moderate';
  return 'severe';
};

const getStenosisLevelFromBroadening = (broadening: string): StenosisLevel | null => {
  const lower = broadening.toLowerCase();
  if (lower.includes('ausente')) return 'mild';
  if (lower.includes('leve')) return 'mild';
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

  const parseNumeric = (val?: number | string): number | undefined => {
    if (val === undefined || val === null || val === '') return undefined;
    if (typeof val === 'number') return val;
    const match = val.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : undefined;
  };

  const vps = parseNumeric(params.vps);
  const vdf = parseNumeric(params.vdf);
  const ratio = parseNumeric(params.ratio);
  const { spectralBroadening, symptomatic = false, plaqueGSM, vulnerableFeatures = [] } = params;

  if (vps !== undefined) {
    const level = getStenosisLevelFromVPS(vps);
    levels.push(level);
    criteriaUsed.push(`VPS ${vps} cm/s → ${LEVEL_TO_NASCET[level].nascet}`);
  }

  if (vdf !== undefined) {
    const level = getStenosisLevelFromVDF(vdf);
    levels.push(level);
    criteriaUsed.push(`VDF ${vdf} cm/s → ${LEVEL_TO_NASCET[level].nascet}`);
  }

  if (ratio !== undefined) {
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
