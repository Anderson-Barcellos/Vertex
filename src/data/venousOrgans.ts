import { Organ, OrganCategory, Finding } from './organs';

// ============================================================================
// CONSTANTES - DIRETRIZES SBACV/SBR 2023
// ============================================================================

// Localizações Anatômicas
export const COMMON_FEMORAL_LOCATIONS = [
  'Terço proximal',
  'Terço médio',
  'Terço distal',
  'Junção safeno-femoral'
];

export const FEMORAL_VEIN_LOCATIONS = [
  'Terço proximal',
  'Terço médio',
  'Terço distal',
  'Canal dos adutores'
];

export const POPLITEAL_LOCATIONS = [
  'Terço proximal',
  'Terço médio',
  'Terço distal',
  'Fossa poplítea'
];

export const SAPHENOUS_LOCATIONS = [
  'Crossa safeno-femoral',
  'Terço proximal da coxa',
  'Terço médio da coxa',
  'Terço distal da coxa',
  'Joelho',
  'Terço proximal da perna',
  'Terço médio da perna',
  'Terço distal da perna',
  'Maléolo medial'
];

export const SMALL_SAPHENOUS_LOCATIONS = [
  'Crossa safeno-poplítea',
  'Terço proximal',
  'Terço médio',
  'Terço distal',
  'Maléolo lateral'
];

export const TIBIAL_LOCATIONS = [
  'Tronco tibio-fibular',
  'Terço proximal',
  'Terço médio',
  'Terço distal'
];

export const PERFORATOR_LOCATIONS = [
  'Coxa - terço proximal',
  'Coxa - terço médio',
  'Coxa - terço distal',
  'Joelho',
  'Perna - terço proximal',
  'Perna - terço médio (Cockett)',
  'Perna - terço distal'
];

// Diâmetros Normais (valores de referência)
export const NORMAL_DIAMETERS = {
  COMMON_FEMORAL: '<12 mm',
  FEMORAL: '<10 mm',
  POPLITEAL: '<9 mm',
  GREAT_SAPHENOUS_THIGH: '<6 mm',
  GREAT_SAPHENOUS_KNEE: '<5 mm',
  GREAT_SAPHENOUS_LEG: '<4 mm',
  SMALL_SAPHENOUS: '<4 mm',
  PERFORATOR: '<3.5 mm'
};

// Classificação CEAP
export const CEAP_CLINICAL = [
  'C0 - Sem sinais visíveis de doença venosa',
  'C1 - Telangiectasias ou veias reticulares',
  'C2 - Veias varicosas',
  'C3 - Edema',
  'C4a - Pigmentação ou eczema',
  'C4b - Lipodermatoesclerose ou atrofia branca',
  'C5 - Úlcera cicatrizada',
  'C6 - Úlcera ativa'
];

// Tempo de Refluxo
export const REFLUX_DURATION = [
  'Normal (<0.5s)',
  'Limítrofe (0.5-1.0s)',
  'Patológico (>1.0s)',
  'Grave (>3.0s)'
];

// Padrão de Fluxo
export const FLOW_PATTERN = [
  'Fásico',
  'Não-fásico',
  'Ausente',
  'Retrógrado'
];

// Compressibilidade
export const COMPRESSIBILITY = [
  'Totalmente compressível',
  'Parcialmente compressível',
  'Incompressível'
];

// Ecogenicidade do Trombo
export const THROMBUS_ECHOGENICITY = [
  'Anecóico (agudo recente)',
  'Hipoecóico (agudo)',
  'Isoecóico (subagudo)',
  'Hiperecóico (crônico)',
  'Misto'
];

// Classificação da Trombose
export const THROMBUS_TYPE = [
  'Oclusivo',
  'Não-oclusivo parcial',
  'Mural',
  'Flutuante (alto risco)'
];

// Extensão da Trombose
export const THROMBUS_EXTENT = [
  'Distal (infrapoplítea)',
  'Poplítea isolada',
  'Femoropoplítea',
  'Iliofemoral',
  'Extensa (múltiplos segmentos)'
];

// Achados de Cronicidade
export const CHRONIC_FINDINGS = [
  'Espessamento parietal',
  'Sinequias intraluminais',
  'Veia diminuída de calibre',
  'Refluxo patológico',
  'Recanalização parcial'
];

// ============================================================================
// ÓRGÃOS/SEGMENTOS VENOSOS
// ============================================================================

export const venousOrgans: Organ[] = [
  {
    id: 'femoral-comum',
    name: 'Veia Femoral Comum',
    categories: [
      {
        id: 'trombose-vfc',
        name: 'Trombose Venosa',
        findings: [
          {
            id: 'tvp-aguda-vfc',
            name: 'TVP Aguda',
            description: 'Material ecogênico intraluminal, veia incompressível, ausência de fluxo',
            requiresMeasurement: false,
            requiresLocation: true,
            locations: COMMON_FEMORAL_LOCATIONS,
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: THROMBUS_TYPE },              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY },              { id: 'compressibilidade', label: 'Compressibilidade', type: 'select', options: COMPRESSIBILITY },
              { id: 'extensao', label: 'Extensão', type: 'select', options: THROMBUS_EXTENT }
            ]
          },
          {
            id: 'tvp-cronica-vfc',
            name: 'TVP Crônica',
            description: 'Sinais de trombose prévia com recanalização ou sinequias',
            requiresMeasurement: false,
            requiresLocation: true,
            locations: COMMON_FEMORAL_LOCATIONS,
            customFields: [
              { id: 'achados', label: 'Achados de Cronicidade', type: 'multiselect', options: CHRONIC_FINDINGS },
              { id: 'recanalizacao', label: 'Recanalização', type: 'select', options: ['Completa', 'Parcial', 'Ausente'] }
            ]
          }
        ]
      },
      {
        id: 'insuficiencia-vfc',
        name: 'Insuficiência Venosa',
        findings: [
          {
            id: 'refluxo-vfc',
            name: 'Refluxo Patológico',
            description: 'Refluxo >1.0s à manobra de Valsalva ou compressão',
            requiresMeasurement: true,
            measurements: [
              { id: 'duracao', label: 'Duração do Refluxo', unit: 's', normalRange: '<0.5' },
              { id: 'diametro', label: 'Diâmetro', unit: 'mm', normalRange: NORMAL_DIAMETERS.COMMON_FEMORAL }
            ],
            requiresLocation: true,
            locations: COMMON_FEMORAL_LOCATIONS,
            customFields: [
              { id: 'duracao-cat', label: 'Classificação', type: 'select', options: REFLUX_DURATION },
              { id: 'padrao', label: 'Padrão de Fluxo', type: 'select', options: FLOW_PATTERN },
              { id: 'ceap', label: 'Classificação CEAP', type: 'select', options: CEAP_CLINICAL }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'femoral-superficial',
    name: 'Veia Femoral Superficial',
    categories: [
      {
        id: 'trombose-vfs',
        name: 'Trombose Venosa',
        findings: [
          {
            id: 'tvp-aguda-vfs',
            name: 'TVP Aguda',
            description: 'Material ecogênico intraluminal, veia incompressível',
            requiresMeasurement: false,
            requiresLocation: true,
            locations: FEMORAL_VEIN_LOCATIONS,
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: THROMBUS_TYPE },              { id: 'extensao', label: 'Extensão', type: 'select', options: THROMBUS_EXTENT },              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY },
              { id: 'compressibilidade', label: 'Compressibilidade', type: 'select', options: COMPRESSIBILITY }
            ]
          },
          {
            id: 'tvp-cronica-vfs',
            name: 'TVP Crônica',
            description: 'Sinais de trombose prévia',
            requiresMeasurement: false,
            requiresLocation: true,
            locations: FEMORAL_VEIN_LOCATIONS,
            customFields: [
              { id: 'achados', label: 'Achados', type: 'multiselect', options: CHRONIC_FINDINGS }
            ]
          }
        ]
      },
      {
        id: 'insuficiencia-vfs',
        name: 'Insuficiência Venosa',
        findings: [
          {
            id: 'refluxo-vfs',
            name: 'Refluxo Patológico',
            description: 'Refluxo >1.0s',
            requiresMeasurement: true,
            measurements: [
              { id: 'duracao', label: 'Duração', unit: 's', normalRange: '<0.5' }
            ],
            requiresLocation: true,
            locations: FEMORAL_VEIN_LOCATIONS
          }
        ]
      }
    ]
  },
  {
    id: 'poplitea',
    name: 'Veia Poplítea',
    categories: [
      {
        id: 'trombose-pop',
        name: 'Trombose Venosa',
        findings: [
          {
            id: 'tvp-aguda-pop',
            name: 'TVP Aguda',
            description: 'Material ecogênico intraluminal',
            requiresMeasurement: false,
            requiresLocation: true,
            locations: POPLITEAL_LOCATIONS,
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: THROMBUS_TYPE },              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY },              { id: 'extensao', label: 'Extensão', type: 'select', options: THROMBUS_EXTENT },              { id: 'compressibilidade', label: 'Compressibilidade', type: 'select', options: COMPRESSIBILITY },
              { id: 'padrao', label: 'Padrão de Fluxo', type: 'select', options: FLOW_PATTERN },
              { id: 'ceap', label: 'Classificação CEAP', type: 'select', options: CEAP_CLINICAL }
            ]
          },
          {
            id: 'tvp-cronica-pop',
            name: 'TVP Crônica',
            description: 'Sinais de trombose prévia',
            requiresMeasurement: false,
            requiresLocation: true,
            locations: POPLITEAL_LOCATIONS
          }
        ]
      },
      {
        id: 'cisto-baker',
        name: 'Cisto de Baker',
        findings: [
          {
            id: 'cisto-baker',
            name: 'Cisto de Baker',
            description: 'Coleção anecoica na fossa poplítea',
            requiresMeasurement: true,
            measurements: [
              { id: 'maior-eixo', label: 'Maior Eixo', unit: 'mm' },
              { id: 'menor-eixo', label: 'Menor Eixo', unit: 'mm' }
            ],
            customFields: [
              { id: 'complicacao', label: 'Complicação', type: 'select', options: ['Sem complicações', 'Rotura', 'Infecção'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'safena-magna',
    name: 'Veia Safena Magna',
    categories: [
      {
        id: 'insuficiencia-vsm',
        name: 'Insuficiência Safênica',
        findings: [
          {
            id: 'refluxo-crossa',
            name: 'Incompetência da Crossa',
            description: 'Refluxo na junção safeno-femoral',
            requiresMeasurement: true,
            measurements: [
              { id: 'duracao', label: 'Duração do Refluxo', unit: 's', normalRange: '<0.5' },
              { id: 'diametro-crossa', label: 'Diâmetro na Crossa', unit: 'mm', normalRange: '<6' }
            ],
            customFields: [
              { id: 'duracao-cat', label: 'Classificação', type: 'select', options: REFLUX_DURATION },
              { id: 'padrao', label: 'Padrão de Fluxo', type: 'select', options: FLOW_PATTERN },
              { id: 'ceap', label: 'Classificação CEAP', type: 'select', options: CEAP_CLINICAL }
            ]
          },
          {
            id: 'refluxo-tronco-vsm',
            name: 'Refluxo no Tronco Safênico',
            description: 'Refluxo >1.0s no corpo da safena magna',
            requiresMeasurement: true,
            measurements: [
              { id: 'duracao', label: 'Duração', unit: 's', normalRange: '<0.5' },
              { id: 'diametro', label: 'Diâmetro', unit: 'mm' }
            ],
            requiresLocation: true,
            locations: SAPHENOUS_LOCATIONS,
            customFields: [
              { id: 'extensao', label: 'Extensão', type: 'select', options: ['Coxa', 'Coxa e perna', 'Perna',
              { id: 'padrao', label: 'Padrão de Fluxo', type: 'select', options: FLOW_PATTERN },
              { id: 'ceap', label: 'Classificação CEAP', type: 'select', options: CEAP_CLINICAL }
            ] }
            ]
          },
          {
            id: 'varizes-vsm',
            name: 'Varizes',
            description: 'Dilatações varicosas da safena magna',
            requiresMeasurement: true,
            measurements: [
              { id: 'diametro-max', label: 'Diâmetro Máximo', unit: 'mm' }
            ],
            requiresLocation: true,
            locations: SAPHENOUS_LOCATIONS,
            customFields: [
              { id: 'tortuosidade', label: 'Tortuosidade', type: 'select', options: ['Ausente', 'Leve', 'Moderada', 'Acentuada',
              { id: 'padrao', label: 'Padrão de Fluxo', type: 'select', options: FLOW_PATTERN },
              { id: 'ceap', label: 'Classificação CEAP', type: 'select', options: CEAP_CLINICAL }
            ] }
            ]
          }
        ]
      },
      {
        id: 'trombose-vsm',
        name: 'Tromboflebite Safênica',
        findings: [
          {
            id: 'tromboflebite-superficial',
            name: 'Tromboflebite Superficial',
            description: 'Material ecogênico intraluminal na safena',
            requiresMeasurement: false,
            requiresLocation: true,
            locations: SAPHENOUS_LOCATIONS,
            customFields: [
              { id: 'extensao-crossa', label: 'Distância da Crossa', type: 'number', unit: 'cm' },
              { id: 'tipo', label: 'Tipo', type: 'select', options: ['Oclusivo', 'Não-oclusivo'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'safena-parva',
    name: 'Veia Safena Parva',
    categories: [
      {
        id: 'insuficiencia-vsp',
        name: 'Insuficiência Safênica',
        findings: [
          {
            id: 'refluxo-vsp',
            name: 'Refluxo Safena Parva',
            description: 'Refluxo >1.0s na safena parva',
            requiresMeasurement: true,
            measurements: [
              { id: 'duracao', label: 'Duração', unit: 's', normalRange: '<0.5' },
              { id: 'diametro', label: 'Diâmetro', unit: 'mm', normalRange: NORMAL_DIAMETERS.SMALL_SAPHENOUS }
            ],
            requiresLocation: true,
            locations: SMALL_SAPHENOUS_LOCATIONS
          },
          {
            id: 'incompetencia-crossa-vsp',
            name: 'Incompetência da Crossa Safeno-Poplítea',
            description: 'Refluxo na junção safeno-poplítea',
            requiresMeasurement: true,
            measurements: [
              { id: 'duracao', label: 'Duração', unit: 's' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'veias-perfurantes',
    name: 'Veias Perfurantes',
    categories: [
      {
        id: 'insuficiencia-perf',
        name: 'Insuficiência de Perfurantes',
        findings: [
          {
            id: 'perfurante-insuficiente',
            name: 'Perfurante Insuficiente',
            description: 'Perfurante >3.5mm com refluxo >0.5s',
            requiresMeasurement: true,
            measurements: [
              { id: 'diametro', label: 'Diâmetro', unit: 'mm', normalRange: NORMAL_DIAMETERS.PERFORATOR },
              { id: 'duracao', label: 'Duração Refluxo', unit: 's', normalRange: '<0.5' }
            ],
            requiresLocation: true,
            locations: PERFORATOR_LOCATIONS,
            customFields: [
              { id: 'fluxo', label: 'Direção do Fluxo', type: 'select', options: ['Centrífugo (normal)', 'Centrípeto (refluxo)',
              { id: 'padrao', label: 'Padrão de Fluxo', type: 'select', options: FLOW_PATTERN },
              { id: 'ceap', label: 'Classificação CEAP', type: 'select', options: CEAP_CLINICAL }
            ] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'veias-tibiais',
    name: 'Veias Tibiais',
    categories: [
      {
        id: 'trombose-tibiais',
        name: 'Trombose Venosa',
        findings: [
          {
            id: 'tvp-tibiais',
            name: 'TVP em Veias Tibiais',
            description: 'Trombose venosa profunda distal',
            requiresMeasurement: false,
            requiresLocation: true,
            locations: TIBIAL_LOCATIONS,
            customFields: [
              { id: 'segmento', label: 'Segmento', type: 'select', options: ['Tibial anterior', 'Tibial posterior', 'Fibular', 'Múltiplos'] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: THROMBUS_TYPE }
            ]
          }
        ]
      }
    ]
  },
  // ============================================================================
  // SISTEMA VENOSO PROFUNDO PROXIMAL
  // ============================================================================
  {
    id: 'iliaca-externa',
    name: 'Veia Ilíaca Externa',
    categories: [
      {
        id: 'trombose-vie',
        name: 'Trombose Venosa',
        findings: [
          {
            id: 'tvp-aguda-vie',
            name: 'TVP Aguda',
            description: 'Trombo intraluminal em veia ilíaca externa',
            requiresMeasurement: false,
            requiresLocation: false,
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: THROMBUS_TYPE },              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY },              { id: 'extensao', label: 'Extensão', type: 'select', options: ['Segmentar', 'Extensa', 'Para veia cava',
              { id: 'compressibilidade', label: 'Compressibilidade', type: 'select', options: COMPRESSIBILITY }
            ] }
            ]
          },
          {
            id: 'compressao-vie',
            name: 'Compressão Extrínseca',
            description: 'Síndrome de May-Thurner ou compressão tumoral',
            requiresMeasurement: false,
            customFields: [
              { id: 'causa', label: 'Causa', type: 'select', 
                options: ['May-Thurner', 'Massa pélvica', 'Linfonodomegalia', 'Gravidez', 'Outra'] },
              { id: 'grau', label: 'Grau de Estenose', type: 'select', 
                options: ['<50%', '50-70%', '70-90%', '>90%'] }
            ]
          }
        ]
      },
      {
        id: 'fluxo-vie',
        name: 'Alterações de Fluxo',
        findings: [
          {
            id: 'fluxo-nao-fasico-vie',
            name: 'Fluxo Não-Fásico',
            description: 'Perda da variação respiratória',
            requiresMeasurement: false,
            customFields: [
              { id: 'padrao', label: 'Padrão', type: 'select', options: FLOW_PATTERN }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'iliaca-comum',
    name: 'Veia Ilíaca Comum',
    categories: [
      {
        id: 'trombose-vic',
        name: 'Trombose Venosa',
        findings: [
          {
            id: 'tvp-aguda-vic',
            name: 'TVP Aguda',
            description: 'Trombo intraluminal em veia ilíaca comum',
            requiresMeasurement: false,
            requiresLocation: false,
            customFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: ['Direito', 'Esquerdo', 'Bilateral',
              { id: 'tipo', label: 'Tipo de Oclusão', type: 'select', options: THROMBUS_TYPE },
              { id: 'extensao', label: 'Extensão', type: 'select', options: THROMBUS_EXTENT },
              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY },
              { id: 'compressibilidade', label: 'Compressibilidade', type: 'select', options: COMPRESSIBILITY }
            ] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: THROMBUS_TYPE },
              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY }
            ]
          },
          {
            id: 'may-thurner',
            name: 'Síndrome de May-Thurner',
            description: 'Compressão da veia ilíaca comum esquerda',
            requiresMeasurement: false,
            customFields: [
              { id: 'grau', label: 'Grau de Estenose', type: 'select', 
                options: ['<50%', '50-70%', '70-90%', '>90%'] },
              { id: 'colaterais', label: 'Colaterais', type: 'select', 
                options: ['Ausentes', 'Escassas', 'Moderadas', 'Exuberantes'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'vci',
    name: 'Veia Cava Inferior',
    categories: [
      {
        id: 'trombose-vci',
        name: 'Trombose',
        findings: [
          {
            id: 'trombose-vci',
            name: 'Trombose da VCI',
            description: 'Trombo em veia cava inferior',
            requiresMeasurement: true,
            measurements: [
              { id: 'extensao', label: 'Extensão', unit: 'cm' }
            ],
            customFields: [
              { id: 'nivel', label: 'Nível', type: 'select', 
                options: ['Infrarrenal', 'Justarrenal', 'Suprarrenal', 'Retro-hepático'] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: THROMBUS_TYPE }
            ]
          },
          {
            id: 'filtro-vci',
            name: 'Filtro de VCI',
            description: 'Presença de filtro de veia cava',
            requiresMeasurement: false,
            customFields: [
              { id: 'posicao', label: 'Posição', type: 'select', 
                options: ['Infrarrenal adequada', 'Migração caudal', 'Migração cranial', 'Inclinado'] },
              { id: 'perviedade', label: 'Perviedade', type: 'select', 
                options: ['Pérvio', 'Trombose parcial', 'Trombose total'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'femoral-profunda',
    name: 'Veia Femoral Profunda',
    categories: [
      {
        id: 'trombose-vfp',
        name: 'Trombose Venosa',
        findings: [
          {
            id: 'tvp-aguda-vfp',
            name: 'TVP Aguda',
            description: 'TVP isolada de veia femoral profunda',
            requiresMeasurement: false,
            requiresLocation: false,
            customFields: [
              { id: 'tipo', label: 'Tipo', type: 'select', options: THROMBUS_TYPE },              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY },              { id: 'extensao', label: 'Extensão', type: 'select',                 options: ['Proximal', 'Distal', 'Toda extensão',
              { id: 'compressibilidade', label: 'Compressibilidade', type: 'select', options: COMPRESSIBILITY }
            ] }
            ]
          }
        ]
      },
      {
        id: 'anatomia-vfp',
        name: 'Variações Anatômicas',
        findings: [
          {
            id: 'duplicacao-vfp',
            name: 'Duplicação',
            description: 'Duplicação da veia femoral profunda',
            requiresMeasurement: false
          }
        ]
      }
    ]
  },
  // ============================================================================
  // SISTEMA VENOSO MUSCULAR (VEIAS DA PANTURRILHA)
  // ============================================================================
  {
    id: 'gastrocnemias',
    name: 'Veias Gastrocnêmias',
    categories: [
      {
        id: 'trombose-gastroc',
        name: 'TVP de Panturrilha',
        findings: [
          {
            id: 'tvp-gastroc-medial',
            name: 'TVP Gastrocnêmia Medial',
            description: 'Trombose da veia gastrocnêmia medial',
            requiresMeasurement: true,
            measurements: [
              { id: 'extensao', label: 'Extensão', unit: 'cm' }
            ],
            customFields: [
              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY }
            ]
          },
          {
            id: 'tvp-gastroc-lateral',
            name: 'TVP Gastrocnêmia Lateral',
            description: 'Trombose da veia gastrocnêmia lateral',
            requiresMeasurement: true,
            measurements: [
              { id: 'extensao', label: 'Extensão', unit: 'cm' }
            ],
            customFields: [
              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY }
            ]
          }
        ]
      },
      {
        id: 'dilatacao-gastroc',
        name: 'Dilatação Varicosa',
        findings: [
          {
            id: 'varizes-gastroc',
            name: 'Dilatação Varicosa',
            description: 'Dilatação das veias gastrocnêmias',
            requiresMeasurement: true,
            measurements: [
              { id: 'diametro', label: 'Diâmetro máximo', unit: 'mm', normalRange: '<8' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'soleares',
    name: 'Veias Soleares',
    categories: [
      {
        id: 'trombose-solear',
        name: 'TVP de Panturrilha',
        findings: [
          {
            id: 'tvp-solear',
            name: 'TVP Solear',
            description: 'Trombose das veias soleares',
            requiresMeasurement: true,
            measurements: [
              { id: 'extensao', label: 'Extensão', unit: 'cm' },
              { id: 'numero', label: 'Número de veias', unit: '' }
            ],
            customFields: [
              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY },              { id: 'localizacao', label: 'Localização', type: 'select',                 options: ['Proximal', 'Média', 'Distal', 'Múltiplas',
              { id: 'padrao', label: 'Padrão de Fluxo', type: 'select', options: FLOW_PATTERN },
              { id: 'ceap', label: 'Classificação CEAP', type: 'select', options: CEAP_CLINICAL }
            ] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'fibulares',
    name: 'Veias Fibulares',
    categories: [
      {
        id: 'trombose-fibular',
        name: 'Trombose Venosa',
        findings: [
          {
            id: 'tvp-fibular',
            name: 'TVP Fibular',
            description: 'Trombose das veias fibulares',
            requiresMeasurement: false,
            customFields: [
              { id: 'numero', label: 'Número de veias acometidas', type: 'select', options: ['1', '2', 'Todas'] },
              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY }
            ]
          }
        ]
      }
    ]
  },
  // ============================================================================
  // VEIAS ACESSÓRIAS E COMUNICANTES
  // ============================================================================
  {
    id: 'giacomini',
    name: 'Veia de Giacomini',
    categories: [
      {
        id: 'insuficiencia-giacomini',
        name: 'Insuficiência',
        findings: [
          {
            id: 'refluxo-giacomini',
            name: 'Refluxo',
            description: 'Refluxo pela veia de Giacomini',
            requiresMeasurement: true,
            measurements: [
              { id: 'duracao', label: 'Duração do refluxo', unit: 's', normalRange: '<0.5' },
              { id: 'diametro', label: 'Diâmetro', unit: 'mm' }
            ],
            customFields: [
              { id: 'extensao', label: 'Extensão', type: 'select',                 options: ['Completa', 'Proximal', 'Distal',
              { id: 'padrao', label: 'Padrão de Fluxo', type: 'select', options: FLOW_PATTERN },
              { id: 'ceap', label: 'Classificação CEAP', type: 'select', options: CEAP_CLINICAL }
            ] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'safena-acessoria-anterior',
    name: 'Veia Safena Acessória Anterior',
    categories: [
      {
        id: 'insuficiencia-saa',
        name: 'Insuficiência',
        findings: [
          {
            id: 'refluxo-saa',
            name: 'Refluxo',
            description: 'Refluxo pela safena acessória anterior',
            requiresMeasurement: true,
            measurements: [
              { id: 'duracao', label: 'Duração', unit: 's', normalRange: '<0.5' },
              { id: 'diametro', label: 'Diâmetro', unit: 'mm', normalRange: '<4' }
            ],
            requiresLocation: true,
            locations: ['Terço proximal da coxa', 'Terço médio da coxa', 'Terço distal da coxa']
          },
          {
            id: 'varizes-saa',
            name: 'Varizes',
            description: 'Dilatação varicosa da safena acessória anterior',
            requiresMeasurement: true,
            measurements: [
              { id: 'diametro', label: 'Diâmetro máximo', unit: 'mm' }
            ]
          }
        ]
      }
    ]
  }
];
