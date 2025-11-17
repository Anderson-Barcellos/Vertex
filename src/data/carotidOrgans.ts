import { Organ, OrganCategory, Finding } from './organs';

// ============================================================================
// CONSTANTES - DIRETRIZES DIC/CBR/SBACV 2023
// ============================================================================

// Velocidades e Critérios de Estenose
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
            hasLocation: true,  // Bulbo, segmento cervical
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
            hasMeasurement: true,  // % e velocidades (VPS, VDF)
            hasLocation: true,
            hasSeverity: true,  // <50%, 50-69%, ≥70%
            extraFields: [
              {
                id: 'stenosis_percent',
                label: 'Estenose estimada (%)',
                type: 'text',
                placeholder: 'Ex: 65%'
              },
              {
                id: 'vps',
                label: 'VPS (Velocidade Pico Sistólico)',
                type: 'text',
                placeholder: 'Ex: 250 cm/s'
              },
              {
                id: 'vdf',
                label: 'VDF (Velocidade Diastólica Final)',
                type: 'text',
                placeholder: 'Ex: 120 cm/s'
              },
              {
                id: 'ratio_aci_acc',
                label: 'Razão VPS ACI/ACC',
                type: 'text',
                placeholder: 'Ex: 4.2'
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
                id: 'stenosis_percent',
                label: 'Estenose estimada (%)',
                type: 'text',
                placeholder: 'Ex: 65%'
              },
              {
                id: 'vps',
                label: 'VPS (Velocidade Pico Sistólico)',
                type: 'text',
                placeholder: 'Ex: 250 cm/s'
              },
              {
                id: 'vdf',
                label: 'VDF (Velocidade Diastólica Final)',
                type: 'text',
                placeholder: 'Ex: 120 cm/s'
              },
              {
                id: 'ratio_aci_acc',
                label: 'Razão VPS ACI/ACC',
                type: 'text',
                placeholder: 'Ex: 4.2'
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
