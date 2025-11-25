import { Organ } from './organs';

export const LATERALITY = ['Direito', 'Esquerdo'];

export const COMPRESSIBILITY = [
  'Totalmente compressível',
  'Parcialmente compressível',
  'Incompressível'
];

export const THROMBUS_TYPE = [
  'Oclusivo',
  'Não-oclusivo parcial',
  'Mural',
  'Flutuante'
];

export const THROMBUS_ECHOGENICITY = [
  'Anecóico (agudo)',
  'Hipoecóico (agudo)',
  'Isoecóico (subagudo)',
  'Hiperecóico (crônico)',
  'Misto'
];

export const REFLUX_DURATION = [
  'Normal (<0.5s)',
  'Limítrofe (0.5-1.0s)',
  'Patológico (>1.0s)',
  'Grave (>3.0s)'
];

export const CEAP_CLINICAL = [
  'C0 - Sem sinais',
  'C1 - Telangiectasias',
  'C2 - Varizes',
  'C3 - Edema',
  'C4a - Pigmentação',
  'C4b - Lipodermatoesclerose',
  'C5 - Úlcera cicatrizada',
  'C6 - Úlcera ativa'
];

export const venousOrgans: Organ[] = [
  {
    id: 'sistema-profundo',
    name: 'Sistema Venoso Profundo',
    icon: 'vein',
    normalDescription: 'Veias femorais e poplíteas pérvias, compressíveis, com fluxo fásico preservado.',
    categories: [
      {
        id: 'tvp-profundo',
        name: 'Trombose Venosa Profunda',
        findings: [
          {
            id: 'tvp-aguda',
            name: 'TVP Aguda',
            description: 'Material intraluminal, veia incompressível',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'veia', label: 'Veia', type: 'select', options: ['Femoral Comum', 'Femoral Superficial', 'Femoral Profunda', 'Poplítea', 'Ilíaca Externa', 'Ilíaca Comum'] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: THROMBUS_TYPE },
              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY },
              { id: 'compressibilidade', label: 'Compressibilidade', type: 'select', options: COMPRESSIBILITY },
              { id: 'extensao', label: 'Extensão (cm)', type: 'text', placeholder: 'ex: 10' }
            ]
          },
          {
            id: 'tvp-cronica',
            name: 'TVP Crônica / Sequelas',
            description: 'Sinais de trombose prévia com recanalização',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'veia', label: 'Veia', type: 'select', options: ['Femoral Comum', 'Femoral Superficial', 'Femoral Profunda', 'Poplítea', 'Ilíaca Externa', 'Ilíaca Comum'] },
              { id: 'achados', label: 'Achados', type: 'select', options: ['Espessamento parietal', 'Sinequias', 'Veia diminuída', 'Recanalização parcial', 'Refluxo'] },
              { id: 'recanalizacao', label: 'Recanalização', type: 'select', options: ['Completa', 'Parcial', 'Ausente'] }
            ]
          },
          {
            id: 'may-thurner',
            name: 'Síndrome de May-Thurner',
            description: 'Compressão da veia ilíaca comum esquerda',
            hasMeasurement: true,
            extraFields: [
              { id: 'grau', label: 'Grau de Estenose', type: 'select', options: ['<50%', '50-70%', '70-90%', '>90%'] },
              { id: 'colaterais', label: 'Colaterais', type: 'select', options: ['Ausentes', 'Escassas', 'Moderadas', 'Exuberantes'] },
              { id: 'trombose', label: 'Trombose associada', type: 'select', options: ['Ausente', 'Presente'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sistema-safenico',
    name: 'Sistema Safênico',
    icon: 'vein',
    normalDescription: 'Safenas magna e parva com calibre normal, sem refluxo patológico.',
    categories: [
      {
        id: 'insuficiencia-safenica',
        name: 'Insuficiência Safênica',
        findings: [
          {
            id: 'refluxo-jsf',
            name: 'Incompetência da Crossa (JSF)',
            description: 'Refluxo na junção safeno-femoral',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'tempo', label: 'Tempo de Refluxo (s)', type: 'text', placeholder: 'ex: 2.5' },
              { id: 'duracao', label: 'Classificação', type: 'select', options: REFLUX_DURATION },
              { id: 'diametro', label: 'Diâmetro na crossa (mm)', type: 'text', placeholder: 'ex: 8' },
              { id: 'ceap', label: 'CEAP', type: 'select', options: CEAP_CLINICAL }
            ]
          },
          {
            id: 'refluxo-tronco-vsm',
            name: 'Refluxo Tronco Safena Magna',
            description: 'Refluxo no corpo da safena magna',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'extensao', label: 'Extensão', type: 'select', options: ['Coxa', 'Perna', 'Coxa e perna'] },
              { id: 'tempo', label: 'Tempo de Refluxo (s)', type: 'text', placeholder: 'ex: 1.8' },
              { id: 'diametro', label: 'Diâmetro máximo (mm)', type: 'text', placeholder: 'ex: 7' },
              { id: 'ceap', label: 'CEAP', type: 'select', options: CEAP_CLINICAL }
            ]
          },
          {
            id: 'refluxo-jsp',
            name: 'Incompetência da Crossa (JSP)',
            description: 'Refluxo na junção safeno-poplítea',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'tempo', label: 'Tempo de Refluxo (s)', type: 'text', placeholder: 'ex: 1.5' },
              { id: 'diametro', label: 'Diâmetro (mm)', type: 'text', placeholder: 'ex: 5' },
              { id: 'ceap', label: 'CEAP', type: 'select', options: CEAP_CLINICAL }
            ]
          },
          {
            id: 'refluxo-safena-parva',
            name: 'Refluxo Safena Parva',
            description: 'Refluxo no tronco da safena parva',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'tempo', label: 'Tempo de Refluxo (s)', type: 'text', placeholder: 'ex: 1.2' },
              { id: 'diametro', label: 'Diâmetro (mm)', type: 'text', placeholder: 'ex: 4' }
            ]
          },
          {
            id: 'varizes',
            name: 'Varizes',
            description: 'Dilatações varicosas',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'territorio', label: 'Território', type: 'select', options: ['Safena Magna', 'Safena Parva', 'Acessória Anterior', 'Colaterais'] },
              { id: 'diametro', label: 'Diâmetro máximo (mm)', type: 'text', placeholder: 'ex: 12' },
              { id: 'tortuosidade', label: 'Tortuosidade', type: 'select', options: ['Leve', 'Moderada', 'Acentuada'] }
            ]
          }
        ]
      },
      {
        id: 'tromboflebite',
        name: 'Tromboflebite',
        findings: [
          {
            id: 'tromboflebite-superficial',
            name: 'Tromboflebite Superficial',
            description: 'Material intraluminal em veia superficial',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'veia', label: 'Veia', type: 'select', options: ['Safena Magna', 'Safena Parva', 'Colateral'] },
              { id: 'distancia', label: 'Distância da crossa (cm)', type: 'text', placeholder: 'ex: 8' },
              { id: 'extensao', label: 'Extensão (cm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'tipo', label: 'Tipo', type: 'select', options: ['Oclusiva', 'Não-oclusiva'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'perfurantes',
    name: 'Veias Perfurantes',
    icon: 'vein',
    normalDescription: 'Perfurantes com calibre normal e fluxo centrípeto.',
    categories: [
      {
        id: 'insuf-perfurantes',
        name: 'Perfurantes Insuficientes',
        findings: [
          {
            id: 'perfurante-insuf',
            name: 'Perfurante Insuficiente',
            description: 'Perfurante >3.5mm com refluxo >0.5s',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'local', label: 'Local', type: 'select', options: ['Coxa proximal', 'Coxa média', 'Coxa distal', 'Joelho', 'Perna proximal', 'Perna média (Cockett)', 'Perna distal'] },
              { id: 'diametro', label: 'Diâmetro (mm)', type: 'text', placeholder: 'ex: 4.5' },
              { id: 'tempo', label: 'Tempo de Refluxo (s)', type: 'text', placeholder: 'ex: 0.8' },
              { id: 'numero', label: 'Quantidade', type: 'text', placeholder: 'ex: 2' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'panturrilha',
    name: 'Veias da Panturrilha',
    icon: 'vein',
    normalDescription: 'Veias musculares e tibiais pérvias e compressíveis.',
    categories: [
      {
        id: 'tvp-panturrilha',
        name: 'TVP Distal',
        findings: [
          {
            id: 'tvp-muscular',
            name: 'TVP de Veias Musculares',
            description: 'Trombose em veias gastrocnêmias ou soleares',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'veia', label: 'Veia', type: 'select', options: ['Gastrocnêmia Medial', 'Gastrocnêmia Lateral', 'Soleares'] },
              { id: 'extensao', label: 'Extensão (cm)', type: 'text', placeholder: 'ex: 5' },
              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY }
            ]
          },
          {
            id: 'tvp-tibial',
            name: 'TVP de Veias Tibiais',
            description: 'Trombose em veias tibiais/fibulares',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'veia', label: 'Veia', type: 'select', options: ['Tibiais Posteriores', 'Tibiais Anteriores', 'Fibulares'] },
              { id: 'tipo', label: 'Tipo', type: 'select', options: THROMBUS_TYPE },
              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'observacoes-venoso',
    name: 'Observações',
    icon: 'notes',
    normalDescription: '',
    categories: [
      {
        id: 'obs-venoso',
        name: 'Observações Gerais',
        findings: [
          {
            id: 'cisto-baker',
            name: 'Cisto de Baker',
            description: 'Coleção na fossa poplítea',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'maior-eixo', label: 'Maior eixo (mm)', type: 'text', placeholder: 'ex: 45' },
              { id: 'menor-eixo', label: 'Menor eixo (mm)', type: 'text', placeholder: 'ex: 20' },
              { id: 'complicacao', label: 'Complicação', type: 'select', options: ['Sem complicações', 'Rotura', 'Infecção'] }
            ]
          },
          {
            id: 'obs-venoso-texto',
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
