export interface Finding {
  id: string;
  name: string;
  description: string;
  severity?: 'leve' | 'moderado' | 'acentuado';
  hasDetails?: boolean;
  hasSeverity?: boolean;
  hasMeasurement?: boolean;
  hasLocation?: boolean;
  hasQuantity?: boolean;
  isNormal?: boolean;
  extraFields?: (string | {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    options?: string[];
  })[];
}

export interface OrganCategory {
  id: string;
  name: string;
  findings: Finding[];
}

export interface Organ {
  id: string;
  name: string;
  icon: string;
  categories: OrganCategory[];
  normalDescription: string;
}

export const abdominalWallOrgans: Organ[] = [
  {
    id: 'subcutaneous',
    name: 'Tecido Subcutâneo',
    icon: 'layers',
    normalDescription: 'apresenta espessura preservada, ecotextura habitual, sem evidências de coleções, hematomas ou lesões focais.',
    categories: [
      {
        id: 'thickness',
        name: 'Espessura',
        findings: [
          {
            id: 'thickening',
            name: 'Espessamento',
            description: 'Aumento da espessura do tecido subcutâneo',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasSeverity: true
          }
        ]
      },
      {
        id: 'lesions',
        name: 'Lesões',
        findings: [
          {
            id: 'lipoma',
            name: 'Lipoma',
            description: 'Lesão adiposa bem delimitada',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              {
                id: 'characteristics',
                label: 'Características',
                type: 'textarea',
                placeholder: 'Descreva aspecto ecográfico, vascularização, etc.'
              }
            ]
          },
          {
            id: 'sebaceous-cyst',
            name: 'Cisto Sebáceo',
            description: 'Cisto de origem epidérmica',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          }
        ]
      },
      {
        id: 'collections',
        name: 'Coleções',
        findings: [
          {
            id: 'hematoma',
            name: 'Hematoma',
            description: 'Coleção hemática',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              {
                id: 'stage',
                label: 'Estágio',
                type: 'select',
                options: ['Agudo', 'Subagudo', 'Crônico', 'Em organização']
              }
            ]
          },
          {
            id: 'seroma',
            name: 'Seroma',
            description: 'Coleção serosa',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          },
          {
            id: 'abscess',
            name: 'Abscesso',
            description: 'Coleção purulenta',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          }
        ]
      }
    ]
  },
  {
    id: 'muscles',
    name: 'Musculatura Abdominal',
    icon: 'activity',
    normalDescription: 'apresenta espessura, ecotextura e simetria preservadas. Músculos retos abdominais com alinhamento normal. Não há evidências de diástase, hérnias ou lesões.',
    categories: [
      {
        id: 'rectus',
        name: 'Músculos Retos',
        findings: [
          {
            id: 'diastasis',
            name: 'Diástase dos Retos',
            description: 'Separação dos músculos retos abdominais',
            hasDetails: true,
            hasMeasurement: true,
            hasSeverity: true,
            extraFields: [
              {
                id: 'supraumbilical',
                label: 'Distância Supraumbilical (cm)',
                type: 'text',
                placeholder: 'Ex: 2.5'
              },
              {
                id: 'umbilical',
                label: 'Distância Umbilical (cm)',
                type: 'text',
                placeholder: 'Ex: 3.2'
              },
              {
                id: 'infraumbilical',
                label: 'Distância Infraumbilical (cm)',
                type: 'text',
                placeholder: 'Ex: 2.0'
              }
            ]
          },
          {
            id: 'muscle-hematoma',
            name: 'Hematoma Intramuscular',
            description: 'Coleção hemática no interior do músculo',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          }
        ]
      },
      {
        id: 'changes',
        name: 'Alterações Musculares',
        findings: [
          {
            id: 'atrophy',
            name: 'Atrofia Muscular',
            description: 'Redução da espessura muscular',
            hasDetails: true,
            hasLocation: true,
            hasSeverity: true
          },
          {
            id: 'tear',
            name: 'Lesão Muscular/Rotura',
            description: 'Descontinuidade das fibras musculares',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            hasSeverity: true
          }
        ]
      }
    ]
  },
  {
    id: 'hernias',
    name: 'Hérnias',
    icon: 'alert-circle',
    normalDescription: 'não evidenciadas. Paredes íntegras, sem defeitos herniários visíveis ao exame.',
    categories: [
      {
        id: 'ventral',
        name: 'Hérnias Ventrais',
        findings: [
          {
            id: 'umbilical',
            name: 'Hérnia Umbilical',
            description: 'Defeito da parede na região umbilical',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'ring-diameter',
                label: 'Diâmetro do Anel (cm)',
                type: 'text',
                placeholder: 'Ex: 1.5'
              },
              {
                id: 'sac-dimensions',
                label: 'Dimensões do Saco (cm)',
                type: 'text',
                placeholder: 'Ex: 3.0 x 2.5'
              },
              {
                id: 'content',
                label: 'Conteúdo',
                type: 'select',
                options: ['Gordura omental', 'Alças intestinais', 'Líquido', 'Misto', 'Indeterminado']
              },
              {
                id: 'reducibility',
                label: 'Redutibilidade',
                type: 'select',
                options: ['Redutível', 'Irredutível', 'Parcialmente redutível']
              }
            ]
          },
          {
            id: 'epigastric',
            name: 'Hérnia Epigástrica',
            description: 'Defeito da linha alba na região epigástrica',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'ring-diameter',
                label: 'Diâmetro do Anel (cm)',
                type: 'text',
                placeholder: 'Ex: 0.8'
              },
              {
                id: 'content',
                label: 'Conteúdo',
                type: 'select',
                options: ['Gordura pré-peritoneal', 'Gordura omental', 'Indeterminado']
              }
            ]
          },
          {
            id: 'incisional',
            name: 'Hérnia Incisional',
            description: 'Defeito em cicatriz cirúrgica prévia',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'scar-location',
                label: 'Localização da Cicatriz',
                type: 'text',
                placeholder: 'Ex: Mediana infraumbilical'
              },
              {
                id: 'defect-extension',
                label: 'Extensão do Defeito (cm)',
                type: 'text',
                placeholder: 'Ex: 5.0'
              },
              {
                id: 'defect-width',
                label: 'Largura do Defeito (cm)',
                type: 'text',
                placeholder: 'Ex: 3.0'
              },
              {
                id: 'content',
                label: 'Conteúdo',
                type: 'select',
                options: ['Alças intestinais', 'Gordura omental', 'Ambos', 'Indeterminado']
              },
              {
                id: 'reducibility',
                label: 'Redutibilidade',
                type: 'select',
                options: ['Redutível', 'Irredutível', 'Parcialmente redutível']
              }
            ]
          }
        ]
      },
      {
        id: 'lateral',
        name: 'Hérnias Laterais',
        findings: [
          {
            id: 'spigelian',
            name: 'Hérnia de Spiegel',
            description: 'Defeito na linha semilunar',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              {
                id: 'side',
                label: 'Lado',
                type: 'select',
                options: ['Direito', 'Esquerdo', 'Bilateral']
              },
              {
                id: 'defect-diameter',
                label: 'Diâmetro do Defeito (cm)',
                type: 'text',
                placeholder: 'Ex: 2.0'
              }
            ]
          },
          {
            id: 'lumbar',
            name: 'Hérnia Lombar',
            description: 'Defeito na região lombar',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          }
        ]
      }
    ]
  },
  {
    id: 'scars',
    name: 'Cicatrizes e Anastomoses',
    icon: 'scissors',
    normalDescription: 'não apresentam alterações significativas. Sem evidências de hérnias incisionais, endometriose ou granulomas.',
    categories: [
      {
        id: 'surgical-scars',
        name: 'Cicatrizes Cirúrgicas',
        findings: [
          {
            id: 'normal-scar',
            name: 'Cicatriz sem Alterações',
            description: 'Cicatriz cirúrgica sem complicações',
            hasDetails: true,
            hasLocation: true,
            isNormal: true
          },
          {
            id: 'endometriosis',
            name: 'Endometriose de Parede',
            description: 'Implante endometrial em cicatriz cirúrgica',
            hasDetails: true,
            hasMeasurement: true,
            extraFields: [
              {
                id: 'related-scar',
                label: 'Cicatriz Relacionada',
                type: 'select',
                options: ['Cesariana (Pfannenstiel)', 'Laparoscopia', 'Mediana', 'Paramediana', 'Outra']
              },
              {
                id: 'layer',
                label: 'Camada Acometida',
                type: 'select',
                options: ['Subcutânea', 'Muscular', 'Ambas', 'Pré-peritoneal']
              },
              {
                id: 'characteristics',
                label: 'Características',
                type: 'textarea',
                placeholder: 'Descreva aspecto, vascularização, relação com ciclo menstrual, etc.'
              }
            ]
          },
          {
            id: 'suture-granuloma',
            name: 'Granuloma de Sutura',
            description: 'Reação de corpo estranho ao material de sutura',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          }
        ]
      }
    ]
  },
  {
    id: 'other',
    name: 'Outros Achados',
    icon: 'search',
    normalDescription: 'não evidenciados. Exame sem outras particularidades.',
    categories: [
      {
        id: 'masses',
        name: 'Massas e Nódulos',
        findings: [
          {
            id: 'solid-mass',
            name: 'Lesão Sólida',
            description: 'Massa sólida de natureza indeterminada',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              {
                id: 'echogenicity',
                label: 'Ecogenicidade',
                type: 'select',
                options: ['Hipoecogênica', 'Isoecogênica', 'Hiperecogênica', 'Mista']
              },
              {
                id: 'margins',
                label: 'Margens',
                type: 'select',
                options: ['Bem definidas', 'Irregulares', 'Microlobuladas', 'Espiculadas']
              },
              {
                id: 'vascularization',
                label: 'Vascularização',
                type: 'select',
                options: ['Ausente', 'Periférica', 'Central', 'Mista']
              }
            ]
          },
          {
            id: 'cystic-lesion',
            name: 'Lesão Cística',
            description: 'Lesão com conteúdo líquido',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              {
                id: 'type',
                label: 'Tipo',
                type: 'select',
                options: ['Simples', 'Complexo', 'Septado', 'Com debris']
              }
            ]
          }
        ]
      },
      {
        id: 'lymph-nodes',
        name: 'Linfonodos',
        findings: [
          {
            id: 'lymphadenopathy',
            name: 'Linfonodomegalia',
            description: 'Linfonodo aumentado',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true,
            extraFields: [
              {
                id: 'morphology',
                label: 'Morfologia',
                type: 'select',
                options: ['Preservada', 'Arredondado', 'Cortical espessada', 'Hilo não visível']
              }
            ]
          }
        ]
      },
      {
        id: 'vascular',
        name: 'Alterações Vasculares',
        findings: [
          {
            id: 'varicosity',
            name: 'Varicosidade',
            description: 'Dilatação de veias da parede',
            hasDetails: true,
            hasLocation: true
          },
          {
            id: 'vascular-malformation',
            name: 'Malformação Vascular',
            description: 'Alteração vascular congênita ou adquirida',
            hasDetails: true,
            hasMeasurement: true,
            hasLocation: true
          }
        ]
      }
    ]
  }
];
