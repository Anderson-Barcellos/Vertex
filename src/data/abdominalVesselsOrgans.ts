import { Organ, OrganCategory, Finding } from './organs';

// ============================================================================
// CONSTANTES - DIRETRIZES ESC 2024, ACR 2024, SBACV
// ============================================================================

// Diâmetros da Aorta Abdominal
export const AORTA_DIAMETERS = {
  NORMAL: '<2.5 cm',
  ECTASIA: '2.5-2.9 cm',
  ANEURYSM_SMALL: '3.0-4.4 cm',
  ANEURYSM_MEDIUM: '4.5-5.4 cm',
  ANEURYSM_LARGE: '5.5-5.9 cm',
  ANEURYSM_GIANT: '≥6.0 cm'
};

export const AORTA_CLASSIFICATION = [
  'Normal (<2.5 cm)',
  'Ectasia (2.5-2.9 cm)',
  'Aneurisma pequeno (3.0-4.4 cm)',
  'Aneurisma médio (4.5-5.4 cm)',
  'Aneurisma grande (5.5-5.9 cm) - indicação cirúrgica',
  'Aneurisma gigante (≥6.0 cm) - cirurgia urgente'
];

// Níveis da Aorta Abdominal
export const AORTA_LEVELS = [
  'Aorta suprarrenal (nível do tronco celíaco)',
  'Aorta justarrenal (nível das artérias renais)',
  'Aorta infrarrenal (abaixo das renais)',
  'Bifurcação aórtica (ilíacas comuns)'
];

// Localizações Anatômicas para Aorta
export const AORTA_LOCATIONS = [
  'Proximal (tronco celíaco)',
  'Média (artérias renais)',
  'Distal (pré-bifurcação)',
  'Bifurcação ilíaca'
];

// Critérios de Estenose - Artérias Renais
export const RENAL_STENOSIS_CRITERIA = [
  'Normal (PSV <180 cm/s, RAR <3.5)',
  'Estenose <60% (PSV <180 cm/s)',
  'Estenose 60-99% (PSV >180 cm/s, RAR >3.5)',
  'Estenose crítica (PSV >400 cm/s)',
  'Oclusão (fluxo ausente)'
];

// RAR = Renal-Aortic Ratio (Razão Renal/Aorta)
export const RAR_VALUES = [
  'Normal (RAR <3.5)',
  'Estenose significativa (RAR ≥3.5)',
  'Estenose grave (RAR >5.0)'
];

// Velocidades Artéria Renal
export const RENAL_VELOCITIES = {
  PSV_NORMAL: '<180 cm/s',
  PSV_STENOSIS_60: '>180 cm/s',
  PSV_STENOSIS_CRITICAL: '>400 cm/s',
  EDV_NORMAL: '<50 cm/s',
  RI_NORMAL: '0.55-0.70'
};

// Critérios de Estenose - Artéria Mesentérica Superior
export const SMA_STENOSIS_CRITERIA = [
  'Normal (PSV <200 cm/s)',
  'Estenose <50% (PSV 200-275 cm/s)',
  'Estenose 50-69% (PSV 275-400 cm/s)',
  'Estenose ≥70% (PSV >275 cm/s, EDV >45 cm/s)',
  'Oclusão (fluxo ausente)'
];

// Critérios de Estenose - Tronco Celíaco
export const CELIAC_STENOSIS_CRITERIA = [
  'Normal (PSV <200 cm/s)',
  'Estenose <50% (PSV 200-240 cm/s)',
  'Estenose ≥50% (PSV >200 cm/s)',
  'Estenose ≥70% (PSV >240 cm/s)',
  'Síndrome do ligamento arqueado mediano',
  'Oclusão (fluxo ausente)'
];

// Padrão de Fluxo
export const FLOW_PATTERN = [
  'Trifásico (normal)',
  'Bifásico',
  'Monofásico',
  'Amortecido (tardus-parvus)',
  'Ausente'
];

// Padrão de Fluxo Específico Mesentérico
export const MESENTERIC_FLOW = [
  'Jejum: alta resistência',
  'Pós-prandial: baixa resistência',
  'Fluxo reverso diastólico (patológico)'
];

// Características das Placas
export const PLAQUE_CHARACTERISTICS = [
  'Placa calcificada',
  'Placa não calcificada (mole)',
  'Placa mista',
  'Placa ulcerada'
];

// Tipos de Aneurisma
export const ANEURYSM_TYPE = [
  'Fusiforme (simétrico)',
  'Sacular (assimétrico)',
  'Micótico (infectado)',
  'Inflamatório'
];

// Complicações do Aneurisma
export const ANEURYSM_COMPLICATIONS = [
  'Sem complicações',
  'Trombo mural',
  'Dissecção',
  'Rotura contida',
  'Sinais de instabilidade'
];

// Tipos de Dissecção Aórtica
export const DISSECTION_TYPE = [
  'Stanford A (aorta ascendente)',
  'Stanford B (aorta descendente)',
  'DeBakey I (ascendente + descendente)',
  'DeBakey II (ascendente)',
  'DeBakey III (descendente)'
];

// Índice de Resistividade (RI)
export const RESISTIVITY_INDEX = [
  'Normal (0.55-0.70)',
  'Baixa resistência (<0.55)',
  'Alta resistência (>0.70)'
];

// Índice de Pulsatilidade (PI)
export const PULSATILITY_INDEX = [
  'Normal (0.90-1.80)',
  'Baixo (<0.90)',
  'Elevado (>1.80)'
];

// ============================================================================
// DEFINIÇÃO DOS VASOS E ACHADOS
// ============================================================================

export const abdominalVesselsOrgans: Organ[] = [
  // ============================================================================
  // AORTA ABDOMINAL
  // ============================================================================
  {
    id: 'aorta-abdominal',
    name: 'Aorta Abdominal',
    icon: 'artery',
    normalDescription: 'apresenta calibre normal em toda sua extensão (diâmetro anteroposterior <2.5 cm), paredes regulares e fluxo trifásico. Não foram identificados aneurismas, dissecções, placas ateroscleróticas significativas ou estenoses.',
    categories: [
      {
        id: 'aneurisma-aorta',
        name: 'Aneurisma',
        findings: [
          {
            id: 'aneurisma-aorta',
            name: 'Aneurisma de Aorta Abdominal',
            description: 'Dilatação localizada da aorta (diâmetro >3.0 cm)',
            hasDetails: true,
            hasMeasurement: true,  // Diâmetro AP e transverso
            hasLocation: true,
            extraFields: [
              {
                id: 'diameter_ap',
                label: 'Diâmetro Anteroposterior (AP)',
                type: 'text',
                placeholder: 'Ex: 4.5 cm'
              },
              {
                id: 'diameter_transverse',
                label: 'Diâmetro Transverso',
                type: 'text',
                placeholder: 'Ex: 4.2 cm'
              },
              {
                id: 'diameter_longitudinal',
                label: 'Extensão Longitudinal',
                type: 'text',
                placeholder: 'Ex: 8 cm'
              },
              {
                id: 'classification',
                label: 'Classificação por Tamanho',
                type: 'select',
                options: AORTA_CLASSIFICATION
              },
              {
                id: 'type',
                label: 'Tipo de Aneurisma',
                type: 'select',
                options: ANEURYSM_TYPE
              },
              {
                id: 'level',
                label: 'Nível Anatômico',
                type: 'select',
                options: AORTA_LEVELS
              },
              {
                id: 'thrombus',
                label: 'Trombo Mural',
                type: 'select',
                options: ['Ausente', 'Presente - leve', 'Presente - moderado', 'Presente - extenso']
              },
              {
                id: 'complications',
                label: 'Complicações',
                type: 'select',
                options: ANEURYSM_COMPLICATIONS
              }
            ]
          }
        ]
      },
      {
        id: 'placas-aorta',
        name: 'Placas Ateroscleróticas',
        findings: [
          {
            id: 'placa-aorta',
            name: 'Placa aterosclerótica',
            description: 'Depósito aterosclerótico na parede aórtica',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasSeverity: true,
            extraFields: [
              {
                id: 'characteristics',
                label: 'Características da Placa',
                type: 'select',
                options: PLAQUE_CHARACTERISTICS
              },
              {
                id: 'stenosis_degree',
                label: 'Grau de Estenose',
                type: 'text',
                placeholder: 'Ex: <50%'
              }
            ]
          }
        ]
      },
      {
        id: 'disseccao-aorta',
        name: 'Dissecção Aórtica',
        findings: [
          {
            id: 'disseccao-aorta',
            name: 'Dissecção da Aorta',
            description: 'Separação das camadas da parede aórtica com flap intimal',
            hasDetails: true,
            hasMeasurement: true,  // Diâmetro da luz verdadeira e falsa
            extraFields: [
              {
                id: 'type',
                label: 'Classificação',
                type: 'select',
                options: DISSECTION_TYPE
              },
              {
                id: 'true_lumen',
                label: 'Diâmetro da Luz Verdadeira',
                type: 'text',
                placeholder: 'Ex: 1.8 cm'
              },
              {
                id: 'false_lumen',
                label: 'Diâmetro da Luz Falsa',
                type: 'text',
                placeholder: 'Ex: 2.5 cm'
              },
              {
                id: 'thrombus_false_lumen',
                label: 'Trombo na Luz Falsa',
                type: 'select',
                options: ['Ausente', 'Parcial', 'Total']
              }
            ]
          }
        ]
      },
      {
        id: 'outras-aorta',
        name: 'Outras Alterações',
        findings: [
          {
            id: 'ectasia-aorta',
            name: 'Ectasia aórtica',
            description: 'Dilatação leve da aorta (2.5-2.9 cm)',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          },
          {
            id: 'estenose-aorta',
            name: 'Estenose aórtica',
            description: 'Estreitamento da luz aórtica',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              {
                id: 'psvnumber',
                label: 'PSV (Pico Sistólico)',
                type: 'text',
                placeholder: 'Ex: 180 cm/s'
              },
              {
                id: 'stenosis_percent',
                label: 'Estenose Estimada',
                type: 'text',
                placeholder: 'Ex: 50%'
              }
            ]
          }
        ]
      }
    ]
  },

  // ============================================================================
  // TRONCO CELÍACO
  // ============================================================================
  {
    id: 'tronco-celiaco',
    name: 'Tronco Celíaco',
    icon: 'artery',
    normalDescription: 'apresenta origem e trajeto normal, com fluxo anterógrado preservado. PSV dentro dos limites da normalidade (<200 cm/s). Não foram identificadas estenoses significativas.',
    categories: [
      {
        id: 'estenose-celiaco',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-celiaco',
            name: 'Estenose do Tronco Celíaco',
            description: 'Redução luminal do tronco celíaco',
            hasDetails: true,
            hasMeasurement: true,
            hasSeverity: true,
            extraFields: [
              {
                id: 'psv',
                label: 'PSV (Velocidade Pico Sistólico)',
                type: 'text',
                placeholder: 'Ex: 250 cm/s'
              },
              {
                id: 'edv',
                label: 'EDV (Velocidade Diastólica Final)',
                type: 'text',
                placeholder: 'Ex: 80 cm/s'
              },
              {
                id: 'stenosis_grade',
                label: 'Grau de Estenose',
                type: 'select',
                options: CELIAC_STENOSIS_CRITERIA
              },
              {
                id: 'flow_pattern',
                label: 'Padrão de Fluxo',
                type: 'select',
                options: FLOW_PATTERN
              },
              {
                id: 'cause',
                label: 'Causa Provável',
                type: 'select',
                options: ['Aterosclerose', 'Síndrome do ligamento arqueado mediano', 'Compressão extrínseca', 'Indeterminada']
              }
            ]
          },
          {
            id: 'oclusao-celiaco',
            name: 'Oclusão',
            description: 'Oclusão completa do tronco celíaco',
            hasDetails: true,
            extraFields: [
              {
                id: 'collaterals',
                label: 'Circulação Colateral',
                type: 'select',
                options: ['Ausente', 'Presente - adequada', 'Presente - insuficiente']
              }
            ]
          }
        ]
      },
      {
        id: 'outras-celiaco',
        name: 'Outras Alterações',
        findings: [
          {
            id: 'sindrome-ligamento',
            name: 'Síndrome do Ligamento Arqueado Mediano',
            description: 'Compressão extrínseca do tronco celíaco pelo ligamento arqueado',
            hasDetails: true,
            extraFields: [
              {
                id: 'psv_expiration',
                label: 'PSV na Expiração',
                type: 'text',
                placeholder: 'Ex: 300 cm/s'
              },
              {
                id: 'psv_inspiration',
                label: 'PSV na Inspiração',
                type: 'text',
                placeholder: 'Ex: 150 cm/s'
              }
            ]
          }
        ]
      }
    ]
  },

  // ============================================================================
  // ARTÉRIA MESENTÉRICA SUPERIOR
  // ============================================================================
  {
    id: 'mesenterica-superior',
    name: 'Artéria Mesentérica Superior',
    icon: 'artery',
    normalDescription: 'apresenta origem e trajeto normais, com fluxo anterógrado preservado. PSV dentro dos limites da normalidade (<200 cm/s em jejum). Não foram identificadas estenoses significativas.',
    categories: [
      {
        id: 'estenose-ams',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-ams',
            name: 'Estenose da Artéria Mesentérica Superior',
            description: 'Redução luminal da artéria mesentérica superior',
            hasDetails: true,
            hasMeasurement: true,
            hasSeverity: true,
            extraFields: [
              {
                id: 'psv',
                label: 'PSV (Velocidade Pico Sistólico)',
                type: 'text',
                placeholder: 'Ex: 350 cm/s'
              },
              {
                id: 'edv',
                label: 'EDV (Velocidade Diastólica Final)',
                type: 'text',
                placeholder: 'Ex: 60 cm/s'
              },
              {
                id: 'stenosis_grade',
                label: 'Grau de Estenose',
                type: 'select',
                options: SMA_STENOSIS_CRITERIA
              },
              {
                id: 'flow_pattern',
                label: 'Padrão de Fluxo',
                type: 'select',
                options: FLOW_PATTERN
              },
              {
                id: 'fasting_status',
                label: 'Estado',
                type: 'select',
                options: ['Jejum', 'Pós-prandial']
              }
            ]
          },
          {
            id: 'oclusao-ams',
            name: 'Oclusão',
            description: 'Oclusão completa da artéria mesentérica superior',
            hasDetails: true,
            extraFields: [
              {
                id: 'collaterals',
                label: 'Circulação Colateral',
                type: 'select',
                options: ['Ausente', 'Presente via mesentérica inferior', 'Presente via celíaco', 'Múltiplas vias']
              }
            ]
          }
        ]
      },
      {
        id: 'outras-ams',
        name: 'Outras Alterações',
        findings: [
          {
            id: 'placa-ams',
            name: 'Placa aterosclerótica',
            description: 'Placa aterosclerótica sem estenose significativa',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'characteristics',
                label: 'Características',
                type: 'select',
                options: PLAQUE_CHARACTERISTICS
              }
            ]
          }
        ]
      }
    ]
  },

  // ============================================================================
  // ARTÉRIA MESENTÉRICA INFERIOR
  // ============================================================================
  {
    id: 'mesenterica-inferior',
    name: 'Artéria Mesentérica Inferior',
    icon: 'artery',
    normalDescription: 'quando visualizada, apresenta origem e trajeto normais, com fluxo anterógrado preservado.',
    categories: [
      {
        id: 'alteracoes-ami',
        name: 'Alterações',
        findings: [
          {
            id: 'estenose-ami',
            name: 'Estenose',
            description: 'Redução luminal da artéria mesentérica inferior',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'psv',
                label: 'PSV (Velocidade Pico Sistólico)',
                type: 'text',
                placeholder: 'Ex: 200 cm/s'
              },
              {
                id: 'stenosis_degree',
                label: 'Grau de Estenose',
                type: 'text',
                placeholder: 'Ex: <50%'
              }
            ]
          },
          {
            id: 'oclusao-ami',
            name: 'Oclusão',
            description: 'Oclusão da artéria mesentérica inferior',
            hasDetails: true
          }
        ]
      }
    ]
  },

  // ============================================================================
  // ARTÉRIA RENAL DIREITA
  // ============================================================================
  {
    id: 'renal-direita',
    name: 'Artéria Renal Direita',
    icon: 'artery',
    normalDescription: 'apresenta origem e trajeto normais, com fluxo anterógrado preservado. PSV <180 cm/s e razão renal/aorta <3.5. Índice de resistividade intrarrenal dentro dos limites da normalidade (0.55-0.70).',
    categories: [
      {
        id: 'estenose-ard',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-ard',
            name: 'Estenose da Artéria Renal',
            description: 'Redução luminal da artéria renal direita',
            hasDetails: true,
            hasMeasurement: true,
            hasSeverity: true,
            hasLocation: true,
            extraFields: [
              {
                id: 'psv_renal',
                label: 'PSV Artéria Renal',
                type: 'text',
                placeholder: 'Ex: 250 cm/s'
              },
              {
                id: 'psv_aorta',
                label: 'PSV Aorta',
                type: 'text',
                placeholder: 'Ex: 70 cm/s'
              },
              {
                id: 'rar',
                label: 'RAR (Razão Renal/Aorta)',
                type: 'text',
                placeholder: 'Ex: 3.8'
              },
              {
                id: 'edv',
                label: 'EDV (Velocidade Diastólica Final)',
                type: 'text',
                placeholder: 'Ex: 80 cm/s'
              },
              {
                id: 'stenosis_grade',
                label: 'Grau de Estenose',
                type: 'select',
                options: RENAL_STENOSIS_CRITERIA
              },
              {
                id: 'ri_intrarenal',
                label: 'IR Intrarrenal',
                type: 'text',
                placeholder: 'Ex: 0.68'
              },
              {
                id: 'location',
                label: 'Localização',
                type: 'select',
                options: ['Óstio', 'Proximal', 'Médio', 'Distal', 'Hilar']
              },
              {
                id: 'cause',
                label: 'Etiologia Provável',
                type: 'select',
                options: ['Aterosclerose', 'Displasia fibromuscular', 'Arterite de Takayasu', 'Indeterminada']
              }
            ]
          },
          {
            id: 'oclusao-ard',
            name: 'Oclusão',
            description: 'Oclusão completa da artéria renal direita',
            hasDetails: true,
            extraFields: [
              {
                id: 'kidney_size',
                label: 'Dimensão do Rim',
                type: 'text',
                placeholder: 'Ex: 8.5 cm (atrófico)'
              }
            ]
          }
        ]
      },
      {
        id: 'outras-ard',
        name: 'Outras Alterações',
        findings: [
          {
            id: 'arteria-polar',
            name: 'Artéria Polar Acessória',
            description: 'Presença de artéria renal acessória (polar superior ou inferior)',
            hasDetails: true,
            extraFields: [
              {
                id: 'pole',
                label: 'Polo',
                type: 'select',
                options: ['Superior', 'Inferior']
              },
              {
                id: 'psv',
                label: 'PSV',
                type: 'text',
                placeholder: 'Ex: 120 cm/s'
              }
            ]
          },
          {
            id: 'displasia-ard',
            name: 'Displasia Fibromuscular',
            description: 'Aspecto em "colar de contas"',
            hasDetails: true,
            hasMeasurement: true
          }
        ]
      }
    ]
  },

  // ============================================================================
  // ARTÉRIA RENAL ESQUERDA
  // ============================================================================
  {
    id: 'renal-esquerda',
    name: 'Artéria Renal Esquerda',
    icon: 'artery',
    normalDescription: 'apresenta origem e trajeto normais, com fluxo anterógrado preservado. PSV <180 cm/s e razão renal/aorta <3.5. Índice de resistividade intrarrenal dentro dos limites da normalidade (0.55-0.70).',
    categories: [
      {
        id: 'estenose-are',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-are',
            name: 'Estenose da Artéria Renal',
            description: 'Redução luminal da artéria renal esquerda',
            hasDetails: true,
            hasMeasurement: true,
            hasSeverity: true,
            hasLocation: true,
            extraFields: [
              {
                id: 'psv_renal',
                label: 'PSV Artéria Renal',
                type: 'text',
                placeholder: 'Ex: 250 cm/s'
              },
              {
                id: 'psv_aorta',
                label: 'PSV Aorta',
                type: 'text',
                placeholder: 'Ex: 70 cm/s'
              },
              {
                id: 'rar',
                label: 'RAR (Razão Renal/Aorta)',
                type: 'text',
                placeholder: 'Ex: 3.8'
              },
              {
                id: 'edv',
                label: 'EDV (Velocidade Diastólica Final)',
                type: 'text',
                placeholder: 'Ex: 80 cm/s'
              },
              {
                id: 'stenosis_grade',
                label: 'Grau de Estenose',
                type: 'select',
                options: RENAL_STENOSIS_CRITERIA
              },
              {
                id: 'ri_intrarenal',
                label: 'IR Intrarrenal',
                type: 'text',
                placeholder: 'Ex: 0.68'
              },
              {
                id: 'location',
                label: 'Localização',
                type: 'select',
                options: ['Óstio', 'Proximal', 'Médio', 'Distal', 'Hilar']
              },
              {
                id: 'cause',
                label: 'Etiologia Provável',
                type: 'select',
                options: ['Aterosclerose', 'Displasia fibromuscular', 'Arterite de Takayasu', 'Indeterminada']
              }
            ]
          },
          {
            id: 'oclusao-are',
            name: 'Oclusão',
            description: 'Oclusão completa da artéria renal esquerda',
            hasDetails: true,
            extraFields: [
              {
                id: 'kidney_size',
                label: 'Dimensão do Rim',
                type: 'text',
                placeholder: 'Ex: 8.5 cm (atrófico)'
              }
            ]
          }
        ]
      },
      {
        id: 'outras-are',
        name: 'Outras Alterações',
        findings: [
          {
            id: 'arteria-polar-e',
            name: 'Artéria Polar Acessória',
            description: 'Presença de artéria renal acessória (polar superior ou inferior)',
            hasDetails: true,
            extraFields: [
              {
                id: 'pole',
                label: 'Polo',
                type: 'select',
                options: ['Superior', 'Inferior']
              },
              {
                id: 'psv',
                label: 'PSV',
                type: 'text',
                placeholder: 'Ex: 120 cm/s'
              }
            ]
          },
          {
            id: 'displasia-are',
            name: 'Displasia Fibromuscular',
            description: 'Aspecto em "colar de contas"',
            hasDetails: true,
            hasMeasurement: true
          }
        ]
      }
    ]
  },

  // ============================================================================
  // ARTÉRIAS ILÍACAS COMUNS
  // ============================================================================
  {
    id: 'iliaca-comum-direita',
    name: 'Artéria Ilíaca Comum Direita',
    icon: 'artery',
    normalDescription: 'apresenta calibre normal, paredes regulares e fluxo trifásico preservado. Não foram identificadas placas ateroscleróticas significativas, aneurismas ou estenoses.',
    categories: [
      {
        id: 'aneurisma-iliaca-d',
        name: 'Aneurisma',
        findings: [
          {
            id: 'aneurisma-iliaca-d',
            name: 'Aneurisma de Ilíaca Comum',
            description: 'Dilatação da artéria ilíaca comum (>1.5 cm)',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'diameter',
                label: 'Diâmetro Máximo',
                type: 'text',
                placeholder: 'Ex: 2.8 cm'
              },
              {
                id: 'type',
                label: 'Tipo',
                type: 'select',
                options: ANEURYSM_TYPE
              },
              {
                id: 'thrombus',
                label: 'Trombo Mural',
                type: 'select',
                options: ['Ausente', 'Presente']
              }
            ]
          }
        ]
      },
      {
        id: 'estenose-iliaca-d',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-iliaca-d',
            name: 'Estenose',
            description: 'Redução luminal da artéria ilíaca comum',
            hasDetails: true,
            hasMeasurement: true,
            hasSeverity: true,
            extraFields: [
              {
                id: 'psv',
                label: 'PSV (Velocidade Pico Sistólico)',
                type: 'text',
                placeholder: 'Ex: 220 cm/s'
              },
              {
                id: 'stenosis_percent',
                label: 'Estenose Estimada',
                type: 'text',
                placeholder: 'Ex: 50%'
              }
            ]
          },
          {
            id: 'oclusao-iliaca-d',
            name: 'Oclusão',
            description: 'Oclusão completa da artéria ilíaca comum',
            hasDetails: true
          }
        ]
      },
      {
        id: 'placas-iliaca-d',
        name: 'Placas Ateroscleróticas',
        findings: [
          {
            id: 'placa-iliaca-d',
            name: 'Placa aterosclerótica',
            description: 'Placa aterosclerótica sem estenose significativa',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'characteristics',
                label: 'Características',
                type: 'select',
                options: PLAQUE_CHARACTERISTICS
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'iliaca-comum-esquerda',
    name: 'Artéria Ilíaca Comum Esquerda',
    icon: 'artery',
    normalDescription: 'apresenta calibre normal, paredes regulares e fluxo trifásico preservado. Não foram identificadas placas ateroscleróticas significativas, aneurismas ou estenoses.',
    categories: [
      {
        id: 'aneurisma-iliaca-e',
        name: 'Aneurisma',
        findings: [
          {
            id: 'aneurisma-iliaca-e',
            name: 'Aneurisma de Ilíaca Comum',
            description: 'Dilatação da artéria ilíaca comum (>1.5 cm)',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'diameter',
                label: 'Diâmetro Máximo',
                type: 'text',
                placeholder: 'Ex: 2.8 cm'
              },
              {
                id: 'type',
                label: 'Tipo',
                type: 'select',
                options: ANEURYSM_TYPE
              },
              {
                id: 'thrombus',
                label: 'Trombo Mural',
                type: 'select',
                options: ['Ausente', 'Presente']
              }
            ]
          }
        ]
      },
      {
        id: 'estenose-iliaca-e',
        name: 'Estenose',
        findings: [
          {
            id: 'estenose-iliaca-e',
            name: 'Estenose',
            description: 'Redução luminal da artéria ilíaca comum',
            hasDetails: true,
            hasMeasurement: true,
            hasSeverity: true,
            extraFields: [
              {
                id: 'psv',
                label: 'PSV (Velocidade Pico Sistólico)',
                type: 'text',
                placeholder: 'Ex: 220 cm/s'
              },
              {
                id: 'stenosis_percent',
                label: 'Estenose Estimada',
                type: 'text',
                placeholder: 'Ex: 50%'
              }
            ]
          },
          {
            id: 'oclusao-iliaca-e',
            name: 'Oclusão',
            description: 'Oclusão completa da artéria ilíaca comum',
            hasDetails: true
          }
        ]
      },
      {
        id: 'placas-iliaca-e',
        name: 'Placas Ateroscleróticas',
        findings: [
          {
            id: 'placa-iliaca-e',
            name: 'Placa aterosclerótica',
            description: 'Placa aterosclerótica sem estenose significativa',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'characteristics',
                label: 'Características',
                type: 'select',
                options: PLAQUE_CHARACTERISTICS
              }
            ]
          }
        ]
      }
    ]
  }
];

// ============================================================================
// VALORES DE REFERÊNCIA E CRITÉRIOS DIAGNÓSTICOS
// ============================================================================

export const DIAGNOSTIC_CRITERIA = {
  AORTA: {
    normal: '< 2.5 cm',
    ectasia: '2.5 - 2.9 cm',
    aneurysm: '≥ 3.0 cm',
    surgical_indication: '≥ 5.5 cm'
  },
  RENAL: {
    normal: 'PSV < 180 cm/s, RAR < 3.5',
    stenosis_60: 'PSV > 180 cm/s, RAR > 3.5',
    stenosis_critical: 'PSV > 400 cm/s',
    occlusion: 'No flow detected'
  },
  SMA: {
    normal: 'PSV < 200 cm/s (fasting)',
    stenosis_50: 'PSV 200-275 cm/s',
    stenosis_70: 'PSV > 275 cm/s, EDV > 45 cm/s',
    occlusion: 'No flow detected'
  },
  CELIAC: {
    normal: 'PSV < 200 cm/s',
    stenosis_50: 'PSV 200-240 cm/s',
    stenosis_70: 'PSV > 240 cm/s',
    occlusion: 'No flow detected'
  },
  ILIAC: {
    normal_diameter: '< 1.5 cm',
    aneurysm: '> 1.5 cm',
    stenosis_50: 'PSV > 200 cm/s',
    stenosis_70: 'PSV > 300 cm/s'
  }
};

// Índices Doppler Normais
export const NORMAL_INDICES = {
  RI_RENAL: '0.55-0.70',
  PI_RENAL: '0.90-1.80',
  RI_MESENTERIC: '0.80-0.90 (fasting)',
  RI_CELIAC: '0.70-0.85'
};
