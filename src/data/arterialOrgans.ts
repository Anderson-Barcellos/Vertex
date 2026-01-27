import { Organ } from './organs';
import {
  LATERALITY,
  STENOSIS_GRADE,
  WAVEFORM_PATTERNS,
  OCCLUSION_TYPE,
  COLLATERAL_STATUS,
  PLAQUE_TYPE,
  createObservacoesOrgan
} from './shared';
import {
  ITB_CLASSIFICATION,
  IDB_CLASSIFICATION,
  CLAUDICATION_DISTANCE,
  FONTAINE_CLASSIFICATION,
  WIFI_WOUND,
  WIFI_ISCHEMIA,
  WIFI_FOOT_INFECTION,
  STENOSIS_PERCENT,
  PLAQUE_COMPOSITION,
  PLAQUE_SURFACE,
  THROMBUS_TYPE
} from './shared/commonFields';

// Re-export constants from shared modules
export { 
  LATERALITY, 
  STENOSIS_GRADE, 
  WAVEFORM_PATTERNS, 
  OCCLUSION_TYPE, 
  COLLATERAL_STATUS, 
  PLAQUE_TYPE,
  ITB_CLASSIFICATION,
  IDB_CLASSIFICATION,
  CLAUDICATION_DISTANCE,
  FONTAINE_CLASSIFICATION,
  WIFI_WOUND,
  WIFI_ISCHEMIA,
  WIFI_FOOT_INFECTION 
};

export const arterialOrgans: Organ[] = [
  {
    id: 'itb',
    name: 'Índice Tornozelo-Braquial (ITB)',
    icon: 'stethoscope',
    normalDescription: 'ITB dentro dos limites da normalidade bilateralmente (0.91-1.30).',
    categories: [
      {
        id: 'itb-medidas',
        name: 'Medidas',
        findings: [
          {
            id: 'itb-valores',
            name: 'Avaliação do ITB',
            description: 'Índice de pressão tornozelo/braço',
            hasMeasurement: true,
            extraFields: [
              { id: 'pas-braquial', label: 'PAS Braquial (mmHg)', type: 'text', placeholder: 'ex: 120' },
              { id: 'pas-tornoz-d', label: 'PAS Tornozelo D (mmHg)', type: 'text', placeholder: 'ex: 110' },
              { id: 'pas-tornoz-e', label: 'PAS Tornozelo E (mmHg)', type: 'text', placeholder: 'ex: 115' },
              { id: 'itb-direito', label: 'ITB Direito (calculado)', type: 'text', placeholder: 'Calculado automaticamente' },
              { id: 'itb-esquerdo', label: 'ITB Esquerdo (calculado)', type: 'text', placeholder: 'Calculado automaticamente' },
              { id: 'classificacao-d', label: 'Classificação MID', type: 'select', options: [...ITB_CLASSIFICATION] },
              { id: 'classificacao-e', label: 'Classificação MIE', type: 'select', options: [...ITB_CLASSIFICATION] }
            ]
          },
          {
            id: 'itb-pos-exercicio',
            name: 'ITB Pós-Exercício',
            description: 'Avaliação após esteira ou flexão plantar',
            hasMeasurement: true,
            extraFields: [
              { id: 'itb-exerc-d', label: 'ITB Pós-Exercício D', type: 'text', placeholder: 'ex: 0.65' },
              { id: 'itb-exerc-e', label: 'ITB Pós-Exercício E', type: 'text', placeholder: 'ex: 0.70' },
              { id: 'queda', label: 'Queda significativa (>20%)', type: 'select', options: ['Não', 'Sim - MID', 'Sim - MIE', 'Sim - Bilateral'] },
              { id: 'tempo-recuperacao', label: 'Tempo de Recuperação', type: 'select', options: ['<2 min', '2-5 min', '5-10 min', '>10 min'] }
            ]
          },
          {
            id: 'idb-valores',
            name: 'Índice Dedo-Braquial (IDB)',
            description: 'Pressão do hálux/PAS braquial - útil em diabéticos com artérias incompressíveis',
            hasMeasurement: true,
            extraFields: [
              { id: 'pressao-halux-d', label: 'Pressão Hálux D (mmHg)', type: 'text', placeholder: 'ex: 75' },
              { id: 'pressao-halux-e', label: 'Pressão Hálux E (mmHg)', type: 'text', placeholder: 'ex: 80' },
              { id: 'idb-direito', label: 'IDB Direito (calculado)', type: 'text', placeholder: 'Calculado automaticamente' },
              { id: 'idb-esquerdo', label: 'IDB Esquerdo (calculado)', type: 'text', placeholder: 'Calculado automaticamente' },
              { id: 'classificacao-idb-d', label: 'Classificação MID', type: 'select', options: [...IDB_CLASSIFICATION] },
              { id: 'classificacao-idb-e', label: 'Classificação MIE', type: 'select', options: [...IDB_CLASSIFICATION] }
            ]
          },
          {
            id: 'claudicacao',
            name: 'Distância de Claudicação',
            description: 'Distância percorrida até início da dor (Fontaine)',
            hasMeasurement: true,
            extraFields: [
              { id: 'distancia-claud', label: 'Distância', type: 'select', options: [...CLAUDICATION_DISTANCE] },
              { id: 'lado-claud', label: 'Lado sintomático', type: 'select', options: ['Direito', 'Esquerdo', 'Bilateral', 'Não informado'] },
              { id: 'fontaine', label: 'Classificação de Fontaine', type: 'select', options: ['I - Assintomático', 'IIa - Claudicação >200m', 'IIb - Claudicação <200m', 'III - Dor em repouso', 'IV - Lesão trófica/gangrena'] }
            ]
          }
        ]
      },
      {
        id: 'wifi-classification',
        name: 'Classificação WIfI (Pé Diabético)',
        findings: [
          {
            id: 'wifi-avaliacao',
            name: 'Avaliação WIfI',
            description: 'Wound, Ischemia, foot Infection - estratificação de risco de amputação',
            hasDetails: true,
            extraFields: [
              { id: 'wifi-w', label: 'W - Wound (Ferida)', type: 'select', options: [...WIFI_WOUND] },
              { id: 'wifi-i', label: 'I - Ischemia (Isquemia)', type: 'select', options: [...WIFI_ISCHEMIA] },
              { id: 'wifi-fi', label: 'fI - foot Infection (Infecção)', type: 'select', options: [...WIFI_FOOT_INFECTION] },
              { id: 'lado-wifi', label: 'Lado', type: 'select', options: ['Direito', 'Esquerdo', 'Bilateral'] },
              { id: 'risco-amputacao', label: 'Risco de Amputação', type: 'select', options: ['Muito baixo', 'Baixo', 'Moderado', 'Alto'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'aorto-iliaco',
    name: 'Segmento Aorto-Ilíaco',
    icon: 'artery',
    normalDescription: 'Artérias ilíacas com paredes regulares, fluxo trifásico preservado e sem sinais de estenose.',
    categories: [
      {
        id: 'achados-iliaco',
        name: 'Achados',
        findings: [
          {
            id: 'estenose-iliaca',
            name: 'Estenose',
            description: 'Estenose arterial com aumento de velocidade',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Ilíaca Comum', 'Ilíaca Externa'] },
              { id: 'grau', label: 'Grau', type: 'select', options: [...STENOSIS_GRADE] },
              { id: 'psv', label: 'PSV (cm/s)', type: 'text', placeholder: 'ex: 250' },
              { id: 'vr', label: 'Velocity Ratio', type: 'text', placeholder: 'ex: 3.2' },
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: [...WAVEFORM_PATTERNS] }
            ]
          },
          {
            id: 'oclusao-iliaca',
            name: 'Oclusão',
            description: 'Ausência de fluxo ao Doppler',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Ilíaca Comum', 'Ilíaca Externa'] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: [...OCCLUSION_TYPE] },
              { id: 'extensao', label: 'Extensão (cm)', type: 'text', placeholder: 'ex: 5' },
              { id: 'colaterais', label: 'Colaterais', type: 'select', options: [...COLLATERAL_STATUS] }
            ]
          },
          {
            id: 'placa-iliaca',
            name: 'Placa Aterosclerótica',
            description: 'Espessamento focal da parede',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Ilíaca Comum', 'Ilíaca Externa'] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: [...PLAQUE_TYPE] },
              { id: 'espessura', label: 'Espessura (mm)', type: 'text', placeholder: 'ex: 3' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'femoral',
    name: 'Segmento Femoral',
    icon: 'artery',
    normalDescription: 'Artérias femorais com calibre normal, paredes regulares e fluxo trifásico preservado.',
    categories: [
      {
        id: 'achados-femoral',
        name: 'Achados',
        findings: [
          {
            id: 'estenose-femoral',
            name: 'Estenose',
            description: 'Estenose arterial com aumento de velocidade',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Femoral Comum', 'Femoral Superficial', 'Femoral Profunda'] },
              { id: 'local', label: 'Local', type: 'select', options: ['Proximal', 'Médio', 'Distal', 'Canal de Hunter'] },
              { id: 'grau', label: 'Grau', type: 'select', options: [...STENOSIS_GRADE] },
              { id: 'psv', label: 'PSV (cm/s)', type: 'text', placeholder: 'ex: 180' },
              { id: 'vr', label: 'Velocity Ratio', type: 'text', placeholder: 'ex: 2.5' },
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: [...WAVEFORM_PATTERNS] }
            ]
          },
          {
            id: 'oclusao-femoral',
            name: 'Oclusão',
            description: 'Ausência de fluxo ao Doppler',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Femoral Comum', 'Femoral Superficial', 'Femoral Profunda'] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: [...OCCLUSION_TYPE] },
              { id: 'extensao', label: 'Extensão (cm)', type: 'text', placeholder: 'ex: 10' },
              { id: 'colaterais', label: 'Colaterais', type: 'select', options: [...COLLATERAL_STATUS] }
            ]
          },
          {
            id: 'placa-femoral',
            name: 'Placa Aterosclerótica',
            description: 'Espessamento focal da parede',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Femoral Comum', 'Femoral Superficial', 'Femoral Profunda'] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: [...PLAQUE_TYPE] },
              { id: 'espessura', label: 'Espessura (mm)', type: 'text', placeholder: 'ex: 2.5' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'popliteo',
    name: 'Segmento Poplíteo',
    icon: 'artery',
    normalDescription: 'Artéria poplítea com calibre normal, paredes regulares e fluxo trifásico preservado.',
    categories: [
      {
        id: 'achados-popliteo',
        name: 'Achados',
        findings: [
          {
            id: 'estenose-poplitea',
            name: 'Estenose',
            description: 'Estenose arterial com aumento de velocidade',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'local', label: 'Local', type: 'select', options: ['Supra-articular', 'Fossa poplítea', 'Infra-articular'] },
              { id: 'grau', label: 'Grau', type: 'select', options: [...STENOSIS_GRADE] },
              { id: 'psv', label: 'PSV (cm/s)', type: 'text', placeholder: 'ex: 150' },
              { id: 'vr', label: 'Velocity Ratio', type: 'text', placeholder: 'ex: 2.8' },
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: [...WAVEFORM_PATTERNS] }
            ]
          },
          {
            id: 'oclusao-poplitea',
            name: 'Oclusão',
            description: 'Ausência de fluxo ao Doppler',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: [...OCCLUSION_TYPE] },
              { id: 'extensao', label: 'Extensão (cm)', type: 'text', placeholder: 'ex: 3' },
              { id: 'colaterais', label: 'Colaterais', type: 'select', options: [...COLLATERAL_STATUS] }
            ]
          },
          {
            id: 'aneurisma-popliteo',
            name: 'Aneurisma Poplíteo',
            description: 'Dilatação >15mm ou >1.5x normal',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'diametro', label: 'Diâmetro (mm)', type: 'text', placeholder: 'ex: 22' },
              { id: 'trombo', label: 'Trombo mural', type: 'select', options: ['Ausente', 'Parcial', 'Extenso'] },
              { id: 'morfologia', label: 'Morfologia', type: 'select', options: ['Fusiforme', 'Sacular'] }
            ]
          },
          {
            id: 'placa-poplitea',
            name: 'Placa Aterosclerótica',
            description: 'Espessamento focal da parede',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: [...PLAQUE_TYPE] },
              { id: 'espessura', label: 'Espessura (mm)', type: 'text', placeholder: 'ex: 2' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'infrapopliteo',
    name: 'Segmento Infrapoplíteo',
    icon: 'artery',
    normalDescription: 'Artérias tibiais e fibulares com fluxo trifásico/bifásico preservado.',
    categories: [
      {
        id: 'achados-tibiais',
        name: 'Achados',
        findings: [
          {
            id: 'estenose-tibial',
            name: 'Estenose',
            description: 'Estenose arterial com aumento de velocidade',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Tibial Anterior', 'Tibial Posterior', 'Fibular', 'Tronco Tíbio-Fibular'] },
              { id: 'grau', label: 'Grau', type: 'select', options: [...STENOSIS_GRADE] },
              { id: 'psv', label: 'PSV (cm/s)', type: 'text', placeholder: 'ex: 80' },
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: [...WAVEFORM_PATTERNS] }
            ]
          },
          {
            id: 'oclusao-tibial',
            name: 'Oclusão',
            description: 'Ausência de fluxo ao Doppler',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: [...LATERALITY] },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Tibial Anterior', 'Tibial Posterior', 'Fibular', 'Tronco Tíbio-Fibular'] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: [...OCCLUSION_TYPE] },
              { id: 'colaterais', label: 'Colaterais', type: 'select', options: [...COLLATERAL_STATUS] }
            ]
          }
        ]
      }
    ]
  },
  createObservacoesOrgan('arterial')
];
