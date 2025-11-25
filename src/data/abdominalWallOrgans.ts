import { Organ } from './organs';

export const HERNIA_CONTENTS = [
  'Gordura pré-peritoneal',
  'Alça intestinal',
  'Epíplon',
  'Conteúdo misto'
];

export const HERNIA_REDUCIBILITY = [
  'Redutível',
  'Parcialmente redutível',
  'Irredutível',
  'Estrangulada'
];

export const abdominalWallOrgans: Organ[] = [
  {
    id: 'inguinal-direita',
    name: 'Região Inguinal Direita',
    categories: [
      {
        id: 'hernias-ing-d',
        name: 'Hérnias',
        findings: [
          {
            id: 'hernia-inguinal-indireta-d',
            name: 'Hérnia Inguinal Indireta',
            description: 'Lateral aos vasos epigástricos inferiores',
            hasMeasurement: true,
            extraFields: [
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 25' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-inguinal-direta-d',
            name: 'Hérnia Inguinal Direta',
            description: 'Medial aos vasos epigástricos (Hesselbach)',
            hasMeasurement: true,
            extraFields: [
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 25' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-femoral-d',
            name: 'Hérnia Femoral',
            description: 'Abaixo do ligamento inguinal',
            hasMeasurement: true,
            extraFields: [
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 10' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 20' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'inguinal-esquerda',
    name: 'Região Inguinal Esquerda',
    categories: [
      {
        id: 'hernias-ing-e',
        name: 'Hérnias',
        findings: [
          {
            id: 'hernia-inguinal-indireta-e',
            name: 'Hérnia Inguinal Indireta',
            description: 'Lateral aos vasos epigástricos inferiores',
            hasMeasurement: true,
            extraFields: [
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 25' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-inguinal-direta-e',
            name: 'Hérnia Inguinal Direta',
            description: 'Medial aos vasos epigástricos (Hesselbach)',
            hasMeasurement: true,
            extraFields: [
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 25' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-femoral-e',
            name: 'Hérnia Femoral',
            description: 'Abaixo do ligamento inguinal',
            hasMeasurement: true,
            extraFields: [
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 10' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 20' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'parede-anterior',
    name: 'Parede Anterior',
    categories: [
      {
        id: 'hernias-anteriores',
        name: 'Hérnias',
        findings: [
          {
            id: 'hernia-umbilical',
            name: 'Hérnia Umbilical',
            description: 'Através do anel umbilical',
            hasMeasurement: true,
            extraFields: [
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 12' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 20' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-epigastrica',
            name: 'Hérnia Epigástrica',
            description: 'Linha alba acima do umbigo',
            hasMeasurement: true,
            extraFields: [
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 8' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-incisional',
            name: 'Hérnia Incisional',
            description: 'Em cicatriz cirúrgica prévia',
            hasMeasurement: true,
            extraFields: [
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 20' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 40' },
              { id: 'local', label: 'Local da cicatriz', type: 'text', placeholder: 'ex: Linha média infraumbilical' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'diastase-retos',
            name: 'Diástase de Retos',
            description: 'Afastamento dos músculos retos abdominais',
            hasMeasurement: true,
            extraFields: [
              { id: 'distancia', label: 'Distância inter-retos (mm)', type: 'text', placeholder: 'ex: 35' },
              { id: 'nivel', label: 'Nível', type: 'select', options: ['Supraumbilical', 'Umbilical', 'Infraumbilical', 'Toda extensão'] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'parede-lateral',
    name: 'Parede Lateral',
    categories: [
      {
        id: 'hernias-laterais',
        name: 'Hérnias',
        findings: [
          {
            id: 'hernia-spiegel-d',
            name: 'Hérnia de Spiegel Direita',
            description: 'Através da linha semilunar',
            hasMeasurement: true,
            extraFields: [
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 25' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-spiegel-e',
            name: 'Hérnia de Spiegel Esquerda',
            description: 'Através da linha semilunar',
            hasMeasurement: true,
            extraFields: [
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 15' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 25' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          },
          {
            id: 'hernia-lombar',
            name: 'Hérnia Lombar',
            description: 'Triângulo de Petit ou Grynfeltt',
            hasMeasurement: true,
            extraFields: [
              { id: 'lado', label: 'Lado', type: 'select', options: ['Direito', 'Esquerdo'] },
              { id: 'ostio', label: 'Óstio (mm)', type: 'text', placeholder: 'ex: 20' },
              { id: 'saco', label: 'Saco herniário (mm)', type: 'text', placeholder: 'ex: 30' },
              { id: 'conteudo', label: 'Conteúdo', type: 'select', options: HERNIA_CONTENTS },
              { id: 'redutibilidade', label: 'Redutibilidade', type: 'select', options: HERNIA_REDUCIBILITY }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'observacoes',
    name: 'Observações',
    categories: [
      {
        id: 'obs-gerais',
        name: 'Observações Gerais',
        findings: [
          {
            id: 'obs-texto',
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
