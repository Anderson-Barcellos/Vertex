import { Organ, OrganCategory, Finding } from './organs';

// ============================================================================
// CONSTANTES - DIRETRIZES SBACV 2024 + AHA/ACC 2016 + CONSENSO SVM/SVU 2020
// ============================================================================

// Localizações Anatômicas por Segmento
export const ILIAC_LOCATIONS = [
  'Terço proximal',
  'Terço médio',
  'Terço distal'
];

export const FEMORAL_COMMON_LOCATIONS = [
  'Origem',
  'Corpo',
  'Bifurcação'
];

export const FEMORAL_SUPERFICIAL_LOCATIONS = [
  'Terço proximal',
  'Terço médio',
  'Terço distal',
  'Canal dos adutores (Hunter)'
];

export const FEMORAL_PROFUNDA_LOCATIONS = [
  'Origem',
  'Terço proximal',
  'Terço médio'
];

export const POPLITEAL_LOCATIONS = [
  'Supra-articular',
  'Hiato dos adutores',
  'Fossa poplítea',
  'Infra-articular'
];

export const TIBIAL_LOCATIONS = [
  'Origem (tronco tíbio-fibular)',
  'Terço proximal',
  'Terço médio',
  'Terço distal'
];

// Valores Normais de PSV (Peak Systolic Velocity)
export const NORMAL_PSV = {
  ILIAC: '100-200 cm/s',
  FEMORAL_COMMON: '80-120 cm/s',
  FEMORAL_SUPERFICIAL: '80-100 cm/s',
  FEMORAL_PROFUNDA: '80-100 cm/s',
  POPLITEAL: '60-80 cm/s',
  TIBIAL_ANTERIOR: '40-60 cm/s',
  TIBIAL_POSTERIOR: '40-60 cm/s',
  FIBULAR: '40-60 cm/s'
};

// Critérios de Estenose por PSV e Velocity Ratio (Vr)
export const STENOSIS_CRITERIA = {
  MILD: {
    label: 'Leve (<50%)',
    psv: '<100% aumento',
    vr: '<2.0',
    description: 'Estenose hemodinamicamente não significativa'
  },
  MODERATE: {
    label: 'Moderada (50-75%)',
    psv: '100-300% aumento',
    vr: '2.0-4.0',
    description: 'Estenose hemodinamicamente significativa'
  },
  SEVERE: {
    label: 'Grave (>75%)',
    psv: '>300% aumento',
    vr: '>4.0',
    description: 'Estenose crítica, alto risco de oclusão'
  }
};

// Padrão de Onda Doppler (Waveform)
export const WAVEFORM_PATTERNS = [
  'Trifásico (normal)',
  'Bifásico (pode ser normal)',
  'Monofásico (anormal - estenose proximal)',
  'Ausente (oclusão)'
];

// Caracterização de Placas Ateroscleróticas
export const PLAQUE_COMPOSITION = [
  'Calcificada (hiperecogênica com sombra)',
  'Fibro-calcificada (mista)',
  'Fibrolipídica (isoecogênica)',
  'Lipídica (hipoecogênica)',
  'Hemorrágica (heterogênea)'
];

export const PLAQUE_SURFACE = [
  'Lisa/regular',
  'Irregular',
  'Ulcerada'
];

export const PLAQUE_ECHOGENICITY = [
  'Hiperecogênica (calcificada)',
  'Isoecogênica (fibrótica)',
  'Hipoecogênica (lipídica)',
  'Anecogênica (hemorrágica)',
  'Heterogênea (mista)'
];

// Classificação de Fontaine (Doença Arterial Crônica)
export const FONTAINE_CLASSIFICATION = [
  'Estágio I - Assintomático',
  'Estágio IIa - Claudicação leve (>200m)',
  'Estágio IIb - Claudicação moderada/grave (<200m)',
  'Estágio III - Dor em repouso',
  'Estágio IV - Úlcera ou gangrena'
];

// Classificação de Rutherford
export const RUTHERFORD_CLASSIFICATION = [
  'Grau 0 - Assintomático',
  'Grau I - Claudicação leve',
  'Grau II - Claudicação moderada',
  'Grau III - Claudicação grave',
  'Grau IV - Dor em repouso',
  'Grau V - Perda tecidual menor',
  'Grau VI - Perda tecidual maior'
];

// Tipo de Oclusão
export const OCCLUSION_TYPE = [
  'Aguda (<14 dias)',
  'Subaguda (14 dias - 3 meses)',
  'Crônica (>3 meses)'
];

// Extensão da Oclusão/Estenose
export const LESION_EXTENT = [
  'Focal (<1 cm)',
  'Curta (1-5 cm)',
  'Longa (5-10 cm)',
  'Extensa (>10 cm)',
  'Múltiplos segmentos'
];

// Circulação Colateral
export const COLLATERAL_STATUS = [
  'Ausente',
  'Escassa',
  'Moderada',
  'Abundante (bem desenvolvida)'
];

// Grau de Calcificação
export const CALCIFICATION_GRADE = [
  'Ausente',
  'Leve (pontos isolados)',
  'Moderada (segmentar)',
  'Grave (circunferencial)'
];

// ============================================================================
// ÓRGÃOS/SEGMENTOS ARTERIAIS - BILATERAL
// ============================================================================

export const arterialOrgans: Organ[] = [
  // ====================================
  // MEMBRO INFERIOR DIREITO
  // ====================================
  {
    id: 'iliaca-comum-d',
    name: 'Artéria Ilíaca Comum D',
    categories: [
      {
        id: 'estenose-icd',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-leve-icd',
            name: 'Estenose Leve (<50%)',
            description: 'PSV aumentado <100%, Vr <2.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.ILIAC },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'estenose-moderada-icd',
            name: 'Estenose Moderada (50-75%)',
            description: 'PSV 100-300% aumentado, Vr 2.0-4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.ILIAC },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '2.0-4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          },
          {
            id: 'estenose-grave-icd',
            name: 'Estenose Grave (>75%)',
            description: 'PSV >300% aumentado, Vr >4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.ILIAC },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '>4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          }
        ]
      },
      {
        id: 'oclusao-icd',
        name: 'Oclusão',
        findings: [
          {
            id: 'oclusao-total-icd',
            name: 'Oclusão Total',
            description: 'Ausência de fluxo ao Doppler',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'extensao-mm', label: 'Extensão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          }
        ]
      },
      {
        id: 'placa-icd',
        name: 'Placa Aterosclerótica',
        findings: [
          {
            id: 'placa-aterosclerotica-icd',
            name: 'Placa Aterosclerótica',
            description: 'Espessamento focal da parede arterial',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'comprimento', label: 'Comprimento', unit: 'mm', normalRange: '' },
              { id: 'espessura', label: 'Espessura máxima', unit: 'mm', normalRange: '' }
            ],
            customFields: [
              { id: 'composicao', label: 'Composição', type: 'select', options: PLAQUE_COMPOSITION },
              { id: 'superficie', label: 'Superfície', type: 'select', options: PLAQUE_SURFACE },
              { id: 'calcificacao', label: 'Grau de Calcificação', type: 'select', options: CALCIFICATION_GRADE }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'iliaca-externa-d',
    name: 'Artéria Ilíaca Externa D',
    categories: [
      {
        id: 'estenose-ied',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-leve-ied',
            name: 'Estenose Leve (<50%)',
            description: 'PSV aumentado <100%, Vr <2.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.ILIAC },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'estenose-moderada-ied',
            name: 'Estenose Moderada (50-75%)',
            description: 'PSV 100-300% aumentado, Vr 2.0-4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.ILIAC },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '2.0-4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          },
          {
            id: 'estenose-grave-ied',
            name: 'Estenose Grave (>75%)',
            description: 'PSV >300% aumentado, Vr >4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.ILIAC },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '>4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          }
        ]
      },
      {
        id: 'oclusao-ied',
        name: 'Oclusão',
        findings: [
          {
            id: 'oclusao-total-ied',
            name: 'Oclusão Total',
            description: 'Ausência de fluxo ao Doppler',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'extensao-mm', label: 'Extensão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          }
        ]
      },
      {
        id: 'placa-ied',
        name: 'Placa Aterosclerótica',
        findings: [
          {
            id: 'placa-aterosclerotica-ied',
            name: 'Placa Aterosclerótica',
            description: 'Espessamento focal da parede arterial',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'comprimento', label: 'Comprimento', unit: 'mm', normalRange: '' },
              { id: 'espessura', label: 'Espessura máxima', unit: 'mm', normalRange: '' }
            ],
            customFields: [
              { id: 'composicao', label: 'Composição', type: 'select', options: PLAQUE_COMPOSITION },
              { id: 'superficie', label: 'Superfície', type: 'select', options: PLAQUE_SURFACE },
              { id: 'calcificacao', label: 'Grau de Calcificação', type: 'select', options: CALCIFICATION_GRADE }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'femoral-comum-d',
    name: 'Artéria Femoral Comum D',
    categories: [
      {
        id: 'estenose-fcd',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-leve-fcd',
            name: 'Estenose Leve (<50%)',
            description: 'PSV aumentado <100%, Vr <2.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_COMMON_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.FEMORAL_COMMON },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'estenose-moderada-fcd',
            name: 'Estenose Moderada (50-75%)',
            description: 'PSV 100-300% aumentado, Vr 2.0-4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_COMMON_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.FEMORAL_COMMON },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '2.0-4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          },
          {
            id: 'estenose-grave-fcd',
            name: 'Estenose Grave (>75%)',
            description: 'PSV >300% aumentado, Vr >4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_COMMON_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.FEMORAL_COMMON },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '>4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          }
        ]
      },
      {
        id: 'oclusao-fcd',
        name: 'Oclusão',
        findings: [
          {
            id: 'oclusao-total-fcd',
            name: 'Oclusão Total',
            description: 'Ausência de fluxo ao Doppler',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_COMMON_LOCATIONS,
            measurements: [
              { id: 'extensao-mm', label: 'Extensão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          }
        ]
      },
      {
        id: 'placa-fcd',
        name: 'Placa Aterosclerótica',
        findings: [
          {
            id: 'placa-aterosclerotica-fcd',
            name: 'Placa Aterosclerótica',
            description: 'Espessamento focal da parede arterial',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_COMMON_LOCATIONS,
            measurements: [
              { id: 'comprimento', label: 'Comprimento', unit: 'mm', normalRange: '' },
              { id: 'espessura', label: 'Espessura máxima', unit: 'mm', normalRange: '' }
            ],
            customFields: [
              { id: 'composicao', label: 'Composição', type: 'select', options: PLAQUE_COMPOSITION },
              { id: 'superficie', label: 'Superfície', type: 'select', options: PLAQUE_SURFACE },
              { id: 'calcificacao', label: 'Grau de Calcificação', type: 'select', options: CALCIFICATION_GRADE }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'femoral-superficial-d',
    name: 'Artéria Femoral Superficial D',
    categories: [
      {
        id: 'estenose-fsd',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-leve-fsd',
            name: 'Estenose Leve (<50%)',
            description: 'PSV aumentado <100%, Vr <2.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_SUPERFICIAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.FEMORAL_SUPERFICIAL },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'estenose-moderada-fsd',
            name: 'Estenose Moderada (50-75%)',
            description: 'PSV 100-300% aumentado, Vr 2.0-4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_SUPERFICIAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.FEMORAL_SUPERFICIAL },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '2.0-4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          },
          {
            id: 'estenose-grave-fsd',
            name: 'Estenose Grave (>75%)',
            description: 'PSV >300% aumentado, Vr >4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_SUPERFICIAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.FEMORAL_SUPERFICIAL },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '>4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          }
        ]
      },
      {
        id: 'oclusao-fsd',
        name: 'Oclusão',
        findings: [
          {
            id: 'oclusao-total-fsd',
            name: 'Oclusão Total',
            description: 'Ausência de fluxo ao Doppler',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_SUPERFICIAL_LOCATIONS,
            measurements: [
              { id: 'extensao-mm', label: 'Extensão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          }
        ]
      },
      {
        id: 'placa-fsd',
        name: 'Placa Aterosclerótica',
        findings: [
          {
            id: 'placa-aterosclerotica-fsd',
            name: 'Placa Aterosclerótica',
            description: 'Espessamento focal da parede arterial',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_SUPERFICIAL_LOCATIONS,
            measurements: [
              { id: 'comprimento', label: 'Comprimento', unit: 'mm', normalRange: '' },
              { id: 'espessura', label: 'Espessura máxima', unit: 'mm', normalRange: '' }
            ],
            customFields: [
              { id: 'composicao', label: 'Composição', type: 'select', options: PLAQUE_COMPOSITION },
              { id: 'superficie', label: 'Superfície', type: 'select', options: PLAQUE_SURFACE },
              { id: 'calcificacao', label: 'Grau de Calcificação', type: 'select', options: CALCIFICATION_GRADE }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'poplitea-d',
    name: 'Artéria Poplítea D',
    categories: [
      {
        id: 'estenose-popd',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-leve-popd',
            name: 'Estenose Leve (<50%)',
            description: 'PSV aumentado <100%, Vr <2.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: POPLITEAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.POPLITEAL },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'estenose-moderada-popd',
            name: 'Estenose Moderada (50-75%)',
            description: 'PSV 100-300% aumentado, Vr 2.0-4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: POPLITEAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.POPLITEAL },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '2.0-4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          },
          {
            id: 'estenose-grave-popd',
            name: 'Estenose Grave (>75%)',
            description: 'PSV >300% aumentado, Vr >4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: POPLITEAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.POPLITEAL },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '>4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          }
        ]
      },
      {
        id: 'aneurisma-popd',
        name: 'Aneurisma',
        findings: [
          {
            id: 'aneurisma-popd',
            name: 'Aneurisma Poplíteo',
            description: 'Dilatação >15mm ou >1.5x diâmetro normal',
            requiresMeasurement: true,
            requiresLocation: false,
            measurements: [
              { id: 'diametro-ap', label: 'Diâmetro AP', unit: 'mm', normalRange: '<9' },
              { id: 'diametro-lat', label: 'Diâmetro Lateral', unit: 'mm', normalRange: '<9' },
              { id: 'comprimento', label: 'Comprimento', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'trombo', label: 'Trombo mural', type: 'select', options: ['Ausente', 'Presente - parcial', 'Presente - extenso'] },
              { id: 'morfologia', label: 'Morfologia', type: 'select', options: ['Fusiforme', 'Sacular'] }
            ]
          }
        ]
      },
      {
        id: 'oclusao-popd',
        name: 'Oclusão',
        findings: [
          {
            id: 'oclusao-total-popd',
            name: 'Oclusão Total',
            description: 'Ausência de fluxo ao Doppler',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: POPLITEAL_LOCATIONS,
            measurements: [
              { id: 'extensao-mm', label: 'Extensão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          }
        ]
      },
      {
        id: 'placa-popd',
        name: 'Placa Aterosclerótica',
        findings: [
          {
            id: 'placa-aterosclerotica-popd',
            name: 'Placa Aterosclerótica',
            description: 'Espessamento focal da parede arterial',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: POPLITEAL_LOCATIONS,
            measurements: [
              { id: 'comprimento', label: 'Comprimento', unit: 'mm', normalRange: '' },
              { id: 'espessura', label: 'Espessura máxima', unit: 'mm', normalRange: '' }
            ],
            customFields: [
              { id: 'composicao', label: 'Composição', type: 'select', options: PLAQUE_COMPOSITION },
              { id: 'superficie', label: 'Superfície', type: 'select', options: PLAQUE_SURFACE },
              { id: 'calcificacao', label: 'Grau de Calcificação', type: 'select', options: CALCIFICATION_GRADE }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'tibiais-d',
    name: 'Artérias Tibiais D',
    categories: [
      {
        id: 'estenose-tibd',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-tibial-anterior-d',
            name: 'Estenose Tibial Anterior',
            description: 'Estenose da artéria tibial anterior',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: TIBIAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.TIBIAL_ANTERIOR },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' }
            ],
            customFields: [
              { id: 'grau', label: 'Grau de Estenose', type: 'select', options: ['Leve (<50%)', 'Moderada (50-75%)', 'Grave (>75%)'] },
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'estenose-tibial-posterior-d',
            name: 'Estenose Tibial Posterior',
            description: 'Estenose da artéria tibial posterior',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: TIBIAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.TIBIAL_POSTERIOR },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' }
            ],
            customFields: [
              { id: 'grau', label: 'Grau de Estenose', type: 'select', options: ['Leve (<50%)', 'Moderada (50-75%)', 'Grave (>75%)'] },
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'estenose-fibular-d',
            name: 'Estenose Fibular',
            description: 'Estenose da artéria fibular',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: TIBIAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.FIBULAR },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' }
            ],
            customFields: [
              { id: 'grau', label: 'Grau de Estenose', type: 'select', options: ['Leve (<50%)', 'Moderada (50-75%)', 'Grave (>75%)'] },
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          }
        ]
      },
      {
        id: 'oclusao-tibd',
        name: 'Oclusão',
        findings: [
          {
            id: 'oclusao-tibial-anterior-d',
            name: 'Oclusão Tibial Anterior',
            description: 'Ausência de fluxo na artéria tibial anterior',
            requiresMeasurement: false,
            requiresLocation: false,
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          },
          {
            id: 'oclusao-tibial-posterior-d',
            name: 'Oclusão Tibial Posterior',
            description: 'Ausência de fluxo na artéria tibial posterior',
            requiresMeasurement: false,
            requiresLocation: false,
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          },
          {
            id: 'oclusao-fibular-d',
            name: 'Oclusão Fibular',
            description: 'Ausência de fluxo na artéria fibular',
            requiresMeasurement: false,
            requiresLocation: false,
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          }
        ]
      }
    ]
  },

  // ====================================
  // MEMBRO INFERIOR ESQUERDO
  // ====================================
  {
    id: 'iliaca-comum-e',
    name: 'Artéria Ilíaca Comum E',
    categories: [
      {
        id: 'estenose-ice',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-leve-ice',
            name: 'Estenose Leve (<50%)',
            description: 'PSV aumentado <100%, Vr <2.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.ILIAC },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'estenose-moderada-ice',
            name: 'Estenose Moderada (50-75%)',
            description: 'PSV 100-300% aumentado, Vr 2.0-4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.ILIAC },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '2.0-4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          },
          {
            id: 'estenose-grave-ice',
            name: 'Estenose Grave (>75%)',
            description: 'PSV >300% aumentado, Vr >4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.ILIAC },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '>4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          }
        ]
      },
      {
        id: 'oclusao-ice',
        name: 'Oclusão',
        findings: [
          {
            id: 'oclusao-total-ice',
            name: 'Oclusão Total',
            description: 'Ausência de fluxo ao Doppler',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'extensao-mm', label: 'Extensão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          }
        ]
      },
      {
        id: 'placa-ice',
        name: 'Placa Aterosclerótica',
        findings: [
          {
            id: 'placa-aterosclerotica-ice',
            name: 'Placa Aterosclerótica',
            description: 'Espessamento focal da parede arterial',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'comprimento', label: 'Comprimento', unit: 'mm', normalRange: '' },
              { id: 'espessura', label: 'Espessura máxima', unit: 'mm', normalRange: '' }
            ],
            customFields: [
              { id: 'composicao', label: 'Composição', type: 'select', options: PLAQUE_COMPOSITION },
              { id: 'superficie', label: 'Superfície', type: 'select', options: PLAQUE_SURFACE },
              { id: 'calcificacao', label: 'Grau de Calcificação', type: 'select', options: CALCIFICATION_GRADE }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'iliaca-externa-e',
    name: 'Artéria Ilíaca Externa E',
    categories: [
      {
        id: 'estenose-iee',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-leve-iee',
            name: 'Estenose Leve (<50%)',
            description: 'PSV aumentado <100%, Vr <2.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.ILIAC },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'estenose-moderada-iee',
            name: 'Estenose Moderada (50-75%)',
            description: 'PSV 100-300% aumentado, Vr 2.0-4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.ILIAC },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '2.0-4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          },
          {
            id: 'estenose-grave-iee',
            name: 'Estenose Grave (>75%)',
            description: 'PSV >300% aumentado, Vr >4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.ILIAC },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '>4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          }
        ]
      },
      {
        id: 'oclusao-iee',
        name: 'Oclusão',
        findings: [
          {
            id: 'oclusao-total-iee',
            name: 'Oclusão Total',
            description: 'Ausência de fluxo ao Doppler',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'extensao-mm', label: 'Extensão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          }
        ]
      },
      {
        id: 'placa-iee',
        name: 'Placa Aterosclerótica',
        findings: [
          {
            id: 'placa-aterosclerotica-iee',
            name: 'Placa Aterosclerótica',
            description: 'Espessamento focal da parede arterial',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: ILIAC_LOCATIONS,
            measurements: [
              { id: 'comprimento', label: 'Comprimento', unit: 'mm', normalRange: '' },
              { id: 'espessura', label: 'Espessura máxima', unit: 'mm', normalRange: '' }
            ],
            customFields: [
              { id: 'composicao', label: 'Composição', type: 'select', options: PLAQUE_COMPOSITION },
              { id: 'superficie', label: 'Superfície', type: 'select', options: PLAQUE_SURFACE },
              { id: 'calcificacao', label: 'Grau de Calcificação', type: 'select', options: CALCIFICATION_GRADE }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'femoral-comum-e',
    name: 'Artéria Femoral Comum E',
    categories: [
      {
        id: 'estenose-fce',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-leve-fce',
            name: 'Estenose Leve (<50%)',
            description: 'PSV aumentado <100%, Vr <2.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_COMMON_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.FEMORAL_COMMON },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'estenose-moderada-fce',
            name: 'Estenose Moderada (50-75%)',
            description: 'PSV 100-300% aumentado, Vr 2.0-4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_COMMON_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.FEMORAL_COMMON },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '2.0-4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          },
          {
            id: 'estenose-grave-fce',
            name: 'Estenose Grave (>75%)',
            description: 'PSV >300% aumentado, Vr >4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_COMMON_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.FEMORAL_COMMON },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '>4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          }
        ]
      },
      {
        id: 'oclusao-fce',
        name: 'Oclusão',
        findings: [
          {
            id: 'oclusao-total-fce',
            name: 'Oclusão Total',
            description: 'Ausência de fluxo ao Doppler',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_COMMON_LOCATIONS,
            measurements: [
              { id: 'extensao-mm', label: 'Extensão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          }
        ]
      },
      {
        id: 'placa-fce',
        name: 'Placa Aterosclerótica',
        findings: [
          {
            id: 'placa-aterosclerotica-fce',
            name: 'Placa Aterosclerótica',
            description: 'Espessamento focal da parede arterial',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_COMMON_LOCATIONS,
            measurements: [
              { id: 'comprimento', label: 'Comprimento', unit: 'mm', normalRange: '' },
              { id: 'espessura', label: 'Espessura máxima', unit: 'mm', normalRange: '' }
            ],
            customFields: [
              { id: 'composicao', label: 'Composição', type: 'select', options: PLAQUE_COMPOSITION },
              { id: 'superficie', label: 'Superfície', type: 'select', options: PLAQUE_SURFACE },
              { id: 'calcificacao', label: 'Grau de Calcificação', type: 'select', options: CALCIFICATION_GRADE }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'femoral-superficial-e',
    name: 'Artéria Femoral Superficial E',
    categories: [
      {
        id: 'estenose-fse',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-leve-fse',
            name: 'Estenose Leve (<50%)',
            description: 'PSV aumentado <100%, Vr <2.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_SUPERFICIAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.FEMORAL_SUPERFICIAL },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'estenose-moderada-fse',
            name: 'Estenose Moderada (50-75%)',
            description: 'PSV 100-300% aumentado, Vr 2.0-4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_SUPERFICIAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.FEMORAL_SUPERFICIAL },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '2.0-4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          },
          {
            id: 'estenose-grave-fse',
            name: 'Estenose Grave (>75%)',
            description: 'PSV >300% aumentado, Vr >4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_SUPERFICIAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.FEMORAL_SUPERFICIAL },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '>4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          }
        ]
      },
      {
        id: 'oclusao-fse',
        name: 'Oclusão',
        findings: [
          {
            id: 'oclusao-total-fse',
            name: 'Oclusão Total',
            description: 'Ausência de fluxo ao Doppler',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_SUPERFICIAL_LOCATIONS,
            measurements: [
              { id: 'extensao-mm', label: 'Extensão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          }
        ]
      },
      {
        id: 'placa-fse',
        name: 'Placa Aterosclerótica',
        findings: [
          {
            id: 'placa-aterosclerotica-fse',
            name: 'Placa Aterosclerótica',
            description: 'Espessamento focal da parede arterial',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: FEMORAL_SUPERFICIAL_LOCATIONS,
            measurements: [
              { id: 'comprimento', label: 'Comprimento', unit: 'mm', normalRange: '' },
              { id: 'espessura', label: 'Espessura máxima', unit: 'mm', normalRange: '' }
            ],
            customFields: [
              { id: 'composicao', label: 'Composição', type: 'select', options: PLAQUE_COMPOSITION },
              { id: 'superficie', label: 'Superfície', type: 'select', options: PLAQUE_SURFACE },
              { id: 'calcificacao', label: 'Grau de Calcificação', type: 'select', options: CALCIFICATION_GRADE }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'poplitea-e',
    name: 'Artéria Poplítea E',
    categories: [
      {
        id: 'estenose-pope',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-leve-pope',
            name: 'Estenose Leve (<50%)',
            description: 'PSV aumentado <100%, Vr <2.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: POPLITEAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.POPLITEAL },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'estenose-moderada-pope',
            name: 'Estenose Moderada (50-75%)',
            description: 'PSV 100-300% aumentado, Vr 2.0-4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: POPLITEAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.POPLITEAL },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '2.0-4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          },
          {
            id: 'estenose-grave-pope',
            name: 'Estenose Grave (>75%)',
            description: 'PSV >300% aumentado, Vr >4.0',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: POPLITEAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.POPLITEAL },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '>4.0' },
              { id: 'comprimento', label: 'Comprimento da lesão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS },
              { id: 'extensao', label: 'Extensão', type: 'select', options: LESION_EXTENT }
            ]
          }
        ]
      },
      {
        id: 'aneurisma-pope',
        name: 'Aneurisma',
        findings: [
          {
            id: 'aneurisma-pope',
            name: 'Aneurisma Poplíteo',
            description: 'Dilatação >15mm ou >1.5x diâmetro normal',
            requiresMeasurement: true,
            requiresLocation: false,
            measurements: [
              { id: 'diametro-ap', label: 'Diâmetro AP', unit: 'mm', normalRange: '<9' },
              { id: 'diametro-lat', label: 'Diâmetro Lateral', unit: 'mm', normalRange: '<9' },
              { id: 'comprimento', label: 'Comprimento', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'trombo', label: 'Trombo mural', type: 'select', options: ['Ausente', 'Presente - parcial', 'Presente - extenso'] },
              { id: 'morfologia', label: 'Morfologia', type: 'select', options: ['Fusiforme', 'Sacular'] }
            ]
          }
        ]
      },
      {
        id: 'oclusao-pope',
        name: 'Oclusão',
        findings: [
          {
            id: 'oclusao-total-pope',
            name: 'Oclusão Total',
            description: 'Ausência de fluxo ao Doppler',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: POPLITEAL_LOCATIONS,
            measurements: [
              { id: 'extensao-mm', label: 'Extensão', unit: 'cm', normalRange: '' }
            ],
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          }
        ]
      },
      {
        id: 'placa-pope',
        name: 'Placa Aterosclerótica',
        findings: [
          {
            id: 'placa-aterosclerotica-pope',
            name: 'Placa Aterosclerótica',
            description: 'Espessamento focal da parede arterial',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: POPLITEAL_LOCATIONS,
            measurements: [
              { id: 'comprimento', label: 'Comprimento', unit: 'mm', normalRange: '' },
              { id: 'espessura', label: 'Espessura máxima', unit: 'mm', normalRange: '' }
            ],
            customFields: [
              { id: 'composicao', label: 'Composição', type: 'select', options: PLAQUE_COMPOSITION },
              { id: 'superficie', label: 'Superfície', type: 'select', options: PLAQUE_SURFACE },
              { id: 'calcificacao', label: 'Grau de Calcificação', type: 'select', options: CALCIFICATION_GRADE }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 'tibiais-e',
    name: 'Artérias Tibiais E',
    categories: [
      {
        id: 'estenose-tibe',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-tibial-anterior-e',
            name: 'Estenose Tibial Anterior',
            description: 'Estenose da artéria tibial anterior',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: TIBIAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.TIBIAL_ANTERIOR },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' }
            ],
            customFields: [
              { id: 'grau', label: 'Grau de Estenose', type: 'select', options: ['Leve (<50%)', 'Moderada (50-75%)', 'Grave (>75%)'] },
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'estenose-tibial-posterior-e',
            name: 'Estenose Tibial Posterior',
            description: 'Estenose da artéria tibial posterior',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: TIBIAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.TIBIAL_POSTERIOR },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' }
            ],
            customFields: [
              { id: 'grau', label: 'Grau de Estenose', type: 'select', options: ['Leve (<50%)', 'Moderada (50-75%)', 'Grave (>75%)'] },
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'estenose-fibular-e',
            name: 'Estenose Fibular',
            description: 'Estenose da artéria fibular',
            requiresMeasurement: true,
            requiresLocation: true,
            locations: TIBIAL_LOCATIONS,
            measurements: [
              { id: 'psv', label: 'PSV', unit: 'cm/s', normalRange: NORMAL_PSV.FIBULAR },
              { id: 'vr', label: 'Velocity Ratio (Vr)', unit: '', normalRange: '<2.0' }
            ],
            customFields: [
              { id: 'grau', label: 'Grau de Estenose', type: 'select', options: ['Leve (<50%)', 'Moderada (50-75%)', 'Grave (>75%)'] },
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          }
        ]
      },
      {
        id: 'oclusao-tibe',
        name: 'Oclusão',
        findings: [
          {
            id: 'oclusao-tibial-anterior-e',
            name: 'Oclusão Tibial Anterior',
            description: 'Ausência de fluxo na artéria tibial anterior',
            requiresMeasurement: false,
            requiresLocation: false,
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          },
          {
            id: 'oclusao-tibial-posterior-e',
            name: 'Oclusão Tibial Posterior',
            description: 'Ausência de fluxo na artéria tibial posterior',
            requiresMeasurement: false,
            requiresLocation: false,
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          },
          {
            id: 'oclusao-fibular-e',
            name: 'Oclusão Fibular',
            description: 'Ausência de fluxo na artéria fibular',
            requiresMeasurement: false,
            requiresLocation: false,
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Circulação Colateral', type: 'select', options: COLLATERAL_STATUS }
            ]
          }
        ]
      }
    ]
  }
];
