import { Organ } from './organs';

export const LATERALITY = ['Direito', 'Esquerdo', 'Bilateral'];

export const STENOSIS_GRADE = [
  'Leve (<50%)',
  'Moderada (50-75%)',
  'Grave (>75%)'
];

export const WAVEFORM_PATTERNS = [
  'Trifásico',
  'Bifásico',
  'Monofásico',
  'Ausente'
];

export const OCCLUSION_TYPE = [
  'Aguda (<14 dias)',
  'Subaguda (14d - 3m)',
  'Crônica (>3 meses)'
];

export const COLLATERAL_STATUS = [
  'Ausente',
  'Escassa',
  'Moderada',
  'Abundante'
];

export const PLAQUE_TYPE = [
  'Calcificada',
  'Fibro-calcificada',
  'Fibrolipídica',
  'Lipídica'
];

export const ITB_CLASSIFICATION = [
  'Normal (0.91-1.30)',
  'Doença leve (0.70-0.90)',
  'Doença moderada (0.40-0.69)',
  'Doença grave (<0.40)',
  'Incompressível (>1.30)'
];

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
              { id: 'itb-direito', label: 'ITB Direito', type: 'text', placeholder: 'ex: 0.95' },
              { id: 'itb-esquerdo', label: 'ITB Esquerdo', type: 'text', placeholder: 'ex: 1.02' },
              { id: 'classificacao-d', label: 'Classificação MID', type: 'select', options: ITB_CLASSIFICATION },
              { id: 'classificacao-e', label: 'Classificação MIE', type: 'select', options: ITB_CLASSIFICATION }
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
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Ilíaca Comum', 'Ilíaca Externa'] },
              { id: 'grau', label: 'Grau', type: 'select', options: STENOSIS_GRADE },
              { id: 'psv', label: 'PSV (cm/s)', type: 'text', placeholder: 'ex: 250' },
              { id: 'vr', label: 'Velocity Ratio', type: 'text', placeholder: 'ex: 3.2' },
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'oclusao-iliaca',
            name: 'Oclusão',
            description: 'Ausência de fluxo ao Doppler',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Ilíaca Comum', 'Ilíaca Externa'] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'extensao', label: 'Extensão (cm)', type: 'text', placeholder: 'ex: 5' },
              { id: 'colaterais', label: 'Colaterais', type: 'select', options: COLLATERAL_STATUS }
            ]
          },
          {
            id: 'placa-iliaca',
            name: 'Placa Aterosclerótica',
            description: 'Espessamento focal da parede',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Ilíaca Comum', 'Ilíaca Externa'] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: PLAQUE_TYPE },
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
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Femoral Comum', 'Femoral Superficial', 'Femoral Profunda'] },
              { id: 'local', label: 'Local', type: 'select', options: ['Proximal', 'Médio', 'Distal', 'Canal de Hunter'] },
              { id: 'grau', label: 'Grau', type: 'select', options: STENOSIS_GRADE },
              { id: 'psv', label: 'PSV (cm/s)', type: 'text', placeholder: 'ex: 180' },
              { id: 'vr', label: 'Velocity Ratio', type: 'text', placeholder: 'ex: 2.5' },
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'oclusao-femoral',
            name: 'Oclusão',
            description: 'Ausência de fluxo ao Doppler',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Femoral Comum', 'Femoral Superficial', 'Femoral Profunda'] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'extensao', label: 'Extensão (cm)', type: 'text', placeholder: 'ex: 10' },
              { id: 'colaterais', label: 'Colaterais', type: 'select', options: COLLATERAL_STATUS }
            ]
          },
          {
            id: 'placa-femoral',
            name: 'Placa Aterosclerótica',
            description: 'Espessamento focal da parede',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Femoral Comum', 'Femoral Superficial', 'Femoral Profunda'] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: PLAQUE_TYPE },
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
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'local', label: 'Local', type: 'select', options: ['Supra-articular', 'Fossa poplítea', 'Infra-articular'] },
              { id: 'grau', label: 'Grau', type: 'select', options: STENOSIS_GRADE },
              { id: 'psv', label: 'PSV (cm/s)', type: 'text', placeholder: 'ex: 150' },
              { id: 'vr', label: 'Velocity Ratio', type: 'text', placeholder: 'ex: 2.8' },
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'oclusao-poplitea',
            name: 'Oclusão',
            description: 'Ausência de fluxo ao Doppler',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'extensao', label: 'Extensão (cm)', type: 'text', placeholder: 'ex: 3' },
              { id: 'colaterais', label: 'Colaterais', type: 'select', options: COLLATERAL_STATUS }
            ]
          },
          {
            id: 'aneurisma-popliteo',
            name: 'Aneurisma Poplíteo',
            description: 'Dilatação >15mm ou >1.5x normal',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
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
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'tipo', label: 'Tipo', type: 'select', options: PLAQUE_TYPE },
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
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Tibial Anterior', 'Tibial Posterior', 'Fibular', 'Tronco Tíbio-Fibular'] },
              { id: 'grau', label: 'Grau', type: 'select', options: STENOSIS_GRADE },
              { id: 'psv', label: 'PSV (cm/s)', type: 'text', placeholder: 'ex: 80' },
              { id: 'onda', label: 'Padrão de Onda', type: 'select', options: WAVEFORM_PATTERNS }
            ]
          },
          {
            id: 'oclusao-tibial',
            name: 'Oclusão',
            description: 'Ausência de fluxo ao Doppler',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'arteria', label: 'Artéria', type: 'select', options: ['Tibial Anterior', 'Tibial Posterior', 'Fibular', 'Tronco Tíbio-Fibular'] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: OCCLUSION_TYPE },
              { id: 'colaterais', label: 'Colaterais', type: 'select', options: COLLATERAL_STATUS }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'observacoes-arterial',
    name: 'Observações',
    icon: 'notes',
    normalDescription: '',
    categories: [
      {
        id: 'obs-arterial',
        name: 'Observações Gerais',
        findings: [
          {
            id: 'obs-arterial-texto',
            name: 'Observação Adicional',
            description: 'Informações complementares',
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
