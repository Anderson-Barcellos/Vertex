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

export const REFLUX_STATUS = ['Presente', 'Ausente'];

export const REFLUX_CRITERIA = {
  superficial: 0.5,
  profunda: 1.0,
  perfurante: 0.35
};

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

export const DEEP_VEINS = [
  'Femoral Comum',
  'Femoral Superficial (proximal)',
  'Femoral Superficial (média)',
  'Femoral Superficial (distal)',
  'Femoral Profunda',
  'Poplítea',
  'Ilíaca Externa',
  'Ilíaca Comum'
];

export const venousOrgans: Organ[] = [
  {
    id: 'sistema-profundo-d',
    name: 'Sistema Profundo - MID',
    icon: 'vein',
    normalDescription: 'Veias femorais e poplítea direitas pérvias, compressíveis, com fluxo fásico preservado, sem refluxo patológico.',
    categories: [
      {
        id: 'tvp-profundo-d',
        name: 'Trombose Venosa Profunda',
        findings: [
          {
            id: 'tvp-aguda-d',
            name: 'TVP Aguda',
            description: 'Material intraluminal, veia incompressível',
            hasMeasurement: true,
            hasQuantity: true,
            extraFields: [
              { id: 'veia', label: 'Veia', type: 'select', options: DEEP_VEINS },
              { id: 'tipo', label: 'Tipo', type: 'select', options: THROMBUS_TYPE },
              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY },
              { id: 'compressibilidade', label: 'Compressibilidade', type: 'select', options: COMPRESSIBILITY },
              { id: 'extensao', label: 'Extensão (cm)', type: 'text', placeholder: 'ex: 10' }
            ]
          },
          {
            id: 'tvp-cronica-d',
            name: 'TVP Crônica / Sequelas',
            description: 'Sinais de trombose prévia com recanalização',
            hasMeasurement: true,
            hasQuantity: true,
            extraFields: [
              { id: 'veia', label: 'Veia', type: 'select', options: DEEP_VEINS },
              { id: 'achados', label: 'Achados', type: 'select', options: ['Espessamento parietal', 'Sinequias', 'Veia diminuída', 'Recanalização parcial', 'Refluxo secundário'] },
              { id: 'recanalizacao', label: 'Recanalização', type: 'select', options: ['Completa', 'Parcial', 'Ausente'] }
            ]
          }
        ]
      },
      {
        id: 'insuf-profunda-d',
        name: 'Insuficiência Venosa Profunda',
        findings: [
          {
            id: 'refluxo-femoral-d',
            name: 'Refluxo Femoral',
            description: 'Insuficiência valvular em veia femoral (critério: >1.0s)',
            hasMeasurement: true,
            hasQuantity: true,
            extraFields: [
              { id: 'veia', label: 'Segmento', type: 'select', options: ['Femoral Comum', 'Femoral Superficial proximal', 'Femoral Superficial média', 'Femoral Superficial distal', 'Femoral Profunda'] },
              { id: 'refluxo', label: 'Refluxo', type: 'select', options: REFLUX_STATUS },
              { id: 'diametro', label: 'Diâmetro (mm)', type: 'text', placeholder: 'ex: 12' },
              { id: 'etiologia', label: 'Etiologia', type: 'select', options: ['Primária (valvular)', 'Secundária (pós-trombótica)', 'Indeterminada'] }
            ]
          },
          {
            id: 'refluxo-poplitea-d',
            name: 'Refluxo Poplíteo',
            description: 'Insuficiência valvular em veia poplítea (critério: >1.0s)',
            hasMeasurement: true,
            extraFields: [
              { id: 'refluxo', label: 'Refluxo', type: 'select', options: REFLUX_STATUS },
              { id: 'diametro', label: 'Diâmetro (mm)', type: 'text', placeholder: 'ex: 10' },
              { id: 'etiologia', label: 'Etiologia', type: 'select', options: ['Primária (valvular)', 'Secundária (pós-trombótica)', 'Indeterminada'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sistema-profundo-e',
    name: 'Sistema Profundo - MIE',
    icon: 'vein',
    normalDescription: 'Veias femorais e poplítea esquerdas pérvias, compressíveis, com fluxo fásico preservado, sem refluxo patológico.',
    categories: [
      {
        id: 'tvp-profundo-e',
        name: 'Trombose Venosa Profunda',
        findings: [
          {
            id: 'tvp-aguda-e',
            name: 'TVP Aguda',
            description: 'Material intraluminal, veia incompressível',
            hasMeasurement: true,
            hasQuantity: true,
            extraFields: [
              { id: 'veia', label: 'Veia', type: 'select', options: DEEP_VEINS },
              { id: 'tipo', label: 'Tipo', type: 'select', options: THROMBUS_TYPE },
              { id: 'ecogenicidade', label: 'Ecogenicidade', type: 'select', options: THROMBUS_ECHOGENICITY },
              { id: 'compressibilidade', label: 'Compressibilidade', type: 'select', options: COMPRESSIBILITY },
              { id: 'extensao', label: 'Extensão (cm)', type: 'text', placeholder: 'ex: 10' }
            ]
          },
          {
            id: 'tvp-cronica-e',
            name: 'TVP Crônica / Sequelas',
            description: 'Sinais de trombose prévia com recanalização',
            hasMeasurement: true,
            hasQuantity: true,
            extraFields: [
              { id: 'veia', label: 'Veia', type: 'select', options: DEEP_VEINS },
              { id: 'achados', label: 'Achados', type: 'select', options: ['Espessamento parietal', 'Sinequias', 'Veia diminuída', 'Recanalização parcial', 'Refluxo secundário'] },
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
      },
      {
        id: 'insuf-profunda-e',
        name: 'Insuficiência Venosa Profunda',
        findings: [
          {
            id: 'refluxo-femoral-e',
            name: 'Refluxo Femoral',
            description: 'Insuficiência valvular em veia femoral (critério: >1.0s)',
            hasMeasurement: true,
            hasQuantity: true,
            extraFields: [
              { id: 'veia', label: 'Segmento', type: 'select', options: ['Femoral Comum', 'Femoral Superficial proximal', 'Femoral Superficial média', 'Femoral Superficial distal', 'Femoral Profunda'] },
              { id: 'refluxo', label: 'Refluxo', type: 'select', options: REFLUX_STATUS },
              { id: 'diametro', label: 'Diâmetro (mm)', type: 'text', placeholder: 'ex: 12' },
              { id: 'etiologia', label: 'Etiologia', type: 'select', options: ['Primária (valvular)', 'Secundária (pós-trombótica)', 'Indeterminada'] }
            ]
          },
          {
            id: 'refluxo-poplitea-e',
            name: 'Refluxo Poplíteo',
            description: 'Insuficiência valvular em veia poplítea (critério: >1.0s)',
            hasMeasurement: true,
            extraFields: [
              { id: 'refluxo', label: 'Refluxo', type: 'select', options: REFLUX_STATUS },
              { id: 'diametro', label: 'Diâmetro (mm)', type: 'text', placeholder: 'ex: 10' },
              { id: 'etiologia', label: 'Etiologia', type: 'select', options: ['Primária (valvular)', 'Secundária (pós-trombótica)', 'Indeterminada'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sistema-safenico-d',
    name: 'Sistema Safênico - MID',
    icon: 'vein',
    normalDescription: 'Safenas magna e parva direitas com calibre normal, sem refluxo patológico.',
    categories: [
      {
        id: 'insuficiencia-safenica-d',
        name: 'Insuficiência Safênica',
        findings: [
          {
            id: 'refluxo-jsf-d',
            name: 'Incompetência da Crossa (JSF)',
            description: 'Refluxo na junção safeno-femoral (critério: >0.5s)',
            hasMeasurement: true,
            extraFields: [
              { id: 'refluxo', label: 'Refluxo', type: 'select', options: REFLUX_STATUS },
              { id: 'diametro', label: 'Diâmetro na crossa (mm)', type: 'text', placeholder: 'ex: 8' },
              { id: 'ceap', label: 'CEAP', type: 'select', options: CEAP_CLINICAL }
            ]
          },
          {
            id: 'refluxo-tronco-vsm-d',
            name: 'Refluxo Tronco Safena Magna',
            description: 'Refluxo no corpo da safena magna (critério: >0.5s)',
            hasMeasurement: true,
            extraFields: [
              { id: 'extensao', label: 'Extensão', type: 'select', options: ['Coxa', 'Perna', 'Coxa e perna'] },
              { id: 'refluxo', label: 'Refluxo', type: 'select', options: REFLUX_STATUS },
              { id: 'diametro', label: 'Diâmetro máximo (mm)', type: 'text', placeholder: 'ex: 7' },
              { id: 'ceap', label: 'CEAP', type: 'select', options: CEAP_CLINICAL }
            ]
          },
          {
            id: 'refluxo-jsp-d',
            name: 'Incompetência da Crossa (JSP)',
            description: 'Refluxo na junção safeno-poplítea (critério: >0.5s)',
            hasMeasurement: true,
            extraFields: [
              { id: 'refluxo', label: 'Refluxo', type: 'select', options: REFLUX_STATUS },
              { id: 'diametro', label: 'Diâmetro (mm)', type: 'text', placeholder: 'ex: 5' },
              { id: 'ceap', label: 'CEAP', type: 'select', options: CEAP_CLINICAL }
            ]
          },
          {
            id: 'refluxo-safena-parva-d',
            name: 'Refluxo Safena Parva',
            description: 'Refluxo no tronco da safena parva (critério: >0.5s)',
            hasMeasurement: true,
            extraFields: [
              { id: 'refluxo', label: 'Refluxo', type: 'select', options: REFLUX_STATUS },
              { id: 'diametro', label: 'Diâmetro (mm)', type: 'text', placeholder: 'ex: 4' }
            ]
          },
          {
            id: 'varizes-d',
            name: 'Varizes',
            description: 'Dilatações varicosas',
            hasMeasurement: true,
            hasQuantity: true,
            extraFields: [
              { id: 'territorio', label: 'Território', type: 'select', options: ['Safena Magna', 'Safena Parva', 'Acessória Anterior', 'Colaterais'] },
              { id: 'diametro', label: 'Diâmetro máximo (mm)', type: 'text', placeholder: 'ex: 12' },
              { id: 'tortuosidade', label: 'Tortuosidade', type: 'select', options: ['Leve', 'Moderada', 'Acentuada'] }
            ]
          }
        ]
      },
      {
        id: 'tromboflebite-d',
        name: 'Tromboflebite',
        findings: [
          {
            id: 'tromboflebite-superficial-d',
            name: 'Tromboflebite Superficial',
            description: 'Material intraluminal em veia superficial',
            hasMeasurement: true,
            hasQuantity: true,
            extraFields: [
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
    id: 'sistema-safenico-e',
    name: 'Sistema Safênico - MIE',
    icon: 'vein',
    normalDescription: 'Safenas magna e parva esquerdas com calibre normal, sem refluxo patológico.',
    categories: [
      {
        id: 'insuficiencia-safenica-e',
        name: 'Insuficiência Safênica',
        findings: [
          {
            id: 'refluxo-jsf-e',
            name: 'Incompetência da Crossa (JSF)',
            description: 'Refluxo na junção safeno-femoral (critério: >0.5s)',
            hasMeasurement: true,
            extraFields: [
              { id: 'refluxo', label: 'Refluxo', type: 'select', options: REFLUX_STATUS },
              { id: 'diametro', label: 'Diâmetro na crossa (mm)', type: 'text', placeholder: 'ex: 8' },
              { id: 'ceap', label: 'CEAP', type: 'select', options: CEAP_CLINICAL }
            ]
          },
          {
            id: 'refluxo-tronco-vsm-e',
            name: 'Refluxo Tronco Safena Magna',
            description: 'Refluxo no corpo da safena magna (critério: >0.5s)',
            hasMeasurement: true,
            extraFields: [
              { id: 'extensao', label: 'Extensão', type: 'select', options: ['Coxa', 'Perna', 'Coxa e perna'] },
              { id: 'refluxo', label: 'Refluxo', type: 'select', options: REFLUX_STATUS },
              { id: 'diametro', label: 'Diâmetro máximo (mm)', type: 'text', placeholder: 'ex: 7' },
              { id: 'ceap', label: 'CEAP', type: 'select', options: CEAP_CLINICAL }
            ]
          },
          {
            id: 'refluxo-jsp-e',
            name: 'Incompetência da Crossa (JSP)',
            description: 'Refluxo na junção safeno-poplítea (critério: >0.5s)',
            hasMeasurement: true,
            extraFields: [
              { id: 'refluxo', label: 'Refluxo', type: 'select', options: REFLUX_STATUS },
              { id: 'diametro', label: 'Diâmetro (mm)', type: 'text', placeholder: 'ex: 5' },
              { id: 'ceap', label: 'CEAP', type: 'select', options: CEAP_CLINICAL }
            ]
          },
          {
            id: 'refluxo-safena-parva-e',
            name: 'Refluxo Safena Parva',
            description: 'Refluxo no tronco da safena parva (critério: >0.5s)',
            hasMeasurement: true,
            extraFields: [
              { id: 'refluxo', label: 'Refluxo', type: 'select', options: REFLUX_STATUS },
              { id: 'diametro', label: 'Diâmetro (mm)', type: 'text', placeholder: 'ex: 4' }
            ]
          },
          {
            id: 'varizes-e',
            name: 'Varizes',
            description: 'Dilatações varicosas',
            hasMeasurement: true,
            hasQuantity: true,
            extraFields: [
              { id: 'territorio', label: 'Território', type: 'select', options: ['Safena Magna', 'Safena Parva', 'Acessória Anterior', 'Colaterais'] },
              { id: 'diametro', label: 'Diâmetro máximo (mm)', type: 'text', placeholder: 'ex: 12' },
              { id: 'tortuosidade', label: 'Tortuosidade', type: 'select', options: ['Leve', 'Moderada', 'Acentuada'] }
            ]
          }
        ]
      },
      {
        id: 'tromboflebite-e',
        name: 'Tromboflebite',
        findings: [
          {
            id: 'tromboflebite-superficial-e',
            name: 'Tromboflebite Superficial',
            description: 'Material intraluminal em veia superficial',
            hasMeasurement: true,
            hasQuantity: true,
            extraFields: [
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
    normalDescription: 'Perfurantes com calibre normal e fluxo centrípeto bilateralmente.',
    categories: [
      {
        id: 'insuf-perfurantes',
        name: 'Perfurantes Insuficientes',
        findings: [
          {
            id: 'perfurante-insuf',
            name: 'Perfurante Insuficiente',
            description: 'Perfurante com refluxo patológico (critério: >0.35s)',
            hasMeasurement: true,
            hasQuantity: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'local', label: 'Local', type: 'select', options: ['Coxa proximal', 'Coxa média', 'Coxa distal (Hunter)', 'Joelho (Dodd)', 'Perna proximal (Boyd)', 'Perna média (Cockett)', 'Perna distal', 'Retromaleolar medial', 'Retromaleolar lateral'] },
              { id: 'refluxo', label: 'Refluxo', type: 'select', options: REFLUX_STATUS },
              { id: 'diametro', label: 'Diâmetro (mm)', type: 'text', placeholder: 'ex: 4.5' }
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
    normalDescription: 'Veias musculares e tibiais pérvias e compressíveis bilateralmente.',
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
            hasQuantity: true,
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
            hasQuantity: true,
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
            hasQuantity: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'maior-eixo', label: 'Maior eixo (mm)', type: 'text', placeholder: 'ex: 45' },
              { id: 'menor-eixo', label: 'Menor eixo (mm)', type: 'text', placeholder: 'ex: 20' },
              { id: 'complicacao', label: 'Complicação', type: 'select', options: ['Sem complicações', 'Rotura', 'Infecção'] }
            ]
          },
          {
            id: 'edema',
            name: 'Edema Subcutâneo',
            description: 'Espessamento do tecido subcutâneo',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: LATERALITY },
              { id: 'local', label: 'Local', type: 'select', options: ['Tornozelo', 'Perna', 'Coxa', 'Difuso'] },
              { id: 'grau', label: 'Grau', type: 'select', options: ['Leve', 'Moderado', 'Acentuado'] }
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
